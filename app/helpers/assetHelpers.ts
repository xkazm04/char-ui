import { AssetType } from "../types/asset";

export const getBorderColor = (asset: AssetType) => {
  if (!asset || !asset.type) return 'border-gray-500/10';
  switch (asset.type) {
    case 'Body': return 'border-blue-500/10';
    case 'Equipment': return 'border-red-500/10';
    case 'Clothing': return 'border-green-500/10';
    case 'Background': return 'border-purple-500/10';
    default: return 'border-gray-500/10';
  }
};

export const getTypeIndicatorClass = (type: string | undefined) => {
  switch (type?.toLowerCase()) {
    case 'body': return 'bg-blue-500';
    case 'equipment': return 'bg-red-500';
    case 'clothing': return 'bg-green-500';
    case 'background': return 'bg-purple-500';
    default: return 'bg-gray-500';
  }
};

export const assetColor = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'body':
      return 'bg-blue-400/20';
    case 'equipment':
      return 'bg-red-500/20';
    case 'clothing':
      return 'bg-green-500/20';
    case 'background':
      return 'bg-purple-500/20';
    default:
      return 'bg-gray-900/20';
  }
}

export const getSimilarityColor = (similarity: number) => {
  if (similarity >= 90) return "text-red-400 bg-red-500/10 border-red-500/20";
  if (similarity >= 75) return "text-orange-400 bg-orange-500/10 border-orange-500/20";
  if (similarity >= 60) return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
  return "text-green-400 bg-green-500/10 border-green-500/20";
};