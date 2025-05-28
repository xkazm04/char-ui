import { useState, useEffect, useMemo, useCallback } from 'react';
import { Hammer, Sparkles } from 'lucide-react';
import { useNavStore } from '@/app/store/navStore';
import { AnimatePresence, motion } from 'framer-motion';
import {  useAssetGroups, usePrefetchAssets, } from '@/app/functions/assetFns';
import AssetManCatSelector from './AssetManCatSelector';
import AssetSearch from './AssetSearch';
import { processSearchResultsIntoGroups, useSemanticAssetSearch } from '@/app/functions/assetSearchFns';
import AssetGroupFullScreen from './AssetGroupFullScreen';
import AssetGroupSidebar from './AssetGroupSidebar';

const AssetListLayout = () => {
  const [mainSearchQuery, setMainSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [searchMode, setSearchMode] = useState<'text' | 'semantic'>('text');
  const { assetNavExpanded, setAssetNavExpanded, assetNavHighlighted, setAssetNavHighlighted } = useNavStore();
  
  const { prefetchNextPage } = usePrefetchAssets(activeCategory);

  const { 
    searchAssets, 
    results: semanticResults, 
    isLoading: isSemanticLoading, 
    error: semanticError,
    clearResults: clearSemanticResults 
  } = useSemanticAssetSearch();

  const handleHammerClick = useCallback(() => {
    setAssetNavExpanded(!assetNavExpanded);
    setAssetNavHighlighted(false);
  }, [assetNavExpanded, setAssetNavExpanded, setAssetNavHighlighted]);
  
  const { 
    data: assetGroups = [], 
    allFetchedAssets = [],
    isLoading, 
    error, 
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage 
  } = useAssetGroups(activeCategory, assetNavExpanded);

  useEffect(() => {
    if (searchMode === 'text' && hasNextPage && !isFetchingNextPage && assetNavExpanded) {
      const timer = setTimeout(() => {
        fetchNextPage();
        const currentPage = Math.ceil(allFetchedAssets.length / 50);
        prefetchNextPage(currentPage + 1);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [searchMode, hasNextPage, isFetchingNextPage, fetchNextPage, assetNavExpanded, allFetchedAssets.length, prefetchNextPage]);

  // Process results based on search mode
  const displayAssetGroups = useMemo(() => {
    if (searchMode === 'semantic') {
      return processSearchResultsIntoGroups(semanticResults);
    }
    if (!mainSearchQuery) return assetGroups;
    
    return assetGroups.map(group => {
      const filteredAssets = group.assets.filter(asset => {
        const searchLower = mainSearchQuery.toLowerCase();
        return (
          (asset.name && asset.name.toLowerCase().includes(searchLower)) ||
          (asset.description && asset.description.toLowerCase().includes(searchLower)) ||
          (asset.subcategory && asset.subcategory.toLowerCase().includes(searchLower))
        );
      });

      // Update subcategories to only include filtered assets
      const filteredSubcategories = group.subcategories ? 
        Object.entries(group.subcategories).reduce((acc, [subcategory, assets]) => {
          const filteredSubAssets = assets.filter(asset => {
            const searchLower = mainSearchQuery.toLowerCase();
            return (
              (asset.name && asset.name.toLowerCase().includes(searchLower)) ||
              (asset.description && asset.description.toLowerCase().includes(searchLower)) ||
              (asset.subcategory && asset.subcategory.toLowerCase().includes(searchLower))
            );
          });
          
          if (filteredSubAssets.length > 0) {
            acc[subcategory] = filteredSubAssets;
          }
          return acc;
        }, {} as Record<string, typeof group.assets>) : undefined;

      return {
        ...group,
        assets: filteredAssets,
        subcategories: filteredSubcategories,
        hasMatchingAssets: filteredAssets.length > 0
      };
    }).filter(group => group.hasMatchingAssets);
  }, [assetGroups, semanticResults, mainSearchQuery, searchMode]);

  const totalDisplayedAssets = useMemo(() => 
    displayAssetGroups.reduce((sum, group) => sum + group.assets.length, 0),
    [displayAssetGroups]
  );

  const handleClearFilters = useCallback(() => {
    setMainSearchQuery("");
    setActiveCategory(null);
    clearSemanticResults();
  }, [clearSemanticResults]);

  const currentlyLoading = searchMode === 'semantic' ? isSemanticLoading : isLoading;
  const currentError = searchMode === 'semantic' ? semanticError : error;

  return (
    <>
      <button
        className={`absolute top-4 right-4 text-white p-1 rounded-full border border-gray-700
            ${assetNavHighlighted && 'shadow-lg shadow-green-500 animate-pulse'}
            shadow-lg transition-colors cursor-pointer z-30 ${assetNavExpanded ? 'bg-sky-700' : 'bg-gray-800 hover:bg-gray-700'}
            `}
        onClick={handleHammerClick}
      >
        <Hammer size={24} />
      </button>
      <AnimatePresence mode="wait">
        {assetNavExpanded && (
          <motion.div
            initial={{ 
              x: '100%', 
              opacity: 0,
              width: isFullScreen ? '100vw' : 'md:min-w-[550px]'
            }}
            animate={{ 
              x: 0, 
              opacity: 1,
              width: isFullScreen ? '100vw' : 'auto',
              left: isFullScreen ? 0 : 'auto'
            }}
            exit={{ 
              x: isFullScreen ? '-100%' : '100%', 
              opacity: 0 
            }}
            key="asset-nav"
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 30,
              duration: isFullScreen ? 0.2 : 0.3,
              width: { delay: isFullScreen ? 0 : 0.1 }
            }}
            className={`flex flex-col z-10 ${isFullScreen ? 'w-screen' : 'md:min-w-[550px]'} fixed max-h-screen
            ${isFullScreen ? 'left-0' : 'right-0'} border-l border-gray-800 bg-gray-950/95 text-gray-100`}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-800 flex justify-between pr-20 items-center">
              {isFullScreen && <div/>}
              <h1 className="text-xl font-bold">Asset Manager</h1>
              <div className="flex items-center gap-3">
                {searchMode === 'semantic' && (
                  <span className="text-xs text-purple-400 flex items-center gap-1">
                    <Sparkles size={12} />
                    AI Search
                  </span>
                )}
                <div className="text-sm text-gray-400 flex flex-row gap-1">
                   {hasNextPage && <div className='h-2 w-2 rounded-2xl bg-emerald-400 animate-pulse'/>}
                  {totalDisplayedAssets} asset{totalDisplayedAssets !== 1 ? 's' : ''} 
                  {searchMode === 'semantic' ? ' found' : ' loaded'}
                </div>
              </div>
            </div>

            <AssetManCatSelector
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              isFullScreen={isFullScreen}
              setIsFullScreen={setIsFullScreen}
            />

            <div className="flex flex-1 overflow-hidden">
              <div className="w-full border-r border-gray-800 flex flex-col">
                <AssetSearch
                  mainSearchQuery={mainSearchQuery}
                  setMainSearchQuery={setMainSearchQuery}
                  searchMode={searchMode}
                  setSearchMode={setSearchMode}
                  currentlyLoading={currentlyLoading}
                  currentError={currentError}
                  refetch={refetch}
                  searchAssets={searchAssets}
                  clearSemanticResults={clearSemanticResults}
                  activeCategory={activeCategory}
                  />
                
                {!currentlyLoading && !currentError && displayAssetGroups.length > 0 && (
                  <>
                    {isFullScreen ? 
                      <AssetGroupFullScreen assetGroups={displayAssetGroups} /> : 
                      <AssetGroupSidebar assetGroups={displayAssetGroups} />}
                  </>
                )}
                
                {!currentlyLoading && !currentError && (
                  <>
                    {searchMode === 'text' && isFetchingNextPage && assetGroups.length > 0 && (
                      <div className="p-4 text-center text-sm text-gray-400">Fetching more assets...</div>
                    )}
                    {displayAssetGroups.length === 0 && !isFetchingNextPage && (
                      <div className="flex flex-col items-center justify-center h-40 text-gray-400 p-4 text-center">
                        {mainSearchQuery || activeCategory ? (
                          <div className="text-center">
                            <p>No matching assets found.</p>
                            {searchMode === 'semantic' && (
                              <p className="mt-1 text-xs">Try different keywords or lower the similarity threshold</p>
                            )}
                            <button
                              className="mt-3 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-md text-sm"
                              onClick={handleClearFilters}
                            >
                              Clear filters
                            </button>
                          </div>
                        ) : (
                          <p>No assets found for the selected category, or none exist.</p>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AssetListLayout;