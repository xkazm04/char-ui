import { AlertCircle, ChevronRight, Search } from "lucide-react";
import { useState } from "react";
import { AssetGroup } from "./AssetListLayout";
import AssetGroupItem from "./AssetGroupItem";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  assetGroups: AssetGroup[];
  setAssetGroups: (groups: AssetGroup[]) => void;
  setSelectedAsset: (assetId: string | null) => void;
  mainSearchQuery: string;
  selectedAsset: string | null;
}

const AssetGroupList = ({ assetGroups, setAssetGroups, setSelectedAsset, mainSearchQuery, selectedAsset }: Props) => {
  const [groupSearchQueries, setGroupSearchQueries] = useState<Record<string, string>>({});

  const toggleGroup = (groupId: string) => {
    setAssetGroups(groups =>
      groups.map(group =>
        group.id === groupId
          ? { ...group, expanded: !group.expanded }
          : group
      )
    );
  };

  const filteredGroups = assetGroups.filter(group => {
    if (mainSearchQuery && !group.name.toLowerCase().includes(mainSearchQuery.toLowerCase())) {
      return false;
    }
    return true;
  }).map(group => {
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

  const handleGroupSearch = (groupId: string, query: string) => {
    setGroupSearchQueries(prev => ({
      ...prev,
      [groupId]: query
    }));
  };

  const toggleAssetSelection = (assetId: string) => {
    setSelectedAsset(prev => prev === assetId ? null : assetId);
  };

  return (
    <div className="flex flex-col overflow-y-auto flex-1">
      {filteredGroups.map(group => (
        <div key={group.id} className="border-b border-gray-800">
          {/* Header */}
          <div
            className="flex items-center p-3 cursor-pointer hover:brightness-125"
            onClick={() => toggleGroup(group.id)}
          >
            <motion.div
              initial={false}
              animate={{ rotate: group.expanded ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronRight size={18} className="text-gray-400 mr-2" />
            </motion.div>
            <span className="font-medium">{group.name}</span>
            <span className="ml-2 text-xs text-gray-500">({group.assets.length})</span>
          </div>

          {/* Expanded group content with animation */}
          <AnimatePresence>
            {group.expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pl-7 pr-3 pb-3">
                  {/* Group-specific search */}
                  <div className="relative mb-2">
                    <input
                      type="text"
                      placeholder={`Search in ${group.name}...`}
                      className="w-full bg-gray-800 rounded-md px-3 py-1.5 pl-7 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
                      value={groupSearchQueries[group.id] || ""}
                      onChange={(e) => handleGroupSearch(group.id, e.target.value)}
                    />
                    <Search className="absolute left-2 top-2 text-gray-400" size={14} />
                  </div>

                  {/* Assets in the group */}
                  <div className="grid grid-cols-3 gap-2">
                    {group.assets.length > 0 ? (
                      group.assets.map(asset => (
                        <AssetGroupItem 
                          asset={asset}
                          key={asset.id || asset._id}
                          selectedAsset={selectedAsset}
                          toggleAssetSelection={toggleAssetSelection}
                        />
                      ))
                    ) : (
                      <div className="flex items-center justify-center p-4 text-gray-500 text-sm">
                        <AlertCircle size={16} className="mr-2" />
                        No assets found
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export default AssetGroupList;