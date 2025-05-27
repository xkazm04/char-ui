import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { GenType } from "@/app/types/gen";
import ModelViewer from "./ModelViewer";
import { ModelInfo } from "./ModelViewer";
import ModelControl from "./ModelControl";
import ModelSettings from "./ModelSettings";
import ModelHeader from "./ModelHeader";

interface Character3DModalProps {
  isOpen: boolean;
  onClose: () => void;
  gen: GenType;
  modelUrl: string | null;
}

const Character3DModal = ({
  isOpen,
  onClose,
  gen,
  modelUrl
}: Character3DModalProps) => {
  const [autoRotate, setAutoRotate] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [lightingPreset, setLightingPreset] = useState('studio');
 

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (event.key) {
        case 'Escape':
          onClose();
          break;
        case 'r':
        case 'R':
          setAutoRotate(prev => !prev);
          break;
        case 's':
        case 'S':
          setShowSettings(prev => !prev);
          break;
        case '1':
          setLightingPreset('studio');
          break;
        case '2':
          setLightingPreset('environment');
          break;
        case '3':
          setLightingPreset('dramatic');
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const getModelData = useMemo((): ModelInfo | null => {
    if (!modelUrl) return null;

    // Determine format from URL path
    let format: "glb" | "fbx" | "obj" = "glb";
    
    if (modelUrl.includes('/fbx')) format = "fbx";
    else if (modelUrl.includes('/obj')) format = "obj";
    else if (modelUrl.includes('/usdz')) format = "glb"; // USDZ fallback to GLB
    else if (gen.meshy?.glb_url) format = "glb";
    else if (gen.meshy?.fbx_url) format = "fbx";
    else if (gen.meshy?.obj_url) format = "obj";

    return {
      id: `character-model-${gen._id}`,
      name: "Character Model",
      path: modelUrl,
      format,
      thumbnail: gen.meshy?.thumbnail_url
    };
  }, [modelUrl, gen._id, gen.meshy]);

  const createdDate = new Date(gen.created_at || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  if (!getModelData) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black backdrop-blur-md"
          onClick={onClose}
        >
          {/* Header */}
          <ModelHeader
            createdDate={createdDate}
            getModelData={getModelData}
            onClose={onClose}
            showSettings={showSettings}
            setShowSettings={setShowSettings}
          />  
          
          {/* 3D Viewer */}
          <div 
            className="h-full w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full w-full"
            >
              <ModelViewer
                models={[getModelData]}
                defaultModel={getModelData.id}
                autoRotate={autoRotate}
                lightingPreset={lightingPreset}
              />
            </motion.div>
          </div>

          {/* Variant Controls */}
          <ModelControl
            gen={gen}
            modelUrl={modelUrl}
            getModelData={getModelData}
          />

          {/* Settings Panel */}
          <ModelSettings
            showSettings={showSettings}
            autoRotate={autoRotate}
            setAutoRotate={setAutoRotate}
            lightingPreset={lightingPreset}
            setLightingPreset={setLightingPreset}
            getModelData={getModelData}
            gen={gen}
            createdDate={createdDate}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (typeof window === 'undefined') return null;

  return createPortal(modalContent, document.body);
};

export default Character3DModal;