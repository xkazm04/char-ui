import { motion } from "framer-motion";
import { ImageIcon, Info, X } from "lucide-react";

type Props = {
    createdDate: string;
    showInfo: boolean;
    setShowInfo: (show: boolean) => void;
    onClose: () => void;
}

const CharModalHeader = ({createdDate, showInfo, setShowInfo, onClose}: Props) => {
    return <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4"
    >
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <ImageIcon className="h-6 w-6 text-sky-400" />
                <div>
                    <p className="text-sm text-gray-400">{createdDate}</p>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title={'Show assets info'}
                    onClick={(e) => { e.stopPropagation(); setShowInfo(!showInfo); }}
                    className={`p-2 cursor-pointer rounded-lg transition-colors ${showInfo ? 'bg-sky-500/20 text-sky-400' : 'bg-gray-800/50 text-gray-400 hover:text-white'
                        }`}
                >
                    <Info size={20} />
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title={'Close'}
                    onClick={(e) => { e.stopPropagation(); onClose(); }}
                    className="p-2 cursor-pointer bg-gray-800/50 text-gray-400 hover:text-white rounded-lg transition-colors"
                >
                    <X size={20} />
                </motion.button>
            </div>
        </div>
    </motion.div>
}

export default CharModalHeader;