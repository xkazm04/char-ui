import { SimilarAsset } from "@/app/types/asset";
import Image from "next/image";

type Props ={
    similar: SimilarAsset;
}

const AssetSimilarItemCard = ({similar}: Props) => {
    return <>
        <div key={similar.id} className="bg-gray-700 p-3 rounded-md border border-gray-600">
            <div className="flex items-start gap-3">
                {similar.image_url && (
                    <div className="w-16 h-16 relative flex-shrink-0">
                        <Image
                            src={similar.image_url}
                            alt={similar.name}
                            fill
                            className="object-cover rounded"
                        />
                    </div>
                )}
                <div>
                    <h3 className="font-medium text-white">{similar.name}</h3>
                    <p className="text-sm text-gray-400 mb-1">{similar.type}</p>
                    {similar.description && (
                        <p className="text-xs text-gray-300 line-clamp-2">{similar.description}</p>
                    )}
                    <div className="mt-1 text-xs">
                        <span className="text-yellow-400">{(similar.similarity * 100).toFixed(1)}% similar</span>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default AssetSimilarItemCard;