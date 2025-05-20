import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CharacterSketchCard from './CharacterSketchCard';
import { useCharacterStore } from '@/app/store/charStore';
import { useAssetStore } from '@/app/store/assetStore';
import { LucideImages } from 'lucide-react';
import { useNavStore } from '@/app/store/navStore';
import { useGenerations } from '@/app/functions/genFns';

export default function CharacterSketchGrid() {
  const { currentCharacter } = useCharacterStore();
  //@ts-expect-error Ignore
  const {  isGenerating, setIsGenerating } = useAssetStore();
  const { assetNavExpanded, setAssetNavExpanded } = useNavStore()
  const { data: sketches, isLoading } = useGenerations({
    limit: 20,
    // characterId: currentCharacter?.id, - hardcoded for now
  });


  if (sketches && sketches.length === 0 && !isGenerating) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full h-full flex flex-col items-center justify-center bg-gray-950/20 rounded-lg border border-dashed border-sky-900/50"
      >
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-sky-900/20 rounded-full flex items-center justify-center">
            <LucideImages className="h-8 w-8 text-sky-500/70" />
          </div>
          <h3 className="text-xl font-semibold text-sky-200 mb-2">No sketches yet</h3>
          <p className="text-gray-400 mb-6">
            Apply some assets to your character and generate sketches to see them here.
          </p>
          <button
            className="px-4 py-2 bg-sky-700 hover:bg-sky-600 rounded-md cursor-pointer
            transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-[#0d1230]"
            onClick={() => setAssetNavExpanded(!assetNavExpanded)}
          >
            Select asset
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full bg-gray-950/20 rounded-lg border border-sky-900/30 overflow-hidden flex flex-col md:min-h-[450px] lg:min-h-[600px]"
    >
      <div className="p-4 flex justify-between items-center border-b border-sky-900/30">
        <h3 className="text-lg font-medium text-sky-200">
          Generations
        </h3>
        <button onClick={() => setIsGenerating(false)} className="mt-4 px-4 py-2 bg-sky-700 hover:bg-sky-600 rounded-md cursor-pointer
            transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-[#0d1230]">
          Cancel
        </button>
      </div>

      {/* Sketches container */}
      <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-sky-900/50 scrollbar-track-transparent">
        <AnimatePresence mode="wait">
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4"
          >
            {sketches && sketches.map((sketch) => (
              <CharacterSketchCard
                key={sketch._id}
                gen={sketch}
                usedAssets={sketch.used_assets}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}