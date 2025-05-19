import { LucideSparkles } from "lucide-react";
import { m } from "framer-motion";
import { handleCharacterSketch } from "@/app/functions/leoFns";
import { useAssetStore } from "@/app/store/assetStore";
import { useState } from "react";

type Props = {
    isGenerating: boolean;
    setIsGenerating: (generating: boolean) => void;
    hasAnyAssets: boolean;
}

const BuilderGenSketch = ({isGenerating, setIsGenerating, hasAnyAssets}: Props) => {
    const { assetPrompt } = useAssetStore()
    const [ genError, setGenError ] = useState<boolean>(false)

    const handleGenerate = async () => {
        handleCharacterSketch({
            prompt: assetPrompt || "wooden sword",
            element: 67297, // hardcoded for now,
            setGenerationId: () => {console.log("Generation ID set, but not used in this component")},
            setGenError,
            setIsGenerating,
            setGeneratedImage: () => {console.log("Generated image set, but not used in this component")}
        });
    };
    return <>
        <m.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={!hasAnyAssets || isGenerating}
            onClick={handleGenerate}
            className={`px-3 py-1 rounded-md text-sm flex items-center ${genError && 'border border-red-500'}
                ${hasAnyAssets && !isGenerating
                ? 'bg-gradient-to-r from-sky-700 to-sky-600 hover:from-sky-500 hover:to-sky-500 text-white shadow-md'
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
                </>
            )}
        </m.button>
    </>
}

export default BuilderGenSketch;