import { useState, memo, useCallback, useRef, useMemo } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import CharacterSketchCardToolbar from './CharacterSketchCardToolbar';
import { GenType, UsedAssets } from '@/app/types/gen';
import { CheckSquare, Square } from 'lucide-react';
import CharacterSketchCardContent from './CharacterSketchCardContent';

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
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);

  // Check if model is generated from meshy data
  const modelGenerated = useMemo(() => {
    return !!(gen.meshy?.glb_url);
  }, [gen.meshy?.glb_url]);

  const modelUrl = useMemo(() => {
    return gen.meshy?.glb_url || null;
  }, [gen.meshy?.glb_url]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);
    
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  }, [mouseX, mouseY]);

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

  const handleSelect = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(!isSelected);
  }, [isSelected, onSelect]);

  const cardClasses = {
    'grid-small': 'aspect-square',
    'grid-medium': 'aspect-[4/5]',
    'grid-large': 'aspect-[3/4]'
  };

  return (
    <motion.div
      ref={cardRef}
      className="group relative"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className={`relative rounded-xl overflow-hidden border border-gray-800/50 bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-sm ${cardClasses[viewMode]} ${
          isSelected ? 'ring-2 ring-sky-500 ring-opacity-60' : ''
        }`}
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          transformPerspective: 1000,
        }}
        transition={{ duration: 0.1 }}
      >
        {/* Selection Checkbox */}
        {onSelect && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: isHovered || isSelected ? 1 : 0, 
              scale: isHovered || isSelected ? 1 : 0.8 
            }}
            onClick={handleSelect}
            className="absolute top-3 left-3 z-20 p-1.5 bg-gray-900/80 backdrop-blur rounded-lg hover:bg-gray-800/80 transition-all"
          >
            {isSelected ? (
              <CheckSquare className="h-4 w-4 text-sky-400" />
            ) : (
              <Square className="h-4 w-4 text-gray-400" />
            )}
          </motion.button>
        )}

        {/* Main Image/3D Content */}
        <CharacterSketchCardContent 
          gen={gen}
          usedAssets={usedAssets}
          is3DMode={is3DMode}
          modelUrl={modelUrl}
          modelGenerated={modelGenerated}
          isHovered={isHovered}
          showDetails={showDetails}
          handleShowDetails={handleShowDetails}
        />

        {/* Hover Border Effect */}
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-transparent"
          animate={{
            borderColor: isHovered 
              ? 'rgba(56, 189, 248, 0.3)' 
              : 'transparent'
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>

      {/* Enhanced Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-3"
      >
        <CharacterSketchCardToolbar 
          modelGenerated={modelGenerated}
          is3DMode={is3DMode}
          handleToggle3D={handleToggle3D}
          handleDownload={handleDownload}
          handleShowDetails={handleShowDetails}
          showDetails={showDetails}
          imageUrl={gen.image_url}
          setModelGenerated={() => {}} // Not needed anymore since we use meshy data
          setModelUrl={() => {}} // Not needed anymore since we use meshy data
          setIs3DMode={setIs3DMode}
          gen={gen}
        />
      </motion.div>
    </motion.div>
  );
}

export default memo(CharacterSketchCard);