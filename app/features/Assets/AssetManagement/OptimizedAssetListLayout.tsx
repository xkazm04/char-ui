"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Hammer, Search, X, Loader, Maximize2, Minimize2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavStore } from "@/app/store/navStore";
import { useOptimizedAssets, useParallelAssetsByType } from "@/app/hooks/useOptimizedAssets";
import { processAssetsIntoGroups } from "@/app/functions/assetFns";
import { performance } from "@/app/styles/design-tokens";
import AssetManCatSelector from "./AssetManCatSelector";
import OptimizedAssetGroup from "./OptimizedAssetGroup";
import { Button } from "@/app/components/ui/button";
import { debounce } from "lodash";

const OptimizedAssetListLayout = () => {
  const [mainSearchQuery, setMainSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [knownAssetTypes, setKnownAssetTypes] = useState<string[]>([]);
  const [useParallelLoading, setUseParallelLoading] = useState(false);
  
  const {
    assetNavExpanded,
    setAssetNavExpanded,
    assetNavHighlighted,
    setAssetNavHighlighted,
  } = useNavStore();

  // Debounce search input
  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedSearchQuery(mainSearchQuery);
    }, performance.searchDebounceTime);
    
    handler();
    return () => {
      handler.cancel();
    };
  }, [mainSearchQuery]);

  // Single type loading
  const {
    assets: singleTypeAssets,
    isLoading: isSingleTypeLoading,
    isFetchingNextPage: isSingleTypeFetchingMore,
    hasNextPage: hasSingleTypeNextPage,
    loadMoreAssets: loadMoreSingleTypeAssets,
    error: singleTypeError,
    refetch: refetchSingleType,
    totalAssets: singleTypeTotalAssets,
  } = useOptimizedAssets(
    activeCategory,
    assetNavExpanded && !useParallelLoading,
    performance.defaultPageSize
  );

  // Parallel loading for all asset types
  const {
    assetsByType,
    isLoading: isParallelLoading,
    isFetchingNextPage: isParallelFetchingMore,
    hasNextPage: hasParallelNextPage,
    loadMoreAssets: loadMoreParallelAssets,
    error: parallelError,
    refetch: refetchParallel,
    totalAssets: parallelTotalAssets,
  } = useParallelAssetsByType(
    knownAssetTypes,
    assetNavExpanded && useParallelLoading,
    Math.floor(performance.defaultPageSize / (knownAssetTypes.length || 1))
  );

  // Discover asset types from loaded assets
  useEffect(() => {
    if (singleTypeAssets.length > 0 && !activeCategory) {
      const types = new Set(singleTypeAssets.map((asset) => asset.type));
      setKnownAssetTypes(Array.from(types));
    }
  }, [singleTypeAssets, activeCategory]);

  // Auto-load more assets when scrolling
  useEffect(() => {
    if (
      assetNavExpanded &&
      !useParallelLoading &&
      hasSingleTypeNextPage &&
      !isSingleTypeFetchingMore
    ) {
      loadMoreSingleTypeAssets();
    }
  }, [
    assetNavExpanded,
    hasSingleTypeNextPage,
    isSingleTypeFetchingMore,
    loadMoreSingleTypeAssets,
    useParallelLoading,
  ]);

  const handleHammerClick = () => {
    setAssetNavExpanded(!assetNavExpanded);
    setAssetNavHighlighted(false);
  };

  // Process assets into groups
  const assetGroups = useMemo(() => {
    if (useParallelLoading) {
      // Combine assets from all types for search filtering
      const allAssets = assetsByType.flatMap((group) => group.assets);
      
      // Filter by search query
      const filteredAssets = debouncedSearchQuery
        ? allAssets.filter((asset) => {
            return (
              (asset.name &&
                asset.name
                  .toLowerCase()
                  .includes(debouncedSearchQuery.toLowerCase())) ||
              (asset.description &&
                asset.description
                  .toLowerCase()
                  .includes(debouncedSearchQuery.toLowerCase())) ||
              (asset.subcategory &&
                asset.subcategory
                  .toLowerCase()
                  .includes(debouncedSearchQuery.toLowerCase()))
            );
          })
        : allAssets;
      
      return processAssetsIntoGroups(filteredAssets);
    } else {
      // Filter by search query
      const filteredAssets = debouncedSearchQuery
        ? singleTypeAssets.filter((asset) => {
            return (
              (asset.name &&
                asset.name
                  .toLowerCase()
                  .includes(debouncedSearchQuery.toLowerCase())) ||
              (asset.description &&
                asset.description
                  .toLowerCase()
                  .includes(debouncedSearchQuery.toLowerCase())) ||
              (asset.subcategory &&
                asset.subcategory
                  .toLowerCase()
                  .includes(debouncedSearchQuery.toLowerCase()))
            );
          })
        : singleTypeAssets;
      
      return processAssetsIntoGroups(filteredAssets);
    }
  }, [
    assetsByType,
    debouncedSearchQuery,
    singleTypeAssets,
    useParallelLoading,
  ]);

  // Calculate total displayed assets
  const totalDisplayedAssets = useMemo(() => {
    return assetGroups.reduce((sum, group) => sum + group.assets.length, 0);
  }, [assetGroups]);

  // Calculate total API fetched assets
  const totalApiFetchedAssets = useParallelLoading
    ? parallelTotalAssets
    : singleTypeTotalAssets;

  // Handle category change
  const handleCategoryChange = useCallback((category: string | null) => {
    setActiveCategory(category);
    
    // If switching to "All" categories, enable parallel loading
    if (!category && knownAssetTypes.length > 1) {
      setUseParallelLoading(true);
    } else {
      setUseParallelLoading(false);
    }
  }, [knownAssetTypes]);

  // Handle errors
  const error = useParallelLoading ? parallelError : singleTypeError;
  
  // Handle loading state
  const isLoading = useParallelLoading ? isParallelLoading : isSingleTypeLoading;
  
  // Handle "load more" functionality
  const handleLoadMore = useCallback(() => {
    if (useParallelLoading) {
      if (hasParallelNextPage && !isParallelFetchingMore) {
        loadMoreParallelAssets();
      }
    } else {
      if (hasSingleTypeNextPage && !isSingleTypeFetchingMore) {
        loadMoreSingleTypeAssets();
      }
    }
  }, [
    hasParallelNextPage,
    hasSingleTypeNextPage,
    isParallelFetchingMore,
    isSingleTypeFetchingMore,
    loadMoreParallelAssets,
    loadMoreSingleTypeAssets,
    useParallelLoading,
  ]);

  // Handle refetch
  const handleRefetch = useCallback(() => {
    if (useParallelLoading) {
      refetchParallel();
    } else {
      refetchSingleType();
    }
  }, [refetchParallel, refetchSingleType, useParallelLoading]);

  return (
    <>
      <button
        className={`absolute top-4 right-4 text-white p-1 rounded-full border border-gray-700
          ${assetNavHighlighted && "shadow-lg shadow-green-500 animate-pulse"}
          shadow-lg transition-colors cursor-pointer z-30 ${
            assetNavExpanded ? "bg-sky-700" : "bg-gray-800 hover:bg-gray-700"
          }
          `}
        onClick={() => handleHammerClick()}
      >
        <Hammer size={24} />
      </button>
      <AnimatePresence mode="wait">
        {assetNavExpanded && (
          <motion.div
            initial={{
              x: "100%",
              opacity: 0,
              width: isFullScreen ? "100vw" : "md:min-w-[550px]",
            }}
            animate={{
              x: 0,
              opacity: 1,
              width: isFullScreen ? "100vw" : "auto",
              left: isFullScreen ? 0 : "auto",
            }}
            exit={{
              x: isFullScreen ? "-100%" : "100%",
              opacity: 0,
            }}
            key="asset-nav"
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: isFullScreen ? 0.2 : 0.3,
              width: { delay: isFullScreen ? 0 : 0.1 },
            }}
            className={`flex flex-col z-10 ${
              isFullScreen ? "w-screen" : "md:min-w-[550px]"
            } fixed max-h-screen
          ${
            isFullScreen ? "left-0" : "right-0"
          } border-l border-gray-800 bg-gray-950/95 text-gray-100`}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <h1 className="text-xl font-bold">Asset Manager</h1>
              <div className="flex items-center gap-2">
                {debouncedSearchQuery || activeCategory ? (
                  <div className="text-sm text-gray-400">
                    {totalDisplayedAssets} asset
                    {totalDisplayedAssets !== 1 ? "s" : ""} found
                  </div>
                ) : (
                  <div className="text-sm text-gray-400">
                    {totalApiFetchedAssets} asset
                    {totalApiFetchedAssets !== 1 ? "s" : ""} loaded
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="ml-2"
                >
                  {isFullScreen ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <AssetManCatSelector
              activeCategory={activeCategory}
              setActiveCategory={handleCategoryChange}
              isFullScreen={isFullScreen}
              setIsFullScreen={setIsFullScreen}
            />

            <div className="flex flex-1 overflow-hidden">
              <div className="w-full border-r border-gray-800 flex flex-col">
                <div className="p-3 border-b border-gray-800">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search loaded assets..."
                      className="w-full bg-gray-800 rounded-md px-3 py-2 pl-9 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      value={mainSearchQuery}
                      onChange={(e) => setMainSearchQuery(e.target.value)}
                    />
                    <Search
                      className="absolute left-3 top-2.5 text-gray-400"
                      size={16}
                    />
                    {mainSearchQuery && (
                      <button
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-200"
                        onClick={() => setMainSearchQuery("")}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {(isLoading || 
                  (useParallelLoading 
                    ? isParallelFetchingMore && assetGroups.length === 0
                    : isSingleTypeFetchingMore && assetGroups.length === 0)
                ) && (
                  <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                    <Loader className="h-8 w-8 animate-spin mb-2" />
                    <p>Loading assets...</p>
                  </div>
                )}

                {error && !isLoading && (
                  <div className="flex flex-col items-center justify-center h-40 text-red-400 p-4 text-center">
                    <p>
                      {error instanceof Error
                        ? error.message
                        : "Failed to load assets."}
                    </p>
                    <button
                      className="mt-4 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-md text-sm"
                      onClick={handleRefetch}
                    >
                      Retry
                    </button>
                  </div>
                )}

                {!isLoading && !error && assetGroups.length > 0 && (
                  <OptimizedAssetGroup
                    assetGroups={assetGroups}
                    setSelectedAssets={setSelectedAssets}
                    isFullScreen={isFullScreen}
                    onLoadMore={handleLoadMore}
                    hasMoreAssets={
                      useParallelLoading
                        ? hasParallelNextPage
                        : hasSingleTypeNextPage
                    }
                    isLoadingMore={
                      useParallelLoading
                        ? isParallelFetchingMore
                        : isSingleTypeFetchingMore
                    }
                  />
                )}

                {/* Message for "no assets" */}
                {!isLoading && !error && assetGroups.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-40 text-gray-400 p-4 text-center">
                    {debouncedSearchQuery || activeCategory ? (
                      <div className="text-center">
                        <p>No matching assets found.</p>
                        <button
                          className="mt-3 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-md text-sm"
                          onClick={() => {
                            setMainSearchQuery("");
                            handleCategoryChange(null);
                          }}
                        >
                          Clear filters
                        </button>
                      </div>
                    ) : (
                      <p>
                        No assets found for the selected category, or none exist.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OptimizedAssetListLayout;

