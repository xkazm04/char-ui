import { useCallback } from "react";
import { AssetTabConfig } from "./AssetAnalysisLayout";
import AssetConfigItem from "./AssetConfigItem";

type Props = {
    config: AssetTabConfig;
    setConfig: (config: AssetTabConfig | ((prev: AssetTabConfig) => AssetTabConfig)) => void;
}

const AssetAnalysisUploadConfig = ({ config, setConfig }: Props) => {
    const handleUpdateConfig = useCallback((
        model: keyof AssetTabConfig, 
        enabled: boolean, 
        apiKey: string
    ) => {
        setConfig((prev) => ({
            ...prev,
            [model]: {
                ...prev[model],
                enabled,
                apiKey
            }
        }));
    }, [setConfig]);

    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 min-w-[400px] mt-2">
            <h3 className="text-sm font-medium text-gray-200 mb-4">Model Configuration</h3>
            <div className="flex flex-col gap-4">
                <AssetConfigItem 
                    model="groq" 
                    config={config} 
                    onUpdateConfig={handleUpdateConfig} 
                />
                <AssetConfigItem 
                    model="openai" 
                    config={config} 
                    onUpdateConfig={handleUpdateConfig} 
                />
                <AssetConfigItem 
                    model="gemini" 
                    config={config} 
                    onUpdateConfig={handleUpdateConfig} 
                />

            </div>
        </div>
    );
};

export default AssetAnalysisUploadConfig;