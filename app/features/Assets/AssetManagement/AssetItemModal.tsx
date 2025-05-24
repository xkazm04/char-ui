import { Trash, Save, ChevronRight, Image as ImageIcon, FileText, Tag, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { AssetType } from "@/app/types/asset";
import { handleDelete, handleSave, useAllAssets } from "@/app/functions/assetFns";
import { useState, useEffect } from "react";
import { ModalBase, ModalHeader, ModalContent, ModalActions } from "@/app/components/ui/modal";
import ActionButton from "@/app/components/ui/Buttons/ActionButton";

type Props = {
    asset: AssetType
    modalRef: React.RefObject<HTMLDivElement>;
    setShowModal: (show: boolean) => void;
}

const AssetItemModal = ({ asset, modalRef, setShowModal }: Props) => {
    const { refetch } = useAllAssets();
    const [genValue, setGenValue] = useState(asset.gen || "");
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const initialGenValue = asset.gen || "";
    const hasChanges = genValue !== initialGenValue;

    // Auto-save functionality
    useEffect(() => {
        if (!hasChanges || !isEditing) return;

        const timer = setTimeout(() => {
            handleSave(genValue, asset._id);
        }, 2000); // Auto-save after 2 seconds of inactivity

        return () => clearTimeout(timer);
    }, [genValue, hasChanges, isEditing, asset._id]);

    const handleSaveClick = async () => {
        setIsSaving(true);
        try {
            await handleSave(genValue, asset._id);
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteClick = async () => {
        setIsDeleting(true);
        try {
            await handleDelete(asset, () => {
                setShowModal(false);
                refetch();
            });
        } catch (error) {
            console.error('Error deleting:', error);
            setIsDeleting(false);
        }
    };

    return (
        <ModalBase
            isOpen={true}
            onClose={() => setShowModal(false)}
            size="md"
            className="min-h-[400px]"
        >
            <ModalHeader
                title={asset.name}
                subtitle={`${asset.type}${asset.subcategory ? ` • ${asset.subcategory}` : ''}`}
                icon={<FileText className="h-5 w-5 text-blue-400" />}
            />

            <ModalContent className="space-y-6">
                {/* Asset Image */}
                {asset.image_url && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex justify-center bg-gray-900/50 rounded-xl p-4 border border-gray-700/30"
                    >
                        <Image
                            src={asset.image_url}
                            alt={asset.name}
                            width={200}
                            height={200}
                            className="rounded-lg object-contain max-h-48 shadow-lg"
                        />
                    </motion.div>
                )}

                {/* Asset Details */}
                <div className="space-y-4">

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
                                className="w-full min-h-[100px] p-4 bg-gray-800/50 border border-gray-600/50 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all resize-none"
                                placeholder="Add generation details..."
                            />
                            {hasChanges && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-end mt-2"
                                >
                                    <ActionButton
                                        onClick={handleSaveClick}
                                        disabled={isSaving}
                                        size="sm"
                                    >
                                        <>
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
                                        </>
                                    </ActionButton>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </ModalContent>

            <ModalActions align="between">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDeleteClick}
                    disabled={isDeleting}
                    className="flex items-center gap-2 px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg border border-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isDeleting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                            Deleting...
                        </>
                    ) : (
                        <>
                            <Trash size={16} />
                            Delete Asset
                        </>
                    )}
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white rounded-lg border border-gray-600/30 transition-all"
                >
                    Close
                </motion.button>
            </ModalActions>
        </ModalBase>
    );
}

export default AssetItemModal;