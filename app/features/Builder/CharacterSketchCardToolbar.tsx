import { Info, CheckSquare, Square } from "lucide-react";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { serverUrl } from "@/app/constants/urls";
import CharacterGenerate3d from "./CharacterGenerate3d";
import CharacterDelete from "./CharacterDelete";
import { GenType } from "@/app/types/gen";
import { useGenStore } from "@/app/store/genStore";

type Props = {
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
  viewMode?: 'grid-small' | 'grid-medium' | 'grid-large';
};

const CharacterCardToolbar = ({ 
  is3DMode, 
  handleToggle3D, 
  handleShowDetails, 
  showDetails,
  imageUrl, 
  setModelUrl, 
  setModelGenerated, 
  setIs3DMode, 
  gen,
  isSelected = false,
  onSelect,
  viewMode
}: Props) => {
  const { is3dGenerating, setIs3dGenerating } = useGenStore();
  const [progress, setProgress] = useState<number>(0);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [localGenerating, setLocalGenerating] = useState<boolean>(false);
  const [taskId, setTaskId] = useState<string | null>(null);

  // Use a unified state for generation status
  const isGenerating = localGenerating || gen.is_3d_generating || is3dGenerating;
  const hasModel = gen.has_3d_model || false;

  const handleGenerate3D = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();

    setLocalGenerating(true);
    setIs3dGenerating(true);
    setProgress(0);
    setGenerationError(null);
    setTaskId(null);

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
      console.log('3D generation started:', data);
      
      // Store the task_id locally for immediate polling
      setTaskId(data.task_id);

    } catch (error) {
      console.error('Failed to generate 3D model:', error);
      setGenerationError(error instanceof Error ? error.message : 'Unknown error occurred');
      setLocalGenerating(false);
      setIs3dGenerating(false);
      setTaskId(null);
    }
  }, [imageUrl, setIs3dGenerating, gen._id]);

  const handleSelect = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(!isSelected);
  }, [isSelected, onSelect]);

  const handleInfoClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    handleShowDetails(e);
  }, [handleShowDetails]);

  // Polling effect - now works with either taskId (immediate) or gen.meshy?.meshy_id (from database)
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const currentTaskId = taskId || gen.meshy?.meshy_id;
    
    // Start polling if we're generating and have a task ID
    if (isGenerating && !hasModel && currentTaskId) {
      console.log('Starting polling for task:', currentTaskId);
      
      intervalId = setInterval(async () => {
        try {
          const response = await fetch(`${serverUrl}/meshy/status/${currentTaskId}?generation_id=${gen._id}`);
          if (!response.ok) {
            throw new Error(`Status check failed with status ${response.status}`);
          }

          const data = await response.json();
          console.log('Polling status:', data);

          setProgress(data.progress || 0);
          
          if (data.status === 'completed') {
            const glbUrl = data.model_urls?.glb || "";

            if (glbUrl) {
              setModelUrl(glbUrl);
              setModelGenerated(true);
              setIs3DMode(true);
              setLocalGenerating(false);
              setIs3dGenerating(false);
              setTaskId(null);
              clearInterval(intervalId);
              console.log('3D model completed');
            }
          } else if (data.status === 'failed') {
            setGenerationError(data.task_error?.message || 'Model generation failed');
            setLocalGenerating(false);
            setIs3dGenerating(false);
            setTaskId(null);
            clearInterval(intervalId);
            console.log('3D model generation failed');
          }
        } catch (error) {
          console.error('Failed to check model status:', error);
        }
      }, 10000);
    }

    return () => {
      if (intervalId) {
        console.log('Clearing polling interval');
        clearInterval(intervalId);
      }
    };
  }, [isGenerating, hasModel, taskId, gen.meshy?.meshy_id, gen._id, setModelUrl, setModelGenerated, setIs3DMode, setIs3dGenerating]);

  // Update local state when gen object changes
  useEffect(() => {
    if (hasModel && gen.meshy?.glb_url) {
      setModelUrl(gen.meshy.glb_url);
      setModelGenerated(true);
      setLocalGenerating(false);
      setIs3dGenerating(false);
      setTaskId(null);
      setProgress(100);
    }
    
    if (gen.meshy?.status === 'failed') {
      setGenerationError('Model generation failed');
      setLocalGenerating(false);
      setIs3dGenerating(false);
      setTaskId(null);
    }
    
    // Update progress if we're generating
    if (isGenerating && gen.meshy?.progress !== undefined) {
      setProgress(gen.meshy.progress);
    }

    // Sync local state with gen object state
    if (gen.is_3d_generating && !localGenerating) {
      setLocalGenerating(true);
    } else if (!gen.is_3d_generating && localGenerating && gen.meshy?.meshy_id) {
      setLocalGenerating(false);
      setTaskId(null);
    }

    // Clear global generating state if the generation object shows it's not generating
    if (!gen.is_3d_generating && is3dGenerating && gen.meshy?.meshy_id) {
      setIs3dGenerating(false);
      setTaskId(null);
    }

    // Set taskId from gen object if we don't have it locally
    if (!taskId && gen.meshy?.meshy_id && isGenerating) {
      setTaskId(gen.meshy.meshy_id);
    }
  }, [gen, hasModel, isGenerating, is3dGenerating, localGenerating, taskId, setModelUrl, setModelGenerated, setIs3dGenerating]);

  // Initialize progress from gen object if available
  useEffect(() => {
    if (gen.meshy?.progress !== undefined) {
      setProgress(gen.meshy.progress);
    }
  }, [gen.meshy?.progress]);

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
          modelGenerated={hasModel}
          isGenerating={isGenerating}
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