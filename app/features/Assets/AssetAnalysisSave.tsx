import { useNavStore } from "@/app/store/navStore";
import { Check, Loader2, Save } from "lucide-react";
import { serverUrl } from "@/app/constants/urls";
import { motion } from "framer-motion";
import { useState } from "react";
import { AssetType, SimilarAsset } from "@/app/types/asset";

interface ValidationResponse {
    similar_assets: SimilarAsset[];
    description_vector: number[];
    message: string;
    status: 'ok' | 'similar_found';
}

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



const AssetAnalysisSave = ({ setShowSimilarModal, setIsSaving, setSaveError, setShowSuccess, asset, descriptionVector, handleAssetGeneration
, setDescriptionVector, setSimilarAssets, showSuccess = false, saveError = false, isGenerating = false, isSaving = false
}: Props) => {
    const {setAssetNavExpanded} = useNavStore();
    const [isValidating, setIsValidating] = useState(false);
    const validateVector = async () => {
        setIsValidating(true);

        try {
            const response = await fetch(`${serverUrl}/assets/validate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: asset.type,
                    name: asset.name,
                    description: asset.description,
                    descriptionVector: descriptionVector,
                    gen: asset.gen,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const validationData: ValidationResponse = await response.json();

            setDescriptionVector(validationData.description_vector);

            if (validationData.status === 'similar_found' && validationData.similar_assets.length > 0) {
                setSimilarAssets(validationData.similar_assets);
                setShowSimilarModal(true);
                return false;
            }

            return true;

        } catch (error) {
            console.error('Error validating asset:', error);
            setSaveError(true);
            return false;
        } finally {
            setIsValidating(false);
        }
    };


    const handleSave = async () => {
        setIsSaving(true);
        setSaveError(false);
        const shouldContinue = await validateVector();

        if (!shouldContinue) {
            setIsSaving(false);
            return;
        }

        try {
            const response = await fetch(`${serverUrl}/assets/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: asset.type,
                    name: asset.name,
                    description: asset.description,
                    description_vector: descriptionVector,
                    gen: asset.gen,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            setIsSaving(false);
            setShowSuccess(true);
            setAssetNavExpanded(true);

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
    return <button
        className="p-1 rounded-lg hover:bg-sky-700/40 transition-colors duration-200 cursor-pointer"
        title={isValidating ? "Validating..." : isSaving ? "Saving..." : showSuccess ? "Saved!" : saveError ? "Save failed!" : "Save"}
        onClick={handleSave}
        disabled={isValidating || isSaving || showSuccess || isGenerating}
    >
        {isValidating || isSaving ? (
            <Loader2 className="h-4 w-4 text-sky-400 animate-spin" />
        ) : showSuccess ? (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                exit={{ opacity: 0 }}
            >
                <Check className="h-4 w-4 text-green-400" />
            </motion.div>
        ) : (
            <Save className={`h-4 w-4 ${saveError ? 'text-red-400' : 'text-sky-400 hover:text-sky-300'}`} />
        )}
    </button>
}

export default AssetAnalysisSave;