import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cooksUrl } from '../constants/urls';
import { PromptModel, CreatePromptModel, UpdatePromptModel } from '../types/prompt';

const promptUrl = `${cooksUrl}/prompts`;

// Fetch all prompts
export const fetchPrompts = async (): Promise<PromptModel[]> => {
  const response = await fetch(`${promptUrl}/`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  
  return response.json();
};

// Fetch prompt by agent name
export const fetchPromptByAgent = async (agentName: string): Promise<PromptModel> => {
  const response = await fetch(`${promptUrl}/agent/${agentName}`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  
  return response.json();
};

// Create a new prompt
export const createPrompt = async (promptData: CreatePromptModel): Promise<PromptModel> => {
  const response = await fetch(`${promptUrl}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(promptData),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  
  return response.json();
};

// Update a prompt
export const updatePrompt = async (
  promptId: string, 
  promptData: UpdatePromptModel
): Promise<PromptModel> => {
  const response = await fetch(`${promptUrl}/${promptId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(promptData),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  
  return response.json();
};

// Delete a prompt
export const deletePrompt = async (promptId: string): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${promptUrl}/${promptId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  
  return response.json();
};

// Hook to get all prompts
export const usePrompts = (enabled = true) => {
  return useQuery({
    queryKey: ['prompts'],
    queryFn: fetchPrompts,
    enabled,
    staleTime: 30 * 60 * 1000, 
  });
};

// Hook to get prompt by agent name
export const usePromptByAgent = (agentName: string, enabled = true) => {
  return useQuery({
    queryKey: ['prompt', 'agent', agentName],
    queryFn: () => fetchPromptByAgent(agentName),
    enabled: enabled && !!agentName,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to create a prompt
export const useCreatePrompt = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createPrompt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
    },
  });
};

// Hook to update a prompt
export const useUpdatePrompt = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ promptId, promptData }: { promptId: string; promptData: UpdatePromptModel }) => 
      updatePrompt(promptId, promptData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
      queryClient.invalidateQueries({ queryKey: ['prompt', data._id] });
      queryClient.invalidateQueries({ queryKey: ['prompt', 'agent', data.agent] });
    },
  });
};

// Hook to delete a prompt
export const useDeletePrompt = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deletePrompt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
    },
  });
};