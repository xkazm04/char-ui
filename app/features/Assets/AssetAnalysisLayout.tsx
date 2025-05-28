import { useState } from "react";
import AssetAnalysisResult from "./AssetAnalysisResult";
import AssetAnalysisUpload from "./AssetAnalysisUpload";
import { AssetType } from "@/app/types/asset";


export interface AssetTabConfig {
  openai: {
    apiKey: string;
    enabled: boolean;
    reference_url: string;
  };
  gemini: {
    apiKey: string;
    enabled: boolean;
    reference_url: string;
  };
  groq: {
    apiKey: string;
    enabled: boolean;
    reference_url: string;
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
      reference_url: "https://platform.openai.com/api-keys"
    },
    gemini: {
      apiKey: "",
      enabled: false,
      reference_url: "https://ai.google.dev/gemini-api/docs/api-key" 
    },
    groq: {
      apiKey: "",
      enabled: true,
      reference_url: "https://console.groq.com/docs/models"
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