import { useAssets } from "@/app/functions/assetFns";
import { handleAssetGenerationAndSave } from "@/app/functions/leoFns";
import { useNavStore } from "@/app/store/navStore";
import { AssetType, SimilarAsset } from "@/app/types/asset";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import AssetSimilarItemCard from "./AssetsSimilarItemCard";

type Props = {
    showSimilarModal: boolean;
    similarAssets: SimilarAsset[];
    setShowSimilarModal: (show: boolean) => void;
    setIsSaving: (saving: boolean) => void;
    setSaveError: (error: boolean) => void;
    setShowSuccess: (show: boolean) => void;
    asset: AssetType;
    descriptionVector?: number[] | null;
    handleAssetGeneration: () => void;
}

const AssetsSimilarModal = ({showSimilarModal, similarAssets, setShowSimilarModal, setIsSaving, setSaveError, setShowSuccess, asset, descriptionVector, handleAssetGeneration}: Props) => {
    const {setAssetNavHighlighted} = useNavStore();
    const { refetch } = useAssets();
    const handleConfirmSave = async () => {
        setShowSimilarModal(false);
        setIsSaving(true);
        setSaveError(false);

        try {
            const assetToSave = {
                type: asset.type,
                name: asset.name,
                gen: asset.gen,
                description: asset.description,
                description_vector: descriptionVector || [],
            };
            
            console.log("Confirming save with asset:", assetToSave);
            
            await handleAssetGenerationAndSave({
                prompt: asset.gen,
                generationId: null,
                setGenerationId: () => {},
                setGenError: (error) => setSaveError(error),
                setIsGenerating: setIsSaving,
                setGeneratedImage: () => {}, 
                asset: assetToSave,
                setSavedAssetId: () => {}
            });
            
            setIsSaving(false);
            setShowSuccess(true);
            setAssetNavHighlighted(true);
            refetch(); 

            setTimeout(() => {
                setShowSuccess(false);
                handleAssetGeneration();
            }, 2000);
        } catch (error) {
            console.error('Error saving asset:', error);
            setIsSaving(false);
            setSaveError(true);
        }
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

                        <p className="text-gray-300 mb-4 text-sm">
                            Found <b>{similarAssets.length} existing {similarAssets.length === 1 ? 'asset' : 'assets'}</b> that {similarAssets.length === 1 ? 'is' : 'are'} similar to what you are trying to save.
                            Do you still want to continue?
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                            {similarAssets.map(similar => (
                                <AssetSimilarItemCard similar={similar} key={similar.id} />
                            ))}
                        </div>

                        <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-gray-700">
                            <button
                                onClick={() => setShowSimilarModal(false)}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmSave}
                                className="px-4 py-2 text-sm bg-sky-800 hover:bg-sky-600 text-white rounded-md transition-colors cursor-pointer"
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