'use client';
import AssetAnalysisLayout from "./features/Assets/AssetAnalysisLayout";
import AssetListLayout from "./features/Assets/AssetListLayout";

const AppShell = () => {
    return <div className="flex min-h-full w-full flex-wrap">
        <AssetAnalysisLayout />
        <AssetListLayout />
    </div>
}

export default AppShell;