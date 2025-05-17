import { Save, Loader2, CheckCheck } from "lucide-react";
import { motion } from "framer-motion";
import { AssetType, SimilarAsset } from "@/app/types/asset";
import { serverUrl } from "@/app/constants/urls";
import { handleAssetGenerationAndSave } from "@/app/functions/leoFns";

type Props = {
    setShowSimilarModal: (show: boolean) => void;
    setIsSaving: (saving: boolean) => void;
    setSaveError: (error: boolean) => void;
    setShowSuccess: (show: boolean) => void;
    asset: AssetType;
    descriptionVector?: number[];
    handleAssetGeneration: () => void;
    setDescriptionVector: (vector: number[]) => void;
    setSimilarAssets: (assets: SimilarAsset[]) => void;
    showSuccess?: boolean;
    saveError?: boolean;
    isGenerating?: boolean;
    isSaving?: boolean;
}



const AssetAnalysisSave = ({ 
    asset,
    setShowSimilarModal,
    setIsSaving,
    setSaveError,
    setShowSuccess,
    setDescriptionVector,
    setSimilarAssets,
    showSuccess = false,
    saveError = false,
    isGenerating = false,
    isSaving = false
}: Props) => {

    const handleSave = async () => {
        setIsSaving(true);
        setShowSuccess(false);
        setSaveError(false);

        try {
            // First validate the asset to check for similar items
            const validateResponse = await fetch(`${serverUrl}/assets/validate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(asset),
            });

            if (!validateResponse.ok) {
                throw new Error(`Validation failed: ${validateResponse.status}`);
            }

            const validationData = await validateResponse.json();
            
            if (validationData.description_vector) {
                setDescriptionVector(validationData.description_vector);
            }

            if (validationData.similar_assets && validationData.similar_assets.length > 0) {
                setSimilarAssets(validationData.similar_assets);
                setShowSimilarModal(true);
                setIsSaving(false);
                return;
            }
            const assetToSave = {
                ...asset,
                description_vector: validationData.description_vector
            };
            
            console.log("Attempting to save asset:", assetToSave);
            
            await handleAssetGenerationAndSave({
                prompt: asset.gen,
                type: "asset",
                generationId: null,
                setGenerationId: () => {}, 
                setGenError: (error) => setSaveError(error),
                setIsGenerating: setIsSaving,
                setGeneratedImage: () => {},
                asset: assetToSave, 
                setSavedAssetId: () => {} 
            });

            setShowSuccess(true);
            
        } catch (error) {
            console.error("Error saving asset:", error);
            setSaveError(true);
        } finally {
            setIsSaving(false);
        }
    };

    return <button
        className="p-1 rounded-lg hover:bg-sky-700/40 transition-colors duration-200 cursor-pointer"
        title={isSaving ? "Saving..." : showSuccess ? "Saved!" : saveError ? "Save failed!" : "Save"}
        onClick={handleSave}
        disabled={isSaving || showSuccess || isGenerating}
    >
        {isSaving ? (
            <Loader2 className="h-4 w-4 text-sky-400 animate-spin" />
        ) : showSuccess ? (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                exit={{ opacity: 0 }}
            >
                <CheckCheck className="h-4 w-4 text-green-400" />
            </motion.div>
        ) : (
            <Save className={`h-4 w-4 ${saveError ? 'text-red-400' : 'text-sky-400 hover:text-sky-300'}`} />
        )}
    </button>
}

export default AssetAnalysisSave;