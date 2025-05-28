import { getSimilarityColor } from "@/app/helpers/assetHelpers";
import { motion } from "framer-motion";
import { AlertTriangle, Shield, CheckCircle, Database, Brain } from "lucide-react";
import SimilarItemCard from "./SimilarItemCard";
import { SimilarAsset } from "@/app/types/asset";

type Props = {
    similar: SimilarAsset;
    index: number;
}

const SimilarItem = ({similar, index}: Props) => {
    const openaiSimilarity = Math.round(similar.similarity * 100);
    const mongoSimilarity = similar.similarity_mongo ? Math.round(similar.similarity_mongo * 100) : null;
    const primarySimilarity = mongoSimilarity || openaiSimilarity;
    

    const getSimilarityIcon = (similarity: number) => {
        if (similarity >= 90) return AlertTriangle;
        if (similarity >= 75) return Shield;
        return CheckCircle;
    };

    const SimilarityIcon = getSimilarityIcon(primarySimilarity);


    return (
        <motion.div
            key={similar.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="relative group"
        >
            {/* Enhanced Similarity Badge with Dual Scores */}
            <div className="absolute -top-3 -right-3 z-10 space-y-1">
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-bold ${getSimilarityColor(primarySimilarity)}`}>
                    <SimilarityIcon className="h-3 w-3" />
                    <span>{primarySimilarity}%</span>
                    {mongoSimilarity && <Database className="h-2.5 w-2.5 opacity-60" />}
                    {!mongoSimilarity && <Brain className="h-2.5 w-2.5 opacity-60" />}
                </div>

                {/* Secondary Score (if both available) */}
                {mongoSimilarity && openaiSimilarity !== mongoSimilarity && (
                    <div className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-700/80 backdrop-blur border border-gray-600/30 rounded-full text-xs">
                        <Brain className="h-2.5 w-2.5 text-gray-400" />
                        <span className="text-gray-300 font-medium">{openaiSimilarity}%</span>
                    </div>
                )}
            </div>

            <SimilarItemCard similar={similar} />
        </motion.div>
    );
}

export default SimilarItem;