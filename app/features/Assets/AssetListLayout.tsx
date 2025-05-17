import { useState } from 'react';
import { Hammer, Search, X, Loader, User, Shield, Shirt, Image } from 'lucide-react';
import AssetGroupList from './AssetGroupList';
import { useNavStore } from '@/app/store/navStore';
import { AnimatePresence, motion } from 'framer-motion';
import { useAssetGroups } from '@/app/functions/assetFns';

const MAIN_CATEGORIES = [
  { id: "Body", icon: User, color: "border-blue-500/50" },
  { id: "Equipment", icon: Shield, color: "border-red-500/50" },
  { id: "Clothing", icon: Shirt, color: "border-green-500/50" },
  { id: "Background", icon: Image, color: "border-purple-500/50" }
];

const AssetListLayout = () => {
  const [mainSearchQuery, setMainSearchQuery] = useState("");
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { assetNavExpanded, setAssetNavExpanded, assetNavHighlighted, setAssetNavHighlighted } = useNavStore();

  const handleHammerClick = () => {
    setAssetNavExpanded(!assetNavExpanded);
    setAssetNavHighlighted(false);
  }
  
  const { 
    data: assetGroups = [], 
    isLoading, 
    error, 
    refetch 
  } = useAssetGroups(assetNavExpanded);

  const filteredAssetGroups = assetGroups.map(group => {
    const filteredAssets = group.assets.filter(asset => {
      const matchesSearch = !mainSearchQuery || 
        asset.name.toLowerCase().includes(mainSearchQuery.toLowerCase()) ||
        asset.tags.some(tag => tag.toLowerCase().includes(mainSearchQuery.toLowerCase())) ||
        (asset.description && asset.description.toLowerCase().includes(mainSearchQuery.toLowerCase()));
      
      const matchesCategory = !activeCategory || 
        (asset.type && asset.type === activeCategory);
      
      return matchesSearch && matchesCategory;
    });

    return {
      ...group,
      assets: filteredAssets,
      hasMatchingAssets: filteredAssets.length > 0
    };
  }).filter(group => group.hasMatchingAssets);

  const totalFilteredAssets = filteredAssetGroups.reduce(
    (sum, group) => sum + group.assets.length, 
    0
  );

  const toggleAssetSelection = (assetId: string) => {
    console.log("Toggling asset:", assetId);
    setSelectedAssets(prev => {
      const newSet = new Set(prev);
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

  return (<>
    <button
      className={`absolute top-4 right-4 text-white p-1 rounded-full border border-gray-700
          ${assetNavHighlighted && 'shadow-lg shadow-green-500 animate-pulse'}
          shadow-lg transition-colors cursor-pointer z-20 ${assetNavExpanded ? 'bg-sky-700' : 'bg-gray-800 hover:bg-gray-700'}
          `}
      onClick={() => handleHammerClick()}
    >
      <Hammer size={24} />
    </button>
    <AnimatePresence mode="wait">
      {assetNavExpanded &&
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          key="asset-nav"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="flex flex-col z-10 md:min-w-[550px] fixed max-h-screen
          right-0 border-l border-gray-800 bg-gray-900 text-gray-100">
          {/* Header */}
          <div className="p-4 border-b border-gray-800 flex justify-between items-center">
            <h1 className="text-xl font-bold">Asset Manager</h1>
            {mainSearchQuery || activeCategory ? (
              <div className="text-sm text-gray-400">
                {totalFilteredAssets} asset{totalFilteredAssets !== 1 ? 's' : ''} found
              </div>
            ) : null}
          </div>

          {/* Category Selector with Icon Buttons */}
          <div className="flex justify-center py-2 px-3 border-b border-gray-800 gap-3">
            <button
              onClick={() => setActiveCategory(null)}
              className={`p-2 rounded-md text-xs flex flex-col items-center
                border-2 ${activeCategory === null ? 'bg-gray-700 border-white' : 'bg-gray-800 border-gray-700 hover:bg-gray-700'}
                transition-all`}
              title="All Categories"
            >
              <span className="text-[10px] font-medium">ALL</span>
            </button>
            
            {MAIN_CATEGORIES.map(category => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`p-2 rounded-md text-xs flex flex-row items-center gap-1
                    border-1 ${activeCategory === category.id 
                      ? `bg-gray-700 ${category.color}` 
                      : `bg-gray-800 border-gray-700 hover:bg-gray-700 hover:${category.color}`}
                    transition-all`}
                  title={category.id}
                >
                  <Icon size={16} />
                  <span className="text-[10px] hidden 2xl:block font-medium">{category.id.toUpperCase()}</span>
                </button>
              );
            })}
          </div>

          {/* Main content */}
          <div className="flex flex-1 overflow-hidden">
            <div className="w-full border-r border-gray-800 flex flex-col">
              <div className="p-3 border-b border-gray-800">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search all assets..."
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
              
              {/* Show loading indicator while fetching */}
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                  <Loader className="h-8 w-8 animate-spin mb-2" />
                  <p>Loading assets...</p>
                </div>
              )}
              
              {/* Show error message if there was an error */}
              {error && (
                <div className="flex flex-col items-center justify-center h-40 text-red-400 p-4 text-center">
                  <p>{error instanceof Error ? error.message : 'Failed to load assets. Please try again later.'}</p>
                  <button 
                    className="mt-4 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-md text-sm"
                    onClick={() => refetch()}
                  >
                    Retry
                  </button>
                </div>
              )}
              
              {/* Show asset groups if data is loaded */}
              {!isLoading && !error && filteredAssetGroups.length > 0 && (
                <AssetGroupList
                  assetGroups={filteredAssetGroups}
                  mainSearchQuery=""
                  toggleAssetSelection={toggleAssetSelection}
                  selectedAssets={selectedAssets}
                />
              )}
              
              {/* Show message if no assets were found */}
              {!isLoading && !error && filteredAssetGroups.length === 0 && (
                <div className="flex flex-col items-center justify-center h-40 text-gray-400 p-4 text-center">
                  {mainSearchQuery || activeCategory ? (
                    <div className="text-center">
                      <p>No matching assets found.</p>
                      <button
                        className="mt-3 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-md text-sm"
                        onClick={() => {
                          setMainSearchQuery("");
                          setActiveCategory(null);
                        }}
                      >
                        Clear filters
                      </button>
                    </div>
                  ) : (
                    <p>No assets found. Try creating some first.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>}
    </AnimatePresence>
  </>
  );
}

export default AssetListLayout;