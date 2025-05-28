import { FileText, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AssetType } from "@/app/types/asset";
import { handleDelete, useAllAssets, useUpdateAsset } from "@/app/functions/assetFns";
import { useState, useEffect, useRef } from "react";
import AssetModalFooter from "@/app/components/ui/modal/AssetModal/AssetModalFooter";
import AssetModalContent from "@/app/components/ui/modal/AssetModal/AssetModalContent";
import { createPortal } from "react-dom";

type Props = {
    asset: AssetType
    modalRef: React.RefObject<HTMLDivElement>;
    setShowModal: (show: boolean) => void;
    onOptimisticDelete?: (assetId: string) => void;
}

const AssetItemModal = ({ asset, setShowModal, onOptimisticDelete }: Props) => {
    const { refetch } = useAllAssets();
    const updateAssetMutation = useUpdateAsset();
    const [genValue, setGenValue] = useState(asset.gen || "");
    const [isDeleting, setIsDeleting] = useState(false);
    const [mounted, setMounted] = useState(false);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const lastSavedValueRef = useRef(asset.gen || "");
    const isSavingRef = useRef(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        const currentAssetGen = asset.gen || "";
        if (currentAssetGen !== lastSavedValueRef.current && !isSavingRef.current) {
            setGenValue(currentAssetGen);
            lastSavedValueRef.current = currentAssetGen;
        }
    }, [asset.gen]);

    // Auto-save with debouncing
    useEffect(() => {
        const currentValue = genValue;
        const lastSavedValue = lastSavedValueRef.current;

        if (currentValue !== lastSavedValue && !isSavingRef.current) {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }

            debounceRef.current = setTimeout(() => {
                isSavingRef.current = true;
                updateAssetMutation.mutate(
                    {
                        id: asset._id,
                        updates: { gen: currentValue }
                    },
                    {
                        onSuccess: () => {
                            lastSavedValueRef.current = currentValue;
                            isSavingRef.current = false;
                        },
                        onError: () => {
                            isSavingRef.current = false;
                        }
                    }
                );
            }, 1500);
        }

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [genValue, asset._id, updateAssetMutation]);

    const handleDeleteClick = async () => {
        setIsDeleting(true);

        setTimeout(() => {
            setShowModal(false);
            onOptimisticDelete?.(asset._id);
        }, 2000);

        try {
            await handleDelete(asset, () => {
                refetch();
            });
        } catch (error) {
            console.error('Error deleting:', error);
            setIsDeleting(false);
        }
    };

    const modalContent = (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
                style={{
                    zIndex: 9999,
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                }}
                onClick={() => setShowModal(false)}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden"
                    style={{ zIndex: 10000 }}
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
                                    {/* Show similarity score if available */}
                                    {(asset as any).searchSimilarity && (
                                        <span className="ml-2 text-purple-400">
                                            ({((asset as any).searchSimilarity * 100).toFixed(1)}% match)
                                        </span>
                                    )}
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
                        setGenValue={setGenValue}
                        isUpdating={updateAssetMutation.isPending}
                        updateError={updateAssetMutation.error}
                        isSuccess={updateAssetMutation.isSuccess}
                        lastSavedValue={lastSavedValueRef.current}
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

    if (!mounted) return null;

    return createPortal(modalContent, document.body);
}

export default AssetItemModal;