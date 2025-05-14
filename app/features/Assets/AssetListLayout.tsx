import { useState } from 'react';
import { Search,  X } from 'lucide-react';
import AssetGroupList from './AssetGroupList';

// Define TypeScript interfaces
interface Asset {
  id: string;
  name: string;
  thumbnail?: string;
  tags: string[];
  favorite: boolean;
}

export interface AssetGroup {
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
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  

  return (
    <div className="flex flex-col fixed max-h-screen right-0 bg-gray-950/50 text-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
        <h1 className="text-xl font-bold">Asset Manager</h1>
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
          <AssetGroupList 
            assetGroups={assetGroups}
            setAssetGroups={setAssetGroups}
            mainSearchQuery={mainSearchQuery}
            setSelectedAsset={setSelectedAsset}
            selectedAsset={selectedAsset}
          />

        </div>
      </div>
    </div>
  );
}

export default AssetListLayout