import { useState, useEffect } from 'react';
import { Hammer, Search, X, Loader } from 'lucide-react';
import AssetGroupList from './AssetGroupList';
import { useNavStore } from '@/app/store/navStore';
import { AnimatePresence, motion } from 'framer-motion';

// Define TypeScript interfaces
interface Asset {
  _id: string;
  name: string;
  type: string; // Add type field to match backend model
  description?: string;
  image_url?: string;
  thumbnail?: string;
  tags: string[];
  favorite: boolean;
  metadata?: {
    tags?: string[];
    compatible_with?: string[];
  };
}

export interface AssetGroup {
  id: string;
  name: string;
  assets: Asset[];
  expanded: boolean;
}

const AssetListLayout = () => {
  const [assetGroups, setAssetGroups] = useState<AssetGroup[]>([]);
  const [mainSearchQuery, setMainSearchQuery] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { assetNavExpanded, setAssetNavExpanded } = useNavStore();

  // Fetch assets from backend and organize them by type
  useEffect(() => {
    const fetchAssets = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('http://localhost:8000/assets/');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const assets: Asset[] = await response.json();
        
        // Group assets by their type
        const assetsByType = assets.reduce<Record<string, Asset[]>>((acc, asset) => {
          if (!asset.type) return acc;
          
          if (!acc[asset.type]) {
            acc[asset.type] = [];
          }
          
          // Ensure tags array exists
          const tags = asset.metadata?.tags || [];
          
          // Add processed asset to its type group
          acc[asset.type].push({
            ...asset,
            tags: tags,
            favorite: tags.includes('favorite') || false
          });
          
          return acc;
        }, {});
        
        // Convert grouped assets into AssetGroup array
        const groups: AssetGroup[] = Object.entries(assetsByType).map(([type, typeAssets], index) => ({
          id: `group-${type}`,
          name: type.charAt(0).toUpperCase() + type.slice(1), // Capitalize first letter
          assets: typeAssets,
          expanded: index === 0 // First group expanded by default
        }));
        
        setAssetGroups(groups);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching assets:', error);
        setError('Failed to load assets. Please try again later.');
        setIsLoading(false);
      }
    };

    if (assetNavExpanded) {
      fetchAssets();
    }
  }, [assetNavExpanded]);

  return (<>
    <button
      className={`absolute top-4 right-4 text-white p-1 rounded-full border border-gray-700
          shadow-lg transition-colors cursor-pointer z-20 ${assetNavExpanded ? 'bg-sky-700' : 'bg-gray-800 hover:bg-gray-700'}
          `}
      onClick={() => setAssetNavExpanded(!assetNavExpanded)}
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
          className="flex flex-col z-10 xl:min-w-[500px] fixed max-h-screen right-0 border-l border-gray-800 bg-gray-900 text-gray-100">
          {/* Header */}
          <div className="p-4 border-b border-gray-800 flex justify-between items-center">
            <h1 className="text-xl font-bold">Asset Manager</h1>
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
                  <p>{error}</p>
                  <button 
                    className="mt-4 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-md text-sm"
                    onClick={() => setAssetNavExpanded(true)} // Trigger a re-fetch by toggling
                  >
                    Retry
                  </button>
                </div>
              )}
              
              {/* Show asset groups if data is loaded */}
              {!isLoading && !error && assetGroups.length > 0 && (
                <AssetGroupList
                  assetGroups={assetGroups}
                  setAssetGroups={setAssetGroups}
                  mainSearchQuery={mainSearchQuery}
                  setSelectedAsset={setSelectedAsset}
                  selectedAsset={selectedAsset}
                />
              )}
              
              {/* Show message if no assets were found */}
              {!isLoading && !error && assetGroups.length === 0 && (
                <div className="flex flex-col items-center justify-center h-40 text-gray-400 p-4 text-center">
                  <p>No assets found. Try creating some first.</p>
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