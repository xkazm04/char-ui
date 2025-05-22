"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Loader } from "lucide-react";
import { AssetType } from "@/app/types/asset";
import { useAssetStore } from "@/app/store/assetStore";
import OptimizedAssetGroupItem from "./OptimizedAssetGroupItem";
import { VirtualizedGrid } from "@/app/components/ui/virtualized-grid";
import { performance } from "@/app/styles/design-tokens";

interface AssetGroup {
  id: string;
  name: string;
  assets: AssetType[];
  subcategories?: Record<string, AssetType[]>;
}

interface OptimizedAssetGroupProps {
  assetGroups: AssetGroup[];
  setSelectedAssets: React.Dispatch<React.SetStateAction<Set<string>>>;
  isFullScreen?: boolean;
  onLoadMore?: () => void;
  hasMoreAssets?: boolean;
  isLoadingMore?: boolean;
}

const OptimizedAssetGroup: React.FC<OptimizedAssetGroupProps> = ({
  assetGroups,
  setSelectedAssets,
  isFullScreen = false,
  onLoadMore,
  hasMoreAssets = false,
  isLoadingMore = false,
}) => {
  const { toggleGroupExpanded, getGroupExpanded } = useAssetStore();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  // Initialize expanded state from store
  useEffect(() => {
    const initialExpandedState: Record<string, boolean> = {};
    assetGroups.forEach((group) => {
      initialExpandedState[group.id] = getGroupExpanded(group.id);
    });
    setExpandedGroups(initialExpandedState);
  }, [assetGroups, getGroupExpanded]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Calculate columns based on screen size
  const getColumnCount = useCallback(() => {
    if (isFullScreen) {
      if (windowWidth < 640) return 1;
      if (windowWidth < 960) return 2;
      if (windowWidth < 1280) return 3;
      return 4;
    } else {
      return 3; // Sidebar view always has 3 columns
    }
  }, [isFullScreen, windowWidth]);

  const toggleAssetSelection = useCallback((assetId: string) => {
    setSelectedAssets((prev: Set<string>): Set<string> => {
      const newSet: Set<string> = new Set(prev);
      if (newSet.has(assetId)) {
        newSet.delete(assetId);
      } else {
        newSet.add(assetId);
      }
      return newSet;
    });
  }, [setSelectedAssets]);

  const handleToggleGroup = (groupId: string) => {
    toggleGroupExpanded(groupId);
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  // Loading indicator for virtualized grid
  const LoadingIndicator = () => (
    <div className="flex items-center justify-center p-4 text-gray-400">
      <Loader className="h-5 w-5 animate-spin mr-2" />
      <span>Loading more assets...</span>
    </div>
  );

  // Empty state for virtualized grid
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center p-8 text-gray-400 text-sm">
      <div className="w-16 h-16 mb-3 text-gray-600 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-10 h-10"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
          />
        </svg>
      </div>
      <div className="font-medium text-gray-400">No assets found</div>
      <p className="text-xs text-gray-500 mt-1 text-center max-w-xs">
        Try adjusting your search criteria or browse different categories
      </p>
    </div>
  );

  return (
    <div className={`flex flex-col overflow-y-auto flex-1 ${isFullScreen ? 'bg-gray-950/50 p-4' : 'bg-gray-950/30'}`}>
      {assetGroups.map((group) => {
        const isExpanded = expandedGroups[group.id] || false;

        return (
          <div 
            key={group.id} 
            className={`${isFullScreen ? 'border border-gray-800/60 rounded-md bg-gray-900/70 backdrop-blur-sm mb-4 shadow-md' : 'border-b border-gray-800/50'}`}
          >
            {/* Group Header */}
            <div
              className={`flex items-center p-3 cursor-pointer hover:bg-gray-800/20 transition-colors ${isFullScreen ? 'border-b border-gray-800/60' : ''}`}
              onClick={() => handleToggleGroup(group.id)}
            >
              <motion.div
                initial={false}
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-sky-400"
              >
                <ChevronRight size={isFullScreen ? 18 : 16} className="mr-2" />
              </motion.div>
              <span className={`font-medium ${isFullScreen ? 'text-sky-100' : 'text-sm text-sky-100'}`}>
                {group.name}
              </span>
              <span className={`ml-2 text-xs text-sky-400/80`}>
                ({group.assets.length})
              </span>
            </div>

            {/* Expanded group content with animation */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className={isFullScreen ? "p-3" : "py-1 px-2"}>
                    {group.assets.length > 0 ? (
                      group.subcategories && Object.keys(group.subcategories).length > 0 ? (
                        <div className={isFullScreen ? "space-y-4" : "space-y-3"}>
                          {Object.entries(group.subcategories).map(
                            ([subcategory, assets]) =>
                              assets.length > 0 && (
                                <div key={`${group.id}-${subcategory}`} className={isFullScreen ? "space-y-2" : ""}>
                                  {/* Subcategory heading */}
                                  <div className="flex items-center mb-1">
                                    <h4 className={`text-xs font-medium cursor-default uppercase tracking-wider ${isFullScreen ? 'text-gray-400' : 'text-gray-700 hover:text-gray-300 transition-colors duration-300'}`}>
                                      {subcategory}
                                    </h4>
                                    <div className={`ml-${isFullScreen ? '3' : '2'} flex-grow h-px bg-gray-800/${isFullScreen ? '50' : '40'}`}></div>
                                  </div>

                                  {/* Assets in subcategory */}
                                  {isFullScreen ? (
                                    <div className="h-[220px]">
                                      <VirtualizedGrid
                                        items={assets}
                                        renderItem={(asset, index) => (
                                          <OptimizedAssetGroupItem
                                            asset={asset}
                                            toggleAssetSelection={toggleAssetSelection}
                                            isFullScreen={true}
                                            priority={index < performance.virtualizedBatchSize / 2}
                                          />
                                        )}
                                        itemHeight={130}
                                        itemWidth={300}
                                        gap={12}
                                        columnCount={getColumnCount()}
                                        getItemKey={(asset) => asset._id}
                                        onEndReached={onLoadMore}
                                        loadingIndicator={isLoadingMore ? <LoadingIndicator /> : null}
                                        emptyComponent={<EmptyState />}
                                        className="overflow-y-auto"
                                      />
                                    </div>
                                  ) : (
                                    <div className="grid grid-cols-3 gap-1">
                                      {assets.map((asset) => (
                                        <OptimizedAssetGroupItem
                                          asset={asset}
                                          key={asset._id}
                                          toggleAssetSelection={toggleAssetSelection}
                                          isFullScreen={false}
                                        />
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )
                          )}
                        </div>
                      ) : (
                        // Fallback when no subcategories
                        isFullScreen ? (
                          <div className="h-[220px]">
                            <VirtualizedGrid
                              items={group.assets}
                              renderItem={(asset, index) => (
                                <OptimizedAssetGroupItem
                                  asset={asset}
                                  toggleAssetSelection={toggleAssetSelection}
                                  isFullScreen={true}
                                  priority={index < performance.virtualizedBatchSize / 2}
                                />
                              )}
                              itemHeight={130}
                              itemWidth={300}
                              gap={12}
                              columnCount={getColumnCount()}
                              getItemKey={(asset) => asset._id}
                              onEndReached={onLoadMore}
                              loadingIndicator={isLoadingMore ? <LoadingIndicator /> : null}
                              emptyComponent={<EmptyState />}
                              className="overflow-y-auto"
                            />
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 gap-1">
                            {group.assets.map((asset) => (
                              <OptimizedAssetGroupItem
                                asset={asset}
                                key={asset._id}
                                toggleAssetSelection={toggleAssetSelection}
                                isFullScreen={false}
                              />
                            ))}
                          </div>
                        )
                      )
                    ) : (
                      <div className="flex items-center justify-center p-3 text-gray-500 text-xs italic bg-gray-800/20 rounded-md">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4 mr-1.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                          />
                        </svg>
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

export default OptimizedAssetGroup;

