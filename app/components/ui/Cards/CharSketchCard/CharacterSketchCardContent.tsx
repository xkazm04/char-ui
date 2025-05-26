import { motion, AnimatePresence } from "framer-motion";
import { Zap, AlertCircle } from "lucide-react";
import Image from "next/image";
import CharacterSketchCardOverlay from "./CharacterSketchCardOverlay";
import { useState, useMemo } from "react";
import ModelViewer from "../../../../features/Model/ModelViewer";
import { UsedAssets } from "@/app/types/gen";

type Props = {
    gen: {
        _id: string;
        image_url: string;
        created_at?: string;
        meshy?: {
            meshy_id: string;
            glb_url?: string;
            fbx_url?: string;
            obj_url?: string;
            thumbnail_url?: string;
            texture_prompt?: string;
            texture_urls?: Array<{
                base_color?: string;
                metallic?: string;
                normal?: string;
                roughness?: string;
            }>;
            task_error?: any;
            status?: string;
        };
    };
    is3DMode: boolean;
    modelUrl: string | null;
    showDetails: boolean;
    usedAssets?: UsedAssets[];
    isHovered: boolean;
    handleShowDetails: () => void;
}

const CharacterSketchCardContent = ({
    is3DMode, 
    gen,  
    modelUrl, 
    showDetails, 
    usedAssets, 
    isHovered, 
    handleShowDetails
}: Props) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const createdDate = new Date(gen.created_at || Date.now()).toLocaleDateString();

    // Check if we have meshy data and use it
    const has3DModel = useMemo(() => {
        return !!(gen.meshy?.glb_url || gen.meshy?.fbx_url || gen.meshy?.obj_url || modelUrl);
    }, [gen.meshy?.glb_url, gen.meshy?.fbx_url, gen.meshy?.obj_url, modelUrl]);

    const getModelData = useMemo(() => {
        if (!has3DModel) return null;

        // Try different formats in order of preference: GLB -> FBX -> OBJ -> fallback
        let modelPath = gen.meshy?.glb_url || modelUrl;
        let format: "glb" | "fbx" | "obj" = "glb";

        if (!modelPath && gen.meshy?.fbx_url) {
            modelPath = gen.meshy.fbx_url;
            format = "fbx";
        }

        if (!modelPath && gen.meshy?.obj_url) {
            modelPath = gen.meshy.obj_url;
            format = "obj";
        }

        if (!modelPath) return null;

        console.log(`Using ${format} model:`, modelPath);

        return {
            id: `character-model-${gen._id}`,
            name: "Character Model",
            path: modelPath,
            format,
        };
    }, [has3DModel, gen.meshy?.glb_url, gen.meshy?.fbx_url, gen.meshy?.obj_url, modelUrl, gen._id]);

    const meshyStatus = gen.meshy?.status || 'unknown';
    const hasError = gen.meshy?.task_error;

    return (
        <div className="relative w-full h-full overflow-hidden rounded-xl">
            <AnimatePresence mode="wait">
                {is3DMode && has3DModel && getModelData ? (
                    <motion.div
                        key="3d-view"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute inset-0"
                    >
                        <ModelViewer
                            models={[getModelData]}
                            variants={['Default', 'Wireframe']}
                            defaultModel={getModelData.id}
                            defaultVariant="Default"
                        />
                        
                        {/* Status indicators */}
                        <div className="absolute top-2 left-2 px-2 py-1 bg-green-600/80 rounded-md text-xs text-white font-medium">
                            3D Model ({getModelData.format.toUpperCase()})
                        </div>
                        
                        {gen.meshy?.thumbnail_url && (
                            <div className="absolute bottom-2 right-2 px-2 py-1 bg-gray-900/80 rounded-md text-xs text-gray-300">
                                Meshy AI
                            </div>
                        )}

                        {/* Error overlay */}
                        {hasError && (
                            <div className="absolute inset-0 flex items-center justify-center bg-red-900/50 backdrop-blur-sm">
                                <div className="text-center p-4 bg-gray-900/80 rounded-lg">
                                    <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-400" />
                                    <p className="text-xs text-red-300">Model Load Error</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {typeof hasError === 'string' ? hasError : 'Failed to load 3D model'}
                                    </p>
                                </div>
                            </div>
                        )}
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
                                    <p className="text-xs">Failed to load image</p>
                                </div>
                            </div>
                        ) : (
                            <Image
                                src={gen.image_url}
                                alt="Character sketch"
                                fill
                                sizes="(max-width: 768px) 100vw, 33vw"
                                className={`object-cover transition-all duration-300 ${
                                    isHovered ? 'scale-105' : 'scale-100'
                                }`}
                                onLoad={() => setImageLoaded(true)}
                                onError={() => setImageError(true)}
                            />
                        )}

                        {/* 3D Model Available Indicator */}
                        {has3DModel && (
                            <div className="absolute top-2 right-2 px-2 py-1 bg-green-600/80 rounded-md text-xs text-white font-medium">
                                3D Available
                            </div>
                        )}

                        {/* Processing indicator */}
                        {gen.meshy?.meshy_id && meshyStatus === 'processing' && (
                            <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-600/80 rounded-md text-xs text-white font-medium">
                                3D Processing...
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Used assets detail overlay */}
            <AnimatePresence>
                {showDetails && (
                    <CharacterSketchCardOverlay
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
                    {has3DModel && (
                        <span className="text-green-400 text-xs">
                            3D Ready ({getModelData?.format.toUpperCase()})
                        </span>
                    )}
                    {gen.meshy?.meshy_id && meshyStatus === 'processing' && (
                        <span className="text-yellow-400 text-xs">3D Processing</span>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default CharacterSketchCardContent;