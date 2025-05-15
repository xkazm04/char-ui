import { useState } from "react";
import AssetAnalysisResult from "./AssetAnalysisResult";
import AssetAnalysisUpload from "./AssetAnalysisUpload";

export interface Asset {
  name: string;
  description: string;
  gen?: string;
  category?: string;
  [key: string]: any;
}

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
  const [openaiAssets, setOpenaiAssets] = useState<Asset[]>([]);
  const [geminiAssets, setGeminiAssets] = useState<Asset[]>([]);
  const [groqAssets, setGroqAssets] = useState<Asset[]>([]);
  const [config, setConfig] = useState({
    openai: {
      apiKey: "",
      enabled: true,
    },
    gemini: {
      apiKey: "",
      enabled: true
    },
    groq: {
      apiKey: "",
      enabled: false,
    },
  });

  return (
    <div className="flex flex-row w-full h-full p-4 gap-4 justify-center">
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