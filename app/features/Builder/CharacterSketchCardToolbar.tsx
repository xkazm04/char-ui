import { Info, LucideDownload } from "lucide-react";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useAssetStore } from "@/app/store/assetStore";
import { serverUrl } from "@/app/constants/urls";
import CharacterGenerate3d from "./CharacterGenerate3d";
import CharacterDelete from "./CharacterDelete";
import { GenType } from "@/app/types/gen";
import { useGenStore } from "@/app/store/genStore";

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
  gen: GenType;
};

const CharacterCardToolbar = ({ modelGenerated, is3DMode, handleToggle3D, handleDownload, handleShowDetails, showDetails,
  imageUrl, setModelUrl, setModelGenerated, setIs3DMode, gen
}: Props) => {
  const [generationStatus, setGenerationStatus] = useState<string | null>(null);
  const { is3dGenerating, setIs3dGenerating } = useGenStore();
  const [taskId, setTaskId] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const handleGenerate3D = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();

    setIs3dGenerating(true);
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
          prompt: 'Generate 3D model of this character', 
          generation_id: gen._id, 
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
        setIs3dGenerating(false);
      }

    } catch (error) {
      console.error('Failed to generate 3D model:', error);
      setGenerationError(error instanceof Error ? error.message : 'Unknown error occurred');
      setIs3dGenerating(false);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl, setIs3dGenerating]);


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
              setIs3dGenerating(false);
              clearInterval(intervalId);
            }
          } else if (data.status === 'failed') {
            setGenerationError(data.task_error?.message || 'Model generation failed');
            setIs3dGenerating(false);
            clearInterval(intervalId);
          }
        } catch (error) {
          console.error('Failed to check model status:', error);
          setGenerationError('Failed to check model status');
          setIs3dGenerating(false);
          clearInterval(intervalId);
        }
      }, 3000); // Check every 3 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId, generationStatus, is3dGenerating]);

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
      <CharacterDelete
          generationId={gen._id} 
          />
      </div>
      <CharacterGenerate3d
        generationError={generationError}
        modelGenerated={modelGenerated}
        isGenerating={is3dGenerating}
        is3DMode={is3DMode}
        handleGenerate3D={handleGenerate3D}
        handleToggle3D={handleToggle3D}
        progress={progress}
        />
    </div>
  </>
}

export default CharacterCardToolbar;