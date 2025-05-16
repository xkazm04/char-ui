'use client';
import AssetAnalysisLayout from "./features/Assets/AssetAnalysisLayout";
import AssetListLayout from "./features/Assets/AssetListLayout";
// import LandingLayout from "./features/Landing/LandingLayout";

const AppShell = () => {
    return <div className="flex min-h-full w-full flex-wrap">
        <AssetAnalysisLayout />
        <AssetListLayout />
    </div>
}

export default AppShell;