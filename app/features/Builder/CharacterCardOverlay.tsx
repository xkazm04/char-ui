import { AssetType } from "@/app/types/asset";
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";

type Props = {
    usedAssets: AssetType[];
    handleShowDetails: (e: React.MouseEvent) => void;
};

const CharacterCardOverlay = ({ usedAssets, handleShowDetails }: Props) => {
    return <>
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#0a0a18]/90 p-4 overflow-y-auto z-10"
        >
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-bold text-sky-400">Used Assets</h3>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleShowDetails}
                    className="text-gray-400 hover:text-white"
                    aria-label="Close asset details"
                >
                    <XCircle className="h-5 w-5" />
                </motion.button>
            </div>

            <div className="space-y-3">
                {usedAssets.length > 0 ? (
                    ['clothing', 'equipment', 'accessories'].map((type) => {
                        const filteredAssets = usedAssets.filter(asset => asset.type === type);
                        return filteredAssets.length > 0 ? (
                            <div key={type} className="mb-2">
                                <h4 className="text-xs text-gray-400 uppercase mb-1">{type}</h4>
                                <div className="space-y-1">
                                    {filteredAssets.map((asset) => (
                                        <div key={asset._id} className={`rounded-md px-2 text-sm`}>
                                            <li className="text-sky-200 text-xs">{asset.name}</li>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null;
                    })
                ) : (
                    <p className="text-gray-400 text-sm">No assets were used for this sketch.</p>
                )}
            </div>
        </motion.div>
    </>
}

export default CharacterCardOverlay;