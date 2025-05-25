import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Grid3x3, Grid2x2, LucideImages, MoreHorizontal, SortAsc, SortDesc, XIcon } from "lucide-react";
import { IconButton } from "@/app/components/ui/IconButton";

type ViewMode = 'grid-small' | 'grid-medium' | 'grid-large';
type SortMode = 'newest' | 'oldest';

interface GridHeaderProps {
    sketchCount: number;
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
    sortMode: SortMode;
    setSortMode: (mode: SortMode) => void;
    isGenerating: boolean;
    setIsGenerating: (generating: boolean) => void;
}

const CharacterSketchGridHeader = ({
    sketchCount,
    viewMode,
    setViewMode,
    sortMode,
    setSortMode,
    isGenerating,
    setIsGenerating,
}: GridHeaderProps) => {
    const [showSortMenu, setShowSortMenu] = useState(false);

    const buttonOptions = [
        { mode: 'grid-small', icon: <Grid3x3 className="h-4 w-4" />, label: 'Small Grid' },
        { mode: 'grid-medium', icon: <Grid2x2 className="h-4 w-4" />, label: 'Medium Grid' },
        { mode: 'grid-large', icon: <LucideImages className="h-4 w-4" />, label: 'Large Grid' }
    ];

    return (
        <div className="p-4 flex justify-between items-center border-b border-sky-900/30 bg-gradient-to-r from-sky-950/20 to-gray-950/20">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-sky-400" />
                    <h3 className="text-lg font-medium text-sky-200">
                        Generations
                    </h3>
                    <span className="px-2 py-1 bg-sky-900/30 rounded-full text-xs text-sky-300">
                        {sketchCount}
                    </span>
                </div>
            </div>

            {isGenerating && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    title="Cancel Generation"
                    onClick={() => setIsGenerating(false)}
                    className="px-3 py-1.5 text-red-600/80  rounded-md text-sm transition-colors"
                >
                    <XIcon className="animate-pulse" />
                </motion.button>
            )}

            <div className="flex items-center gap-2">
                {/* View Mode Selector */}
                <div className="flex bg-gray-900/50 rounded-lg gap-2 p-1">
                    {buttonOptions.map(({ mode, icon, label }) => (
                        <IconButton
                            key={mode}
                            icon={icon}
                            onClick={() => setViewMode(mode as ViewMode)}
                            active={viewMode === mode}
                            label={label}
                        />
                    ))}
                </div>

                {/* Sort Menu */}
                <div className="relative">
                    <button
                        onClick={() => setShowSortMenu(!showSortMenu)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-900/50 hover:bg-gray-900/70 rounded-md text-sm text-gray-300 transition-colors"
                    >
                        {sortMode === 'newest' && <SortDesc className="h-4 w-4" />}
                        {sortMode === 'oldest' && <SortAsc className="h-4 w-4" />}
                        <MoreHorizontal className="h-4 w-4" />
                    </button>

                    <AnimatePresence>
                        {showSortMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute right-0 top-full mt-1 bg-gray-900/95 backdrop-blur border border-gray-700 rounded-lg shadow-xl z-10 min-w-[140px]"
                            >
                                {[
                                    { key: 'newest', label: 'Newest First', icon: SortDesc },
                                    { key: 'oldest', label: 'Oldest First', icon: SortAsc },
                                ].map(({ key, label, icon: Icon }) => (
                                    <button
                                        key={key}
                                        onClick={() => {
                                            setSortMode(key as SortMode);
                                            setShowSortMenu(false);
                                        }}
                                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-sky-900/30 transition-colors ${sortMode === key ? 'text-sky-300 bg-sky-900/20' : 'text-gray-300'
                                            }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {label}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
export default CharacterSketchGridHeader;