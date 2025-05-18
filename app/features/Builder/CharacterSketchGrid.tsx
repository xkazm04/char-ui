import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CharacterSketchCard from './CharacterSketchCard';
import { useCharacterStore } from '@/app/store/charStore';
import { useAssetStore } from '@/app/store/assetStore';
import {  LucideImages } from 'lucide-react';
import { useNavStore } from '@/app/store/navStore';
import { JinxImgUrl } from './CharacterCard';
import { AssetType } from '@/app/types/asset';

interface CharacterSketch {
  id: string;
  imageUrl: string;
  timestamp: string;
  usedAssets: AssetType[];
}

export default function CharacterSketchGrid() {
  const { currentCharacter } = useCharacterStore();
  const { clothing, equipment, accessories } = useAssetStore();
  const [sketches, setSketches] = useState<CharacterSketch[]>([]);
  const { assetNavExpanded, setAssetNavExpanded } = useNavStore()

  useEffect(() => {
    if (!currentCharacter) return;

    const mockSketches: CharacterSketch[] = Array(4).fill(null).map((_, i) => {
      const randomClothing = clothing.length > 0 ? clothing[Math.floor(Math.random() * clothing.length)] : null;
      const randomEquipment = equipment.length > 0 ? equipment[Math.floor(Math.random() * equipment.length)] : null;
      const randomAccessory = accessories.length > 0 ? accessories[Math.floor(Math.random() * accessories.length)] : null;
      
      const usedAssets: AssetType[] = [
        randomClothing, randomEquipment, randomAccessory
      ].filter(Boolean) as AssetType[];

      return {
        id: `sketch-${i}`,
        imageUrl: JinxImgUrl, 
        timestamp: new Date(Date.now() - i * 3600000).toLocaleString(),
        usedAssets
      };
    });

    setSketches(mockSketches);
  }, [currentCharacter, clothing, equipment, accessories]);


  if (sketches.length === 0) {
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
          <button
            className="px-4 py-2 ml-2 bg-sky-700/20 hover:bg-sky-600 rounded-md cursor-pointer
            transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-[#0d1230]"
            onClick={() => {
              const mockSketches: CharacterSketch[] = Array(4).fill(null).map((_, i) => {
                const randomClothing = clothing.length > 0 ? clothing[Math.floor(Math.random() * clothing.length)] : null;
                const randomEquipment = equipment.length > 0 ? equipment[Math.floor(Math.random() * equipment.length)] : null;
                const randomAccessory = accessories.length > 0 ? accessories[Math.floor(Math.random() * accessories.length)] : null;
                
                const usedAssets: AssetType[] = [
                  randomClothing, randomEquipment, randomAccessory
                ].filter(Boolean) as AssetType[];

                return {
                  id: `sketch-${i}`,
                  imageUrl: JinxImgUrl, // Placeholder image
                  timestamp: new Date(Date.now() - i * 3600000).toLocaleString(),
                  usedAssets
                };
              });
              
              setSketches(mockSketches);
            }}
          >
            Mock Data
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
      {/* Header with view mode toggle */}
      <div className="p-4 flex justify-between items-center border-b border-sky-900/30">
        <h3 className="text-lg font-medium text-sky-200">
          Image Generations
        </h3>
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
              {sketches.map((sketch) => (
                <CharacterSketchCard
                  key={sketch.id}
                  imageUrl={sketch.imageUrl}
                  usedAssets={sketch.usedAssets}
                />
              ))}
            </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}