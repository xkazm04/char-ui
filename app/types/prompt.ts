export interface PromptModel {
  _id: string;
  agent: string;
  name: string; 
  prompt: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePromptModel {
  agent: string;
  name: string; 
  prompt: string;
  enabled: boolean;
}

export interface UpdatePromptModel {
  agent?: string;
  name?: string; 
  prompt?: string;
  enabled?: boolean;
}