import { useState, useEffect, useRef } from "react";
import AssetItemModal from "./AssetItemModal";
import { AssetType } from "@/app/types/asset";

type Props = {
  asset: AssetType;
  selectedAsset: string | null;
  toggleAssetSelection: (assetId: string) => void;
}

const AssetGroupItem = ({ asset, selectedAsset, toggleAssetSelection }: Props) => {
  const assetId = asset.id || asset._id; 
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  
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
          ${selectedAsset === assetId ? 'bg-sky-700' : 'bg-gray-800 hover:bg-gray-700'} 
          rounded-md p-1 cursor-pointer transition-colors
        `}
        onClick={() => toggleAssetSelection(assetId)}
        onContextMenu={handleContextMenu}
      >
        <span className="text-xs mt-1 text-center w-full truncate">
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