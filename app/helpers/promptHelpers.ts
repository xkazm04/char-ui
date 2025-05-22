import { PromptModel } from "@/app/types/prompt";

export type AgentConfig = {
  name: string;
  description: string;
  defaultPrompt: string;
};

// Predefined agent configurations
export const agentConfigs: AgentConfig[] = [
  {
    name: "cooks",
    description: "Character generator that creates character variations based on the provided prompts",
    defaultPrompt: "You are a character generator. Your task is to create character variations based on input descriptions. Focus on personality traits, background, and motivations."
  },
  {
    name: "writer",
    description: "Narrative creator that builds story elements and plot structures",
    defaultPrompt: "You are a narrative creator. Your task is to build compelling storylines and plot structures. Focus on pacing, conflict, and character development."
  },
  {
    name: "worldbuilder",
    description: "Environment and setting designer for immersive worlds",
    defaultPrompt: "You are a worldbuilder. Your task is to design immersive environments and settings. Focus on geography, culture, history, and unique features that make the world feel alive."
  }
];

/**
 * Group prompts by their agent name
 */
export const groupPromptsByAgent = (prompts: PromptModel[]): Record<string, PromptModel[]> => {
  return prompts.reduce<Record<string, PromptModel[]>>((acc, prompt) => {
    if (!acc[prompt.agent]) {
      acc[prompt.agent] = [];
    }
    acc[prompt.agent].push(prompt);
    return acc;
  }, {});
};

/**
 * Get list of agent names that have at least one enabled prompt
 */
export const getEnabledAgents = (promptsByAgent: Record<string, PromptModel[]>): string[] => {
  return Object.keys(promptsByAgent).filter(
    agent => promptsByAgent[agent].some(p => p.enabled)
  );
};

/**
 * Check if agent is enabled (has at least one active prompt)
 */
export const isAgentEnabled = (agent: string, promptsByAgent: Record<string, PromptModel[]>): boolean => {
  const agentPrompts = promptsByAgent[agent] || [];
  return agentPrompts.some(p => p.enabled);
};

/**
 * Check if agent can be managed (has prompts or is one of our predefined agents)
 */
export const canManageAgent = (agent: string, promptsByAgent: Record<string, PromptModel[]>): boolean => {
  return promptsByAgent[agent]?.length > 0 || agentConfigs.some(config => config.name === agent);
};

/**
 * Get all manageable agents (existing in DB or predefined)
 */
export const getAllAgents = (promptsByAgent: Record<string, PromptModel[]>): string[] => {
  const existingAgents = Object.keys(promptsByAgent);
  const predefinedAgents = agentConfigs.map(config => config.name);
  
  return Array.from(new Set([...existingAgents, ...predefinedAgents]));
};

/**
 * Get agent description from config or default text
 */
export const getAgentDescription = (agent: string): string => {
  return agentConfigs.find(config => config.name === agent)?.description || 
         "Custom agent for specialized tasks";
};

/**
 * Get active prompt for an agent
 */
export const getActivePrompt = (
  agent: string, 
  promptsByAgent: Record<string, PromptModel[]>, 
  activePrompts: Record<string, string>
): PromptModel | undefined => {
  const agentPrompts = promptsByAgent[agent] || [];
  const activePromptId = activePrompts[agent];
  
  return agentPrompts.find(p => p._id === activePromptId) || 
         agentPrompts.find(p => p.enabled) || 
         agentPrompts[0];
};

/**
 * Handle auto-resize of textareas
 */
export const handleTextareaResize = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
  e.target.style.height = 'auto';
  e.target.style.height = `${e.target.scrollHeight}px`;
};