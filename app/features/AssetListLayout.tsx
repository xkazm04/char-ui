import { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronRight, X, Filter, Grid, List, AlertCircle } from 'lucide-react';

// Define TypeScript interfaces
interface Asset {
  id: string;
  name: string;
  thumbnail: string;
  tags: string[];
  favorite: boolean;
}

interface AssetGroup {
  id: string;
  name: string;
  assets: Asset[];
  expanded: boolean;
}

// Mock data generator
const generateMockData = (): AssetGroup[] => {
  const assetGroups: AssetGroup[] = [];
  
  const groupTypes = [
    "Hair", "Eyes", "Nose", "Mouth", "Ears", 
    "Facial Hair", "Eyebrows", "Clothes", "Accessories", "Hats",
    "Shoes", "Backgrounds", "Poses", "Weapons", "Jewelry",
    "Tattoos", "Makeup", "Scars", "Body Types", "Species"
  ];
  
  groupTypes.forEach((groupName, groupIndex) => {
    const assets: Asset[] = [];
    
    for (let i = 1; i <= 20; i++) {
      assets.push({
        id: `asset-${groupIndex}-${i}`,
        name: `${groupName} Style ${i}`,
        thumbnail: `/api/placeholder/60/60`,
        tags: [`tag${i % 5}`, `style${i % 3}`],
        favorite: i % 7 === 0
      });
    }
    
    assetGroups.push({
      id: `group-${groupIndex}`,
      name: groupName,
      assets: assets,
      expanded: groupIndex === 0 // First group expanded by default
    });
  });
  
  return assetGroups;
};

const AssetListLayout = () => {
  const [assetGroups, setAssetGroups] = useState<AssetGroup[]>(generateMockData());
  const [mainSearchQuery, setMainSearchQuery] = useState("");
  const [groupSearchQueries, setGroupSearchQueries] = useState<Record<string, string>>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  
  // Toggle group expansion
  const toggleGroup = (groupId: string) => {
    setAssetGroups(groups => 
      groups.map(group => 
        group.id === groupId 
          ? { ...group, expanded: !group.expanded } 
          : group
      )
    );
  };
  
  // Filter assets based on search queries
  const filteredGroups = assetGroups.filter(group => {
    // Filter group names by main search
    if (mainSearchQuery && !group.name.toLowerCase().includes(mainSearchQuery.toLowerCase())) {
      return false;
    }
    return true;
  }).map(group => {
    // Filter assets within each group by group-specific search
    const groupQuery = groupSearchQueries[group.id] || "";
    const filteredAssets = group.assets.filter(asset => 
      asset.name.toLowerCase().includes(groupQuery.toLowerCase()) ||
      asset.tags.some(tag => tag.toLowerCase().includes(groupQuery.toLowerCase()))
    );
    
    return {
      ...group,
      assets: filteredAssets
    };
  });
  
  // Handle group-specific search
  const handleGroupSearch = (groupId: string, query: string) => {
    setGroupSearchQueries(prev => ({
      ...prev,
      [groupId]: query
    }));
  };
  
  // Toggle asset selection
  const toggleAssetSelection = (assetId: string) => {
    setSelectedAsset(prev => prev === assetId ? null : assetId);
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
        <h1 className="text-xl font-bold">Asset Manager</h1>
        <div className="flex space-x-3">
          <button 
            className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-indigo-700' : 'bg-gray-800'}`}
            onClick={() => setViewMode('grid')}
          >
            <Grid size={18} />
          </button>
          <button 
            className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-indigo-700' : 'bg-gray-800'}`}
            onClick={() => setViewMode('list')}
          >
            <List size={18} />
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-800 flex flex-col">
          {/* Main search */}
          <div className="p-3 border-b border-gray-800">
            <div className="relative">
              <input
                type="text"
                placeholder="Search all assets..."
                className="w-full bg-gray-800 rounded-md px-3 py-2 pl-9 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
        

        </div>
        
        {/* Preview/main work area (placeholder) */}
        <div className="flex-1 flex items-center justify-center bg-gray-900">
          {selectedAsset ? (
            <div className="flex flex-col items-center">
              <img 
                src="/api/placeholder/400/400" 
                alt="Selected asset preview"
                className="rounded-lg shadow-lg border border-gray-700"
              />
              <p className="mt-4 text-lg">
                {assetGroups.flatMap(g => g.assets).find(a => a.id === selectedAsset)?.name}
              </p>
              <p className="text-sm text-gray-400 mt-1">Click an asset in the sidebar to preview it</p>
            </div>
          ) : (
            <div className="text-center p-10">
              <img 
                src="/api/placeholder/200/200" 
                alt="Asset manager"
                className="rounded-full mx-auto mb-6 opacity-30"
              />
              <h2 className="text-2xl font-bold text-gray-400">Asset Manager</h2>
              <p className="text-gray-500 max-w-md mx-auto mt-2">
                Select an asset from the sidebar to preview and use it in your character creation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AssetListLayout