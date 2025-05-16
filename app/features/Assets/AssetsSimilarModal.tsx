import { serverUrl } from "@/app/constants/urls";
import { useNavStore } from "@/app/store/navStore";
import { AssetType } from "@/app/types/asset";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import Image from "next/image";

type Props = {
    showSimilarModal: boolean;
    similarAssets: {
        id: string;
        name: string;
        type: string;
        description?: string;
        image_url?: string;
        similarity: number;
    }[];
    setShowSimilarModal: (show: boolean) => void;
    setIsSaving: (saving: boolean) => void;
    setSaveError: (error: boolean) => void;
    setShowSuccess: (show: boolean) => void;
    asset: AssetType;
    descriptionVector?: number[] | null;
    handleAssetGeneration: () => void;
}

const AssetsSimilarModal = ({showSimilarModal, similarAssets, setShowSimilarModal, setIsSaving, setSaveError, setShowSuccess, asset, descriptionVector, handleAssetGeneration}: Props) => {
    const {setAssetNavExpanded} = useNavStore();
    const handleConfirmSave = () => {
        setShowSimilarModal(false);
        setIsSaving(true);
        setSaveError(false);

        fetch(`${serverUrl}/assets/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: asset.type,
                name: asset.name,
                gen: asset.gen,
                description: asset.description,
                description_vector: descriptionVector,
            }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(() => {
                setIsSaving(false);
                setShowSuccess(true);
                setAssetNavExpanded(true);

                setTimeout(() => {
                    setShowSuccess(false);
                    handleAssetGeneration();
                }, 2000);
            })
            .catch(error => {
                console.error('Error saving asset:', error);
                setIsSaving(false);
                setSaveError(true);
            });
    };

    return <>
        <AnimatePresence>
            {showSimilarModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.9 }}
                        className="bg-gray-800 rounded-lg p-5 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                    >
                        <div className="flex items-center mb-4 text-yellow-400">
                            <AlertCircle className="h-5 w-5 mr-2" />
                            <h2 className="text-lg font-bold">Similar Assets Found</h2>
                        </div>

                        <p className="text-gray-300 mb-4">
                            We found {similarAssets.length} existing {similarAssets.length === 1 ? 'asset' : 'assets'} that {similarAssets.length === 1 ? 'is' : 'are'} similar to what you are trying to save.
                            Do you still want to continue?
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                            {similarAssets.map(similar => (
                                <div key={similar.id} className="bg-gray-700 p-3 rounded-md border border-gray-600">
                                    <div className="flex items-start gap-3">
                                        {similar.image_url && (
                                            <div className="w-16 h-16 relative flex-shrink-0">
                                                <Image
                                                    src={similar.image_url}
                                                    alt={similar.name}
                                                    fill
                                                    className="object-cover rounded"
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="font-medium text-white">{similar.name}</h3>
                                            <p className="text-sm text-gray-400 mb-1">{similar.type}</p>
                                            {similar.description && (
                                                <p className="text-xs text-gray-300 line-clamp-2">{similar.description}</p>
                                            )}
                                            <div className="mt-1 text-xs">
                                                <span className="text-yellow-400">{(similar.similarity * 100).toFixed(1)}% similar</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-gray-700">
                            <button
                                onClick={() => setShowSimilarModal(false)}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmSave}
                                className="px-4 py-2 bg-sky-700 hover:bg-sky-600 text-white rounded-md transition-colors"
                            >
                                Save Anyway
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    </>
}

export default AssetsSimilarModal;