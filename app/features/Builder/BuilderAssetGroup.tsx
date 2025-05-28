import { AssetType } from "@/app/types/asset";
import { motion, AnimatePresence } from "framer-motion";
import { LucideChevronDown, LucideChevronRight, LucideTrash2 } from "lucide-react";
import { useState } from "react";
import AssetTag from "./BuilderAssetTag";

interface CollapsibleAssetSectionProps {
  title: string;
  assets: AssetType[];
  type: string;
  onRemove: (id: string, type: string) => void;
  onClearCategory: (type: string) => void;
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
            <div className={`h-[40px] rounded-lg px-2 py-0.5`}>
              <AnimatePresence>
                {assets.length > 0 ? (
                  <div className="flex flex-wrap">
                    {assets.map((asset) => (
                      <AssetTag
                        key={asset._id}
                        asset={asset}
                        onRemove={() => {
                          const assetId = asset._id;
                          const assetType = asset.type || type;

                          if (!assetId) {
                            console.warn('Asset ID is missing, cannot remove asset');
                            return;
                          }
                          onRemove(assetId, assetType);
                        }}
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