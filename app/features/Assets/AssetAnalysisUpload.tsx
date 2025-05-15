'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Loader2 } from 'lucide-react';
import AssetAnalysisUploadImage from './AssetAnalysisUploadImage';
import AssetAnalysisUploadConfig from './AssetAnalysisUploadConfig';
import { AssetTabConfig } from './AssetAnalysisLayout';

type Asset = {
  name: string;
  description: string;
  gen?: string;
  category?: string;
  [key: string]: any;
};

type Props = {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setOpenaiAssets: (assets: Asset[]) => void;
  setGeminiAssets: (assets: Asset[]) => void;
  setGroqAssets: (assets: Asset[]) => void; 
  config: AssetTabConfig;
  setConfig: (config: AssetTabConfig) => void;
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

  const containerHeight = "400px"; 

  const processImage = async () => {
    if (!selectedFile) return;
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const res = await fetch('http://localhost:8000/assets/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const data = await res.json();
      const openaiArr = Array.isArray(data.openai) ? data.openai : [];
      const geminiArr = Array.isArray(data.gemini) ? data.gemini : [];
      const groqArr = Array.isArray(data.groq) ? data.groq : [];

      setOpenaiAssets(openaiArr);
      setGeminiAssets(geminiArr);
      setGroqAssets(groqArr);
    } catch (error) {
      setOpenaiAssets([]);
      setGeminiAssets([]);
      setGroqAssets([]);
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
              <span>Process Asset</span>
            </>
          )}
        </motion.button>
      </motion.div>
      <AssetAnalysisUploadConfig config={config} setConfig={setConfig} />
    </div>
  );
};

export default AssetAnalysisUpload;