import { motion } from "framer-motion";
import { X, Settings, Grid3X3 } from "lucide-react";

type Props = {
    createdDate: string;
    getModelData: { format?: string };
    onClose: () => void;
    showSettings: boolean;
    setShowSettings: (show: boolean) => void;
}

const ModelHeader = ({createdDate, getModelData, onClose, showSettings, setShowSettings}: Props) => {
    return <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4"
    >
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <Grid3X3 className="h-6 w-6 text-sky-400" />
                <div>
                    <h2 className="text-lg font-semibold text-white">3D Character Model</h2>
                    <p className="text-sm text-gray-400">{createdDate} • {getModelData.format.toUpperCase()}</p>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }}
                    className={`p-2 rounded-lg transition-colors ${showSettings ? 'bg-sky-500/20 text-sky-400' : 'bg-gray-800/50 text-gray-400 hover:text-white'
                        }`}
                >
                    <Settings size={20} />
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); onClose(); }}
                    className="p-2 bg-gray-800/50 text-gray-400 hover:text-white rounded-lg transition-colors"
                >
                    <X size={20} />
                </motion.button>
            </div>
        </div>
    </motion.div>
}

export default ModelHeader;