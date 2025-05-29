import { create } from 'zustand'

interface PromptState {
    stylePrompt: string;
    setStylePrompt: (prompt: string) => void;
    promptLimit?: number;
}

export const usePromptStore = create<PromptState>((set) => ({
    stylePrompt: '',
    setStylePrompt: (prompt) => set({ stylePrompt: prompt }),
    promptLimit: 560, 
}))