import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";
import Image from "next/image";
import CharacterCardOverlay from "./CharacterCardOverlay";
import { useState } from "react";
import ModelViewer from "../Model/ModelViewer";
import { UsedAssets } from "@/app/types/gen";

type Props = {
    gen: {
        image_url: string;
        created_at?: string;
    };
    is3DMode: boolean;
    modelGenerated: boolean;
    modelUrl: string | null;
    showDetails: boolean;
    usedAssets?: UsedAssets[];
    isHovered: boolean;
    handleShowDetails: () => void;
}

const CharacterSketchCardContent = ({is3DMode, gen, modelGenerated, modelUrl, showDetails, usedAssets, isHovered, handleShowDetails}: Props) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const createdDate = new Date(gen.created_at || Date.now()).toLocaleDateString();

    const getModelData = () => {
        if (!modelUrl) return null;

        return {
            id: "character-model",
            name: "Character Model",
            path: modelUrl,
            format: "glb" as const,
        };
    };

        const modelData = getModelData() || {
        id: "character-model",
        name: "Character Model",
        path: "/models/jinx.glb",
        format: "glb" as const,
    };

    return <>
        <div className="relative w-full h-full overflow-hidden rounded-xl">
            <AnimatePresence mode="wait">
                {is3DMode && modelGenerated ? (
                    <motion.div
                        key="3d-view"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute inset-0"
                    >
                        <ModelViewer
                            models={[modelData]}
                            variants={['Default', 'Wireframe']}
                            defaultModel={modelData.id}
                            defaultVariant="Default"
                        />
                        <div className="absolute top-2 left-2 px-2 py-1 bg-gray-600/80 rounded-md text-xs text-white font-medium">
                            3D
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="2d-view"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute inset-0"
                    >
                        {!imageLoaded && !imageError && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
                                <div className="w-8 h-8 border-2 border-sky-500 rounded-full animate-spin border-t-transparent"></div>
                            </div>
                        )}

                        {imageError ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 text-gray-400">
                                <div className="text-center">
                                    <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-xs">Failed to load</p>
                                </div>
                            </div>
                        ) : (
                            <Image
                                src={gen.image_url}
                                alt="Character sketch"
                                fill
                                sizes="(max-width: 768px) 100vw, 33vw"
                                className={`object-cover transition-all duration-300 ${isHovered ? 'scale-105' : 'scale-100'
                                    }`}
                                onLoad={() => setImageLoaded(true)}
                                onError={() => setImageError(true)}
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Used assets detail overlay */}
            <AnimatePresence>
                {showDetails && (
                    <CharacterCardOverlay
                        usedAssets={usedAssets}
                        handleShowDetails={handleShowDetails}
                    />
                )}
            </AnimatePresence>

            {/* Bottom Gradient Overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent pointer-events-none" />

            {/* Stats Overlay */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{
                    opacity: isHovered ? 1 : 0,
                    y: isHovered ? 0 : 10
                }}
                className="absolute bottom-3 left-3 right-3"
            >
                <div className="flex items-center justify-between text-xs text-gray-300">
                    <span className="text-gray-400">{createdDate}</span>
                </div>
            </motion.div>
        </div>
    </>
}

export default CharacterSketchCardContent;