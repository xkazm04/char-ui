
import React from 'react';
import Image from 'next/image';
import { ModelInfo } from './ModelViewer';

interface ModelGalleryProps {
  models: ModelInfo[];
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
}

const ModelGallery: React.FC<ModelGalleryProps> = ({
  models,
  selectedModelId,
  onSelectModel
}) => {
  return (
    <div className="py-2 px-4 bg-gray-900 border-t border-gray-800">
      <div className="flex items-center justify-center space-x-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        {models.map((model) => (
          <div
            key={model.id}
            onClick={() => onSelectModel(model.id)}
            className={`relative cursor-pointer transition-all duration-300 ${
              selectedModelId === model.id 
                ? 'opacity-100 scale-105 border-2 border-yellow-500' 
                : 'opacity-70 hover:opacity-90 border border-gray-700'
            }`}
          >
            <div className="w-16 h-16 rounded overflow-hidden bg-gray-800">
              {model.thumbnail ? (
                <Image
                  src={model.thumbnail}
                  alt={model.name}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-gray-500 text-xs">
                  {model.name.slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>
            <div className={`absolute -bottom-1 left-0 right-0 h-1 ${
              selectedModelId === model.id ? 'bg-yellow-500' : 'bg-transparent'
            }`} />
            <div className="text-center text-xs mt-1 text-gray-400 truncate max-w-16">
              {model.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelGallery;