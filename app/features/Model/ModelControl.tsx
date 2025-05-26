
import { motion } from "framer-motion";
import { useCallback } from "react";
import { RotateCcw, Download } from "lucide-react";

type Props = {
    modelUrl: string | null;
    getModelData?: { format?: string };
    gen: { _id: string };
    selectedVariant: string;
    setSelectedVariant: (variant: string) => void;
    variants: string[];
    setShowFloor: (show: boolean) => void;
    setAutoRotate: (rotate: boolean) => void;
}

const ModelControl = ({modelUrl, getModelData, gen, selectedVariant,
     setSelectedVariant, variants, setShowFloor, setAutoRotate}: Props) => {

    const handleDownload = useCallback(async () => {
        if (!modelUrl) return;

        try {
            const response = await fetch(modelUrl);
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            const format = getModelData?.format || 'glb';
            link.download = `character-model-${gen._id}.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('Failed to download model:', error);
        }
    }, [modelUrl, getModelData?.format, gen._id]);

    const handleReset = useCallback(() => {
        setSelectedVariant('Default');
        setShowFloor(true);
        setAutoRotate(false);
        //eslint-disable-next-line no-console
    }, []);

    return <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
    >
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Variants:</span>
                {variants.map((variant) => (
                    <motion.button
                        key={variant}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedVariant(variant);
                        }}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${selectedVariant === variant
                            ? 'bg-sky-500 text-white'
                            : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                            }`}
                    >
                        {variant}
                    </motion.button>
                ))}
            </div>

            <div className="flex items-center space-x-2">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); handleReset(); }}
                    className="p-2 bg-gray-800/50 text-gray-400 hover:text-white rounded-lg transition-colors"
                    title="Reset view"
                >
                    <RotateCcw size={20} />
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); handleDownload(); }}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                    <Download size={20} />
                    <span>Download 3D Model</span>
                </motion.button>
            </div>
        </div>

        <div className="text-xs text-gray-500 text-center">
            Use mouse to rotate • Scroll to zoom • Press <kbd className="px-1 py-0.5 bg-gray-800 rounded">R</kbd> for auto-rotate • <kbd className="px-1 py-0.5 bg-gray-800 rounded">F</kbd> to toggle floor
        </div>
    </motion.div>
}

export default ModelControl;