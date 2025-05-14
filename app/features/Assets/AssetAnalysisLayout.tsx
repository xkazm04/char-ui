import { useState } from "react";
import AssetAnalysisResult from "./AssetAnalysisResult";
import AssetAnalysisUpload from "./AssetAnalysisUpload";

export interface AssetResponse {
  description: string;
  name: string;
  metadata: Record<string, any>;
  image_url: string;
}

const AssetAnalysisLayout = () => {
      const [isLoading, setIsLoading] = useState(false);
      const [response, setResponse] = useState<AssetResponse | null>(null);
      const [assetName, setAssetName] = useState('');
      const [assetDescription, setAssetDescription] = useState('');
      const [metadataJson, setMetadataJson] = useState('');

    return <div className="flex flex-row w-full h-full p-4 gap-4 justify-center">
        <AssetAnalysisUpload 
            setResponse={setResponse}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setAssetName={setAssetName}
            setMetadataJson={setMetadataJson}
            setAssetDescription={setAssetDescription}
            />
        <AssetAnalysisResult
            metadataJson={metadataJson}
            assetName={assetName}
            assetDescription={assetDescription}
            response={response}
            isLoading={isLoading}
            setAssetName={setAssetName}
            setAssetDescription={setAssetDescription}
            setMetadataJson={setMetadataJson}
            />

    </div>
}
export default AssetAnalysisLayout;