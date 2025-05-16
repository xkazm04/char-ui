import { useState } from "react";
import AssetAnalysisResult from "./AssetAnalysisResult";
import AssetAnalysisUpload from "./AssetAnalysisUpload";
import { AssetType } from "@/app/types/asset";


export interface AssetTabConfig {
  openai: {
    apiKey: string;
    enabled: boolean;
  };
  gemini: {
    apiKey: string;
    enabled: boolean;
  };
  groq: {
    apiKey: string;
    enabled: boolean;
  };
}

const AssetAnalysisLayout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [openaiAssets, setOpenaiAssets] = useState<AssetType[]>([]);
  const [geminiAssets, setGeminiAssets] = useState<AssetType[]>([]);
  const [groqAssets, setGroqAssets] = useState<AssetType[]>([]);
  const [config, setConfig] = useState({
    openai: {
      apiKey: "",
      enabled: false,
    },
    gemini: {
      apiKey: "",
      enabled: false
    },
    groq: {
      apiKey: "",
      enabled: true,
    },
  });

  return (
    <div className="flex flex-row w-full h-full p-4 gap-10 justify-start flex-wrap lg:flex-nowrap">
      <AssetAnalysisUpload
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setOpenaiAssets={setOpenaiAssets}
        setGroqAssets={setGroqAssets}
        setGeminiAssets={setGeminiAssets}
        config={config}
        setConfig={setConfig}
      />
      <AssetAnalysisResult
        openaiAssets={openaiAssets}
        groqAssets={groqAssets}
        geminiAssets={geminiAssets}
        isLoading={isLoading}
        config={config}
      />
    </div>
  );
};

export default AssetAnalysisLayout;