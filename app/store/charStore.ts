'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { characters } from '../data/characters';

export interface Character {
  id: string;
  name: string;
  description: string;
  image_url: string;
  gif_url?: string;
  // Add additional fields as needed
}

interface CharacterStore {
  currentCharacter: Character | null;
  setCurrentCharacter: (id: string | null) => void;
  resetToDefaultCharacters: () => void; // New function for resetting
}

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set) => ({
      currentCharacter: null,
      setCurrentCharacter: (id: string | null) => {
        if (id === null) {
          set({ currentCharacter: null });
        } else {
          const character: Character | undefined = characters.find(c => c.id === id);
          set({ currentCharacter: character || null });
        }
      },
      resetToDefaultCharacters: () => {
        set({ currentCharacter: null });
      }
    }),
    {
      name: 'character-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentCharacter: state.currentCharacter
      }),
    }
  )
);