import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon, CheckCircle, AlertCircle } from "lucide-react";

type Props = {
    showSuccessIndicator: boolean;
    isUpdating: boolean;
    updateError: Error | null;
    genValue: string;
    setGenValue: (value: string) => void;
    hasChanges: boolean;
}

const AssetModalContentGen = ({ showSuccessIndicator, isUpdating, updateError, genValue, setGenValue, hasChanges }: Props) => {
    const getBorderColor = () => {
        if (updateError) return 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50';
        if (showSuccessIndicator) return 'border-sky-500/50 focus:border-sky-500 focus:ring-sky-500/50';
        if (hasChanges && isUpdating) return 'border-orange-500/50 focus:border-orange-500 focus:ring-orange-500/50';
        if (hasChanges) return 'border-orange-500/50 focus:border-orange-500 focus:ring-orange-500/50';
        return 'border-gray-600/50 focus:border-blue-500/50 focus:ring-blue-500/50';
    };
    return <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <ImageIcon className="h-4 w-4" />
            Generation Details
            <AnimatePresence mode="wait">
                {isUpdating && (
                    <motion.div
                        key="saving"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-1 text-xs px-2 py-1 bg-orange-500/20 text-orange-300 rounded-full border border-orange-500/30"
                    >
                        <div className="w-2 h-2 border border-orange-300 border-t-transparent rounded-full animate-spin" />
                        Saving...
                    </motion.div>
                )}
                {showSuccessIndicator && !isUpdating && (
                    <motion.div
                        key="saved"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-1 text-xs px-2 py-1 bg-sky-500/20 text-sky-300 rounded-full border border-sky-500/30"
                    >
                        <CheckCircle className="w-3 h-3" />
                        Saved
                    </motion.div>
                )}
                {updateError && !isUpdating && (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-1 text-xs px-2 py-1 bg-red-500/20 text-red-300 rounded-full border border-red-500/30"
                    >
                        <AlertCircle className="w-3 h-3" />
                        Save failed
                    </motion.div>
                )}
            </AnimatePresence>
        </label>
        <div className="relative">
            <motion.textarea
                value={genValue}
                onChange={(e) => setGenValue(e.target.value)}
                className={`w-full min-h-[100px] p-3 bg-gray-800/50 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all resize-none text-sm ${getBorderColor()}`}
                placeholder="Add generation details..."
                animate={{
                    borderColor: showSuccessIndicator ? '#0ea5e9' :
                        updateError ? '#ef4444' :
                            hasChanges ? '#f97316' : '#6b7280'
                }}
                transition={{ duration: 0.2 }}
            />

            {/* Error message */}
            {updateError && (
                <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-xs text-red-400"
                >
                    Failed to save: {updateError.message}
                </motion.p>
            )}
        </div>
    </div>
}

export default AssetModalContentGen;