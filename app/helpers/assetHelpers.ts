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