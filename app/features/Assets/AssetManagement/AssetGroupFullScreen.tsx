import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import React, { useEffect, useState, useRef, useCallback, Suspense } from "react"; 
import { useAssetStore } from "@/app/store/assetStore";
import LazyRenderWrapper from "@/app/helpers/LazyRenderWrapper";
import { AssetGroup } from "@/app/types/asset";

const AssetGroupItem = React.lazy(() => import("./AssetGroupItem"));

type Props = {
  assetGroups: AssetGroup[];
}

const AssetGroupFullScreen = ({
  assetGroups,
}: Props) => {
  const { toggleGroupExpanded, getGroupExpanded, setGroupExpanded } = useAssetStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [optimisticallyDeleted, setOptimisticallyDeleted] = useState<Set<string>>(new Set());

  const toggleAssetSelection = useCallback((assetId: string) => {
      const newSet: Set<string> = new Set();
      if (newSet.has(assetId)) {
        newSet.delete(assetId);
      } else {
        newSet.add(assetId);
      }
      return newSet;
  }, []);

  const handleOptimisticDelete = useCallback((assetId: string) => {
    setOptimisticallyDeleted(prev => new Set(prev).add(assetId));
  }, []);

  useEffect(() => {
    assetGroups.forEach(group => {
      setGroupExpanded(group.id, true);
    });

  }, [assetGroups, setGroupExpanded]);

  // Filter out optimistically deleted assets
  const filteredAssetGroups = assetGroups.map(group => ({
    ...group,
    assets: group.assets.filter(asset => !optimisticallyDeleted.has(asset._id)),
    subcategories: group.subcategories ? Object.fromEntries(
      Object.entries(group.subcategories).map(([subcategory, assets]) => [
        subcategory,
        assets.filter(asset => !optimisticallyDeleted.has(asset._id))
      ])
    ) : undefined
  }));

  const AssetSuspenseFallback = () => (
    <div style={{ height: "220px" }} className="bg-gray-800/10 rounded-md animate-pulse w-full"></div>
  );

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-y-auto p-4 bg-gray-950/50"
    >
      <motion.div
        className={`grid gap-4 auto-rows-min`}
        style={{
          gridTemplateColumns: `repeat(3, minmax(300px, 1fr))`
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
        {filteredAssetGroups.map(group => {
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
                      {group.assets.length > 0 ? (
                        group.subcategories && Object.keys(group.subcategories).length > 0 ? (
                          <div className="space-y-4">
                            {Object.entries(group.subcategories).map(([subcategory, assets]) => (
                              assets.length > 0 && (
                                <div key={`${group.id}-${subcategory}`} className="space-y-2">
                                  <div className="flex items-center">
                                    <h4 className="text-xs cursor-default font-medium text-gray-400 uppercase tracking-wider">{subcategory}</h4>
                                    <div className="ml-3 flex-grow h-px bg-gray-800/50"></div>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3">
                                    {assets.map(asset => (
                                      <LazyRenderWrapper 
                                        key={asset._id}
                                        placeholderHeight="220px"
                                      >
                                        <Suspense fallback={<AssetSuspenseFallback />}>
                                          <AssetGroupItem
                                            asset={asset}
                                            toggleAssetSelection={toggleAssetSelection}
                                            isFullScreen={true}
                                            onOptimisticDelete={handleOptimisticDelete}
                                          />
                                        </Suspense>
                                      </LazyRenderWrapper>
                                    ))}
                                  </div>
                                </div>
                              )
                            ))}
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3"> 
                            {group.assets.map(asset => (
                              <LazyRenderWrapper 
                                key={asset._id} 
                                placeholderHeight="120px" 
                              >
                                <Suspense fallback={<AssetSuspenseFallback />}>
                                  <AssetGroupItem
                                    asset={asset}
                                    toggleAssetSelection={toggleAssetSelection}
                                    isFullScreen={true}
                                    onOptimisticDelete={handleOptimisticDelete}
                                  />
                                </Suspense>
                              </LazyRenderWrapper>
                            ))}
                          </div>
                        )
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