import { useState, useEffect, useRef } from "react";
import AssetItemModal from "./AssetItemModal";
import { AssetType as AssetTypeObj } from "@/app/types/asset";
import { useAssetStore } from "@/app/store/assetStore";
import Image from "next/image";

type Props = {
  asset: AssetTypeObj;
  isSelected: boolean;  
  toggleAssetSelection: (assetId: string) => void;
}

const AssetGroupItem = ({ asset, isSelected, toggleAssetSelection }: Props) => {
  const assetId = asset.id || asset._id;
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const { Body, Equipment, Clothing, Background, addAsset, removeAsset } = useAssetStore();
  
  const isInStore = [
    ...Body, 
    ...Equipment, 
    ...Clothing, 
    ...Background
  ].some(item => item.id === assetId);
  
  const handleAssetSelection = () => {
    if (isInStore) {
      if (Body.some(item => item.id === assetId)) {
        removeAsset(assetId, 'Body');
      } else if (Equipment.some(item => item.id === assetId)) {
        removeAsset(assetId, 'Equipment');
      } else if (Clothing.some(item => item.id === assetId)) {
        removeAsset(assetId, 'Clothing');
      } else if (Background.some(item => item.id === assetId)) {
        removeAsset(assetId, 'Background');
      }
    } else {
      if (asset.type && ['Body', 'Equipment', 'Clothing', 'Background'].includes(asset.type)) {
        addAsset({
          _id: assetId,
          name: asset.name,
          description: asset.description || '',
          type: asset.type,
          subcategory: asset.subcategory || '',
          gen: asset.gen || '',
          image_url: asset.image_url || ''
        });
      } else {
        console.warn(`Asset has invalid type: ${asset.type}`);
      }
    }
  
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

  const getBorderColor = () => {
    switch (asset.type) {
      case 'Body': return 'border-blue-500/10';
      case 'Equipment': return 'border-red-500/10'; 
      case 'Clothing': return 'border-green-500/10';
      case 'Background': return 'border-purple-500/10';
      default: return 'border-gray-500/10';
    }
  };

  return (
    <>
      <div
        key={assetId}
        className={`
          flex flex-col items-center border hover:brightness-110
          ${getBorderColor()}
          ${isInStore ? 'opacity-100' : 'opacity-70'} 
          rounded-md cursor-pointer transition-all duration-300 ease-linear
          ${isSelected ? 'ring-1 ring-white' : ''}
        `}
        onClick={handleAssetSelection}
        onContextMenu={handleContextMenu}
      >
        <div className="w-full overflow-hidden">
            <Image 
              src={'https://cdn.leonardo.ai/users/65d71243-f7c2-4204-a1b3-433aaf62da5b/generations/4d9fb0a2-0c26-4d39-be35-1265a3d3a2bb/segments/1:1:1/Flux_Dev_________A_stylized_handdrawn_illustration_of_silver_r_0.jpg'} // Hardcoded for test now
              alt={asset.name}
              className="w-full h-16 object-cover rounded mb-1"
              width={100}
              height={64}
            />
          <div className="bg-gray-900 bg-opacity-70 p-1 rounded">
            <span className="text-xs px-1 text-center w-full truncate block">
              {asset.name}
            </span>
            {asset.subcategory && (
              <span className="text-[10px] text-gray-400 px-1 text-center w-full truncate block">
                {asset.subcategory}
              </span>
            )}
          </div>
        </div>
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