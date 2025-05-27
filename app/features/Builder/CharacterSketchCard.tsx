import { useState, memo, useCallback, useRef, useMemo } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import CharacterSketchCardToolbar from '../../components/ui/Cards/CharSketchCard/CharacterSketchCardToolbar';
import { GenType, UsedAssets } from '@/app/types/gen';
import CharacterSketchCardContent from '../../components/ui/Cards/CharSketchCard/CharacterSketchCardContent';
import CharacterImageModal from './CharacterImageModal';
import Character3DModal from '../Model/Character3DModal';
import { getBestModelUrl } from '@/app/functions/meshyFns';

interface CharacterSketchCardProps {
  gen: GenType;
  usedAssets?: UsedAssets[];
  viewMode?: 'grid-small' | 'grid-medium' | 'grid-large';
  isSelected?: boolean;
  onSelect?: (selected: boolean) => void;
}

function CharacterSketchCard({
  gen,
  usedAssets,
  viewMode = 'grid-medium',
  isSelected = false,
  onSelect
}: CharacterSketchCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [is3DMode, setIs3DMode] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [show3DModal, setShow3DModal] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [2, -2]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-2, 2]);

  const modelGenerated = useMemo(() => {
    return !!(gen.meshy?.glb_url || gen.meshy?.fbx_url || gen.meshy?.obj_url || gen.meshy?.usdz_url);
  }, [gen.meshy?.glb_url, gen.meshy?.fbx_url, gen.meshy?.obj_url, gen.meshy?.usdz_url]);

  // Use the helper function to get the best proxied model URL
  const modelUrl = useMemo(() => {
    return getBestModelUrl(gen);
  }, [gen]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);
    
    mouseX.set(x * 0.5);
    mouseY.set(y * 0.5);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  }, [mouseX, mouseY]);

  const handleCardClick = useCallback(() => {
    if (is3DMode && modelGenerated) {
      setShow3DModal(true);
    } else {
      setShowImageModal(true);
    }
  }, [is3DMode, modelGenerated]);

  const handleDownload = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(gen.image_url);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      const filename = gen.image_url.split('/').pop() || 'character-sketch.png';
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  }, [gen.image_url]);

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

  const cardClasses = {
    'grid-small': 'aspect-square',
    'grid-medium': 'aspect-[4/5]',
    'grid-large': 'aspect-[3/4]'
  };

  return (
    <>
      <motion.div
        ref={cardRef}
        className="group relative cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className={`relative rounded-xl overflow-hidden border border-gray-800/50 bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-sm ${cardClasses[viewMode]} ${
            isSelected ? 'ring-2 ring-sky-500 ring-opacity-60 shadow-lg shadow-sky-500/20' : ''
          }`}
          style={{
            rotateX: isHovered ? rotateX : 0,
            rotateY: isHovered ? rotateY : 0,
            transformPerspective: 1000,
          }}
          transition={{ duration: 0.1 }}
        >
          {/* Main Content */}
          <CharacterSketchCardContent 
            gen={gen}
            usedAssets={usedAssets}
            is3DMode={is3DMode}
            modelUrl={modelUrl}
            isHovered={isHovered}
            showDetails={showDetails}
            //@ts-expect-error Ignore
            handleShowDetails={handleShowDetails}
          />

          {/* Interactive Hover Effects */}
          <motion.div
            className="absolute inset-0 rounded-xl bg-gradient-to-t from-sky-500/0 via-transparent to-sky-500/0"
            animate={{
              background: isHovered 
                ? 'linear-gradient(to top, rgba(56, 189, 248, 0.1), transparent, rgba(56, 189, 248, 0.05))'
                : 'linear-gradient(to top, transparent, transparent, transparent)'
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Click hint overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]"
            transition={{ duration: 0.2 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: isHovered ? 1 : 0.8,
                opacity: isHovered ? 1 : 0 
              }}
              className="px-4 py-2 bg-gray-900/80 rounded-lg text-white text-sm font-medium"
            >
              {is3DMode && modelGenerated ? 'View 3D Model' : 'View Full Size'}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Enhanced Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-3"
        >
          <CharacterSketchCardToolbar 
            is3DMode={is3DMode}
            handleToggle3D={handleToggle3D}
            handleDownload={handleDownload}
            handleShowDetails={handleShowDetails}
            showDetails={showDetails}
            imageUrl={gen.image_url}
            setModelGenerated={() => {}}
            setModelUrl={() => {}}
            setIs3DMode={setIs3DMode}
            gen={gen}
            isSelected={isSelected}
            onSelect={onSelect}
          />
        </motion.div>
      </motion.div>

      {/* Modals */}
      <CharacterImageModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        gen={gen}
        usedAssets={usedAssets}
      />

      <Character3DModal
        isOpen={show3DModal}
        onClose={() => setShow3DModal(false)}
        gen={gen}
        modelUrl={modelUrl}
      />
    </>
  );
}

export default memo(CharacterSketchCard);