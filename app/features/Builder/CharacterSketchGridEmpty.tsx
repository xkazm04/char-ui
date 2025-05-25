import { useNavStore } from "@/app/store/navStore";
import { motion } from "framer-motion";
import { Sparkles, LucideImages } from "lucide-react";

const CharacterSketchGridEmpty = () => {
    const { assetNavExpanded, setAssetNavExpanded } = useNavStore();
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-950/20 via-sky-950/10 to-gray-950/20 rounded-lg border border-dashed border-sky-900/50 backdrop-blur-sm"
        >
            <div className="text-center p-8 max-w-md">
                <motion.div
                    className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-sky-900/30 to-gray-900/30 rounded-full flex items-center justify-center"
                    animate={{
                        scale: [1, 1.05, 1],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <Sparkles className="h-10 w-10 text-sky-400" />
                </motion.div>
                <h3 className="text-2xl font-semibold text-sky-200 mb-3">Generate character variation image</h3>
                <p className="text-gray-400 mb-8 leading-relaxed">
                    Select assets from your collection and generate unique character sketches. Watch your imagination come to life!
                </p>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-1 bg-gradient-to-r from-sky-600/80 to-sky-700 rounded-lg cursor-pointer
            transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-gray-950 text-white font-medium"
                    onClick={() => setAssetNavExpanded(!assetNavExpanded)}
                >
                    <span className="flex items-center gap-2">
                        <LucideImages className="h-5 w-5" />
                        Browse Assets
                    </span>
                </motion.button>
            </div>
        </motion.div>
    );
}

export default CharacterSketchGridEmpty;