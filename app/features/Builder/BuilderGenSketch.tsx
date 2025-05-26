import { LucideSparkles, Palette, AlertTriangle } from "lucide-react";
import { m } from "framer-motion";
import { handleCharacterSketch } from "@/app/functions/leoFns";
import { useAssetStore } from "@/app/store/assetStore";
import { useState } from "react";
import { useCharacterStore } from "@/app/store/charStore";
import { useGenerations } from "@/app/functions/genFns";
import { IMAGE_STYLES, type ImageStyle } from "@/app/constants/imageStyles";
import { StylePickerModal } from "@/app/components/ui/modal";
import { usePromptStore } from "@/app/store/promptStore";

type Props = {
    isGenerating: boolean;
    setIsGenerating: (generating: boolean) => void;
    hasAnyAssets: boolean;
}

const BuilderGenSketch = ({isGenerating, setIsGenerating, hasAnyAssets}: Props) => {
    const { assetPrompt, getAllSelectedAssets } = useAssetStore()
    const [ genError, setGenError ] = useState<boolean>(false)
    const [generationId, setGenerationId] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const {stylePrompt, setStylePrompt, promptLimit} = usePromptStore() 
    const [selectedStyle, setSelectedStyle] = useState<ImageStyle>(IMAGE_STYLES[0]);
    const [isStylePickerOpen, setIsStylePickerOpen] = useState<boolean>(false);
    const { currentCharacter } = useCharacterStore()
    const { refetch } = useGenerations({
        limit: 50, 
        characterId: currentCharacter?.id || '',
    });

    const char = currentCharacter?.description || ''
    const fullPrompt = char + assetPrompt  + stylePrompt;
    const isOverLimit = promptLimit && fullPrompt.length > promptLimit;

    const handleStyleSelect = (style: ImageStyle) => {
        setSelectedStyle(style);
        setStylePrompt(style.prompt);
    };

    const handleGenerate = async () => {
        // Get all selected assets from the store
        const selectedAssets = getAllSelectedAssets();
        
        console.log("Selected assets for generation:", selectedAssets);
        
        handleCharacterSketch({
            prompt: fullPrompt,
            element: currentCharacter?.element, 
            character_id: currentCharacter?.id,
            used_assets: selectedAssets, // Pass the selected assets
            generationId,
            setGenerationId,
            setGenError,
            setIsGenerating,
            setGeneratedImage,
            onSuccess: () => {
                refetch();
            }
        });
    };

    const canGenerate = hasAnyAssets && !isGenerating && !isOverLimit;

    return (
        <>
            <div className="flex items-center gap-3">
                {genError && 
                    <m.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }} 
                        className="text-red-400/50">
                        Processing error - service down
                    </m.div>
                }

                {/* Prompt limit warning */}
                {isOverLimit && 
                    <m.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center gap-1 text-red-400/80 text-sm"
                    >
                        <AlertTriangle className="w-4 h-4" />
                        <span>Prompt too long</span>
                    </m.div>
                }
                
                {/* Style Picker Button */}
                <m.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsStylePickerOpen(true)}
                    className="px-3 py-2 rounded-md text-sm flex items-center bg-gray-800/90 hover:bg-gray-700/90 text-gray-300 border border-gray-600/50 hover:border-gray-500/50 transition-colors"
                    aria-label="Select art style"
                >
                    <Palette className="mr-2 h-4 w-4" />
                    <span className="mr-1">{selectedStyle.icon}</span>
                    <span>{selectedStyle.name}</span>
                </m.button>

                {/* Generate Button */}
                <m.button
                    whileHover={{ scale: canGenerate ? 1.03 : 1 }}
                    whileTap={{ scale: canGenerate ? 0.97 : 1 }}
                    disabled={!canGenerate}
                    onClick={handleGenerate}
                    className={`px-4 py-2 rounded-md text-sm flex items-center transition-all duration-200 relative
                        ${genError || isOverLimit ? 'border border-red-500' : ''}
                        ${canGenerate
                        ? 'bg-gradient-to-r from-sky-700 to-sky-600 hover:from-sky-600 hover:to-sky-500 text-white shadow-lg hover:shadow-xl'
                        : 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
                        }`}
                    aria-label="Generate character sketch"
                >
                    {isGenerating ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Generating...
                        </>
                    ) : (
                        <>
                            <LucideSparkles className="mr-2 h-4 w-4" />
                            Generate
                            {isOverLimit && (
                                <m.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.2, delay: 0.1 }}
                                    className="absolute -top-1 -right-1"
                                >
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                </m.div>
                            )}
                        </>
                    )}
                </m.button>
            </div>

            <StylePickerModal
                isOpen={isStylePickerOpen}
                selectedStyle={selectedStyle}
                onStyleSelect={handleStyleSelect}
                onClose={() => setIsStylePickerOpen(false)}
            />
        </>
    );
}

export default BuilderGenSketch;