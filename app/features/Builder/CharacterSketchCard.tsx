import { useState, memo, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { AssetType } from '@/app/types/asset';
import ModelViewer from '../Model/ModelViewer';
import CharacterCardToolbar from './CharacterCardToolbar';
import CharacterCardOverlay from './CharacterCardOverlay';
interface CharacterSketchCardProps {
  imageUrl: string;
  usedAssets: AssetType[];
}

function CharacterSketchCard({
  imageUrl,
  usedAssets,
}: CharacterSketchCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [modelGenerated, setModelGenerated] = useState(false);
  const [is3DMode, setIs3DMode] = useState(false);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  

  const handleDownload = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      const filename = imageUrl.split('/').pop() || 'character-sketch.png';
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  }, [imageUrl]);

  const handleShowDetails = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDetails(prev => !prev);
  }, []);

  const handleToggle3D = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (modelGenerated) {
      setIs3DMode(prev => !prev);
    }
  }, [modelGenerated]);

  const getModelData = () => {
    if (!modelUrl) return null;
    
    return {
      id: "character-model",
      name: "Character Model",
      path: modelUrl, 
      format: "glb" as const,
    };
  };
  
  const modelData = getModelData() || {
    id: "character-model",
    name: "Character Model",
    path: "/models/jinx.glb", // Test
    format: "glb" as const,
  };

  return (
    <div className="flex flex-col">
      <div
        className={`relative rounded-lg overflow-hidden border border-gray-800/50 bg-gray-900/30`}
      >
        <div className="aspect-square overflow-hidden relative rounded-lg">
          <AnimatePresence mode="wait">
            {is3DMode && modelGenerated ? (
              <motion.div
                key="3d-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <ModelViewer 
                  models={[modelData]} 
                  variants={['Default', 'Wireframe']}
                  defaultModel={modelData.id}
                  defaultVariant="Default"
                />
              </motion.div>
            ) : (
              <motion.div
                key="2d-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Image
                  src={imageUrl}
                  alt="Character sketch"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain"
                />
              </motion.div>
            )}
          </AnimatePresence>
          {/* Used assets detail overlay */}
          <AnimatePresence>
            {showDetails && (
              <CharacterCardOverlay 
                usedAssets={usedAssets}
                handleShowDetails={handleShowDetails}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      <CharacterCardToolbar 
        modelGenerated={modelGenerated}
        is3DMode={is3DMode}
        handleToggle3D={handleToggle3D}
        handleDownload={handleDownload}
        handleShowDetails={handleShowDetails}
        showDetails={showDetails}
        imageUrl={imageUrl}
        setModelGenerated={setModelGenerated}
        setModelUrl={setModelUrl}
        setIs3DMode={setIs3DMode}
      />
    </div>
  );
}

export default memo(CharacterSketchCard);