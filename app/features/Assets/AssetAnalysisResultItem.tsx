import { X, Loader2, CheckCheck } from "lucide-react";
import { motion } from "framer-motion";
import { fadeEffect } from "@/app/components/anim/variants";
import { useState } from "react";
import Image from "next/image";

import AssetsSimilarModal from "./AssetsSimilarModal";
import { AssetType, SimilarAsset } from "@/app/types/asset";
import AssetAnalysisSave from "./AssetAnalysisSave";

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
    
    const handleRemove = (idx: number) => {
        if (tab === "openai") {
            setOpenaiList((prev) => prev.filter((_, i) => i !== idx));
        } else if (tab === "gemini") {
            setGeminiList((prev) => prev.filter((_, i) => i !== idx));
        } else if (tab === "groq") {
            setGroqList((prev) => prev.filter((_, i) => i !== idx));
        }
    };

    const handleAssetGeneration = () => {
        setIsGenerating(true);
        setTimeout(() => {
            try {
                setGeneratedImage('https://cdn.leonardo.ai/users/65d71243-f7c2-4204-a1b3-433aaf62da5b/generations/36ed4b36-e156-430a-95e4-a2001d818609/variations/Default_a_masterpiece_rough_color_pencil_sketch_of_A_mesmerizi_0_36ed4b36-e156-430a-95e4-a2001d818609_0.png');
            } catch (error) {
                console.error(`Error generating asset for ${asset.name}:`, error);
            } finally {
                setIsGenerating(false);
            }
        }, 10000);
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
                {isGenerating && (
                    <div className="absolute inset-0 bg-black/70 z-20 rounded-lg flex items-center justify-center">
                        <div className="animate-pulse absolute left-2 top-2 text-green-600 text-sm z-30 italic">Image saved, generating asset preview...</div>
                        <Loader2 className="h-10 w-10 text-sky-400 animate-spin" />
                    </div>
                )}
                
                {/* Display generated image if available */}
                {!isGenerating && generatedImage && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 bg-black/80 z-30 rounded-lg flex items-center justify-center p-4">
                        <div className="absolute top-2 left-2 text-green-600 text-sm z-30"><CheckCheck/></div>
                        <div className="relative w-full h-full">
                            <Image 
                                src={generatedImage}
                                alt={`Generated ${asset.name}`}
                                fill
                                className="object-contain rounded"
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
                        <span className="font-semibold">Gen:</span> {asset.gen}
                    </div>
                    <textarea
                        value={JSON.stringify(asset, null, 2)}
                        readOnly
                        rows={4}
                        className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-xs text-gray-200 font-mono mt-2 outline-none focus:ring focus:ring-sky-500"
                    />
                </div>
                <div className="flex gap-2 mt-2 justify-end">
                    <AssetAnalysisSave
                        setShowSimilarModal={setShowSimilarModal}
                        setIsSaving={setIsSaving}
                        setSaveError={setSaveError}
                        setShowSuccess={setShowSuccess}
                        handleAssetGeneration={handleAssetGeneration}
                        setDescriptionVector={setDescriptionVector}
                        setSimilarAssets={setSimilarAssets}
                        showSuccess={showSuccess}
                        saveError={saveError}
                        isGenerating={isGenerating}
                        isSaving={isSaving}
                        asset={asset}
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
                handleAssetGeneration={handleAssetGeneration}
                asset={asset}
                descriptionVector={descriptionVector}
                />
        </>
    );
}

export default AssetAnalysisResultItem;