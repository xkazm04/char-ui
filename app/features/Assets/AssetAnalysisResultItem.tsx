import { X, Loader2, CheckCheck, RefreshCw, AlertCircle, Edit } from "lucide-react";
import { motion } from "framer-motion";
import { fadeEffect } from "@/app/components/anim/variants";
import { useState } from "react";
import Image from "next/image";
import AssetsSimilarModal from "./AssetsSimilarModal";
import { AssetType, SimilarAsset } from "@/app/types/asset";
import AssetAnalysisSave from "./AssetAnalysisSave";
import { handleAssetGeneration, handleAssetGenerationAndSave } from "@/app/functions/leoFns";
import { useAllAssets } from "@/app/functions/assetFns";

type Props = {
    asset: AssetType
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
    const { refetch } = useAllAssets();
    const [prompt, setPrompt] = useState<string>(asset.gen || "");

    const handleRemove = (idx: number) => {
        if (tab === "openai") {
            setOpenaiList((prev) => prev.filter((_, i) => i !== idx));
        } else if (tab === "gemini") {
            setGeminiList((prev) => prev.filter((_, i) => i !== idx));
        } else if (tab === "groq") {
            setGroqList((prev) => prev.filter((_, i) => i !== idx));
        }
    };

    const handleRetryGeneration = async () => {
        setGeneratedImage(null);
        setGenError(false);

        try {
            setIsGenerating(true);

            if (savedAssetId) {
                const assetToSave = {
                    ...asset,
                    description_vector: descriptionVector || []
                };

                console.log("Regenerating with asset:", assetToSave);

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
                refetch()
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
                refetch()
            }
        } catch (error) {
            console.error("Error in retry generation:", error);
            setGenError(true);
            setIsGenerating(false);
        }
    };

    return (
        <>
            <motion.div
                key={`asset-${asset.name}-${idx}`}
                layout="position"
                variants={fadeEffect}
                initial="initial"
                animate="animate"
                exit="exit"
                className="bg-gray-700 rounded-lg p-4 border border-gray-600 relative flex flex-col justify-between
                overflow-visible hover:shadow-md hover:shadow-sky-900/20 transition-shadow duration-300 z-10"
            >
                {/* Loading state */}
                {isGenerating && (
                    <div className="absolute inset-0 bg-black/70 z-20 rounded-lg flex items-center justify-center">
                        <div className="animate-pulse absolut right-2 top-2 text-green-500 text-sm z-30 italic">
                            {generationId ? 'Regenerating asset preview...' : 'Saved, generating preview..'}
                        </div>
                        <Loader2 className="h-10 w-10 text-sky-400 animate-spin" />
                    </div>
                )}

                {/* Error state */}
                {genError && !isGenerating && (
                    <div className="absolute inset-0 bg-black/80 z-30 rounded-lg flex flex-col items-center justify-center p-4">
                        <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
                        <p className="text-red-300 mb-4 text-center">Failed to generate image</p>
                        <button
                            onClick={() => handleRetryGeneration()}
                            className="px-3 py-2 bg-red-900/40 hover:bg-red-900/60 rounded text-white flex items-center"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Try Again
                        </button>
                    </div>
                )}

                {/* Display generated image if available */}
                {!isGenerating && generatedImage && !genError && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 bg-black/80 z-30 rounded-lg flex items-center justify-center p-4"
                    >
                        <div className="absolute top-2 left-2 text-green-600 text-sm z-30">
                            <CheckCheck />
                        </div>

                        {/* Retry button */}
                        <button
                            onClick={handleRetryGeneration}
                            className="absolute top-2 right-2 p-1 bg-sky-900/80 cursor-pointer hover:bg-sky-800/80 rounded z-40 transition-colors"
                            title="Generate new variation"
                        >
                            <RefreshCw className="h-4 w-4 text-sky-300" />
                        </button>

                        {/* Image display - Now supporting both URLs and our MongoDB image endpoint */}
                        <div className="relative w-full h-full">
                            <Image
                                src={generatedImage}
                                alt={asset.name}
                                fill
                                className="object-cover rounded"
                                key={generatedImage} // Add key to force refresh when URL changes
                            />
                        </div>
                    </motion.div>
                )}

                <div>
                    <span className="absolute top-2 right-2 bg-sky-900/20 border border-gray-400/20 text-white text-xs px-3 py-1 rounded-full font-semibold z-10">
                        {asset.type}
                    </span>
                    <div className="font-bold text-white mb-1">{asset.name}</div>
                    <div className="text-gray-300 text-sm mb-2">{asset.description}</div>
                    <div className="text-xs text-gray-400 mb-1">
                        {!editGen ? 
                        <div className="">
                            <div>
                                <span>Image preview prompt:</span>
                                <button
                                    title="Edit generation prompt"
                                    onClick={() => setEditGen(true)}
                                    className="text-sky-500 hover:underline ml-1"
                                ><Edit size={14}/></button>
                            </div>
                            <span className="text-sky-200">{asset.gen}</span>
                        </div>
                            :
                            <textarea
                                className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-xs text-gray-200 font-mono mt-1 outline-none focus:ring focus:ring-sky-500"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            />
                        }
                    </div>
                    <textarea
                        value={JSON.stringify(asset, null, 2)}
                        readOnly
                        rows={6}
                        className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-xs text-gray-200 font-mono mt-2 outline-none focus:ring focus:ring-sky-500"
                    />
                </div>
                <div className="flex gap-2 mt-2 justify-end">
                    <AssetAnalysisSave
                        setShowSimilarModal={setShowSimilarModal}
                        setIsSaving={setIsSaving}
                        setSaveError={setSaveError}
                        setShowSuccess={setShowSuccess}
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
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRemove(idx)}
                        className="p-1 rounded-lg hover:bg-red-700/40 transition-colors duration-200 cursor-pointer"
                        title="Remove"
                        disabled={isGenerating}
                    >
                        <X className="h-4 w-4 text-red-400" />
                    </motion.button>
                </div>
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