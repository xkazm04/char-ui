import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { serverUrl } from '../constants/urls';

interface Create3DModelRequest {
  image_url: string;
  generation_id: string;
  prompt?: string;
}

interface Create3DModelResponse {
  model_url: string;
  task_id: string;
  status: string;
  generation_id: string;
}

interface ModelStatusResponse {
  id: string;
  model_urls?: Record<string, string>;
  thumbnail_url?: string;
  texture_prompt?: string;
  progress: number;
  status: string;
  texture_urls?: Array<{
    base_color?: string;
    metallic?: string;
    normal?: string;
    roughness?: string;
  }>;
  task_error?: Record<string, any>;
  generation_id?: string;
}

// Helper function to get proxied model URLs
const getProxiedModelUrls = (taskId: string, originalUrls?: Record<string, string>) => {
  if (!originalUrls) return {};
  
  const proxiedUrls: Record<string, string> = {};
  
  // Map each model type to the proxy endpoint
  Object.keys(originalUrls).forEach(type => {
    if (originalUrls[type]) {
      proxiedUrls[type] = `${serverUrl}/meshy/proxy/${taskId}/${type}`;
    }
  });
  
  return proxiedUrls;
};

// Helper function to get proxied thumbnail URL
const getProxiedThumbnailUrl = (taskId: string, originalThumbnailUrl?: string) => {
  if (!originalThumbnailUrl) return undefined;
  return `${serverUrl}/meshy/proxy/${taskId}/thumbnail`;
};

const create3DModel = async (request: Create3DModelRequest): Promise<Create3DModelResponse> => {
  const response = await fetch(`${serverUrl}/meshy/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      detail: `HTTP error! Status: ${response.status}`
    }));
    throw new Error(errorData.detail || 'Failed to create 3D model');
  }

  return response.json();
};

const getModelStatus = async (taskId: string, generationId?: string): Promise<ModelStatusResponse> => {
  const params = new URLSearchParams();
  if (generationId) {
    params.append('generation_id', generationId);
  }
  
  const url = `${serverUrl}/meshy/status/${taskId}${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      detail: `HTTP error! Status: ${response.status}`
    }));
    throw new Error(errorData.detail || 'Failed to get model status');
  }

  const data = await response.json();
  
  // Transform the response to use proxied URLs
  return {
    ...data,
    model_urls: getProxiedModelUrls(taskId, data.model_urls),
    thumbnail_url: getProxiedThumbnailUrl(taskId, data.thumbnail_url)
  };
};

// Helper function to get the best available model URL with proxy
export const getBestModelUrl = (gen: any): string | null => {
  if (!gen.meshy?.meshy_id) return null;
  
  const taskId = gen.meshy.meshy_id;
  
  // Check for GLB first (best format)
  if (gen.meshy.glb_url) {
    return `${serverUrl}/meshy/proxy/${taskId}/glb`;
  }
  
  // Then FBX
  if (gen.meshy.fbx_url) {
    return `${serverUrl}/meshy/proxy/${taskId}/fbx`;
  }
  
  // Then OBJ
  if (gen.meshy.obj_url) {
    return `${serverUrl}/meshy/proxy/${taskId}/obj`;
  }
  
  // Then USDZ
  if (gen.meshy.usdz_url) {
    return `${serverUrl}/meshy/proxy/${taskId}/usdz`;
  }
  
  return null;
};

// Helper function to get proxied thumbnail
export const getProxiedThumbnail = (gen: any): string | null => {
  if (!gen.meshy?.meshy_id || !gen.meshy?.thumbnail_url) return null;
  return `${serverUrl}/meshy/proxy/${gen.meshy.meshy_id}/thumbnail`;
};

export const useCreate3DModel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: create3DModel,
    onSuccess: () => {
      // Invalidate generations to trigger refetch
      queryClient.invalidateQueries({
        queryKey: ['generations']
      });
    },
    onError: (error) => {
      console.error('Error creating 3D model:', error);
    },
  });
};

export const useModelStatus = (taskId: string | null, generationId?: string, enabled = true) => {
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: ['modelStatus', taskId, generationId],
    queryFn: () => getModelStatus(taskId!, generationId),
    enabled: enabled && !!taskId,
    refetchInterval: (data) => {
      // Poll every 15 seconds if still processing
      if (data?.status === 'processing') {
        return 15000;
      }
      // If completed, invalidate generations and stop polling
      if (data?.status === 'completed') {
        queryClient.invalidateQueries({
          queryKey: ['generations']
        });
        return false;
      }
      return false;
    },
    staleTime: 5 * 1000, // Consider data stale after 5 seconds
  });
};