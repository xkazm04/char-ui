import ActionButton from "@/app/components/ui/Buttons/ActionButton";
import { ModalActions } from "@/app/components/ui/modal";
import { useAllAssets } from "@/app/functions/assetFns";
import { handleAssetGenerationAndSave } from "@/app/functions/leoFns";
import { useNavStore } from "@/app/store/navStore";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { useState } from "react";

type Props = {
    asset: {
        type: string;
        name: string;
        gen?: string;
        description?: string;
    };
    setShowSimilarModal: (show: boolean) => void;
    setIsSaving: (saving: boolean) => void;
    setSaveError: (error: boolean) => void;
    setShowSuccess: (show: boolean) => void;
    descriptionVector?: number[] | null;
    setGeneratedImage?: (url: string | null) => void;
    prompt?: string;
}

const SimilarFooter = ({ asset, setShowSimilarModal, setIsSaving, setSaveError, setShowSuccess, descriptionVector, setGeneratedImage, prompt }: Props) => {
    const { setAssetNavHighlighted } = useNavStore();
    const { refetch } = useAllAssets();
    const [isSaving, setLocalSaving] = useState(false);
    const [isProcessingBackground, setIsProcessingBackground] = useState(false);

    const handleConfirmSave = async () => {
        setLocalSaving(true);
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

            // Don't wrap setGeneratedImage - let it work directly
            await handleAssetGenerationAndSave({
                prompt: prompt || asset.gen || "wooden sword",
                generationId: null,
                setGenerationId: () => { },
                setGenError: (error) => {
                    setSaveError(error);
                    setIsSaving(false);
                    setLocalSaving(false);
                },
                setIsGenerating: setIsSaving,
                //@ts-expect-error Ignore
                setGeneratedImage: setGeneratedImage, asset: assetToSave,
                setSavedAssetId: () => { }
            });

            // Set success states after the generation completes
            setShowSuccess(true);
            setIsSaving(false);
            setLocalSaving(false);
            setIsProcessingBackground(true);
            setAssetNavHighlighted(true);

            // Schedule refetch after background processing
            setTimeout(() => {
                refetch();
                setIsProcessingBackground(false);
            }, 5000);

        } catch (error) {
            console.error('Error saving asset:', error);
            setIsSaving(false);
            setLocalSaving(false);
            setSaveError(true);
            setIsProcessingBackground(false);
        }
    };

    return <ModalActions align="between">
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowSimilarModal(false)}
            className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white rounded-lg border border-gray-600/30 transition-all"
            disabled={isSaving || isProcessingBackground}
        >
            Cancel
        </motion.button>
        <ActionButton
            onClick={handleConfirmSave}
            disabled={isSaving || isProcessingBackground}
        >
            <>
                {(isSaving || isProcessingBackground) ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {isProcessingBackground ? 'Processing...' : 'Saving...'}
                    </>
                ) : (
                    <>
                        <Zap className="h-4 w-4" />
                        Save Anyway
                        <ArrowRight className="h-4 w-4" />
                    </>
                )}
            </>
        </ActionButton>
    </ModalActions>
}

export default SimilarFooter;