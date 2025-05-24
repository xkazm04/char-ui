import { useQuery } from '@tanstack/react-query';
import { serverUrl } from '../constants/urls';

export interface AgentLog {
  id: string;
  session_id?: string;
  agent_name: string;
  output: string;
  timestamp: string;
}

interface FetchAgentLogsParams {
  sessionId?: string;
  agentName?: string;
  limit?: number;
}

const fetchAgentLogs = async ({
  sessionId,
  agentName,
  limit = 100
}: FetchAgentLogsParams = {}): Promise<AgentLog[]> => {
  const params = new URLSearchParams();
  
  if (sessionId) {
    params.append('session_id', sessionId);
  }
  
  if (agentName) {
    params.append('agent_name', agentName);
  }
  
  params.append('limit', limit.toString());
  
  const url = `${serverUrl}/agent-logs/?${params.toString()}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  
  return response.json();
};

const fetchSessionLogs = async (sessionId: string): Promise<AgentLog[]> => {
  const url = `${serverUrl}/agent-logs/session/${sessionId}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    if (response.status === 404) {
      return []; // Return empty array if no logs found
    }
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  
  return response.json();
};

export const useAgentLogs = (
  params: FetchAgentLogsParams = {}, 
  enabled = true
) => {
  return useQuery({
    queryKey: ['agent-logs', params],
    queryFn: () => fetchAgentLogs(params),
    enabled,
    staleTime: 10 * 1000, // 10 seconds
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
  });
};

export const useSessionLogs = (sessionId: string, enabled = true) => {
  return useQuery({
    queryKey: ['session-logs', sessionId],
    queryFn: () => fetchSessionLogs(sessionId),
    enabled: enabled && !!sessionId,
    staleTime: 5 * 1000, // 5 seconds
    refetchInterval: 3000, // Refetch every 3 seconds for real-time updates
  });
};