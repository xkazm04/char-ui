import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AssetType } from '../types/asset';

type MainCategoryType = 'Body' | 'Equipment' | 'Clothing' | 'Background';

interface AssetState {
  Body: AssetType[];
  Equipment: AssetType[];
  Clothing: AssetType[];
  Background: AssetType[];
  
  expandedGroups: Record<string, boolean>;
  
  addAsset: (asset: AssetType) => void;
  removeAsset: (assetId: string, type: MainCategoryType, subcategory?: string) => void;
  clearAssets: (type?: MainCategoryType, subcategory?: string) => void;
  clearAllAssets: () => void;
  assetPrompt: string;
  
  setGroupExpanded: (groupId: string, expanded: boolean) => void;
  toggleGroupExpanded: (groupId: string) => void;
  getGroupExpanded: (groupId: string) => boolean;

  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
  
  // Computed properties
  getTotalAssetCount: () => number;
  getAssetsByCategory: (category: MainCategoryType) => AssetType[];
  getAllSelectedAssets: () => AssetType[];
  
  // Category-specific prompt methods
  getPromptByCategory: (category: MainCategoryType) => string;
  
  // Helper to rebuild prompt from current assets
  rebuildAssetPrompt: () => void;
}

export const useAssetStore = create<AssetState>()(
  persist(
    (set, get) => ({
      Body: [],
      Equipment: [],
      Clothing: [],
      Background: [],
      expandedGroups: {},
      assetPrompt: '',
      isGenerating: false,

      addAsset: (asset) =>
        set((state) => {
          // Ensure asset has an ID
          if (!asset._id) {
            console.warn('Asset missing ID, cannot add to store');
            return state;
          }

          // Normalize the asset type
          const validType = asset.type && ['Body', 'Equipment', 'Clothing', 'Background'].includes(asset.type)
            ? asset.type as MainCategoryType
            : 'Equipment';
          
          const normalizedAsset = {
            ...asset,
            type: validType,
            id: asset._id 
          };
          
          // Check if asset already exists in the category
          const existingAssets = state[validType];
          const assetExists = existingAssets.some(
            existingAsset => (existingAsset._id === normalizedAsset._id) 
          );
          
          if (assetExists) {
            console.log(`Asset ${normalizedAsset.name} already exists in ${validType}`);
            return state;
          }
          
          // Add asset to category
          const newState = {
            ...state,
            [validType]: [...existingAssets, normalizedAsset]
          };
          
          // Rebuild prompt from all assets
          const allAssets = [
            ...newState.Body,
            ...newState.Equipment,
            ...newState.Clothing,
            ...newState.Background
          ];
          
          const promptParts = allAssets
            .map(asset => asset.gen || asset.name)
            .filter(Boolean)
            .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
          
          return {
            ...newState,
            assetPrompt: promptParts.join(', ')
          };
        }),

      removeAsset: (assetId, type) =>
        set((state) => {
          const assetToRemove = state[type].find(
            asset => asset._id === assetId
          );

          if (!assetToRemove) {
            console.warn(`Asset with ID ${assetId} not found in ${type}`);
            return state;
          }
          
          // Remove asset from category
          const newState = {
            ...state,
            [type]: state[type].filter(asset => 
              asset._id !== assetId
            )
          };
          
          // Rebuild prompt from remaining assets
          const allRemainingAssets = [
            ...newState.Body,
            ...newState.Equipment,
            ...newState.Clothing,
            ...newState.Background
          ];
          
          const promptParts = allRemainingAssets
            .map(asset => asset.gen || asset.name)
            .filter(Boolean)
            .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
          
          return {
            ...newState,
            assetPrompt: promptParts.join(', ')
          };
        }),

      clearAssets: (type) =>
        set((state) => {
          if (!type) {
            return {
              ...state,
              Body: [],
              Equipment: [],
              Clothing: [],
              Background: [],
              assetPrompt: ''
            };
          }
          
          // Clear specific category
          const newState = {
            ...state,
            [type]: []
          };
          
          // Rebuild prompt from remaining assets
          const allRemainingAssets = [
            ...newState.Body,
            ...newState.Equipment,
            ...newState.Clothing,
            ...newState.Background
          ];
          
          const promptParts = allRemainingAssets
            .map(asset => asset.gen || asset.name)
            .filter(Boolean)
            .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
          
          return {
            ...newState,
            assetPrompt: promptParts.join(', ')
          };
        }),

      clearAllAssets: () =>
        set({
          Body: [],
          Equipment: [],
          Clothing: [],
          Background: [],
          assetPrompt: ''
        }),

      rebuildAssetPrompt: () =>
        set((state) => {
          const allAssets = [
            ...state.Body,
            ...state.Equipment,
            ...state.Clothing,
            ...state.Background
          ];
          
          const promptParts = allAssets
            .map(asset => asset.gen || asset.name)
            .filter(Boolean)
            .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
          
          return {
            ...state,
            assetPrompt: promptParts.join(', ')
          };
        }),
      
      setGroupExpanded: (groupId, expanded) => 
        set((state) => ({
          expandedGroups: {
            ...state.expandedGroups,
            [groupId]: expanded
          }
        })),
        
      toggleGroupExpanded: (groupId) => 
        set((state) => ({
          expandedGroups: {
            ...state.expandedGroups,
            [groupId]: !(state.expandedGroups[groupId] ?? false)
          }
        })),
        
      getGroupExpanded: (groupId) => {
        const state = get();
        return state.expandedGroups[groupId] ?? false;
      },

      setIsGenerating: (isGenerating) => set({ isGenerating }),

      // Computed properties
      getTotalAssetCount: () => {
        const state = get();
        return state.Body.length + state.Equipment.length + 
               state.Clothing.length + state.Background.length;
      },

      getAssetsByCategory: (category) => {
        const state = get();
        return state[category] || [];
      },

      getAllSelectedAssets: () => {
        const state = get();
        return [
          ...state.Body,
          ...state.Equipment, 
          ...state.Clothing,
          ...state.Background
        ];
      },

      // Category-specific prompt methods
      getPromptByCategory: (category) => {
        const state = get();
        const assets = state[category];
        const promptParts = assets
          .map(asset => asset.gen || asset.name)
          .filter(Boolean)
          .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
        
        return promptParts.join(', ');
      },
    }),
    {
      name: 'character-assets-storage',
      version: 2 // Increment version due to logic changes
    }
  )
);