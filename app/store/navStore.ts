import { create } from 'zustand'

interface NavState {
    assetNavExpanded: boolean;
    setAssetNavExpanded: (expanded: boolean) => void;
    assetNavHighlighted: boolean;
    setAssetNavHighlighted: (highlighted: boolean) => void;
    charNavExpanded: boolean;
    setCharNavExpanded: (expanded: boolean) => void;
}

export const useNavStore = create<NavState>((set) => ({
    assetNavExpanded: false,
    setAssetNavExpanded: (expanded) => set({ assetNavExpanded: expanded }),
    assetNavHighlighted: false,
    setAssetNavHighlighted: (highlighted) => set({ assetNavHighlighted: highlighted }),
    charNavExpanded: false,
    setCharNavExpanded: (expanded) => set({ charNavExpanded: expanded }),
}))