import { create } from 'zustand'

interface GenState {
    genIsStarted: boolean;
    setGenIsStarted: (started: boolean) => void;
    startGen: () => void;
    is3dGenerating: boolean;
    setIs3dGenerating: (generating: boolean) => void;
}

export const useGenStore = create<GenState>((set) => ({
    genIsStarted: false,
    setGenIsStarted: (started) => set({ genIsStarted: started }),
    startGen: () => {
        set({ genIsStarted: true });
        setTimeout(() => {
            set({ genIsStarted: false });
        }, 10000);
    },
    is3dGenerating: false,
    setIs3dGenerating: (generating) => set({ is3dGenerating: generating }),
}))