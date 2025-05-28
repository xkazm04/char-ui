import { assetColor } from "@/app/helpers/assetHelpers";
import { AssetType } from "@/app/types/asset";
import { motion } from "framer-motion";


interface AssetTagProps {
  asset: AssetType;
  onRemove: () => void;
}


const AssetTag = ({ asset, onRemove }: AssetTagProps) => {
  return (
    <motion.button
      key={asset._id}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      onClick={(e) => {
        e.stopPropagation();
        onRemove();
      }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`flex items-center ${assetColor(asset.type)} cursor-pointer
         border border-gray-700/50 rounded-full px-3 py-1 text-xs mr-2 mb-2`}
    >
      <span className="text-white truncate max-w-[150px]">{asset.name}</span>
    </motion.button>
  );
};

export default AssetTag;