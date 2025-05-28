import { AssetType, SimilarAsset } from "@/app/types/asset";
import { motion } from "framer-motion";
import { AlertTriangle, Search, Database, Brain } from "lucide-react";
import { useState, useMemo } from "react";
import { ModalBase, ModalHeader, ModalContent } from "@/app/components/ui/modal";
import SimilarStats from "./AssetsSimilar/SimilarStats";
import SimilarItem from "./AssetsSimilar/SimilarItem";
import SimilarFooter from "./AssetsSimilar/SimilarFooter";

type Props = {
    showSimilarModal: boolean;
    similarAssets: SimilarAsset[];
    setShowSimilarModal: (show: boolean) => void;
    setIsSaving: (saving: boolean) => void;
    setSaveError: (error: boolean) => void;
    setShowSuccess: (show: boolean) => void;
    asset: AssetType;
    descriptionVector?: number[] | null;
    setGeneratedImage?: (url: string | null) => void;
    prompt?: string;
}

const AssetsSimilarModal = ({
    showSimilarModal,
    similarAssets,
    setShowSimilarModal,
    setIsSaving,
    setSaveError,
    setShowSuccess,
    asset,
    descriptionVector,
    setGeneratedImage,
    prompt
}: Props) => {

    const [searchFilter, setSearchFilter] = useState("");
    
    const filteredSimilarAssets = useMemo(() => {
        if (!searchFilter) return similarAssets;
        return similarAssets.filter(similar =>
            similar.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
            similar.description?.toLowerCase().includes(searchFilter.toLowerCase())
        );
    }, [similarAssets, searchFilter]);

    // Calculate statistics for both similarity scores
    const similarityStats = useMemo(() => {
        if (!similarAssets.length) return { 
            openai: { avg: 0, max: 0 }, 
            mongo: { avg: 0, max: 0 },
            hasMongoData: false 
        };
        
        const openaiSimilarities = similarAssets.map(asset => asset.similarity * 100);
        const mongoSimilarities = similarAssets
            .filter(asset => asset.similarity_mongo !== undefined)
            .map(asset => asset.similarity_mongo! * 100);
        
        const hasMongoData = mongoSimilarities.length > 0;
        
        return {
            openai: {
                avg: Math.round(openaiSimilarities.reduce((sum, val) => sum + val, 0) / openaiSimilarities.length),
                max: Math.round(Math.max(...openaiSimilarities))
            },
            mongo: hasMongoData ? {
                avg: Math.round(mongoSimilarities.reduce((sum, val) => sum + val, 0) / mongoSimilarities.length),
                max: Math.round(Math.max(...mongoSimilarities))
            } : { avg: 0, max: 0 },
            hasMongoData
        };
    }, [similarAssets]);


    return (
        <ModalBase 
            isOpen={showSimilarModal}
            onClose={() => setShowSimilarModal(false)}
            size="xl"
        >
            <ModalHeader 
                title="Similar Assets Detected"
                subtitle={`Found ${similarAssets.length} similar asset${similarAssets.length !== 1 ? 's' : ''} using ${similarityStats.hasMongoData ? 'hybrid validation' : 'OpenAI similarity'}`}
                icon={
                    <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <AlertTriangle className="h-6 w-6 text-orange-400" />
                    </motion.div>
                }
            />

            {/* Enhanced Stats Bar with Dual Similarity */}
            <SimilarStats
                similarityStats={similarityStats}
                similarAssets={similarAssets}
            />

            {/* Search Filter */}
            {similarAssets.length > 3 && (
                <div className="px-6 pt-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Filter similar assets..."
                            value={searchFilter}
                            onChange={(e) => setSearchFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all"
                        />
                    </div>
                </div>
            )}

            <ModalContent>
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    {filteredSimilarAssets.map((similar, index) => {
                        return <SimilarItem
                            key={similar.id}
                            similar={similar}
                            index={index}
                        />
                    })}
                </motion.div>

                {filteredSimilarAssets.length === 0 && searchFilter && (
                    <div className="text-center py-8 text-gray-400">
                        <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No assets match your search</p>
                    </div>
                )}

                {/* Enhanced Warning Message */}
                <div className="mt-6 p-4 bg-orange-500/5 border border-orange-500/20 rounded-lg">
                    <div className="flex items-start gap-3">
                        <div className="p-1 bg-orange-500/10 rounded border border-orange-500/20 mt-0.5">
                            <AlertTriangle className="h-4 w-4 text-orange-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-orange-300 font-medium mb-1">Potential Duplicate Content</p>
                            <p className="text-xs text-orange-200/80 leading-relaxed">
                                {similarityStats.hasMongoData 
                                    ? 'Our hybrid validation system found similar assets using both MongoDB Atlas Vector Search and OpenAI similarity analysis.' 
                                    : 'Similar assets were found using OpenAI similarity analysis.'
                                } Consider if this content already exists before proceeding.
                            </p>
                            {similarityStats.hasMongoData && (
                                <div className="mt-2 flex items-center gap-4 text-xs">
                                    <div className="flex items-center gap-1 text-blue-300">
                                        <Database className="h-3 w-3" />
                                        <span>Atlas Search: More precise vector matching</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-purple-300">
                                        <Brain className="h-3 w-3" />
                                        <span>OpenAI: Semantic understanding</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </ModalContent>

            <SimilarFooter
                asset={asset}
                setIsSaving={setIsSaving}
                setSaveError={setSaveError}
                setShowSimilarModal={setShowSimilarModal}
                setShowSuccess={setShowSuccess}
                descriptionVector={descriptionVector}
                setGeneratedImage={setGeneratedImage}
                prompt={prompt}
            />
        </ModalBase>
    );
}

export default AssetsSimilarModal;