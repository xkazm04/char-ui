import { useState, useEffect } from 'react'; // Added useEffect
import { Hammer, Search, X, Loader } from 'lucide-react';
import AssetGroupList from './AssetGroup';
import { useNavStore } from '@/app/store/navStore';
import { AnimatePresence, motion } from 'framer-motion';
import { useAssetGroups } from '@/app/functions/assetFns';
import AssetManCatSelector from './AssetManCatSelector';

const AssetListLayout = () => {
  const [mainSearchQuery, setMainSearchQuery] = useState("");
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { assetNavExpanded, setAssetNavExpanded, assetNavHighlighted, setAssetNavHighlighted } = useNavStore();

  const handleHammerClick = () => {
    setAssetNavExpanded(!assetNavExpanded);
    setAssetNavHighlighted(false);
  }
  
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
    if (hasNextPage && !isFetchingNextPage && assetNavExpanded) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, assetNavExpanded]);


  const filteredAssetGroups = assetGroups.map(group => {
    const filteredAssets = group.assets.filter(asset => {
      const matchesSearch = !mainSearchQuery || 
        (asset.name && asset.name.toLowerCase().includes(mainSearchQuery.toLowerCase())) ||
        (asset.description && asset.description.toLowerCase().includes(mainSearchQuery.toLowerCase())) ||
        (asset.subcategory && asset.subcategory.toLowerCase().includes(mainSearchQuery.toLowerCase()));
      
      // Category filtering is now primarily handled by the API via `activeCategory` passed to `useAssetGroups`
      // const matchesCategory = !activeCategory || (asset.type && asset.type === activeCategory);
      
      return matchesSearch; // && matchesCategory;
    });

    return {
      ...group,
      assets: filteredAssets,
      hasMatchingAssets: filteredAssets.length > 0
    };
  }).filter(group => group.hasMatchingAssets);

  const totalDisplayedAssets = filteredAssetGroups.reduce(
    (sum, group) => sum + group.assets.length, 
    0
  );

  const totalApiFetchedAssets = allFetchedAssets.length;


  return (<>
    <button
      className={`absolute top-4 right-4 text-white p-1 rounded-full border border-gray-700
          ${assetNavHighlighted && 'shadow-lg shadow-green-500 animate-pulse'}
          shadow-lg transition-colors cursor-pointer z-30 ${assetNavExpanded ? 'bg-sky-700' : 'bg-gray-800 hover:bg-gray-700'}
          `}
      onClick={() => handleHammerClick()}
    >
      <Hammer size={24} />
    </button>
    <AnimatePresence mode="wait">
      {assetNavExpanded &&
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
          ${isFullScreen ? 'left-0' : 'right-0'} border-l border-gray-800 bg-gray-950/95 text-gray-100`}>
          {/* Header */}
          <div className="p-4 border-b border-gray-800 flex justify-between items-center">
            <h1 className="text-xl font-bold">Asset Manager</h1>
            {mainSearchQuery || activeCategory ? (
              <div className="text-sm text-gray-400">
                {totalDisplayedAssets} asset{totalDisplayedAssets !== 1 ? 's' : ''} found
              </div>
            ) : (
              <div className="text-sm text-gray-400">
                {totalApiFetchedAssets} asset{totalApiFetchedAssets !== 1 ? 's' : ''} loaded
              </div>
            )}
          </div>

          <AssetManCatSelector
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory} // This will trigger a refetch in useAssetGroups
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
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
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
              
              {(isLoading || (isFetchingNextPage && assetGroups.length === 0)) && ( // Show loader if initial or fetching first page
                <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                  <Loader className="h-8 w-8 animate-spin mb-2" />
                  <p>Loading assets...</p>
                </div>
              )}
              
              {error && !isLoading && (
                <div className="flex flex-col items-center justify-center h-40 text-red-400 p-4 text-center">
                  <p>{error instanceof Error ? error.message : 'Failed to load assets.'}</p>
                  <button 
                    className="mt-4 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-md text-sm"
                    onClick={() => refetch()}
                  >
                    Retry
                  </button>
                </div>
              )}
              
              {!isLoading && !error && filteredAssetGroups.length > 0 && (
                <AssetGroupList
                  assetGroups={filteredAssetGroups}
                  setSelectedAssets={setSelectedAssets}
                  isFullScreen={isFullScreen}
                />
              )}
              
              {/* Message for "fetching more" or "no assets" */}
              {!isLoading && !error && (
                <>
                  {isFetchingNextPage && assetGroups.length > 0 && (
                     <div className="p-4 text-center text-sm text-gray-400">Fetching more assets...</div>
                  )}
                  {filteredAssetGroups.length === 0 && !isFetchingNextPage && (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-400 p-4 text-center">
                      {mainSearchQuery || activeCategory ? (
                        <div className="text-center">
                          <p>No matching assets found.</p>
                          <button
                            className="mt-3 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-md text-sm"
                            onClick={() => {
                              setMainSearchQuery("");
                              setActiveCategory(null); // This will refetch with no type filter
                            }}
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
        </motion.div>}
    </AnimatePresence>
  </>
  );
}

export default AssetListLayout;