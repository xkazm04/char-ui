import { ArrowLeftRight, Box, Info, Loader2, LucideDownload, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useAssetStore } from "@/app/store/assetStore";
import ProgressBar from "@/app/components/anim/ProgressBar";
import { serverUrl } from "@/app/constants/urls";

type Props = {
  modelGenerated: boolean;
  is3DMode: boolean;
  handleToggle3D: (e: React.MouseEvent) => void;
  handleDownload: (e: React.MouseEvent) => void;
  handleShowDetails: (e: React.MouseEvent) => void;
  showDetails: boolean;
  imageUrl: string;
  setModelUrl: (url: string) => void;
  setModelGenerated: (generated: boolean) => void;
  setIs3DMode: (is3D: boolean) => void;
};

const CharacterCardToolbar = ({ modelGenerated, is3DMode, handleToggle3D, handleDownload, handleShowDetails, showDetails,
  imageUrl, setModelUrl, setModelGenerated, setIs3DMode
}: Props) => {
  const [generationStatus, setGenerationStatus] = useState<string | null>(null);
  const { isGenerating, setIsGenerating } = useAssetStore();
  const [taskId, setTaskId] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const handleGenerate3D = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();

    setIsGenerating(true);
    setProgress(0);
    setGenerationError(null);

    try {
      const response = await fetch(`${serverUrl}/meshy/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: imageUrl,
          prompt: 'Generate 3D model of this character', // Optional prompt
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      setModelUrl(data.model_url);
      setTaskId(data.task_id);
      setGenerationStatus(data.status);

      // If the model is immediately available, set modelGenerated to true
      if (data.status === 'completed' && data.model_url) {
        setModelGenerated(true);
        setIs3DMode(true);
        setProgress(100);
        setIsGenerating(false);
      }

    } catch (error) {
      console.error('Failed to generate 3D model:', error);
      setGenerationError(error instanceof Error ? error.message : 'Unknown error occurred');
      setIsGenerating(false);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl, setIsGenerating]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (taskId && generationStatus === 'processing') {
      intervalId = setInterval(async () => {
        try {
          const response = await fetch(`${serverUrl}/meshy/status/${taskId}`);
          if (!response.ok) {
            throw new Error(`Status check failed with status ${response.status}`);
          }

          const data = await response.json();

          // Update progress for showing in UI
          setProgress(data.progress || 0);
          setGenerationStatus(data.status);

          if (data.status === 'completed') {
            // Get the GLB model URL for rendering
            const glbUrl = data.model_urls?.glb || "";

            if (glbUrl) {
              setModelUrl(glbUrl);
              setModelGenerated(true);
              setIs3DMode(true);
              setIsGenerating(false);
              clearInterval(intervalId);
            }
          } else if (data.status === 'failed') {
            setGenerationError(data.task_error?.message || 'Model generation failed');
            setIsGenerating(false);
            clearInterval(intervalId);
          }
        } catch (error) {
          console.error('Failed to check model status:', error);
          setGenerationError('Failed to check model status');
          setIsGenerating(false);
          clearInterval(intervalId);
        }
      }, 3000); // Check every 3 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId, generationStatus, setIsGenerating]);

  return <>
    <div className="flex justify-between items-center rounded p-1 bg-gray-950/50 opacity-30 
    hover:opacity-100 transition-opacity duration-200 ease-linear backdrop-blur-sm border border-gray-800/50">
      <div className="flex space-x-1">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-1.5 text-sky-200 rounded hover:bg-gray-800/50 hover:text-sky-400 transition-colors cursor-pointer"
          onClick={handleDownload}
          aria-label="Download image"
          title="Download image"
        >
          <LucideDownload size={18} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`p-1.5 rounded hover:bg-gray-800/50 transition-colors cursor-pointer
             ${showDetails ? 'text-sky-400 bg-gray-800/30' : 'text-sky-200 hover:text-sky-400'
            }`}
          onClick={handleShowDetails}
          aria-label="Show used assets"
          title="Show used assets"
        >
          <Info size={18} />
        </motion.button>
      </div>
      {isGenerating && <ProgressBar progress={progress} />}
      {generationError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="text-red-500 text-center p-4 max-w-xs opacity-60">
            <p className="text-xs">{generationError}</p>
          </div>
        </div>
      )}
      <div className="flex space-x-1">
        {!modelGenerated ? (
          <motion.button
            whileHover={{ scale: 1.25 }}
            whileTap={{ scale: 0.95 }}
            className={`px-2 py-1 text-sky-500/90 rounded cursor-pointer
                      shadow-lg hover:text-yellow-400 transition-colors flex items-center space-x-1`}
            onClick={handleGenerate3D}
            disabled={isGenerating}
            title="Generate 3D model"
            aria-label="Generate 3D model"
          >
            {isGenerating ? (
              <>
                <Loader2 size={16} className="animate-spin mr-1" />
              </>
            ) : (
              <div 
                title={'Generated 3D model'} 
                className="flex items-center space-x-1">
                <span className="text-xs opacity-0 hover:opacity-100 transition-all duration-200 ease-in-out">
                  
                  {generationError ? 'Retry' : 'Generate model'}
                </span>
                {!generationError ? <Box size={18} /> : <RefreshCcw size={18} />}

              </div>
            )}
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-2 py-1 text-xs font-medium rounded shadow-lg flex items-center space-x-1 ${is3DMode
              ? 'text-yellow-500/90 hover:text-yellow-400'
              : 'bg-gray-700/90 text-gray-100 hover:bg-gray-600'
              }`}
            onClick={handleToggle3D}
            title={is3DMode ? "Show 2D image" : "Show 3D model"}
            aria-label={is3DMode ? "Show 2D image" : "Show 3D model"}
          >
            <ArrowLeftRight size={16} />
          </motion.button>
        )}
      </div>
    </div>
  </>
}

export default CharacterCardToolbar;