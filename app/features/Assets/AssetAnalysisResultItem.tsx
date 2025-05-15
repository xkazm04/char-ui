import { Save, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { fadeEffect } from "@/app/components/anim/variants";
import { Asset } from "./AssetAnalysisResult";

type Props = {
    asset: Asset
    idx: number;
    setOpenaiList: (list: Asset[]) => void;
    setGeminiList: (list: Asset[]) => void;
    setGroqList: (list: Asset[]) => void; 
    tab: "groq" | "openai" | "gemini";
}

const AssetAnalysisResultItem = ({ asset, idx, setOpenaiList, setGeminiList, setGroqList, tab }: Props) => {
    const handleRemove = (idx: number) => {
        if (tab === "openai") {
            setOpenaiList((prev) => prev.filter((_, i) => i !== idx));
        } else if (tab === "gemini") {
            setGeminiList((prev) => prev.filter((_, i) => i !== idx));
        } else if (tab === "groq") {
            setGroqList((prev) => prev.filter((_, i) => i !== idx));
        }
    };

    return <>
        <motion.div
            key={asset.name + idx}
            layout
            variants={fadeEffect}
            initial="initial"
            animate="animate"
            exit="exit"
            className="bg-gray-700 rounded-lg p-4 border border-gray-600 relative overflow-visible hover:shadow-md hover:shadow-sky-900/20 transition-shadow duration-300"
        >
            {/* Category Tag */}
            <span className="absolute top-2 right-2 bg-sky-600 text-white text-xs px-3 py-1 rounded-full shadow font-semibold z-10">
                {asset.category}
            </span>
            <div className="font-bold text-white mb-1">{asset.name}</div>
            <div className="text-gray-300 mb-2">{asset.description}</div>
            <div className="text-xs text-gray-400 mb-1">
                <span className="font-semibold">Gen:</span> {asset.gen}
            </div>
            <textarea
                value={JSON.stringify(asset, null, 2)}
                readOnly
                rows={4}
                className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-xs text-gray-200 font-mono mt-2"
            />
            {/* Action Buttons */}
            <div className="flex gap-2 mt-2">
                <button
                    className="p-1.5 rounded hover:bg-sky-700/40 transition-colors"
                    title="Save (coming soon)"
                    disabled
                >
                    <Save className="h-4 w-4 text-sky-400" />
                </button>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRemove(idx)}
                    className="p-1.5 rounded hover:bg-red-700/40 transition-colors"
                    title="Remove"
                >
                    <Trash2 className="h-4 w-4 text-red-400" />
                </motion.button>
            </div>
        </motion.div>
    </>
}

export default AssetAnalysisResultItem;