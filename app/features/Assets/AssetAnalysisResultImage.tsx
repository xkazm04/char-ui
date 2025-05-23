import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCheck, RefreshCw, ImageIcon } from "lucide-react"

type Props = {
    generatedImage: string | null
    genError: boolean
    asset: {
        name: string
    }
    handleRetryGeneration: () => void
    isSaving: boolean
    showSuccess: boolean
    isGenerating: boolean
}

const AssetAnalysisResultImage = ({ generatedImage, genError, asset, handleRetryGeneration, isSaving, showSuccess, isGenerating }: Props) => {
    return (
        <div className="relative mx-4 mb-4 max-w-[300px] max-h-[300px] h-[300px]">
            <AnimatePresence>
                {generatedImage && !genError ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative w-full h-full rounded-lg overflow-hidden bg-gray-900/50"
                    >
                        <Image
                            src={generatedImage}
                            alt={asset.name}
                            fill
                            className="object-cover"
                            key={generatedImage}
                            sizes="192px"
                        />

                        {/* Success Badge - smaller */}
                        <div className="absolute top-1.5 left-1.5 flex items-center gap-1 px-1.5 py-0.5 bg-green-500/20 backdrop-blur rounded text-xs">
                            <CheckCheck className="h-2.5 w-2.5 text-green-400" />
                            <span className="text-xs text-green-300 font-medium">Generated</span>
                        </div>

                        {/* Regenerate Button - smaller */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleRetryGeneration}
                            className="absolute top-1.5 right-1.5 p-1 bg-sky-500/20 hover:bg-sky-500/30 backdrop-blur rounded border border-sky-400/30 text-sky-300 transition-all"
                            title="Generate new variation"
                        >
                            <RefreshCw className="h-3 w-3" />
                        </motion.button>

                        {/* Save Progress Overlay */}
                        <AnimatePresence>
                            {(isSaving || showSuccess) && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center"
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="w-8 h-8 border-3 border-sky-500/30 rounded-full">
                                                <div className="w-8 h-8 border-3 border-sky-500 rounded-full animate-spin border-t-transparent absolute"></div>
                                            </div>
                                            <motion.p
                                                className="mt-2 text-xs text-sky-300 font-medium text-center"
                                                animate={{ opacity: [0.5, 1, 0.5] }}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                            >
                                                Saving...
                                            </motion.p>
                                        </>
                                    ) : (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="flex flex-col items-center"
                                        >
                                            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30">
                                                <CheckCheck className="h-4 w-4 text-green-400" />
                                            </div>
                                            <p className="mt-2 text-xs text-green-300 font-medium">Saved!</p>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Image Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                    </motion.div>
                ) : !isGenerating && !genError && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full h-full rounded-lg bg-gray-800/30 border border-gray-700/30 flex flex-col items-center justify-center text-gray-500"
                    >
                        <ImageIcon className="h-6 w-6 mb-1" />
                        <p className="text-xs text-center px-2">No preview, save to generate one.</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default AssetAnalysisResultImage;