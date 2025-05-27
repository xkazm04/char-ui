
import { motion } from "framer-motion";
import { useCallback } from "react";
import { Download, BoxIcon } from "lucide-react";

type Props = {
    modelUrl: string | null;
    getModelData?: { format?: string };
    gen: { _id: string };
}

const ModelControl = ({modelUrl, getModelData, gen}: Props) => {

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


    return <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
    >
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
                 <BoxIcon />
            </div>

            <div className="flex items-center space-x-2">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); handleDownload(); }}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                    <Download size={20} />
                    <span>Download .glb</span>
                </motion.button>
            </div>
        </div>

        <div className="text-xs text-gray-500 text-center">
            Use mouse to rotate • Scroll to zoom • Press <kbd className="px-1 py-0.5 bg-gray-800 rounded">R</kbd> for auto-rotate
        </div>
    </motion.div>
}

export default ModelControl;