import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serverUrl } from '../constants/urls';
import { GenType } from '../types/gen';

interface FetchGenerationsParams {
  characterId?: string;
  skip?: number;
  limit?: number;
}

const fetchCharGenerations = async ({
  characterId,
  skip = 0,
  limit = 20
}: FetchGenerationsParams = {}): Promise<GenType[]> => {
  const params = new URLSearchParams();
  
  if (characterId) {
    params.append('character_id', characterId);
  }
  
  params.append('skip', skip.toString());
  params.append('limit', limit.toString());
  
  const url = `${serverUrl}/gen/?${params.toString()}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  
  return response.json();
};

const deleteGeneration = async (generationId: string): Promise<void> => {
  const response = await fetch(`${serverUrl}/gen/${generationId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      detail: `HTTP error! Status: ${response.status}`
    }));
    throw new Error(errorData.detail || `Failed to delete generation`);
  }
};

export const useGenerations = (
  { characterId, skip, limit }: FetchGenerationsParams = {}, 
  enabled = true
) => {
  return useQuery({
    queryKey: ['generations', { characterId, skip, limit }],
    queryFn: () => fetchCharGenerations({ characterId, skip, limit }),
    enabled,
    staleTime: 30 * 60 * 1000,
  });
};

export const useDeleteGeneration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGeneration,
    onSuccess: () => {
      // Invalidate and refetch generations
      queryClient.invalidateQueries({
        queryKey: ['generations']
      });
    },
    onError: (error) => {
      console.error('Error deleting generation:', error);
    },
  });
};