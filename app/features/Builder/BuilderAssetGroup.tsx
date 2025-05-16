import { AssetType } from "@/app/types/asset";
import { motion, AnimatePresence } from "framer-motion";
import { LucideChevronDown, LucideChevronRight, LucideTrash2, LucideX } from "lucide-react";
import { useState } from "react";

interface AssetTagProps {
  asset: AssetType;
  onRemove: () => void;
}

  export const assetColor = (type: string) => {
    switch (type) {
      case 'clothing':
        return 'bg-blue-400/20';
      case 'equipment':
        return 'bg-green-500/20';
      case 'accessories':
        return 'bg-purple-500/10';
      default:
        return 'bg-gray-900/20';
    }
  }

const AssetTag = ({ asset, onRemove }: AssetTagProps) => {

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`flex items-center ${assetColor(asset.type)}
         border border-gray-700/50 rounded-full px-3 py-1 text-xs mr-2 mb-2`}
    >
      <span className="text-white truncate max-w-[150px]">{asset.name}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="ml-2 text-gray-400 hover:text-red-400 transition-colors duration-200"
        aria-label={`Remove ${asset.name}`}
      >
        <LucideX className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
};

interface CollapsibleAssetSectionProps {
  title: string;
  assets: AssetType[];
  type: string;
  onRemove: (id: string, type: AssetType) => void;
  onClearCategory: (type: AssetType) => void;
  defaultOpen?: boolean;
}

const BuilderAssetGroup = ({ 
  title, 
  assets, 
  type, 
  onRemove, 
  onClearCategory,
  defaultOpen = true 
}: CollapsibleAssetSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="mb-3 border-b border-sky-900/20 pb-3 last:border-b-0 last:pb-0">
      <div 
        className="flex justify-between items-center mb-1.5 cursor-pointer" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          {isOpen ? 
            <LucideChevronDown className="h-3.5 w-3.5 text-sky-400 mr-1.5" /> : 
            <LucideChevronRight className="h-3.5 w-3.5 text-sky-400 mr-1.5" />
          }
          <h3 className="text-sm font-medium text-sky-300">{title} <span className="text-xs text-sky-500">({assets.length})</span></h3>
        </div>
        
        {assets.length > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClearCategory(type);
            }}
            className="text-xs text-gray-400 hover:text-red-400 transition-colors flex items-center"
            aria-label={`Clear all ${title.toLowerCase()}`}
          >
            <LucideTrash2 className="h-3 w-3 mr-1" />
            Clear
          </button>
        )}
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className={`
              ${assets.length > 0 ? 'min-h-[40px]' : 'h-8'} 
              rounded-lg p-2 border border-sky-900/20
            `}>
              <AnimatePresence>
                {assets.length > 0 ? (
                  <div className="flex flex-wrap">
                    {assets.map((asset) => (
                      <AssetTag 
                        key={asset.id} 
                        asset={asset} 
                        onRemove={() => onRemove(asset._id, type)} 
                      />
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center h-full text-gray-500 text-xs italic"
                  >
                    No {title.toLowerCase()} selected
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BuilderAssetGroup;