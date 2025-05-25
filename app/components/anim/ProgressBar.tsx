import { motion } from "framer-motion";

type Props = {
    progress: number;
}
export const ProgressBar = ({ progress }: Props) => (
    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-800">
        <motion.div
            className="h-full bg-gradient-to-r from-sky-500 to-indigo-600"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
        />
    </div>
);
export const ProgressBarTexted = () => {
    return <>
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 py-3 bg-gradient-to-r from-sky-900/20 to-gray-900/20 border-b border-sky-900/20"
        >
            <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-sky-400 rounded-full animate-spin border-t-transparent"></div>
                <span className="text-sm text-sky-300">Generating character variation...</span>
                <span className="text-gray-500 italic text-xs">(est. 20s)</span>
                <div className="flex-1 bg-gray-700/50 rounded-full h-1 overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-sky-500 to-gray-200"
                        animate={{ width: ['0%', '100%'] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>
            </div>
        </motion.div>
    </>
}