import { getSimilarityColor } from "@/app/helpers/assetHelpers";
import { SimilarAsset } from "@/app/types/asset";
import { Search, Database, Brain, TrendingUp } from "lucide-react";

type Props = {
    similarityStats: {
        openai: {
            avg: number;
            max: number;
        };
        mongo: {
            avg: number;
            max: number;
        };
        hasMongoData: boolean;
    };
    similarAssets: SimilarAsset[]; 
}

const SimilarStats = ({similarityStats, similarAssets}: Props) => {
    const SimilarityBadge = ({
        similarity,
        type,
        icon: Icon,
        label
    }: {
        similarity: number;
        type: 'openai' | 'mongo';
        icon: any;
        label: string;
    }) => (
        <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium ${getSimilarityColor(similarity)}`}>
            <Icon className="h-3.5 w-3.5" />
            <span className="font-semibold">{similarity}%</span>
            <span className="text-xs opacity-80">{label}</span>
        </div>
    );


    return <div className="px-6 py-4 bg-gray-800/30 border-b border-gray-700/30">
        <div className="space-y-3">
            {/* Search Method Indicator */}
            <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs font-medium ${similarityStats.hasMongoData
                    ? 'text-blue-400 bg-blue-500/10 border-blue-500/20'
                    : 'text-gray-400 bg-gray-500/10 border-gray-500/20'
                    }`}>
                    <Database className="h-3 w-3" />
                    <span>{similarityStats.hasMongoData ? 'Hybrid Search' : 'Standard Search'}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Search className="h-3 w-3" />
                    <span>{similarAssets.length} asset{similarAssets.length !== 1 ? 's' : ''} found</span>
                </div>
            </div>

            {/* Similarity Comparison */}
            <div className="flex items-center gap-3 flex-wrap">
                {/* OpenAI Similarity */}
                <SimilarityBadge
                    similarity={similarityStats.openai.avg}
                    type="openai"
                    icon={Brain}
                    label="OpenAI Avg"
                />

                {/* MongoDB Similarity (if available) */}
                {similarityStats.hasMongoData && (
                    <>
                        <div className="text-gray-500 text-xs">vs</div>
                        <SimilarityBadge
                            similarity={similarityStats.mongo.avg}
                            type="mongo"
                            icon={Database}
                            label="Atlas Avg"
                        />
                    </>
                )}

                {/* Highest Match Indicator */}
                <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded-lg text-xs font-medium text-purple-400">
                    <TrendingUp className="h-3 w-3" />
                    <span>Max: {Math.max(similarityStats.openai.max, similarityStats.mongo.max)}%</span>
                </div>
            </div>
        </div>
    </div>
}

export default SimilarStats;