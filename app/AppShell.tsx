'use client';
import { useState } from "react";
import AssetAnalysisLayout from "./features/Assets/AssetAnalysisLayout";
import AssetListLayout from "./features/Assets/AssetListLayout";
import Navbar from "./components/Navbar";
import { NavTabTypes } from "./types/nav";
import CharBuilderLayout from "./features/Builder/CharBuilderLayout";
// import LandingLayout from "./features/Landing/LandingLayout";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();


const AppShell = () => {
    const [tab, setTab] = useState<NavTabTypes>('assets');
    return <div className="flex min-h-full w-full flex-wrap">
        <QueryClientProvider client={queryClient}>
            <Navbar tab={tab} setTab={setTab} />
            {tab === 'assets' && <AssetAnalysisLayout />}
            <AssetListLayout />
            {tab === 'builder' && <CharBuilderLayout />}
        </QueryClientProvider>
    </div>
}

export default AppShell;