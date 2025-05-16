'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Character {
  id: string;
  name: string;
  description?: string;
  imagePrompt?: string;
  imageUrl?: string;
  // Add additional fields as needed
}

interface CharacterStore {
  characters: Character[];
  currentCharacter: Character | null;
  addCharacter: (character: Character) => void;
  updateCharacter: (character: Character) => void;
  removeCharacter: (id: string) => void;
  setCurrentCharacter: (id: string | null) => void;
}

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set) => ({
      characters: [],
      currentCharacter: null,

      addCharacter: (character) => 
        set((state) => ({
          characters: [...state.characters, character],
          currentCharacter: character
        })),

      updateCharacter: (character) => 
        set((state) => ({
          characters: state.characters.map(c => 
            c.id === character.id ? character : c
          ),
          currentCharacter: character.id === state.currentCharacter?.id 
            ? character 
            : state.currentCharacter
        })),

      removeCharacter: (id) => 
        set((state) => ({
          characters: state.characters.filter(c => c.id !== id),
          currentCharacter: state.currentCharacter?.id === id 
            ? null 
            : state.currentCharacter
        })),

      setCurrentCharacter: (id) => 
        set((state) => ({
          currentCharacter: id 
            ? state.characters.find(c => c.id === id) || null 
            : null
        }))
    }),
    {
      name: 'character-storage'
    }
  )
);