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
            <h3 className="text-sm font-medium text-gray-200">Model provider configuration</h3>
            <h4 className={`text-xs font-mono transition-all duration-200 ease-linear
                ${config.openai.enabled || config.gemini.enabled ? 'text-sky-400' : 'text-gray-500'}
                `}>
                Insert your one-time API key for other than Groq
            </h4>
            <div className="flex flex-col gap-4 mt-4">
                <AssetConfigItem 
                    tooltip="llama-4-scout-17b-16e-instruct"
                    model="groq" 
                    config={config} 
                    onUpdateConfig={handleUpdateConfig} 
                />
                <AssetConfigItem 
                    tooltip="gpt-4o"
                    model="openai" 
                    config={config} 
                    onUpdateConfig={handleUpdateConfig} 
                />
                <AssetConfigItem 
                    tooltip="gemini-1.5-flash"
                    model="gemini" 
                    config={config} 
                    onUpdateConfig={handleUpdateConfig} 
                />
            </div>
        </div>
    );
};

export default AssetAnalysisUploadConfig;