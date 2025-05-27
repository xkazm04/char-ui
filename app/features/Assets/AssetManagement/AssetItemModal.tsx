import { FileText, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AssetType } from "@/app/types/asset";
import { handleDelete, handleSave, useAllAssets } from "@/app/functions/assetFns";
import { useState, useEffect } from "react";
import AssetModalFooter from "@/app/components/ui/modal/AssetModal/AssetModalFooter";
import AssetModalContent from "@/app/components/ui/modal/AssetModal/AssetModalContent";

type Props = {
    asset: AssetType
    modalRef: React.RefObject<HTMLDivElement>;
    setShowModal: (show: boolean) => void;
    onOptimisticDelete?: (assetId: string) => void;
}

const AssetItemModal = ({ asset, setShowModal, onOptimisticDelete }: Props) => {
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
        }, 2000); 

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
        
        // Optimistic updates
        setShowModal(false);
        onOptimisticDelete?.(asset._id);
        
        try {
            await handleDelete(asset, () => {
                refetch();
            });
        } catch (error) {
            console.error('Error deleting:', error);
            setIsDeleting(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={() => setShowModal(false)}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                <FileText className="h-5 w-5 text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-white">{asset.name}</h2>
                                <p className="text-sm text-gray-400">
                                    {asset.type}{asset.subcategory ? ` • ${asset.subcategory}` : ''}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowModal(false)}
                            className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors text-gray-400 hover:text-white"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <AssetModalContent
                        asset={asset}
                        genValue={genValue}
                        hasChanges={hasChanges}
                        setGenValue={setGenValue}
                        setIsEditing={setIsEditing}
                        isSaving={isSaving}
                        handleSaveClick={handleSaveClick}
                        />

                    {/* Footer */}
                    <AssetModalFooter
                        isDeleting={isDeleting}
                        setShowModal={setShowModal}
                        handleDeleteClick={handleDeleteClick}
                        />
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default AssetItemModal;