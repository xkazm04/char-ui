import { motion } from "framer-motion";
import { ZoomIn, RotateCcw, ZoomOut, Download } from "lucide-react";

type Props = {
    handleZoomOut: () => void;
    handleZoomIn: () => void;
    handleReset: () => void;
    handleDownload: () => void;
    zoom: number;
}

const CharModalControls = ({handleZoomOut, handleZoomIn, handleReset, handleDownload, zoom}: Props) => {
    return <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
    >
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
                    className="p-2 bg-gray-800/50 text-gray-400 hover:text-white rounded-lg transition-colors"
                    disabled={zoom <= 0.1}
                >
                    <ZoomOut size={20} />
                </motion.button>

                <span className="text-sm text-gray-400 min-w-[60px] text-center">
                    {Math.round(zoom * 100)}%
                </span>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
                    className="p-2 bg-gray-800/50 text-gray-400 hover:text-white rounded-lg transition-colors"
                    disabled={zoom >= 5}
                >
                    <ZoomIn size={20} />
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); handleReset(); }}
                    className="p-2 bg-gray-800/50 text-gray-400 hover:text-white rounded-lg transition-colors"
                >
                    <RotateCcw size={20} />
                </motion.button>
            </div>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); handleDownload(); }}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
                <Download size={20} />
                <span>Download</span>
            </motion.button>
        </div>

        <div className="mt-2 text-xs text-gray-500 text-center">
            Use mouse wheel to zoom • Drag to pan • Press <kbd className="px-1 py-0.5 bg-gray-800 rounded">Esc</kbd> to close
        </div>
    </motion.div>
}

export default CharModalControls;