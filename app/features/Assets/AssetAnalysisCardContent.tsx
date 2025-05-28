import { Wand2, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { AssetType } from "@/app/types/asset";

type Props = {
    asset: AssetType;
    prompt: string;
    setPrompt: (prompt: string) => void;
    isSaved: boolean;
}

const AssetAnalysisCardContent = ({
    asset,
    prompt,
    setPrompt,
    isSaved,
}: Props) => {
    const [isEditing, setIsEditing] = useState(false);
    const [showRawData, setShowRawData] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.focus();
            const len = textareaRef.current.value.length;
            textareaRef.current.setSelectionRange(len, len);
        }
    }, [isEditing]);

    const handlePromptClick = () => {
        if (!isSaved) {
            setIsEditing(true);
        }
    };

    const handlePromptBlur = () => {
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            setIsEditing(false);
        } else if (e.key === 'Escape') {
            setIsEditing(false);
        }
    };

    return (
        <div className="px-4 pb-4 flex-1 relative z-10">
            <div className="mb-4">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center gap-1 mb-2">
                    <Wand2 className="h-3 w-3" />
                    Generation Prompt
                </label>
                <div
                    className={`relative group ${!isSaved ? 'cursor-text' : 'cursor-default'}`}
                    onClick={handlePromptClick}
                >
                    <TextareaAutosize
                        ref={textareaRef}
                        className="w-full px-3 py-2 bg-gray-800/50 border-1 focus:border-sky-500/80 border-sky-500/20 rounded-lg text-sm text-gray-200 resize-none focus:outline-none focus:ring-0.5 focus:ring-sky-500/20 transition-all"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onBlur={handlePromptBlur}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter generation prompt..."
                    />
                </div>
            </div>

            {/* Raw Data Toggle */}
            <div className="mb-4">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setShowRawData(!showRawData)}
                    className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-300 transition-colors"
                    disabled={isSaved}
                >
                    {showRawData ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    {showRawData ? "Hide" : "Show"} Raw Data
                </motion.button>

                <AnimatePresence>
                    {showRawData && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <TextareaAutosize
                                value={JSON.stringify(asset, null, 2)}
                                readOnly
                                minRows={6}
                                maxRows={12}
                                className="w-full mt-2 px-3 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-xs text-gray-300 font-mono resize-none focus:outline-none"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>


        </div>
    );
};

export default AssetAnalysisCardContent;