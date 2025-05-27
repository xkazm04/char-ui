import { useAllAssets } from "@/app/functions/assetFns";
import { handleAssetGenerationAndSave } from "@/app/functions/leoFns";
import { useNavStore } from "@/app/store/navStore";
import { AssetType, SimilarAsset } from "@/app/types/asset";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, Shield, Zap, Search, CheckCircle } from "lucide-react";
import AssetSimilarItemCard from "./AssetsSimilarItemCard";
import { useState, useMemo } from "react";
import ActionButton from "@/app/components/ui/Buttons/ActionButton";
import { ModalBase, ModalHeader, ModalContent, ModalActions } from "@/app/components/ui/modal";

type Props = {
    showSimilarModal: boolean;
    similarAssets: SimilarAsset[];
    setShowSimilarModal: (show: boolean) => void;
    setIsSaving: (saving: boolean) => void;
    setSaveError: (error: boolean) => void;
    setShowSuccess: (show: boolean) => void;
    asset: AssetType;
    descriptionVector?: number[] | null;
    handleAssetGeneration: () => void;
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
    handleAssetGeneration
}: Props) => {
    const { setAssetNavHighlighted } = useNavStore();
    const { refetch } = useAllAssets();
    const [isSaving, setLocalSaving] = useState(false);
    const [searchFilter, setSearchFilter] = useState("");

    // Filter similar assets based on search
    const filteredSimilarAssets = useMemo(() => {
        if (!searchFilter) return similarAssets;
        return similarAssets.filter(similar =>
            similar.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
            similar.description?.toLowerCase().includes(searchFilter.toLowerCase())
        );
    }, [similarAssets, searchFilter]);

    // Calculate average similarity
    const averageSimilarity = useMemo(() => {
        if (!similarAssets.length) return 0;
        return Math.round(similarAssets.reduce((sum, asset) => sum + asset.similarity, 0) / similarAssets.length);
    }, [similarAssets]);

    const handleConfirmSave = async () => {
        setLocalSaving(true);
        setShowSimilarModal(false);
        setIsSaving(true);
        setSaveError(false);

        try {
            const assetToSave = {
                type: asset.type,
                name: asset.name,
                gen: asset.gen,
                description: asset.description,
                description_vector: descriptionVector || [],
            };

            await handleAssetGenerationAndSave({
                prompt: asset.gen,
                generationId: null,
                setGenerationId: () => { },
                setGenError: (error) => setSaveError(error),
                setIsGenerating: setIsSaving,
                setGeneratedImage: () => { },
                //@ts-expect-error Ignore
                asset: assetToSave,
                setSavedAssetId: () => { }
            });

            setIsSaving(false);
            setLocalSaving(false);
            setShowSuccess(true);
            setAssetNavHighlighted(true);
            refetch();

            setTimeout(() => {
                setShowSuccess(false);
                handleAssetGeneration();
            }, 2000);
        } catch (error) {
            console.error('Error saving asset:', error);
            setIsSaving(false);
            setLocalSaving(false);
            setSaveError(true);
        }
    };

    const getSimilarityColor = (similarity: number) => {
        if (similarity >= 90) return "text-red-400 bg-red-500/10 border-red-500/20";
        if (similarity >= 75) return "text-orange-400 bg-orange-500/10 border-orange-500/20";
        if (similarity >= 60) return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
        return "text-green-400 bg-green-500/10 border-green-500/20";
    };

    const getSimilarityIcon = (similarity: number) => {
        if (similarity >= 90) return AlertTriangle;
        if (similarity >= 75) return Shield;
        return CheckCircle;
    };

    return (
        <ModalBase 
            isOpen={showSimilarModal}
            onClose={() => setShowSimilarModal(false)}
            size="xl"
        >
            <ModalHeader 
                title="Similar Assets Detected"
                subtitle="Review existing assets before saving"
                icon={
                    <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <AlertTriangle className="h-6 w-6 text-orange-400" />
                    </motion.div>
                }
            />

            {/* Stats Bar */}
            <div className="px-6 py-4 bg-gray-800/30 border-b border-gray-700/30">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Search className="h-4 w-4 text-sky-400" />
                            <span className="text-sm text-gray-300">
                                <span className="font-semibold text-white">{similarAssets.length}</span> similar asset{similarAssets.length !== 1 ? 's' : ''} found
                            </span>
                        </div>
                        <div className={`px-2 py-1 rounded-md border text-xs font-medium ${getSimilarityColor(averageSimilarity)}`}>
                            {averageSimilarity}% avg similarity
                        </div>
                    </div>
                </div>
            </div>

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
                        const SimilarityIcon = getSimilarityIcon(similar.similarity);
                        return (
                            <motion.div
                                key={similar.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="relative group"
                            >
                                <div className={`absolute -top-2 -right-2 z-10 px-2 py-1 rounded-full border text-xs font-bold flex items-center gap-1 ${getSimilarityColor(similar.similarity)}`}>
                                    <SimilarityIcon className="h-3 w-3" />
                                    {Math.round(similar.similarity)}%
                                </div>
                                <AssetSimilarItemCard similar={similar} />
                            </motion.div>
                        );
                    })}
                </motion.div>

                {filteredSimilarAssets.length === 0 && searchFilter && (
                    <div className="text-center py-8 text-gray-400">
                        <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No assets match your search</p>
                    </div>
                )}

                {/* Warning Message */}
                <div className="mt-6 p-4 bg-orange-500/5 border border-orange-500/20 rounded-lg">
                    <div className="flex items-start gap-3">
                        <div className="p-1 bg-orange-500/10 rounded border border-orange-500/20 mt-0.5">
                            <AlertTriangle className="h-4 w-4 text-orange-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-orange-300 font-medium mb-1">Potential Duplicate Content</p>
                            <p className="text-xs text-orange-200/80 leading-relaxed">
                                The assets above share similar characteristics with your new asset.
                                Consider if this content already exists before proceeding.
                            </p>
                        </div>
                    </div>
                </div>
            </ModalContent>

            <ModalActions align="between">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowSimilarModal(false)}
                    className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white rounded-lg border border-gray-600/30 transition-all"
                    disabled={isSaving}
                >
                    Cancel
                </motion.button>
                <ActionButton
                    onClick={handleConfirmSave}
                    disabled={isSaving}
                >
                    <>
                        {isSaving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Zap className="h-4 w-4" />
                                Save Anyway
                                <ArrowRight className="h-4 w-4" />
                            </>
                        )}
                    </>
                </ActionButton>
            </ModalActions>
        </ModalBase>
    );
}

export default AssetsSimilarModal;