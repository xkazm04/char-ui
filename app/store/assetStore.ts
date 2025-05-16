import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AssetType } from '../types/asset';


interface AssetState {
  clothing: AssetType[];
  equipment: AssetType[];
  accessories: AssetType[];
  // Add this new state for tracking expanded groups
  expandedGroups: Record<string, boolean>;
  addAsset: (asset: AssetType) => void;
  removeAsset: (assetId: string, type: string) => void;
  clearAssets: (type?: AssetType) => void;
  clearAllAssets: () => void;
  assetPrompt?: string; 
  setAssetPrompt?: (prompt: string) => void;
  // Add these new methods for managing expanded state
  setGroupExpanded: (groupId: string, expanded: boolean) => void;
  toggleGroupExpanded: (groupId: string) => void;
  getGroupExpanded: (groupId: string) => boolean;
}

export const useAssetStore = create<AssetState>()(
  persist(
    (set, get) => ({
      clothing: [],
      equipment: [],
      accessories: [],
      expandedGroups: {},

      addAsset: (asset) =>
        set((state) => {
          const existsInClothing = state.clothing.some(a => a.id === asset.id);
          const existsInEquipment = state.equipment.some(a => a.id === asset.id);
          const existsInAccessories = state.accessories.some(a => a.id === asset.id);
          console.log(asset.description, asset.description)
          // If asset already exists somewhere, don't add it
          if (existsInClothing || existsInEquipment || existsInAccessories) {
            return state;
          }
          
          // Update assetPrompt by adding asset.description if it exists
          let updatedAssetPrompt = state.assetPrompt || '';
          if (asset.description) {
            if (updatedAssetPrompt) {
              updatedAssetPrompt = `${updatedAssetPrompt}, ${asset.description}`;
            } else {
              updatedAssetPrompt = asset.description;
            }
          }
          return {
            ...state,
            [asset.type]: [...state[asset.type], asset],
            assetPrompt: updatedAssetPrompt
          };
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
          
          // Remove the asset.description from assetPrompt
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
              clothing: [],
              equipment: [],
              accessories: [],
              assetPrompt: ''
            };
          }
          
          // Find all gen strings from the assets of the specified type
          const genStringsToRemove = state[type]
            .filter(asset => asset.description)
            .map(asset => asset.description);
            
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
          clothing: [],
          equipment: [],
          accessories: [],
          assetPrompt: ''
        }),
      assetPrompt: undefined,
      setAssetPrompt: (prompt) => set({ assetPrompt: prompt }),
      
      // New methods for managing expanded groups
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
        // Default to true for the first group, false for others
        const state = get();
        return state.expandedGroups[groupId] ?? false;
      }
    }),
    {
      name: 'character-assets-storage'
    }
  )
);