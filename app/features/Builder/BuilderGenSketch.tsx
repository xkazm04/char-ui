import { LucideSparkles, Palette } from "lucide-react";
import { m } from "framer-motion";
import { handleCharacterSketch } from "@/app/functions/leoFns";
import { useAssetStore } from "@/app/store/assetStore";
import { useState, useRef, useEffect } from "react";
import { useCharacterStore } from "@/app/store/charStore";
import { useGenerations } from "@/app/functions/genFns";
import { IMAGE_STYLES, type ImageStyle } from "@/app/constants/imageStyles";
import { StylePickerModal } from "@/app/components/ui/modal";
import { usePromptStore } from "@/app/store/promptStore";
import BuilderGenErr from "./BuilderGenErr";

type Props = {
    isGenerating: boolean;
    setIsGenerating: (generating: boolean) => void;
    hasAnyAssets: boolean;
}

const BuilderGenSketch = ({isGenerating, setIsGenerating, hasAnyAssets}: Props) => {
    const { getAllSelectedAssets, getPromptByCategory } = useAssetStore()
    const [ genError, setGenError ] = useState<boolean>(false)
    const [generationId, setGenerationId] = useState<string | null>(null);
    const { promptLimit} = usePromptStore() 
    const [selectedStyle, setSelectedStyle] = useState<ImageStyle>(IMAGE_STYLES[0]);
    const [preset, setPreset] = useState<string>('');
    const [isStylePickerOpen, setIsStylePickerOpen] = useState<boolean>(false);
    const { currentCharacter } = useCharacterStore()
    const { refetch } = useGenerations({
        limit: 50, 
        characterId: currentCharacter?.id || '',
    });

    const generateButtonRef = useRef<HTMLButtonElement>(null);

    const charPrompt = currentCharacter?.description

    const bodyPrompt = getPromptByCategory('Body')
    const clothingPrompt = getPromptByCategory('Clothing')
    const backgroundPrompt = getPromptByCategory('Background')
    const equipmentPrompt = getPromptByCategory('Equipment')

    const headPrompt = bodyPrompt || currentCharacter?.default_facial || ''
    const finalClothingPrompt = clothingPrompt || currentCharacter?.default_clothing || ''
    const bgPrompt = backgroundPrompt || "Person standing in the dark with black background."
    const equipPrompt = equipmentPrompt || ''

    const fullPrompt = bgPrompt + ". " + charPrompt + ". " + headPrompt + ". " + finalClothingPrompt + " Equiped with " + equipPrompt;
    const isOverLimit = promptLimit && fullPrompt.length > promptLimit;

    // Debug logging to check conditions
    useEffect(() => {
        console.log('Error conditions:', { genError, isOverLimit, promptLimit, promptLength: fullPrompt.length });
    }, [genError, isOverLimit, promptLimit, fullPrompt.length]);

    const handleStyleSelect = (style: ImageStyle) => {
        setSelectedStyle(style);
        setPreset(style.preset || '');
    };

    const handleGenerate = async () => {
        const selectedAssets = getAllSelectedAssets();
        
        console.log("Selected assets for generation:", selectedAssets);
        
        handleCharacterSketch({
            prompt: fullPrompt,
            element: currentCharacter?.element, 
            character_id: currentCharacter?.id,
            used_assets: selectedAssets,
            weight: preset ? 0.5 : 0.8,
            preset: preset,
            generationId,
            setGenerationId,
            setGenError,
            setIsGenerating,
            onSuccess: () => {
                refetch();
            }
        });
    };

    const canGenerate = hasAnyAssets && !isGenerating && !isOverLimit;

    // Test function to trigger errors for debugging
    const triggerTestError = () => {
        setGenError(true);
        setTimeout(() => setGenError(false), 3000);
    };

    return (
        <>
            <div className="flex items-center gap-3">
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
                    ref={generateButtonRef}
                    whileHover={{ scale: canGenerate ? 1.03 : 1 }}
                    whileTap={{ scale: canGenerate ? 0.97 : 1 }}
                    disabled={!canGenerate}
                    onClick={handleGenerate}
                    onDoubleClick={triggerTestError} // Double-click to test tooltip
                    className={`px-4 py-2 rounded-md text-sm flex items-center transition-all duration-200 relative
                        ${genError || isOverLimit ? 'border border-red-500/50 shadow-red-500/20 shadow-lg' : ''}
                        ${canGenerate
                        ? 'bg-gradient-to-r from-sky-700 to-sky-600 hover:from-sky-600 hover:to-sky-500 text-white shadow-lg hover:shadow-xl'
                        : 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
                        }`}
                    aria-label="Generate character sketch"
                    title={`Prompt length: ${fullPrompt.length}${promptLimit ? ` / ${promptLimit}` : ''}`}
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
                            {(genError || isOverLimit) && (
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

            {(genError || isOverLimit) && (
                <BuilderGenErr 
                    genError={genError}
                    // @ts-expect-error Ignore
                    isOverLimit={isOverLimit} targetRef={generateButtonRef}
                />
            )}

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