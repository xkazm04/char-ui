import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cooksUrl } from '../constants/urls';
import { DataSourceConfig, CreateDataSourceConfig, UpdateDataSourceConfig } from '../types/config';

const configUrl = `${cooksUrl}/config`;

// Fetch all data configs
export const fetchDataConfigs = async (): Promise<DataSourceConfig[]> => {
  const response = await fetch(`${configUrl}/`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  
  return response.json();
};


// Create a new data config
export const createDataConfig = async (configData: CreateDataSourceConfig): Promise<DataSourceConfig> => {
  const response = await fetch(`${configUrl}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(configData),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  
  return response.json();
};

// Update a data config
export const updateDataConfig = async (
  configId: string, 
  configData: UpdateDataSourceConfig
): Promise<DataSourceConfig> => {
  const response = await fetch(`${configUrl}/${configId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(configData),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  
  return response.json();
};

// Delete a data config
export const deleteDataConfig = async (configId: string): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${configUrl}/${configId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  
  return response.json();
};

// Hook to get all data configs
export const useDataConfigs = (enabled = true) => {
  return useQuery({
    queryKey: ['dataConfigs'],
    queryFn: fetchDataConfigs,
    enabled,
    staleTime: 30 * 60 * 1000, 
  });
};

// Hook to create a data config
export const useCreateDataConfig = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createDataConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dataConfigs'] });
    },
  });
};

// Hook to update a data config
export const useUpdateDataConfig = (configId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateDataSourceConfig) => updateDataConfig(configId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dataConfigs'] });
      queryClient.invalidateQueries({ queryKey: ['dataConfig', configId] });
    },
  });
};

// Hook to delete a data config
export const useDeleteDataConfig = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteDataConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dataConfigs'] });
    },
  });
};