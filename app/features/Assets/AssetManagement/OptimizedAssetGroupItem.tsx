"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { AssetType } from "@/app/types/asset";
import { useAssetStore } from "@/app/store/assetStore";
import { getBorderColor, getTypeIndicatorClass } from "@/app/helpers/assetHelpers";
import { OptimizedImage } from "@/app/components/ui/optimized-image";
import AssetItemModal from "./AssetItemModal";
import { serverUrl } from "@/app/constants/urls";

interface OptimizedAssetGroupItemProps {
  asset: AssetType;
  toggleAssetSelection: (assetId: string) => void;
  isFullScreen?: boolean;
  priority?: boolean;
}

const OptimizedAssetGroupItem = React.memo(
  ({ asset, toggleAssetSelection, isFullScreen = false, priority = false }: OptimizedAssetGroupItemProps) => {
    const assetId = asset._id;
    const [showModal, setShowModal] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const itemRef = useRef<HTMLDivElement>(null);

    const { Body, Equipment, Clothing, Background, addAsset, removeAsset } =
      useAssetStore();

    const isInStore = useMemo(() => {
      return [...Body, ...Equipment, ...Clothing, ...Background].some(
        (item) => item.id === assetId
      );
    }, [Body, Equipment, Clothing, Background, assetId]);

    // Determine image source
    const imageSource = useMemo(() => {
      if (asset.image_data_base64 && asset.image_content_type) {
        return null; // We'll use the base64 data directly
      }
      if (asset.image_url) {
        return asset.image_url.startsWith("http")
          ? asset.image_url
          : `${serverUrl}${asset.image_url}`;
      }
      return `${serverUrl}/assets/image/${assetId}`;
    }, [asset.image_data_base64, asset.image_content_type, asset.image_url, assetId]);

    const handleAssetSelection = () => {
      if (isInStore) {
        if (!assetId) return;
        if (Body.some((item) => item.id === assetId)) {
          removeAsset(assetId, "Body");
        } else if (Equipment.some((item) => item.id === assetId)) {
          removeAsset(assetId, "Equipment");
        } else if (Clothing.some((item) => item.id === assetId)) {
          removeAsset(assetId, "Clothing");
        } else if (Background.some((item) => item.id === assetId)) {
          removeAsset(assetId, "Background");
        }
      } else {
        let assetType = asset.type;

        if (
          !assetType ||
          !["Body", "Equipment", "Clothing", "Background"].includes(assetType)
        ) {
          assetType = "Equipment"; // Default category
          console.warn(
            `Asset type "${asset.type}" not recognized, defaulting to Equipment`
          );
        }

        addAsset({
          id: assetId,
          name: asset.name,
          description: asset.description || "",
          type: assetType,
          subcategory: asset.subcategory || "",
          gen: asset.gen || "",
          image_url: asset.image_url || "",
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
        document.addEventListener("mousedown", handleClickOutside);
      }
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [showModal]);

    useEffect(() => {
      // Use Intersection Observer to detect when the item is visible
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsVisible(entry.isIntersecting);
        },
        { threshold: 0.1 }
      );

      if (itemRef.current) {
        observer.observe(itemRef.current);
      }

      return () => {
        if (itemRef.current) {
          observer.unobserve(itemRef.current);
        }
      };
    }, []);

    const handleContextMenu = (e: React.MouseEvent) => {
      e.preventDefault();
      setShowModal(true);
    };

    return (
      <>
        {isFullScreen ? (
          <motion.div
            ref={itemRef}
            key={assetId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            title={asset.name + " - right click for the details"}
            className={`
              relative overflow-hidden group border hover:brightness-110
              ${getBorderColor(asset)}
              ${isInStore ? "bg-gray-800/70" : "bg-gray-900/70"} 
              rounded-md cursor-help transition-all duration-300 ease-linear
              ${
                isInStore
                  ? "ring-1 ring-sky-500/50 shadow-sm shadow-sky-500/20"
                  : ""
              }
              h-32 w-full transform hover:scale-[1.02] hover:shadow-lg hover:shadow-black/30
              transition-all duration-300 
            `}
            onClick={handleAssetSelection}
            onContextMenu={handleContextMenu}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Background Image */}
            {(isVisible || priority) && (
              <OptimizedImage
                src={imageSource || ""}
                alt={asset.name}
                className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                fill
                priority={priority}
                base64Data={asset.image_data_base64 || undefined}
                contentType={asset.image_content_type || undefined}
              />
            )}

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
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </motion.div>
        ) : (
          <div
            ref={itemRef}
            key={assetId}
            className={`
              flex flex-col items-center border hover:brightness-110
              ${getBorderColor(asset)}
              ${isInStore ? "bg-gray-800/70" : "bg-gray-900/70"} 
              rounded-md cursor-help transition-all duration-300 ease-linear p-1
              ${isInStore ? "ring-1 ring-sky-500/30 border-sky-500/20" : ""}
            `}
            onClick={handleAssetSelection}
            onContextMenu={handleContextMenu}
          >
            <div className="w-full text-left relative">
              <div
                className={`absolute right-1 top-1/2 -translate-y-1/2 ${getTypeIndicatorClass(
                  asset.type
                )} rounded-full w-1.5 h-1.5`}
              />

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
);

OptimizedAssetGroupItem.displayName = "OptimizedAssetGroupItem";

export default OptimizedAssetGroupItem;

