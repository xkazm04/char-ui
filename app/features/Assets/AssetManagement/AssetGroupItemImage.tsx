import { serverUrl } from "@/app/constants/urls";
import Image from "next/image";
import { useState, useMemo } from "react"; // Added useMemo
import { motion, AnimatePresence } from "framer-motion";
import { AssetType } from "@/app/types/asset"; // Import the main AssetType

type Props = {
    assetId: string; 
    asset: AssetType; 
}

const AssetGroupItemImage = ({ assetId, asset }: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [imageError, setImageError] = useState<boolean>(false);

    const imageSource = useMemo(() => {
        setIsLoading(true); 
        setImageError(false);

        if (asset.image_data_base64 && asset.image_content_type) {
            return `data:${asset.image_content_type};base64,${asset.image_data_base64}`;
        }
        if (asset.image_url) { // Fallback to image_url if present
            return asset.image_url.startsWith('http') ? asset.image_url : `${serverUrl}${asset.image_url}`;
        }
        return `${serverUrl}/assets/image/${assetId}`;
    }, [asset.image_data_base64, asset.image_content_type, asset.image_url, assetId]);


    return (
        <div className="inset-0 w-full h-full relative">
            <AnimatePresence>
                {isLoading && !imageError && (
                    <motion.div 
                        className="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-10"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="w-4 h-4 border-2 border-t-transparent border-blue-400 rounded-full animate-spin" />
                    </motion.div>
                )}
            </AnimatePresence>

            {!imageError ? (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={imageSource} // Key change will re-trigger animation
                        className="w-full h-full relative"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isLoading ? 0 : 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Image
                            src={imageSource}
                            alt={asset.name}
                            className="object-cover group-hover:brightness-150 duration-300"
                            fill
                            loading={"lazy"}
                            onLoad={() => setIsLoading(false)}
                            onError={() => {
                                console.error(`Failed to load image for asset: ${asset.name} (ID: ${assetId}) from src: ${imageSource}`);
                                setImageError(true);
                                setIsLoading(false);
                            }}
                        />
                    </motion.div>
                </AnimatePresence>
            ) : (
                <motion.div 
                    className="w-full h-full flex items-center justify-center bg-gray-800"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <span className="text-xs text-gray-400">Image unavailable</span>
                </motion.div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
    );
}

export default AssetGroupItemImage;