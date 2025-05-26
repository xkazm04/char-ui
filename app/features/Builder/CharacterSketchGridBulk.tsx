import { motion } from "framer-motion";
import { Download, Trash2, X } from "lucide-react";
import { useState, useCallback } from "react";
import { downloadMultipleImages } from "@/app/utils/downloadHelpers";
import { useGenerations, useDeleteGeneration } from "@/app/functions/genFns";
import ConfirmationModal from "@/app/components/ui/modal/ConfirmationModal";

type Props = {
    selectedSketches: Set<string>;
    setSelectedSketches: (sketches: Set<string>) => void;
    characterId?: string;
}

const CharacterSketchGridBulk = ({ selectedSketches, setSelectedSketches, characterId }: Props) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState({ current: 0, total: 0 });
    const [deleteProgress, setDeleteProgress] = useState({ current: 0, total: 0 });
    
    const { data: sketches } = useGenerations({
        limit: 50,
        characterId: characterId || '',
    });

    const deleteGeneration = useDeleteGeneration();
    const selectedSketchesData = sketches?.filter(sketch => selectedSketches.has(sketch._id)) || [];

    const handleBulkDownload = useCallback(async () => {
        if (selectedSketchesData.length === 0) return;

        setIsDownloading(true);
        setDownloadProgress({ current: 0, total: selectedSketchesData.length });

        try {
            const imagesToDownload = selectedSketchesData.map((sketch, index) => ({
                url: sketch.image_url,
                filename: `character-sketch-${sketch._id}-${index + 1}.png`
            }));

            await downloadMultipleImages(
                imagesToDownload,
                (downloaded, total) => {
                    setDownloadProgress({ current: downloaded, total });
                }
            );

            // Clear selection after successful download
            setSelectedSketches(new Set());
        } catch (error) {
            console.error('Bulk download failed:', error);
        } finally {
            setIsDownloading(false);
            setDownloadProgress({ current: 0, total: 0 });
        }
    }, [selectedSketchesData, setSelectedSketches]);

    const handleBulkDelete = useCallback(async () => {
        if (selectedSketchesData.length === 0) return;

        setIsDeleting(true);
        setDeleteProgress({ current: 0, total: selectedSketchesData.length });

        try {
            // Process deletions sequentially with progress tracking
            let completed = 0;
            for (const sketch of selectedSketchesData) {
                try {
                    await deleteGeneration.mutateAsync(sketch._id);
                    completed++;
                    setDeleteProgress({ current: completed, total: selectedSketchesData.length });
                } catch (error) {
                    console.error(`Failed to delete sketch ${sketch._id}:`, error);
                    // Continue with other deletions even if one fails
                    completed++;
                    setDeleteProgress({ current: completed, total: selectedSketchesData.length });
                }
            }

            // Clear selection after deletion attempts
            setSelectedSketches(new Set());
            setShowDeleteConfirm(false);
        } catch (error) {
            console.error('Bulk delete failed:', error);
        } finally {
            setIsDeleting(false);
            setDeleteProgress({ current: 0, total: 0 });
        }
    }, [selectedSketchesData, setSelectedSketches, deleteGeneration]);

    const handleDeleteClick = useCallback(() => {
        setShowDeleteConfirm(true);
    }, []);

    const handleDeleteCancel = useCallback(() => {
        setShowDeleteConfirm(false);
    }, []);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="p-4 bg-gradient-to-r from-sky-900/30 to-gray-900/30 border-t border-sky-900/30 backdrop-blur"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <span className="text-sm text-sky-300">
                            {selectedSketches.size} sketch{selectedSketches.size !== 1 ? 'es' : ''} selected
                        </span>
                        
                        {/* Progress indicators */}
                        {isDownloading && (
                            <div className="flex items-center space-x-2 text-xs text-gray-400">
                                <div className="w-4 h-4 border-2 border-sky-500 rounded-full animate-spin border-t-transparent"></div>
                                <span>Downloading {downloadProgress.current}/{downloadProgress.total}</span>
                            </div>
                        )}
                        
                        {isDeleting && (
                            <div className="flex items-center space-x-2 text-xs text-gray-400">
                                <div className="w-4 h-4 border-2 border-red-500 rounded-full animate-spin border-t-transparent"></div>
                                <span>Deleting {deleteProgress.current}/{deleteProgress.total}</span>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex gap-2">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleBulkDownload}
                            disabled={isDownloading || isDeleting || selectedSketches.size === 0}
                            className="flex items-center gap-2 px-4 py-2 bg-sky-600/80 hover:bg-sky-600 cursor-pointer disabled:bg-gray-600/50 disabled:cursor-not-allowed rounded-md text-sm text-white transition-colors"
                        >
                            <Download className="h-4 w-4" />
                            {isDownloading ? 'Downloading...' : 'Download'}
                        </motion.button>
                        
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleDeleteClick}
                            disabled={isDownloading || isDeleting || selectedSketches.size === 0}
                            className="flex items-center text-red-500/80 gap-2 px-4 py-2 border border-red-600/20 hover:border-red-600 hover:text-red-600
                             disabled:bg-gray-600/50 disabled:cursor-not-allowed rounded-md text-sm transition-colors cursor-pointer"
                        >
                            <X className="h-4 w-4" />
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </motion.button>
                        
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedSketches(new Set())}
                            disabled={isDownloading || isDeleting}
                            className="px-4 py-2 bg-gray-600/80 hover:bg-gray-600 disabled:bg-gray-600/50 disabled:cursor-not-allowed rounded-md text-sm text-white transition-colors"
                        >
                            Clear
                        </motion.button>
                    </div>
                </div>
                
                {/* Progress bar for downloads */}
                {isDownloading && downloadProgress.total > 0 && (
                    <div className="mt-3">
                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-sky-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${(downloadProgress.current / downloadProgress.total) * 100}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    </div>
                )}
                
                {/* Progress bar for deletions */}
                {isDeleting && deleteProgress.total > 0 && (
                    <div className="mt-3">
                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-red-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${(deleteProgress.current / deleteProgress.total) * 100}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={showDeleteConfirm}
                title="Delete Selected Sketches"
                message={`Are you sure you want to delete ${selectedSketches.size} selected sketch${selectedSketches.size !== 1 ? 'es' : ''}? This action cannot be undone.`}
                confirmText="Delete All"
                cancelText="Cancel"
                onConfirm={handleBulkDelete}
                onCancel={handleDeleteCancel}
                isLoading={isDeleting}
                variant="danger"
            />
        </>
    );
};

export default CharacterSketchGridBulk;