import { Info, LucideDownload, CheckSquare, Square } from "lucide-react";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { serverUrl } from "@/app/constants/urls";
import CharacterGenerate3d from "../../../../features/Builder/CharacterGenerate3d";
import CharacterDelete from "../../../../features/Builder/CharacterDelete";
import { GenType } from "@/app/types/gen";
import { useGenStore } from "@/app/store/genStore";
import { downloadImage } from "@/app/utils/downloadHelpers";

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
  isSelected?: boolean;
  onSelect?: (selected: boolean) => void;
};

const CharacterCardToolbar = ({ 
  modelGenerated, 
  is3DMode, 
  handleToggle3D, 
  handleDownload, 
  handleShowDetails, 
  showDetails,
  imageUrl, 
  setModelUrl, 
  setModelGenerated, 
  setIs3DMode, 
  gen,
  isSelected = false,
  onSelect
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
  }, [imageUrl, setIs3dGenerating, setModelUrl, setTaskId, setGenerationStatus, setModelGenerated, setIs3DMode, setProgress, gen._id]);

  const handleSelect = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(!isSelected);
  }, [isSelected, onSelect]);

  const handleDownloadClick = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    const filename = imageUrl.split('/').pop() || 'character-sketch.png';
    await downloadImage(imageUrl, filename);
  }, [imageUrl]);

  const handleInfoClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    handleShowDetails(e);
  }, [handleShowDetails]);

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

          setProgress(data.progress || 0);
          setGenerationStatus(data.status);

          if (data.status === 'completed') {
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
      }, 3000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [taskId, generationStatus, is3dGenerating, setModelUrl, setModelGenerated, setIs3DMode, setIs3dGenerating]);

  return (
    <div 
      className="flex justify-between items-center rounded-lg p-2 bg-gray-950/60 hover:bg-gray-950/80 transition-all duration-200 ease-linear backdrop-blur-sm border border-gray-800/50"
      onClick={(e) => e.stopPropagation()} // Prevent click bubbling to card
    >
      <div className="flex space-x-1">
        {/* Selection checkbox */}
        {onSelect && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSelect}
            className={`p-2 rounded-md transition-all cursor-pointer ${
              isSelected 
                ? 'text-sky-400 bg-sky-500/20 hover:bg-sky-500/30' 
                : 'text-gray-400 hover:text-sky-400 hover:bg-gray-800/50'
            }`}
            aria-label={isSelected ? "Deselect character" : "Select character"}
            title={isSelected ? "Deselect character" : "Select character"}
          >
            {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 text-sky-200 rounded-md hover:bg-gray-800/50 hover:text-sky-400 transition-colors cursor-pointer"
          onClick={handleDownloadClick}
          aria-label="Download image"
          title="Download image"
        >
          <LucideDownload size={18} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`p-2 rounded-md hover:bg-gray-800/50 transition-colors cursor-pointer
             ${showDetails ? 'text-sky-400 bg-gray-800/30' : 'text-sky-200 hover:text-sky-400'
            }`}
          onClick={handleInfoClick}
          aria-label="Show used assets"
          title="Show used assets"
        >
          <Info size={18} />
        </motion.button>

        <div onClick={(e) => e.stopPropagation()}>
          <CharacterDelete generationId={gen._id} />
        </div>
      </div>

      <div onClick={(e) => e.stopPropagation()}>
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
    </div>
  );
};

export default CharacterCardToolbar;