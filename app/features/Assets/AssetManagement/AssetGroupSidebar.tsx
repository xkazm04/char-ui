import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, ChevronRight } from "lucide-react";
import { AssetGroup } from "@/app/functions/assetFns";
import { useAssetStore } from "@/app/store/assetStore";
import AssetGroupItem from "./AssetGroupItem";

type Props = {
  assetGroups: AssetGroup[];
  setSelectedAssets: React.Dispatch<React.SetStateAction<Set<string>>>;
}

const AssetGroupSidebar = ({
  assetGroups,
  setSelectedAssets,
}: Props) => {
  const { toggleGroupExpanded, getGroupExpanded } = useAssetStore();

  const toggleAssetSelection = (assetId: string) => {
    console.log("Toggling asset:", assetId);
    setSelectedAssets((prev: Set<string>): Set<string> => {
      const newSet: Set<string> = new Set(prev);
      if (newSet.has(assetId)) {
        console.log("Removing asset from selection:", assetId);
        newSet.delete(assetId);
      } else {
        console.log("Adding asset to selection:", assetId);
        newSet.add(assetId);
      }
      return newSet;
    });
  };

  return (
    <div className="flex flex-col overflow-y-auto flex-1 bg-gray-950/30">
      {assetGroups.map(group => {
        const isExpanded = getGroupExpanded(group.id);

        return (
          <div key={group.id} className="border-b border-gray-800/50">
            {/* Group Header showing subcategory instead of type */}
            <div
              className="flex items-center p-3 cursor-pointer hover:bg-gray-800/20 transition-colors"
              onClick={() => toggleGroupExpanded(group.id)}
            >
              <motion.div
                initial={false}
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-sky-400"
              >
                <ChevronRight size={16} className="mr-2" />
              </motion.div>
              <span className="font-medium text-sm text-sky-100">{group.name}</span>
              <span className="ml-2 text-xs text-sky-400/80">({group.assets.length})</span>
            </div>

            {/* Expanded group content with animation */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="py-1 px-2">
                    {group.assets.length > 0 ? (
                      group.subcategories && Object.keys(group.subcategories).length > 0 ? (
                        <div className="space-y-3">
                          {Object.entries(group.subcategories).map(([subcategory, assets]) => (
                            assets.length > 0 && (
                              <div key={`${group.id}-${subcategory}`}>
                                {/* Compact subcategory heading */}
                                <div className="flex items-center mb-1">
                                  <h4 className="text-xs font-medium text-gray-700 hover:text-gray-300 cursor-default
                                  transition-colors duration-300  uppercase tracking-wider">
                                    {subcategory}</h4>
                                  <div className="ml-2 flex-grow h-px bg-gray-800/40"></div>
                                </div>
                                
                                {/* Assets in subcategory - compact grid */}
                                <div className="grid grid-cols-3 gap-1">
                                  {assets.map(asset => (
                                    <AssetGroupItem
                                      asset={asset}
                                      key={asset._id || asset._id}
                                      toggleAssetSelection={toggleAssetSelection}
                                      isFullScreen={false}
                                    />
                                  ))}
                                </div>
                              </div>
                            )
                          ))}
                        </div>
                      ) : (
                        // Fallback to original grid when no subcategories
                        <div className="grid grid-cols-3 gap-1">
                          {group.assets.map(asset => (
                            <AssetGroupItem
                              asset={asset}
                              key={asset._id || asset._id}
                              toggleAssetSelection={toggleAssetSelection}
                              isFullScreen={false}
                            />
                          ))}
                        </div>
                      )
                    ) : (
                      <div className="flex items-center justify-center p-3 text-gray-500 text-xs italic bg-gray-800/20 rounded-md">
                        <AlertCircle size={14} className="mr-1.5" />
                        No assets found
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default AssetGroupSidebar;