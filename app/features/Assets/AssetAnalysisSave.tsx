import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { AssetType, SimilarAsset } from "@/app/types/asset";
import { serverUrl } from "@/app/constants/urls";
import { handleAssetGenerationAndSave } from "@/app/functions/leoFns";
import { useState } from "react";
import { useAllAssets } from "@/app/functions/assetFns";
import { buttonConfig } from "@/app/constants/loading";

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
    setGeneratedImage?: (url: string | null) => void;
    prompt?: string;
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
    isSaving = false,
    setGeneratedImage,
    prompt = "",
}: Props) => {
    const { refetch } = useAllAssets();
    const [generationId, setGenerationId] = useState<string | null>(null);
    const [isValidating, setIsValidating] = useState(false);
    const [isProcessingBackground, setIsProcessingBackground] = useState(false);

    const handleSave = async () => {
        setIsValidating(true);
        setIsSaving(true);
        setShowSuccess(false);
        setSaveError(false);

        try {
            // Use hybrid validation with Atlas Vector Search
            const validateResponse = await fetch(`${serverUrl}/assets/validate?use_atlas_search=true`, {
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

            setIsValidating(false);

            if (validationData.similar_assets && validationData.similar_assets.length > 0) {
                setSimilarAssets(validationData.similar_assets);
                setShowSimilarModal(true);
                setIsSaving(false); 
                return;
            }
            
            // No similar assets, proceed with save
            const assetToSave = {
                ...asset,
                description_vector: validationData.description_vector
            };
            
            console.log("Attempting to save asset with preview (hybrid validation passed):", assetToSave);
            
            // Direct pass-through, no wrapper function
            await handleAssetGenerationAndSave({
                prompt: prompt,
                generationId: generationId,
                setGenerationId: setGenerationId,
                setGenError: (error) => {
                    setSaveError(error);
                    setIsSaving(false);
                },
                setIsGenerating: setIsSaving,
                setGeneratedImage: setGeneratedImage,
                asset: assetToSave, 
                setSavedAssetId: () => {} 
            });
            
            // Set success immediately after the function completes (image should be set by now)
            setShowSuccess(true);
            setIsSaving(false);
            setIsProcessingBackground(true);
            
            // Schedule background refresh
            setTimeout(() => {
                refetch();
                setIsProcessingBackground(false);
            }, 5000);
            
        } catch (error) {
            console.error("Error saving asset:", error);
            setSaveError(true);
            setIsSaving(false);
            setIsValidating(false);
            setIsProcessingBackground(false);
            
            setTimeout(() => {
                setSaveError(false);
            }, 5000);
        }
    };

    const getButtonState = () => {
        if (isValidating) return 'validating';
        if (isSaving) return 'saving';
        if (isProcessingBackground) return 'processing';
        if (showSuccess) return 'success';
        if (saveError) return 'error';
        return 'default';
    };

    const buttonState = getButtonState();
    const config = buttonConfig[buttonState];
    const IconComponent = config.icon;

    // Button is disabled only when actually processing, not when modal is open
    const isDisabled = isValidating || isSaving || showSuccess || isGenerating;

    return (
        <motion.button
            whileHover={{ scale: buttonState === 'default' || buttonState === 'error' ? 1.02 : 1 }}
            whileTap={{ scale: buttonState === 'default' || buttonState === 'error' ? 0.98 : 1 }}
            className={`flex items-center cursor-pointer z-30 gap-2 px-3 py-2 rounded-lg border transition-all duration-200 text-sm font-medium ${config.className}`}
            title={config.text}
            onClick={handleSave}
            disabled={isDisabled}
        >
            <IconComponent className={`h-4 w-4 ${config.iconClassName}`} />
            <span>{config.text}</span>
            
            {buttonState === 'success' && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-1"
                >
                    <Sparkles className="h-3 w-3" />
                </motion.div>
            )}
        </motion.button>
    );
}

export default AssetAnalysisSave;