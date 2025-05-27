import { RefreshCw, AlertCircle, Edit, Save, Eye, EyeOff, Wand2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeEffect } from "@/app/components/anim/variants";
import { useState, useCallback, useMemo } from "react";
import AssetsSimilarModal from "./AssetsSimilarModal";
import { AssetType, SimilarAsset } from "@/app/types/asset";
import AssetAnalysisSave from "./AssetAnalysisSave";
import { handleAssetGeneration, handleAssetGenerationAndSave } from "@/app/functions/leoFns";
import { useAllAssets } from "@/app/functions/assetFns";
import AssetAnalysisResultHeader from "./AssetAnalysisResultHeader";
import { catStyles } from "@/app/constants/typeStyles";
import Image from "next/image";

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
    const [editGen, setEditGen] = useState<boolean>(false);
    const [showRawData, setShowRawData] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isSaved, setIsSaved] = useState(false); // New state to track if asset is saved
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

    const savePromptChanges = useCallback(() => {
        setEditGen(false);
    }, []);

    const typeStyles = useMemo(() => {
        return catStyles[asset.type as keyof typeof catStyles] || catStyles.default;
    }, [asset.type]);

    // Handle save success to set saved state
    const handleSaveSuccess = useCallback(() => {
        setShowSuccess(true);
        setIsSaved(true);
        setTimeout(() => {
            setShowSuccess(false);
        }, 3000);
    }, []);

    return (
        <>
            <motion.div
                key={`asset-${asset.name}-${idx}`}
                layout="position"
                variants={fadeEffect}
                initial="initial"
                animate="animate"
                exit="exit"
                onHoverStart={() => !isSaved && setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                className={`relative flex flex-col bg-gradient-to-br ${typeStyles.gradient} 
                backdrop-blur-sm rounded-xl border ${typeStyles.border} hover:border-opacity-60
                transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/5
                overflow-hidden group ${isHovered && !isSaved ? 'scale-[1.01]' : 'scale-100'}
                ${isSaved ? 'pointer-events-none' : ''}`}
            >
                {/* Subtle animated background overlay - only when not saved */}
                {!isSaved && (
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-sky-500/2 via-gray-500/2 to-pink-500/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        animate={{
                            background: isHovered ? [
                                "linear-gradient(45deg, rgba(14, 165, 233, 0.02), rgba(168, 85, 247, 0.02), rgba(236, 72, 153, 0.02))",
                                "linear-gradient(225deg, rgba(168, 85, 247, 0.02), rgba(236, 72, 153, 0.02), rgba(14, 165, 233, 0.02))"
                            ] : "linear-gradient(45deg, rgba(14, 165, 233, 0), rgba(168, 85, 247, 0), rgba(236, 72, 153, 0))"
                        }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    />
                )}

                {/* Header with Type Badge and Actions */}
                <AssetAnalysisResultHeader
                    //@ts-expect-error Ignore
                    asset={asset}
                    isGenerating={isGenerating}
                    typeStyles={typeStyles}
                    handleRemove={handleRemove}
                    idx={idx}
                />

                {/* Content Body - only show when no image or not saved */}
                {(!generatedImage || !isSaved) && (
                    <div className="px-4 pb-4 flex-1 relative z-10">
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                    <Wand2 className="h-3 w-3" />
                                    Generation Prompt
                                </label>
                                {!editGen ? (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        onClick={() => setEditGen(true)}
                                        className="flex items-center gap-1 px-2 py-1 text-xs bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 rounded-md border border-sky-500/20 transition-all"
                                        disabled={isSaved}
                                    >
                                        <Edit className="h-3 w-3" />
                                        Edit
                                    </motion.button>
                                ) : (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        onClick={savePromptChanges}
                                        className="flex items-center gap-1 px-2 py-1 text-xs bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-md border border-green-500/20 transition-all"
                                    >
                                        <Save className="h-3 w-3" />
                                        Save
                                    </motion.button>
                                )}
                            </div>
                            
                            <AnimatePresence mode="wait">
                                {editGen ? (
                                    <motion.textarea
                                        key="edit-mode"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-sm text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all"
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        rows={3}
                                        placeholder="Enter generation prompt..."
                                    />
                                ) : (
                                    <motion.div
                                        key="view-mode"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="px-3 py-2 bg-gray-800/30 border border-gray-600/30 rounded-lg text-sm text-sky-200 min-h-[2.5rem] flex items-center"
                                    >
                                        {prompt || "No prompt set"}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Raw Data Toggle */}
                        <div className="mb-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setShowRawData(!showRawData)}
                                className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-300 transition-colors"
                                disabled={isSaved}
                            >
                                {showRawData ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                {showRawData ? "Hide" : "Show"} Raw Data
                            </motion.button>
                            
                            <AnimatePresence>
                                {showRawData && (
                                    <motion.textarea
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        value={JSON.stringify(asset, null, 2)}
                                        readOnly
                                        rows={6}
                                        className="w-full mt-2 px-3 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-xs text-gray-300 font-mono resize-none focus:outline-none"
                                    />
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 justify-end">
                            <AssetAnalysisSave
                                setShowSimilarModal={setShowSimilarModal}
                                setIsSaving={setIsSaving}
                                setSaveError={setSaveError}
                                setShowSuccess={handleSaveSuccess}
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
                    </div>
                )}

                {/* Full Card Image Overlay - shows when saved */}
                <AnimatePresence>
                    {generatedImage && isSaved && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute inset-0 z-40"
                        >
                            <div className="relative w-full h-full">
                                <Image
                                    src={generatedImage}
                                    alt={asset.name}
                                    className="w-full h-full object-cover rounded-xl"
                                />
                                
                                {/* Gradient overlay for text readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                
                                {/* Asset info overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold mb-1">{asset.name}</h3>
                                            <p className="text-sm text-gray-200 opacity-90 line-clamp-2">{asset.description}</p>
                                        </div>
                                        
                                        {/* Saved indicator */}
                                        <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 backdrop-blur rounded-md border border-green-500/30">
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                <Save className="h-4 w-4 text-green-400" />
                                            </motion.div>
                                            <span className="text-xs text-green-300 font-medium">Saved</span>
                                        </div>
                                    </div>
                                    
                                    {/* Type badge */}
                                    <div className="mt-2">
                                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium ${typeStyles.badge}`}>
                                            <span>{asset.type}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Loading Overlay for Generation */}
                <AnimatePresence>
                    {isGenerating && (
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
                    {genError && !isGenerating && (
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
            </motion.div>

            <AssetsSimilarModal
                showSimilarModal={showSimilarModal}
                similarAssets={similarAssets}
                setShowSimilarModal={setShowSimilarModal}
                setIsSaving={setIsSaving}
                setSaveError={setSaveError}
                setShowSuccess={setShowSuccess}
                handleAssetGeneration={handleRetryGeneration}
                asset={asset}
                descriptionVector={descriptionVector}
            />
        </>
    );
}

export default AssetAnalysisResultItem;