'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Loader2, AlertCircle } from 'lucide-react';
import AssetAnalysisUploadImage from './AssetAnalysisUploadImage';
import AssetAnalysisUploadConfig from './AssetAnalysisUploadConfig';
import { AssetTabConfig } from './AssetAnalysisLayout';
import { serverUrl } from '@/app/constants/urls';
import { AssetType } from '@/app/types/asset';

type Props = {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setOpenaiAssets: (assets: AssetType[]) => void;
  setGeminiAssets: (assets: AssetType[]) => void;
  setGroqAssets: (assets: AssetType[]) => void; 
  config: AssetTabConfig;
  setConfig: React.Dispatch<React.SetStateAction<AssetTabConfig>>;
};

const AssetAnalysisUpload = ({
  isLoading,
  setIsLoading,
  setOpenaiAssets,
  setGeminiAssets,
  setGroqAssets, 
  config,
  setConfig,
}: Props) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const containerHeight = "400px"; 

  const processImage = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setError(null);

    try {
      const anyModelEnabled = config.openai.enabled || config.gemini.enabled || config.groq.enabled;
      
      if (!anyModelEnabled) {
        throw new Error("Please enable at least one model in the configuration");
      }

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('config', JSON.stringify({
        openai: { 
          enabled: config.openai.enabled,
          apiKey: config.openai.apiKey
        },
        gemini: { 
          enabled: config.gemini.enabled,
          apiKey: config.gemini.apiKey 
        },
        groq: { 
          enabled: config.groq.enabled,
          apiKey: config.groq.apiKey 
        }
      }));

      const res = await fetch(`${serverUrl}/assets/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || `Server responded with ${res.status}`);
      }

      const data = await res.json();
      
      const openaiArr = config.openai.enabled && Array.isArray(data.openai) ? data.openai : [];
      const geminiArr = config.gemini.enabled && Array.isArray(data.gemini) ? data.gemini : [];
      const groqArr = config.groq.enabled && Array.isArray(data.groq) ? data.groq : [];

      setOpenaiAssets(openaiArr);
      setGeminiAssets(geminiArr);
      setGroqAssets(groqArr);
    } catch (error) {
      setOpenaiAssets([]);
      setGeminiAssets([]);
      setGroqAssets([]);
      
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      setError(message);
      console.error("Image analysis failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col gap-2'>
      <motion.div
        className="bg-gray-800 min-w-[400px] rounded-lg flex flex-col justify-between p-4 border border-gray-700"
        style={{ height: containerHeight }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <AssetAnalysisUploadImage 
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          setOpenaiAssets={setOpenaiAssets}
          setGeminiAssets={setGeminiAssets}
          setGroqAssets={setGroqAssets}
        />
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 p-2 bg-red-900/30 border border-red-800 rounded-md flex items-center gap-2 text-sm text-red-300"
          >
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </motion.div>
        )}
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={processImage}
          disabled={!selectedFile || isLoading}
          className={`mt-4 w-full py-2 rounded-lg cursor-pointer font-medium flex items-center justify-center space-x-2
          transition-all duration-300
          ${!selectedFile || isLoading
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-sky-800 text-white hover:bg-sky-700 shadow-md hover:shadow-sky-800/20'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.2 } }}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Upload className="h-5 w-5" />
              <span>Analyze Image</span>
            </>
          )}
        </motion.button>
      </motion.div>
      {/* <AssetAnalysisExamples setSelectedFile={setSelectedFile} /> */}
      <AssetAnalysisUploadConfig config={config} setConfig={setConfig} />
    </div>
  );
};

export default AssetAnalysisUpload;