import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideDownload, Info, LucideX } from 'lucide-react'
import { AssetType } from '@/app/types/asset';

interface CharacterSketchCardProps {
  imageUrl: string;
  usedAssets: AssetType[];
  selected?: boolean;
  onSelect?: () => void;
}

export default function CharacterSketchCard({
  imageUrl,
  usedAssets,
  selected = false,
  onSelect
}: CharacterSketchCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
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
  };

  const handleShowDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDetails(true);
  };

  return (
    <motion.div
      className={`relative rounded-lg overflow-hidden cursor-pointer transition-all
                 ${selected ? 'ring-2 ring-sky-500 ring-offset-1 ring-offset-[#0a0a18]' : 'hover:ring-1 hover:ring-sky-500/50'}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      onClick={onSelect}
      layout
    >
      <div className="aspect-square overflow-hidden relative border border-gray-800/50 rounded-lg bg-gray-900/30">
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src={imageUrl}
            alt="Character sketch"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-contain" // This ensures the full image is visible
          />
        </div>

        {/* Hover overlay with action buttons */}
        <AnimatePresence>
          {isHovering && !showDetails && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-t from-[#0a0a18]/80 to-[#0a0a18]/40 flex flex-col items-center justify-end p-4"
            >
              <div className="flex space-x-2 mb-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-sky-200 rounded-full cursor-pointer hover:text-sky-500"
                  onClick={handleDownload}
                  aria-label="Download image"
                >
                  <LucideDownload/>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-sky-200 rounded-full cursor-pointer hover:text-sky-500"
                  onClick={handleShowDetails}
                  aria-label="Show used assets"
                >
                  <Info  />
                </motion.button>
              </div>
              <p className="text-xs italic font-mono text-gray-400">Click to select</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Used assets detail overlay */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0a0a18]/90 p-4 overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-bold text-sky-400">Used Assets</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDetails(false);
                  }}
                  className="text-gray-400 hover:text-white"
                  aria-label="Close asset details"
                >
                  <LucideX className="h-5 w-5" />
                </motion.button>
              </div>

              <div className="space-y-3">
                {usedAssets.length > 0 ? (
                  ['clothing', 'equipment', 'accessories'].map((type) => {
                    const filteredAssets = usedAssets.filter(asset => asset.type === type);
                    return filteredAssets.length > 0 ? (
                      <div key={type} className="mb-2">
                        <h4 className="text-xs text-gray-400 uppercase mb-1">{type}</h4>
                        <div className="space-y-1">
                          {filteredAssets.map((asset) => (
                            <div key={asset.id} className={`rounded-md px-2 text-sm`}>
                              <li className="text-sky-200 text-xs">{asset.name}</li>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null;
                  })
                ) : (
                  <p className="text-gray-400 text-sm">No assets were used for this sketch.</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}