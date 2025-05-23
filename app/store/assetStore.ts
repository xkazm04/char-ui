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
          if (!asset._id && !asset.id) {
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
            id: asset.id || asset._id // Ensure we have an id field
          };
          
          // Check if asset already exists in the category
          const existingAssets = state[validType];
          const assetExists = existingAssets.some(
            existingAsset => (existingAsset._id === normalizedAsset._id) || (existingAsset.id === normalizedAsset.id)
          );
          
          if (assetExists) {
            console.log(`Asset ${normalizedAsset.name} already exists in ${validType}`);
            return state;
          }
          
          // Update asset prompt
          const updatedPrompt = state.assetPrompt 
            ? `${state.assetPrompt}, ${normalizedAsset.gen || normalizedAsset.name}`
            : (normalizedAsset.gen || normalizedAsset.name);
          
          return {
            ...state,
            [validType]: [...existingAssets, normalizedAsset],
            assetPrompt: updatedPrompt
          };
        }),

      removeAsset: (assetId, type) =>
        set((state) => {
          const assetToRemove = state[type].find(
            asset => asset._id === assetId || asset.id === assetId
          );

          if (!assetToRemove) {
            console.warn(`Asset with ID ${assetId} not found in ${type}`);
            return state;
          }
          
          // Update asset prompt
          const genToRemove = assetToRemove.gen || assetToRemove.name;
          let updatedAssetPrompt = state.assetPrompt;
          
          if (genToRemove && updatedAssetPrompt) {
            updatedAssetPrompt = updatedAssetPrompt
              .split(', ')
              .filter(item => item.trim() !== genToRemove.trim())
              .join(', ');
          }
          
          return {
            ...state,
            [type]: state[type].filter(asset => 
              asset._id !== assetId && asset.id !== assetId
            ),
            assetPrompt: updatedAssetPrompt
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
          
          // Remove gen strings from prompt for the specific type
          const genStringsToRemove = state[type]
            .map(asset => asset.gen || asset.name)
            .filter(Boolean);
            
          let updatedAssetPrompt = state.assetPrompt;
          genStringsToRemove.forEach(gen => {
            if (gen) {
              updatedAssetPrompt = updatedAssetPrompt
                .split(', ')
                .filter(item => item.trim() !== gen.trim())
                .join(', ');
            }
          });
          
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
      }
    }),
    {
      name: 'character-assets-storage',
      version: 1 // Add version to help with migrations if needed
    }
  )
);