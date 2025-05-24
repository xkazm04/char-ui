import { AnimatePresence, motion } from "framer-motion";

type Props = {
    log: {
        output: string;
        timestamp: string;
    };
    logIndex: number;
    expandedCell: { logIndex: number } | null;
    setExpandedCell: (cell: { logIndex: number } | null) => void;
}

const CooksLogItemOutput = ({ log, expandedCell, setExpandedCell, logIndex}: Props) => {

    const truncateText = (text: string) => {
        const maxLength = {
            sm: 30,
            md: 60,
            lg: 120
        };

        return text.length > maxLength.lg
            ? <>
                <span className="hidden lg:inline">{text.substring(0, maxLength.lg)}...</span>
                <span className="hidden md:inline lg:hidden">{text.substring(0, maxLength.md)}...</span>
                <span className="inline md:hidden">{text.substring(0, maxLength.sm)}...</span>
            </>
            : text;
    };

    return <AnimatePresence mode="wait">
        {expandedCell?.logIndex === logIndex ? (
            <motion.div
                key="expanded"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
                className="relative"
            >
                <div className="whitespace-pre-wrap break-words max-h-80 overflow-y-auto pr-8 p-3 bg-gray-800/50 rounded-lg border border-gray-600/30">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        {log.output}
                    </motion.div>
                </div>
                <motion.button
                    className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full p-1.5 shadow-lg"
                    onClick={(e) => {
                        e.stopPropagation();
                        setExpandedCell(null);
                    }}
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </motion.button>
            </motion.div>
        ) : (
            <motion.div
                key="collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between group"
            >
                <span className="truncate flex-1 pr-2">{truncateText(log.output)}</span>
                <motion.div
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
}

export default CooksLogItemOutput;