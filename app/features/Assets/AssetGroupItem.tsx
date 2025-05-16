import { useState, useEffect, useRef } from "react";
import AssetItemModal from "./AssetItemModal";
import { AssetType as AssetTypeObj } from "@/app/types/asset";
import { useAssetStore } from "@/app/store/assetStore";
import { assetColor } from "../Builder/BuilderAssetGroup";

type Props = {
  asset: AssetTypeObj;
}

const AssetGroupItem = ({ asset }: Props) => {
  const assetId = asset.id || asset._id;
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const { clothing, equipment, accessories, addAsset, removeAsset } = useAssetStore();
  
  const isSelected = 
    clothing.some(item => item.id === assetId) || 
    equipment.some(item => item.id === assetId) || 
    accessories.some(item => item.id === assetId);
  
  const determineAssetType = (): string => {
    const type = asset.type.toLowerCase();
    if (type.includes('cloth') || type.includes('outfit')) return 'clothing';
    if (type.includes('equip') || type.includes('weapon') || type.includes('tool')) return 'equipment';
    return 'accessories';
  };
  
  const toggleAssetSelection = () => {
    const assetType = determineAssetType();
    
    // If asset is already selected, remove it
    if (isSelected) {
      // Need to check which collection contains the asset
      if (clothing.some(item => item.id === assetId)) {
        removeAsset(assetId, 'clothing');
      } else if (equipment.some(item => item.id === assetId)) {
        removeAsset(assetId, 'equipment');
      } else if (accessories.some(item => item.id === assetId)) {
        removeAsset(assetId, 'accessories');
      }
    } else {
      // Add asset to the appropriate collection
      addAsset({
        id: assetId,
        name: asset.name,
        description: asset.description || '',
        type: assetType,
        imageUrl: asset.image_url || asset.thumbnail
      });
    }
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
      <div
        key={assetId}
        className={`
          flex flex-col items-center
          ${assetColor(determineAssetType())}
          ${!isSelected && 'opacity-50'} 
          rounded-md p-1 cursor-pointer transition-all duration-300 ease-linear
        `}
        onClick={toggleAssetSelection}
        onContextMenu={handleContextMenu}
      >
        <span className="text-xs px-1 text-center w-full truncate">
          {asset.name}
        </span>
      </div>
      
      {/* Asset Detail Modal */}
      {showModal && (
        <AssetItemModal
            asset={asset}
            modalRef={modalRef}
            setShowModal={setShowModal}
            />
      )}
    </>
  );
}

export default AssetGroupItem;