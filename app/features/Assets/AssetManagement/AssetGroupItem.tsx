import React, { useMemo, useState, useRef, useEffect } from 'react';
import AssetItemModal from "./AssetItemModal";
import { AssetType as AssetTypeObj } from "@/app/types/asset";
import { useAssetStore } from "@/app/store/assetStore";
import { motion } from "framer-motion";
import AssetGroupItemImage from "./AssetGroupItemImage";
import { getBorderColor, getTypeIndicatorClass } from "@/app/helpers/assetHelpers";

type Props = {
  asset: AssetTypeObj; 
  toggleAssetSelection: (assetId: string) => void;
  isFullScreen?: boolean;
  onOptimisticDelete?: (assetId: string) => void; 
}

const AssetGroupItem = React.memo(({ 
  asset, 
  toggleAssetSelection, 
  isFullScreen = false,
  onOptimisticDelete 
}: Props) => {
  const assetId = asset._id
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  
  const { 
    Body, 
    Equipment, 
    Clothing, 
    Background, 
    addAsset, 
    removeAsset 
  } = useAssetStore();
  
  const isInStore = useMemo(() => {
    return [
      ...Body, 
      ...Equipment, 
      ...Clothing, 
      ...Background
    ].some(item => item._id === assetId);
  }, [Body, Equipment, Clothing, Background, assetId]);
  
  const handleAssetSelection = () => {
    if (isInStore) {
      if (!assetId) return
      if (Body.some(item => (item._id === assetId))) {
        removeAsset(assetId, 'Body');
      } else if (Equipment.some(item => (item._id === assetId))) {
        removeAsset(assetId, 'Equipment');
      } else if (Clothing.some(item => (item._id === assetId))) {
        removeAsset(assetId, 'Clothing');
      } else if (Background.some(item => (item._id === assetId))) {
        removeAsset(assetId, 'Background');
      }
    } else {
      let assetType = asset.type;
   
      if (!assetType || !['Body', 'Equipment', 'Clothing', 'Background'].includes(assetType)) {
        assetType = 'Equipment'; 
        console.warn(`Asset type "${asset.type}" not recognized, defaulting to Equipment`);
      }

      addAsset({
        _id: assetId,
        name: asset.name,
        description: asset.description || '',
        type: assetType,
        subcategory: asset.subcategory || '',
        gen: asset.gen || '',
        image_url: asset.image_url || ''
      });
    }

    if (!assetId) return;
    toggleAssetSelection(assetId);
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowModal(false);
      }
    };
    
    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModal]);
  
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  return (
    <>
      {isFullScreen ? (
        <motion.div
          key={assetId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          title={asset.name + ' - right click for the details'}
          className={`
            relative overflow-hidden group border hover:brightness-110
            ${getBorderColor(asset)}
            ${isInStore ? 'bg-gray-800/70' : 'bg-gray-900/70'} 
            rounded-md cursor-help transition-all duration-300 ease-linear
            ${isInStore ? 'ring-1 ring-sky-500/80 shadow-sm shadow-sky-500/20' : ''}
            h-32 w-full transform hover:scale-[1.02] hover:shadow-lg hover:shadow-black/30
            transition-all duration-300 
          `}
          onClick={handleAssetSelection}
          onContextMenu={handleContextMenu}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Background Image */}
          <AssetGroupItemImage
            assetId={assetId || ''}
            asset={asset}
          />
        
          {/* Text content at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
            <div className="text-xs font-medium truncate leading-tight">
              {asset.name}
            </div>
            {asset.subcategory && (
              <div className="text-[10px] text-gray-300 truncate">
                {asset.subcategory}
              </div>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          key={assetId}
          className={`
            flex flex-col items-center border hover:brightness-110
            ${getBorderColor(asset)}
            ${isInStore ? 'bg-gray-800/70' : 'bg-gray-900/70'} 
            rounded-md cursor-help transition-all duration-300 ease-linear p-1
            ${isInStore ? 'ring-1 ring-sky-500/80 border-sky-500/20' : ''}
          `}
          onClick={handleAssetSelection}
          onContextMenu={handleContextMenu}
        >
          <div className="w-full text-left relative">
            <div className={`absolute right-1 top-1/2 -translate-y-1/2 ${getTypeIndicatorClass(asset.type)} rounded-full w-1.5 h-1.5`} />
            
            <span className="text-xs pl-1 pr-3 truncate block font-medium">
              {asset.name}
            </span>
            {asset.subcategory && (
              <span className="text-[10px] text-gray-400 pl-1 pr-3 truncate block">
                {asset.subcategory}
              </span>
            )}
          </div>
        </motion.div>
      )}
      
      {/* Asset Detail Modal */}
      {showModal && (
        <AssetItemModal
          asset={asset}
          modalRef={modalRef}
          setShowModal={setShowModal}
          onOptimisticDelete={onOptimisticDelete}
        />
      )}
    </>
  );
});

AssetGroupItem.displayName = 'AssetGroupItem'; 

export default AssetGroupItem;