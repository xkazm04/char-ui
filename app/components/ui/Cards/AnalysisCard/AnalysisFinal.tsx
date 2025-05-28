import { CheckCheck } from "lucide-react";
import Image from "next/image";
import {motion} from "framer-motion";
import { AssetType } from "@/app/types/asset";

type Props = {
    asset: AssetType;
    prompt?: string;
    typeStyles: {
        badge: string; 
    };
    generatedImage: string;
}

const AnalysisFinal = ({ asset, prompt, typeStyles, generatedImage}: Props) => {
    return <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full h-full min-h-[400px]"
    >
        <Image
            src={generatedImage}
            width={400}
            height={400}
            alt={asset.name}
            className="w-full h-full object-cover rounded-xl"
        />

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Asset info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1">{asset.name}</h3>
                    <p className="text-sm text-gray-200 opacity-90 line-clamp-3 mb-2">{asset.description}</p>
                    {prompt && (
                        <p className="text-xs text-gray-300/80 italic line-clamp-2">{prompt}</p>
                    )}
                </div>

                {/* Saved indicator */}
                <div className="flex text-xs font-medium items-center flex-row gap-1 px-2 py-1
                 text-green-300 bg-green-500/20 backdrop-blur rounded-md border border-green-500/30">
                    <span><CheckCheck /></span>
                    <span>saved</span>
                </div>
            </div>

            {/* Type badge */}
            <div className="mt-3">
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium ${typeStyles.badge}`}>
                    <span>{asset.type}</span>
                </div>
            </div>
        </div>
    </motion.div>
}
export default AnalysisFinal;