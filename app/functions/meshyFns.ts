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

  return response.json();
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
      // Poll every 10 seconds if still processing
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