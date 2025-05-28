import { RefreshCw, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useMemo } from "react";
import AssetsSimilarModal from "./AssetsSimilarModal";
import { AssetType, SimilarAsset } from "@/app/types/asset";
import { handleAssetGeneration, handleAssetGenerationAndSave } from "@/app/functions/leoFns";
import { useAllAssets } from "@/app/functions/assetFns";
import AssetAnalysisResultHeader from "./AssetAnalysisResultHeader";
import AssetAnalysisCardContent from "./AssetAnalysisCardContent";
import { catStyles } from "@/app/constants/typeStyles";
import AssetAnalysisSave from "./AssetAnalysisSave";
import AnalysisFinal from "@/app/components/ui/Cards/AnalysisCard/AnalysisFinal";
import AnalysisCard from "@/app/components/ui/Cards/AnalysisCard/AnalysisCard";

type Props = {
    asset: AssetType;
    idx: number;
    setOpenaiList: (list: AssetType[] | ((prev: AssetType[]) => AssetType[])) => void;
    setGeminiList: (list: AssetType[] | ((prev: AssetType[]) => AssetType[])) => void;
    setGroqList: (list: AssetType[] | ((prev: AssetType[]) => AssetType[])) => void;
    tab: string;
}

const AssetAnalysisResultItem = ({ asset, idx, setOpenaiList, setGeminiList, setGroqList, tab }: Props) => {
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [saveError, setSaveError] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [showSimilarModal, setShowSimilarModal] = useState(false);
    const [similarAssets, setSimilarAssets] = useState<SimilarAsset[]>([]);
    const [descriptionVector, setDescriptionVector] = useState<number[] | null>(null);
    const [genError, setGenError] = useState<boolean>(false);
    const [generationId, setGenerationId] = useState<string | null>(null);
    const [savedAssetId, setSavedAssetId] = useState<string | null>(null);

    const [isSaved, setIsSaved] = useState(false);
    const { refetch } = useAllAssets();
    const [prompt, setPrompt] = useState<string>(asset.gen || "");

    const handleRemove = useCallback((idx: number) => {
        if (tab === "openai") {
            setOpenaiList((prev) => prev.filter((_, i) => i !== idx));
        } else if (tab === "gemini") {
            setGeminiList((prev) => prev.filter((_, i) => i !== idx));
        } else if (tab === "groq") {
            setGroqList((prev) => prev.filter((_, i) => i !== idx));
        }
    }, [tab, setOpenaiList, setGeminiList, setGroqList]);

    const handleRetryGeneration = useCallback(async () => {
        setGeneratedImage(null);
        setGenError(false);

        try {
            setIsGenerating(true);

            if (savedAssetId) {
                const assetToSave = {
                    ...asset,
                    description_vector: descriptionVector || []
                };

                await handleAssetGenerationAndSave({
                    prompt: prompt,
                    generationId,
                    setGenerationId,
                    setGenError,
                    setIsGenerating,
                    setGeneratedImage,
                    asset: assetToSave,
                    setSavedAssetId
                });
                refetch();
            } else {
                await handleAssetGeneration({
                    asset,
                    prompt: prompt,
                    generationId,
                    setGenerationId,
                    setGenError,
                    setIsGenerating,
                    setGeneratedImage
                });
                refetch();
            }
        } catch (error) {
            console.error("Error in retry generation:", error);
            setGenError(true);
            setIsGenerating(false);
        }
    }, [asset, prompt, generationId, savedAssetId, descriptionVector, refetch]);

    const typeStyles = useMemo(() => {
        return catStyles[asset.type as keyof typeof catStyles] || catStyles.default;
    }, [asset.type]);

    const handleSaveSuccess = useCallback(() => {
        setIsSaved(true);
        setShowSuccess(true);
        // Don't auto-hide success - keep the final state permanent
    }, []);

    // Custom setShowSuccess that handles the final state transition
    const customSetShowSuccess = useCallback((show: boolean) => {
        if (show) {
            handleSaveSuccess();
        } else {
            setShowSuccess(false);
        }
    }, [handleSaveSuccess]);

    return (
        <>
            <AnalysisCard
                isSaved={isSaved}
                idx={idx}
                typeStyles={typeStyles}
            >

                <AnimatePresence>
                    {isSaved && generatedImage && (
                        <AnalysisFinal
                            asset={asset}
                            prompt={prompt}
                            typeStyles={typeStyles}
                            generatedImage={generatedImage}
                        />

                    )}
                </AnimatePresence>

                {/* Show editing interface - only when not saved */}
                {!isSaved && (
                    <>
                        {/* Header with Type Badge and Actions */}
                        <AssetAnalysisResultHeader
                            //@ts-expect-error Ignore
                            asset={asset}
                            isGenerating={isGenerating}
                            typeStyles={typeStyles}
                            handleRemove={handleRemove}
                            idx={idx}
                        />

                        {/* Content Body */}
                        <AssetAnalysisCardContent
                            asset={asset}
                            prompt={prompt}
                            setPrompt={setPrompt}
                            isSaved={isSaved}
                        />

                        {/* Action Buttons */}
                        <div className="flex gap-2 p-4 justify-end">
                            <AssetAnalysisSave
                                setShowSimilarModal={setShowSimilarModal}
                                setIsSaving={setIsSaving}
                                setSaveError={setSaveError}
                                setShowSuccess={customSetShowSuccess}
                                handleAssetGeneration={handleRetryGeneration}
                                setDescriptionVector={setDescriptionVector}
                                setGeneratedImage={setGeneratedImage}
                                setSimilarAssets={setSimilarAssets}
                                showSuccess={showSuccess}
                                saveError={saveError}
                                isGenerating={isGenerating}
                                isSaving={isSaving}
                                asset={asset}
                                prompt={prompt}
                            />
                        </div>
                    </>
                )}

                {/* Loading Overlay for Generation */}
                <AnimatePresence>
                    {isGenerating && !isSaved && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center z-30"
                        >
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-gray-600 rounded-full"></div>
                                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-sky-500 rounded-full animate-spin border-t-transparent"></div>
                            </div>
                            <motion.p
                                className="mt-4 text-sm text-sky-300 font-medium text-center"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                {generationId ? 'Regenerating preview...' : 'Generating preview...'}
                            </motion.p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Error Overlay */}
                <AnimatePresence>
                    {genError && !isGenerating && !isSaved && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute inset-0 bg-black/90 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center p-6 z-30"
                        >
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 0.5 }}
                            >
                                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                            </motion.div>
                            <p className="text-red-300 mb-6 text-center font-medium">Generation Failed</p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleRetryGeneration}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-300 border border-red-500/30 transition-all"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Try Again
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </AnalysisCard>
            <AssetsSimilarModal
                showSimilarModal={showSimilarModal}
                similarAssets={similarAssets}
                setShowSimilarModal={setShowSimilarModal}
                setIsSaving={setIsSaving}
                setSaveError={setSaveError}
                setShowSuccess={customSetShowSuccess}
                handleAssetGeneration={handleRetryGeneration}
                asset={asset}
                descriptionVector={descriptionVector}
                setGeneratedImage={setGeneratedImage}
                prompt={prompt}
            />


        </>
    );
}

export default AssetAnalysisResultItem;