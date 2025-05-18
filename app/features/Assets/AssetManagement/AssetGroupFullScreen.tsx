import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { AssetGroup } from "@/app/functions/assetFns";
import { useAssetStore } from "@/app/store/assetStore";
import AssetGroupItem from "./AssetGroupItem";

type Props = {
  assetGroups: AssetGroup[];
  setSelectedAssets: React.Dispatch<React.SetStateAction<Set<string>>>;
}

const AssetGroupFullScreen = ({
  assetGroups,
  setSelectedAssets,
}: Props) => {
  const { toggleGroupExpanded, getGroupExpanded, setGroupExpanded } = useAssetStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(3);

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

  useEffect(() => {
    assetGroups.forEach(group => {
      setGroupExpanded(group.id, true);
    });

    const calculateColumns = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;

      if (width < 640) {
        setColumns(1);
      } else if (width < 960) {
        setColumns(2);
      } else if (width < 1280) {
        setColumns(3);
      } else {
        setColumns(4);
      }
    };

    calculateColumns();
    window.addEventListener('resize', calculateColumns);

    return () => {
      window.removeEventListener('resize', calculateColumns);
    };
  }, [assetGroups, setGroupExpanded]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-y-auto p-4 bg-gray-950/50"
    >
      <motion.div
        className={`grid gap-4 auto-rows-min`}
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(300px, 1fr))`
        }}
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.05
            }
          },
          hidden: {}
        }}
      >
        {assetGroups.map(group => {
          const isExpanded = getGroupExpanded(group.id);

          return (
            <motion.div
              key={group.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.3 }}
              className="border border-gray-800/60 rounded-md bg-gray-900/70 backdrop-blur-sm flex flex-col h-min shadow-md"
            >
              {/* Group Header */}
              <div
                className="flex items-center p-3 cursor-pointer hover:bg-gray-800/30 transition-colors border-b border-gray-800/60"
                onClick={() => toggleGroupExpanded(group.id)}
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-sky-400"
                >
                  <ChevronRight size={18} className="mr-2" />
                </motion.div>
                <span className="font-medium text-sky-100">{group.name}</span>
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
                    <div className="p-3">
                      {/* Assets in the group - improved grid with better gap management */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {group.assets.length > 0 ? (
                          group.assets.map(asset => (
                            <AssetGroupItem
                              asset={asset}
                              key={asset.id || asset._id}
                              toggleAssetSelection={toggleAssetSelection}
                              isFullScreen={true}
                            />
                          ))
                        ) : (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full flex flex-col items-center justify-center p-8 text-gray-400 text-sm bg-gray-800/20 rounded-md border border-gray-700/30"
                          >
                            <div className="w-16 h-16 mb-3 text-gray-600 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                              </svg>
                            </div>
                            <div className="font-medium text-gray-400">No assets found</div>
                            <p className="text-xs text-gray-500 mt-1 text-center max-w-xs">
                              Try adjusting your search criteria or browse different categories
                            </p>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default AssetGroupFullScreen;