import { useCallback, useEffect } from "react";
import { Search, Sparkles, X, Loader } from "lucide-react";

type Props = {
    searchMode: 'text' | 'semantic';
    setSearchMode: (mode: 'text' | 'semantic') => void;
    mainSearchQuery: string;
    setMainSearchQuery: (query: string) => void;
    currentlyLoading: boolean;
    currentError: Error | null;
    clearSemanticResults: () => void;
    searchAssets: (params: { query: string; limit?: number; min_score?: number; asset_type?: string }) => void;
    refetch: () => void;
    activeCategory: string | null;
}

const AssetSearch = ({ searchMode, setSearchMode, mainSearchQuery, setMainSearchQuery, currentlyLoading, currentError, clearSemanticResults
    , searchAssets, refetch, activeCategory
}: Props) => {

    useEffect(() => {
        if (searchMode === 'semantic' && mainSearchQuery.trim()) {
            const timer = setTimeout(() => {
                searchAssets({
                    query: mainSearchQuery,
                    limit: 30,
                    min_score: 0.3,
                    asset_type: activeCategory || undefined
                });
            }, 500); // 500ms debounce

            return () => clearTimeout(timer);
        } else if (searchMode === 'semantic') {
            clearSemanticResults();
        }
    }, [mainSearchQuery, searchMode, activeCategory, searchAssets, clearSemanticResults]);

    const toggleSearchMode = useCallback(() => {
        const newMode = searchMode === 'text' ? 'semantic' : 'text';
        setSearchMode(newMode);

        if (newMode === 'text') {
            clearSemanticResults();
        }
    }, [searchMode, clearSemanticResults]);
    return <>
        <div className="p-3 border-b border-gray-800">
            <div className="relative">
                <input
                    type="text"
                    placeholder={searchMode === 'semantic' ?
                        "Describe what you're looking for..." :
                        "Search loaded assets..."
                    }
                    className="w-full bg-gray-800 rounded-md px-3 py-2 pl-9 pr-12 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    value={mainSearchQuery}
                    onChange={(e) => setMainSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />

                {/* Search mode toggle */}
                <button
                    onClick={toggleSearchMode}
                    className={`absolute right-8 top-1.5 p-1 cursor-pointer rounded ${searchMode === 'semantic'
                        ? 'text-purple-400 bg-purple-900/20'
                        : 'text-gray-400 hover:text-gray-200'
                        }`}
                    title={searchMode === 'semantic' ? 'Switch to text search' : 'Switch to AI search'}
                >
                    <Sparkles size={14} />
                </button>

                {mainSearchQuery && (
                    <button
                        className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-200"
                        onClick={() => setMainSearchQuery("")}
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Search mode indicator */}
            <div className="mt-2 text-xs text-gray-500">
                {searchMode === 'semantic' ? (
                    <span>AI-powered semantic search - finds suitable context for term</span>
                ) : (
                    <span>Text search • Searches names, descriptions, and categories</span>
                )}
            </div>
        </div>

        {currentlyLoading && (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                <Loader className="h-8 w-8 animate-spin mb-2" />
                <p>{searchMode === 'semantic' ? 'Searching with AI...' : 'Loading assets...'}</p>
            </div>
        )}

        {currentError && !currentlyLoading && (
            <div className="flex flex-col items-center justify-center h-40 text-red-400 p-4 text-center">
                <p>{currentError instanceof Error ? currentError.message : 'Search failed.'}</p>
                <button
                    className="mt-4 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-md text-sm"
                    onClick={() => searchMode === 'semantic' ?
                        searchAssets({ query: mainSearchQuery, limit: 30, min_score: 0.3 }) :
                        refetch()
                    }
                >
                    Retry
                </button>
            </div>
        )}
    </>
}

export default AssetSearch;