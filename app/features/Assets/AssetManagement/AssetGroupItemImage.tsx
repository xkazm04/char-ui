import { serverUrl } from "@/app/constants/urls";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
    assetId: string;
    asset: {
        name: string;
        type?: string;
    };
    priority?: boolean;
}

const AssetGroupItemImage = ({ assetId, asset }: Props) => {
    const [imageUrl, setImageUrl] = useState<string>(`${serverUrl}/assets/image/${assetId}`);
    const [imageError, setImageError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        setImageUrl(`${serverUrl}/assets/image/${assetId}`);
        setImageError(false);
        setIsLoading(true);
    }, [assetId]);

    return (
        <div className="absolute inset-0 w-full h-full">
            {/* Loading indicator */}
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

            {/* Image with fade-in effect */}
            {!imageError ? (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={imageUrl}
                        className="w-full h-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isLoading ? 0 : 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Image
                            src={imageUrl}
                            alt={asset.name}
                            className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                            fill
                            loading="lazy"
                            onLoad={() => setIsLoading(false)}
                            onError={() => {
                                console.error(`Failed to load image for asset: ${assetId}`);
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

            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
    );
}

export default AssetGroupItemImage;