import React from 'react';

interface ModelVariantsBarProps {
  variants: string[];
  selectedVariant: string;
  onSelectVariant: (variant: string) => void;
}

const ModelVariantsBar: React.FC<ModelVariantsBarProps> = ({
  variants,
  selectedVariant,
  onSelectVariant
}) => {
  if (variants.length === 0) return null;

  return (
    <div className="flex items-center justify-center py-2 px-4 bg-gray-900 border-b border-gray-800">
      <div className="flex space-x-2">
        {variants.map((variant) => (
          <button
            key={variant}
            onClick={() => onSelectVariant(variant)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              selectedVariant === variant
                ? 'bg-yellow-500 text-gray-900 font-medium'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {variant}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModelVariantsBar;