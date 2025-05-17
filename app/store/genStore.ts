import { create } from 'zustand'

interface GenState {
    genIsStarted: boolean;
    setGenIsStarted: (started: boolean) => void;
    startGen: () => void;
}

export const useGenStore = create<GenState>((set) => ({
    genIsStarted: false,
    setGenIsStarted: (started) => set({ genIsStarted: started }),
    startGen: () => {
        set({ genIsStarted: true });
        setTimeout(() => {
            set({ genIsStarted: false });
        }, 10000);
    }
}))