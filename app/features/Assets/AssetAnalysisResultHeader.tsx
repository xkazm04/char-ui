import { motion } from "framer-motion"
import { Sparkles, X } from "lucide-react"

type Props = {
    asset: {
        name: string;
        description: string;
        type: string;
    };
    isGenerating: boolean;
    typeStyles: {
        badge: string;
    };
    handleRemove: (index: number) => void;
    idx: number;
}
const AssetAnalysisResultHeader = ({asset, isGenerating, typeStyles, handleRemove, idx}: Props) => {
    
    return <>
        <div className="relative p-4 pb-2 z-10">
            <div className="flex items-start justify-between mb-3">
                <motion.div
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${typeStyles.badge}`}
                    whileHover={{ scale: 1.05 }}
                >
                    <Sparkles className="h-3 w-3" />
                    {asset.type}
                </motion.div>

                <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRemove(idx)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 transition-all"
                    title="Remove asset"
                    disabled={isGenerating}
                >
                    <X className="h-4 w-4" />
                </motion.button>
            </div>

            {/* Asset Title */}
            <motion.h3
                className="text-lg font-bold text-white mb-2 group-hover:text-sky-200 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                {asset.name}
            </motion.h3>

            {/* Description */}
            <motion.p
                className="text-sm text-gray-300 mb-3 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                {asset.description}
            </motion.p>
        </div>
    </>
}

export default AssetAnalysisResultHeader