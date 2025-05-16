import { create } from 'zustand'

interface NavState {
    assetNavExpanded: boolean;
    setAssetNavExpanded: (expanded: boolean) => void;
}

export const useNavStore = create<NavState>((set) => ({
    assetNavExpanded: false,
    setAssetNavExpanded: (expanded) => set({ assetNavExpanded: expanded }),
}))