import { serverUrl } from "@/app/constants/urls";
import { AssetType } from "@/app/types/asset";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import AssetModalContentGen from "./AssetModalContentGen";

type Props = {
    asset: AssetType;
    setGenValue: (value: string) => void;
    genValue: string;
    isUpdating: boolean;
    updateError: Error | null;
    isSuccess: boolean;
    lastSavedValue: string; 
}

const AssetModalContent = ({ 
    asset, 
    setGenValue, 
    genValue, 
    isUpdating, 
    updateError, 
    isSuccess,
    lastSavedValue 
}: Props) => {
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    const [showSuccessIndicator, setShowSuccessIndicator] = useState(false);
    
    const hasChanges = genValue !== lastSavedValue;

    useEffect(() => {
        if (isSuccess && !isUpdating) {
            setShowSuccessIndicator(true);
            const timer = setTimeout(() => {
                setShowSuccessIndicator(false);
            }, 2000); 
            return () => clearTimeout(timer);
        }
    }, [isSuccess, isUpdating]);

    const imageSource = useMemo(() => {
        setImageLoading(true);
        setImageError(false);

        if (asset.image_data_base64 && asset.image_content_type) {
            return `data:${asset.image_content_type};base64,${asset.image_data_base64}`;
        }
        if (asset.image_url) {
            return asset.image_url.startsWith('http') ? asset.image_url : `${serverUrl}${asset.image_url}`;
        }
        return `${serverUrl}/assets/image/${asset._id}`;
    }, [asset.image_data_base64, asset.image_content_type, asset.image_url, asset._id]);

    return (
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Asset Image */}
            <div className="flex justify-center">
                <div className="relative w-48 h-48 bg-gray-800/50 rounded-xl border border-gray-700/30 overflow-hidden">
                    <AnimatePresence>
                        {imageLoading && !imageError && (
                            <motion.div
                                className="absolute inset-0 flex items-center justify-center z-10"
                                initial={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="w-6 h-6 border-2 border-t-transparent border-blue-400 rounded-full animate-spin" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!imageError ? (
                        <Image
                            src={imageSource}
                            alt={asset.name}
                            fill
                            className="object-cover"
                            onLoad={() => setImageLoading(false)}
                            onError={() => {
                                console.error(`Failed to load image for asset: ${asset.name} (ID: ${asset._id})`);
                                setImageError(true);
                                setImageLoading(false);
                            }}
                        />
                    ) : (
                        <motion.div
                            className="w-full h-full flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="text-center text-gray-500">
                                <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <span className="text-sm">Image unavailable</span>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Description */}
            {asset.description && (
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                        <FileText className="h-4 w-4" />
                        Description
                    </label>
                    <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
                        <p className="text-gray-200 text-sm leading-relaxed">{asset.description}</p>
                    </div>
                </div>
            )}

            {/* Generation Details */}
            <AssetModalContentGen
                showSuccessIndicator={showSuccessIndicator}
                isUpdating={isUpdating}
                updateError={updateError}
                genValue={genValue}
                setGenValue={setGenValue}
                hasChanges={hasChanges}
                />
        </div>
    );
};

export default AssetModalContent;