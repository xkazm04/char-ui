import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AssetType } from '../types/asset';

// Define the main categories as per the backend
type MainCategoryType = 'Body' | 'Equipment' | 'Clothing' | 'Background';

interface AssetState {
  // Organizing assets by main category
  Body: AssetType[];
  Equipment: AssetType[];
  Clothing: AssetType[];
  Background: AssetType[];
  
  // Track expanded groups
  expandedGroups: Record<string, boolean>;
  
  // Methods
  addAsset: (asset: AssetType) => void;
  removeAsset: (assetId: string, type: MainCategoryType, subcategory?: string) => void;
  clearAssets: (type?: MainCategoryType, subcategory?: string) => void;
  clearAllAssets: () => void;
  assetPrompt?: string; 
  setAssetPrompt?: (prompt: string) => void;
  
  // Group expansion methods
  setGroupExpanded: (groupId: string, expanded: boolean) => void;
  toggleGroupExpanded: (groupId: string) => void;
  getGroupExpanded: (groupId: string) => boolean;

  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
}

export const useAssetStore = create<AssetState>()(
  persist(
    (set, get) => ({
      // Initialize categories
      Body: [],
      Equipment: [],
      Clothing: [],
      Background: [],
      expandedGroups: {},

      addAsset: (asset) =>
        set((state) => {
          // Ensure the asset has a valid type, defaulting to Equipment if not
          const validType = asset.type && ['Body', 'Equipment', 'Clothing', 'Background'].includes(asset.type)
            ? asset.type
            : 'Equipment';
          
          // Create an asset with the valid type
          const assetWithValidType = {
            ...asset,
            type: validType
          };
          
          // Add to the appropriate category
          switch (validType) {
            case 'Body':
              return { Body: [...state.Body, assetWithValidType] };
            case 'Equipment':
              return { Equipment: [...state.Equipment, assetWithValidType] };
            case 'Clothing':
              return { Clothing: [...state.Clothing, assetWithValidType] };
            case 'Background':
              return { Background: [...state.Background, assetWithValidType] };
            default:
              // This shouldn't happen due to the validType check above
              console.warn(`Unknown asset type: ${validType}`);
              return state;
          }
        }),

      removeAsset: (assetId, type) =>
        set((state) => {
          const assetToRemove = state[type].find(asset => asset.id === assetId);

          if (!assetToRemove || !assetToRemove.gen) {
            return {
              ...state,
              [type]: state[type].filter(asset => asset.id !== assetId)
            };
          }
          
          // Remove the asset.gen from assetPrompt
          let updatedAssetPrompt = state.assetPrompt || '';
          if (updatedAssetPrompt) {
            updatedAssetPrompt = updatedAssetPrompt
              .replace(`, ${assetToRemove.gen},`, ',') 
              .replace(`, ${assetToRemove.gen}`, '') 
              .replace(`${assetToRemove.gen}, `, '') 
              .replace(`${assetToRemove.gen}`, ''); 
              
            updatedAssetPrompt = updatedAssetPrompt.trim().replace(/^,|,$/g, '');
          }
          
          return {
            ...state,
            [type]: state[type].filter(asset => asset.id !== assetId),
            assetPrompt: updatedAssetPrompt
          };
        }),

      clearAssets: (type) =>
        set((state) => {
          if (!type) {
            return {
              Body: [],
              Equipment: [],
              Clothing: [],
              Background: [],
              assetPrompt: ''
            };
          }
          
          // Find all gen strings from the assets of the specified type
          const genStringsToRemove = state[type]
            .filter(asset => asset.gen)
            .map(asset => asset.gen);
            
          // Remove all gen strings from the assetPrompt
          let updatedAssetPrompt = state.assetPrompt || '';
          genStringsToRemove.forEach(gen => {
            if (gen) {
              updatedAssetPrompt = updatedAssetPrompt
                .replace(`, ${gen},`, ',')
                .replace(`, ${gen}`, '')
                .replace(`${gen}, `, '')
                .replace(`${gen}`, '');
            }
          });
          
          // Clean up any trailing or leading commas
          updatedAssetPrompt = updatedAssetPrompt.trim().replace(/^,|,$/g, '');
          
          return {
            ...state,
            [type]: [],
            assetPrompt: updatedAssetPrompt
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
      assetPrompt: undefined,
      setAssetPrompt: (prompt) => set({ assetPrompt: prompt }),
      
      // Group expansion methods
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
      isGenerating: false,
      setIsGenerating: (isGenerating) => set({ isGenerating })
    }),
    {
      name: 'character-assets-storage'
    }
  )
);