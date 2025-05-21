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
import CooksLayout from "./features/Cooks/CooksLayout";
import UIDesignShowcase from "./features/UIDemo/UIDesignShowcase";

const queryClient = new QueryClient();

const AppShell = () => {
    const [tab, setTab] = useState<NavTabTypes>('assets');
    return <div className="flex flex-col min-h-full w-full flex-wrap">
        <QueryClientProvider client={queryClient}>
            <div
                onClick={() => setTab('landing')}
                className="absolute items-center text-lg font-bold text-white top-2 left-4 cursor-pointer hidden md:flex"
            >
                Pixel <GlowingText>Play</GlowingText>
            </div>
            {tab !== 'landing' && <Navbar tab={tab} setTab={setTab} />}
            {tab === 'assets' && <AssetAnalysisLayout />}
            {tab !== 'landing' && <AssetListLayout />}
            {tab === 'builder' && <CharBuilderLayout />}
            {tab === 'landing' && <LandingLayout setTab={setTab} />}
            {tab === 'cooks' && <CooksLayout />}
            {tab === 'ui-demo' && <UIDesignShowcase />}
        </QueryClientProvider>
    </div>
}

export default AppShell;
