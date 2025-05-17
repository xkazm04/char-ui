import { AlertCircle, ChevronRight } from "lucide-react";
import AssetGroupItem from "./AssetGroupItem";
import { motion, AnimatePresence } from "framer-motion";
import { useAssetStore } from "@/app/store/assetStore";
import { AssetGroup } from "@/app/functions/assetFns";

type Props = {
  assetGroups: AssetGroup[];
  mainSearchQuery: string;
  toggleAssetSelection: (assetId: string) => void;
  selectedAssets: Set<string>;
}

const AssetGroupList = ({ assetGroups, toggleAssetSelection, selectedAssets }: Props) => {
  const { toggleGroupExpanded, getGroupExpanded } = useAssetStore();

  return (
    <div className="flex flex-col overflow-y-auto flex-1">
      {assetGroups.map(group => {
        const isExpanded = getGroupExpanded(group.id);
        
        return (
          <div key={group.id} className="border-b border-gray-800">
            {/* Group Header showing subcategory instead of type */}
            <div
              className="flex items-center p-3 cursor-pointer hover:brightness-125"
              onClick={() => toggleGroupExpanded(group.id)}
            >
              <motion.div
                initial={false}
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronRight size={18} className="text-gray-400 mr-2" />
              </motion.div>
              <span className="font-medium">{group.name}</span>
              <span className="ml-2 text-xs text-gray-500">({group.assets.length})</span>
            </div>

            {/* Expanded group content with animation */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden py-1"
                >
                  <div className="pl-5 pr-3 pb-3">
                    {/* Assets in the group */}
                    <div className="grid grid-cols-3 gap-2">
                      {group.assets.length > 0 ? (
                        group.assets.map(asset => (
                          <AssetGroupItem 
                            asset={asset}
                            key={asset.id || asset._id}
                            isSelected={selectedAssets.has(asset.id || asset._id)}
                            toggleAssetSelection={toggleAssetSelection}
                          />
                        ))
                      ) : (
                        <div className="flex items-center justify-center p-4 text-gray-500 text-sm">
                          <AlertCircle size={16} className="mr-2" />
                          No assets found
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export default AssetGroupList;