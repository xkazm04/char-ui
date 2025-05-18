import { useState, useEffect, useRef, useMemo } from "react";
import AssetItemModal from "./AssetItemModal";
import { AssetType as AssetTypeObj } from "@/app/types/asset";
import { useAssetStore } from "@/app/store/assetStore";
import Image from "next/image";
import { motion } from "framer-motion";

type Props = {
  asset: AssetTypeObj; 
  toggleAssetSelection: (assetId: string) => void;
  isFullScreen?: boolean;
}

const AssetGroupItem = ({ asset, toggleAssetSelection, isFullScreen = false }: Props) => {
  const assetId = asset.id || asset._id;
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
  
  // Check if this asset is already in any category
  const isInStore = useMemo(() => {
    return [
      ...Body, 
      ...Equipment, 
      ...Clothing, 
      ...Background
    ].some(item => item.id === assetId || item._id === assetId);
  }, [Body, Equipment, Clothing, Background, assetId]);
  
  const handleAssetSelection = () => {
    // If the asset is already in the store, we need to remove it
    if (isInStore) {
      // Find which category contains the asset and remove it
      if (!assetId) return
      if (Body.some(item => (item.id === assetId || item._id === assetId))) {
        removeAsset(assetId, 'Body');
      } else if (Equipment.some(item => (item.id === assetId || item._id === assetId))) {
        removeAsset(assetId, 'Equipment');
      } else if (Clothing.some(item => (item.id === assetId || item._id === assetId))) {
        removeAsset(assetId, 'Clothing');
      } else if (Background.some(item => (item.id === assetId || item._id === assetId))) {
        removeAsset(assetId, 'Background');
      }
    } else {
      // Ensure the asset has a type property that's one of our main categories
      let assetType = asset.type;
      
      // If the type isn't one of our main categories, default to Equipment
      if (!assetType || !['Body', 'Equipment', 'Clothing', 'Background'].includes(assetType)) {
        assetType = 'Equipment'; // Default category
        console.warn(`Asset type "${asset.type}" not recognized, defaulting to Equipment`);
      }
      
      // Create a cleaned asset object with correct id format and valid type
      addAsset({
        id: assetId,
        _id: assetId,
        name: asset.name,
        description: asset.description || '',
        type: assetType,
        subcategory: asset.subcategory || '',
        gen: asset.gen || '',
        image_url: asset.image_url || ''
      });
    }

    // Update UI selection state via the parent component
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

  const getBorderColor = () => {
    switch (asset.type) {
      case 'Body': return 'border-blue-500/10';
      case 'Equipment': return 'border-red-500/10'; 
      case 'Clothing': return 'border-green-500/10';
      case 'Background': return 'border-purple-500/10';
      default: return 'border-gray-500/10';
    }
  };

  // Add this helper function for type indicators
  const getTypeIndicatorClass = (type: string | undefined) => {
    switch (type?.toLowerCase()) {
      case 'body': return 'bg-blue-500';
      case 'equipment': return 'bg-red-500';
      case 'clothing': return 'bg-green-500';
      case 'background': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <>
      {isFullScreen ? (
        <motion.div
          key={assetId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className={`
            relative overflow-hidden group border hover:brightness-110
            ${getBorderColor()}
            ${isInStore ? 'bg-gray-800/70' : 'bg-gray-900/70'} 
            rounded-md cursor-pointer transition-all duration-300 ease-linear
            ${isInStore ? 'ring-1 ring-sky-500/50 shadow-sm shadow-sky-500/20' : ''}
            h-32 w-full transform hover:scale-[1.02] hover:shadow-lg hover:shadow-black/30
            transition-all duration-300
          `}
          onClick={handleAssetSelection}
          onContextMenu={handleContextMenu}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full">
            <Image 
              src={'https://cdn.leonardo.ai/users/65d71243-f7c2-4204-a1b3-433aaf62da5b/generations/4d9fb0a2-0c26-4d39-be35-1265a3d3a2bb/segments/1:1:1/Flux_Dev_________A_stylized_handdrawn_illustration_of_silver_r_0.jpg'} 
              alt={asset.name}
              className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>
        
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
        <div
          key={assetId}
          className={`
            flex flex-col items-center border hover:brightness-110
            ${getBorderColor()}
            ${isInStore ? 'bg-gray-800/70' : 'bg-gray-900/70'} 
            rounded-md cursor-pointer transition-all duration-300 ease-linear p-1
            ${isInStore ? 'ring-1 ring-sky-500/30 border-sky-500/20' : ''}
          `}
          onClick={handleAssetSelection}
          onContextMenu={handleContextMenu}
        >
          <div className="w-full text-left relative">
            {/* Asset type indicator dot */}
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
        </div>
      )}
      
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