import { AlertCircle, ChevronDown, ChevronRight, Search } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { AssetGroup } from "./AssetListLayout";

type Props = {
  assetGroups: AssetGroup[];
  setAssetGroups: (groups: AssetGroup[]) => void;
  setSelectedAsset: (assetId: string | null) => void;
  mainSearchQuery: string;
  selectedAsset: string | null;
}

const AssetGroupList = ({ assetGroups, setAssetGroups, setSelectedAsset, mainSearchQuery, selectedAsset  }: Props) => {
  const [groupSearchQueries, setGroupSearchQueries] = useState<Record<string, string>>({});
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

  return <>
    <div className="flex flex-col overflow-y-auto flex-1">
      {filteredGroups.map(group => (
        <div key={group.id} className="border-b border-gray-800">
          {/* Group header */}
          <div
            className="flex items-center p-3 cursor-pointer hover:bg-gray-800"
            onClick={() => toggleGroup(group.id)}
          >
            {group.expanded ? (
              <ChevronDown size={18} className="text-gray-400 mr-2" />
            ) : (
              <ChevronRight size={18} className="text-gray-400 mr-2" />
            )}
            <span className="font-medium">{group.name}</span>
            <span className="ml-2 text-xs text-gray-500">({group.assets.length})</span>
          </div>

          {/* Expanded group content */}
          {group.expanded && (
            <div className="pl-7 pr-3 pb-3">
              {/* Group-specific search */}
              <div className="relative mb-2">
                <input
                  type="text"
                  placeholder={`Search in ${group.name}...`}
                  className="w-full bg-gray-800 rounded-md px-3 py-1.5 pl-7 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={groupSearchQueries[group.id] || ""}
                  onChange={(e) => handleGroupSearch(group.id, e.target.value)}
                />
                <Search className="absolute left-2 top-2 text-gray-400" size={14} />
              </div>

              {/* Assets in the group */}
              <div className={"grid grid-cols-3 gap-2"}>
                {group.assets.length > 0 ? (
                  group.assets.map(asset => (
                    <div
                      key={asset.id}
                      className={`
                              flex flex-col items-center
                              ${selectedAsset === asset.id ? 'bg-indigo-700' : 'bg-gray-800 hover:bg-gray-700'} 
                              rounded-md p-1 cursor-pointer transition-colors
                            `}
                      onClick={() => toggleAssetSelection(asset.id)}
                    >
                      {asset.thumbnail && <Image
                        src={asset.thumbnail}
                        alt={asset.name}
                        className={` w-12 h-12 rounded-sm object-cover`}
                      />}
                      <span className={`text-xs mt-1 text-center w-full truncate`}>
                        {asset.name}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center p-4 text-gray-500 text-sm">
                    <AlertCircle size={16} className="mr-2" />
                    No assets found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  </>
}

  export default AssetGroupList;