import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CharacterSketchCard from './CharacterSketchCard';
import { useAssetStore } from '@/app/store/assetStore';
import { useGenerations } from '@/app/functions/genFns';
import { ProgressBarTexted } from '@/app/components/anim/ProgressBar';
import CharacterSketchGridEmpty from './CharacterSketchGridEmpty';
import CharacterSketchGridHeader from './CharacterSketchGridHeader';
import CharacterSketchGridBulk from './CharacterSketchGridBulk';
import { useCharacterStore } from '@/app/store/charStore';

type ViewMode = 'grid-small' | 'grid-medium' | 'grid-large';
type SortMode = 'newest' | 'oldest';


export default function CharacterSketchGrid() {
  const { isGenerating, setIsGenerating } = useAssetStore();
  const { currentCharacter} = useCharacterStore()
  const { data: sketches, isLoading } = useGenerations({
    limit: 50, 
    characterId: currentCharacter?.id || '',
  });

  const [viewMode, setViewMode] = useState<ViewMode>('grid-medium');
  const [sortMode, setSortMode] = useState<SortMode>('newest');
  const [selectedSketches, setSelectedSketches] = useState<Set<string>>(new Set());

  // Sort and filter sketches
  const processedSketches = useMemo(() => {
    if (!sketches) return [];
    
    const filtered = [...sketches];
    
    filtered.sort((a, b) => {
      switch (sortMode) {
        case 'newest':
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        case 'oldest':
          return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [sketches, sortMode]);

  // Grid classes based on view mode
  const gridClasses = useMemo(() => {
    switch (viewMode) {
      case 'grid-small':
        return 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3';
      case 'grid-medium':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4';
      case 'grid-large':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6';
      default:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4';
    }
  }, [viewMode]);

  // Loading state
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full h-full bg-gray-950/20 rounded-lg border border-sky-900/30 overflow-hidden flex flex-col md:min-h-[450px] lg:min-h-[600px]"
      >
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-sky-900/30 rounded-full"></div>
              <div className="absolute top-0 left-0 w-12 h-12 border-4 border-sky-500 rounded-full animate-spin border-t-transparent"></div>
            </div>
            <p className="text-gray-400">Loading generations...</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full bg-gradient-to-br from-gray-950/20 via-sky-950/5 to-gray-950/10 rounded-lg border border-sky-900/30 overflow-hidden flex flex-col md:min-h-[450px] lg:min-h-[600px] backdrop-blur-sm"
    >
      <CharacterSketchGridHeader
        sketchCount={processedSketches.length}
        viewMode={viewMode}
        setViewMode={setViewMode}
        sortMode={sortMode}
        setSortMode={setSortMode}
        isGenerating={isGenerating}
        setIsGenerating={setIsGenerating}
      />
      {processedSketches.length == 0 && <CharacterSketchGridEmpty />}

      {/* Sketches Grid */}
      <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-sky-900/50 scrollbar-track-transparent">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${viewMode}-${sortMode}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={gridClasses}
          >
            {processedSketches.map((sketch, index) => (
              <motion.div
                key={sketch._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.05,
                  ease: "easeOut"
                }}
              >
                <CharacterSketchCard
                  gen={sketch}
                  usedAssets={sketch.used_assets}
                  viewMode={viewMode}
                  isSelected={selectedSketches.has(sketch._id)}
                  onSelect={(selected) => {
                    const newSelected = new Set(selectedSketches);
                    if (selected) {
                      newSelected.add(sketch._id);
                    } else {
                      newSelected.delete(sketch._id);
                    }
                    setSelectedSketches(newSelected);
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Generation Progress */}
      {isGenerating && (
        <ProgressBarTexted />
      )}

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedSketches.size > 0 && (
          <CharacterSketchGridBulk 
            selectedSketches={selectedSketches}
            setSelectedSketches={setSelectedSketches}
            characterId={currentCharacter?.id}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}