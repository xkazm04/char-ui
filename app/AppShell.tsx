'use client';
import { useState } from "react";
import AssetAnalysisLayout from "./features/Assets/AssetAnalysisLayout";
import AssetListLayout from "./features/Assets/AssetManagement/AssetListLayout";
import Navbar from "./components/Navbar";
import { NavTabTypes } from "./types/nav";
import CharBuilderLayout from "./features/Builder/CharBuilderLayout";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LandingLayout from "./features/Landing/LandingLayout";
import GlowingText from "./components/landing/GlowingText";
const queryClient = new QueryClient();

const AppShell = () => {
    const [tab, setTab] = useState<NavTabTypes>('assets');
    return <div className="flex min-h-full w-full flex-wrap">
        <QueryClientProvider client={queryClient}>
            <div
                onClick={() => setTab('landing')}
                className="absolute top-2 left-4 cursor-pointer hidden md:block">
                <h1 className="text-lg font-bold text-white">Pixel <GlowingText>Play</GlowingText></h1>
            </div>
            {tab !== 'landing' && <Navbar tab={tab} setTab={setTab} />}
            {tab === 'assets' && <AssetAnalysisLayout />}
            {tab !== 'landing' && <AssetListLayout />}
            {tab === 'builder' && <CharBuilderLayout />}
            {tab === 'landing' && <LandingLayout setTab={setTab} />}
        </QueryClientProvider>
    </div>
}

export default AppShell;