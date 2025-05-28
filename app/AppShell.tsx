'use client';
import { useState } from "react";
import AssetAnalysisLayout from "./features/Assets/AssetAnalysisLayout";
import Navbar from "./components/Navbar";
import { NavTabTypes } from "./types/nav";
import CharBuilderLayout from "./features/Builder/CharBuilderLayout";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LandingLayout from "./features/Landing/LandingLayout";
import GlowingText from "./components/landing/GlowingText";
import CooksLayout from "./features/Cooks/CooksLayout";
import AssetListLayout from "./features/Assets/AssetManagement/AssetListLayout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppShell = () => {
    const [tab, setTab] = useState<NavTabTypes>('assets');
    return <div className="flex flex-col min-h-full w-full flex-wrap">
        <QueryClientProvider client={queryClient}>
            <div
                onClick={() => setTab('landing')}
                className="absolute items-center z-[30] text-lg font-bold text-white top-2 left-4 cursor-pointer hidden md:flex"
            >
                Piksel <GlowingText>Play</GlowingText>
            </div>
            {tab !== 'landing' && <Navbar tab={tab} setTab={setTab} />}
            {tab === 'assets' && <AssetAnalysisLayout />}
            {tab !== 'landing' && <AssetListLayout />}
            {tab === 'builder' && <CharBuilderLayout />}
            {tab === 'landing' && <LandingLayout setTab={setTab} />}
            {tab === 'cooks' && <CooksLayout />}
        </QueryClientProvider>
    </div>
}

export default AppShell;
