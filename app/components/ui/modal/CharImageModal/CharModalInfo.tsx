import { UsedAssets } from "@/app/types/gen";
import { motion } from "framer-motion";
import { PersonStanding } from "lucide-react";

type Props = {
    usedAssets: UsedAssets[];
}

const CharModalInfo = ({usedAssets}: Props) => {
    return <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className="absolute top-20 right-4 w-80 bg-gray-900/95 backdrop-blur-sm rounded-lg border border-gray-700 p-4"
        onClick={(e) => e.stopPropagation()}
    >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <PersonStanding className="h-5 w-5 mr-2 text-sky-400" />
            Used assets
        </h3>

        {usedAssets && usedAssets.length > 0 ? (
            <div className="space-y-3">
                {['clothing', 'equipment', 'body', 'accessories'].map((type) => {
                    const filteredAssets = usedAssets.filter(asset => asset.type === type);
                    return filteredAssets.length > 0 ? (
                        <div key={type}>
                            <h4 className="text-sm text-sky-400 uppercase mb-2 font-medium">{type}</h4>
                            <div className="space-y-1">
                                {filteredAssets.map((asset) => (
                                    <div key={asset._id} className="text-sm text-gray-300 bg-gray-800/30 rounded px-2 py-1">
                                        {asset.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null;
                })}
            </div>
        ) : (
            <p className="text-gray-400 text-sm">No assets information available.</p>
        )}
    </motion.div>
}

export default CharModalInfo;