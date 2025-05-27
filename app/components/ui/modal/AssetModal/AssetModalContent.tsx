import { serverUrl } from "@/app/constants/urls";
import { AssetType } from "@/app/types/asset";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, ImageIcon, Save } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

type Props = {
    asset: AssetType;
    hasChanges: boolean;
    setGenValue: (value: string) => void;
    setIsEditing: (isEditing: boolean) => void;
    isSaving: boolean;
    genValue: string;
    handleSaveClick: () => void;
}

const AssetModalContent = ({ asset, hasChanges, setGenValue, setIsEditing, isSaving, genValue, handleSaveClick }: Props ) => {
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
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
    return <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
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
        <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                <ImageIcon className="h-4 w-4" />
                Generation Details
                {hasChanges && (
                    <span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-300 rounded-full border border-orange-500/30">
                        Unsaved changes
                    </span>
                )}
            </label>
            <div className="relative">
                <textarea
                    value={genValue}
                    onChange={(e) => {
                        setGenValue(e.target.value);
                        setIsEditing(true);
                    }}
                    onFocus={() => setIsEditing(true)}
                    onBlur={() => setIsEditing(false)}
                    className="w-full min-h-[100px] p-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none text-sm"
                    placeholder="Add generation details..."
                />
                {hasChanges && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-end mt-2"
                    >
                        <button
                            onClick={handleSaveClick}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            {isSaving ? (
                                <>
                                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={14} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    </div>
}

export default AssetModalContent;