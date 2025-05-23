import { ProgressBar } from '@/app/components/anim/ProgressBar';
import { motion } from 'framer-motion';
import { Loader2, Box, ArrowLeftRight, RefreshCcw } from 'lucide-react';

type Props = {
    generationError: string | null;
    modelGenerated: boolean;
    isGenerating: boolean;
    is3DMode: boolean;
    handleGenerate3D: (e: React.MouseEvent) => void;
    handleToggle3D: (e: React.MouseEvent) => void;
    progress: number;
}

const CharacterGenerate3d = ({generationError, modelGenerated, isGenerating, is3DMode, handleGenerate3D, handleToggle3D, progress }: Props) => {

    return <>
        <div className="flex space-x-1">
            {generationError &&
                <motion.div
                    title="Credits for 3D generation depleted"
                    className="text-red-200"
                >
                    ERR
                </motion.div>}
            {!modelGenerated ? (
                <motion.button
                    whileHover={{ scale: 1.25 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-2 py-1 text-sky-500/90 rounded cursor-pointer
                      shadow-lg hover:text-yellow-400 transition-colors flex items-center space-x-1`}
                    onClick={handleGenerate3D}
                    disabled={isGenerating}
                    title="Generate 3D model"
                    aria-label="Generate 3D model"
                >
                    {isGenerating ? (
                        <>
                            <Loader2 size={16} className="animate-spin mr-1" />
                        </>
                    ) : (
                        <div
                            title={'Generated 3D model'}
                            className="flex items-center space-x-1">
                            {!generationError ? <Box size={18} /> : <RefreshCcw size={18} />}

                        </div>
                    )}
                </motion.button>
            ) : (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-2 py-1 text-xs font-medium rounded shadow-lg flex items-center space-x-1 ${is3DMode
                        ? 'text-yellow-500/90 hover:text-yellow-400'
                        : 'bg-gray-700/90 text-gray-100 hover:bg-gray-600'
                        }`}
                    onClick={handleToggle3D}
                    title={is3DMode ? "Show 2D image" : "Show 3D model"}
                    aria-label={is3DMode ? "Show 2D image" : "Show 3D model"}
                >
                    <ArrowLeftRight size={16} />
                </motion.button>
            )}
        </div>
        {isGenerating && <ProgressBar progress={progress} />}
    </>
}

export default CharacterGenerate3d;