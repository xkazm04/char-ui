import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAssetStore } from '@/app/store/assetStore';
import { EraserIcon } from 'lucide-react';
import BuilderAssetGroup from './BuilderAssetGroup';
import BuilderGenSketch from './BuilderGenSketch';
import { useNavStore } from '@/app/store/navStore';

const BuilderAction = () => {
  const {
    Body,
    Equipment,
    Clothing,
    Background,
    removeAsset,
    clearAssets,
    clearAllAssets,
    isGenerating,
    setIsGenerating
  } = useAssetStore();

  // Use the categories from store
  const categories = useMemo(() => [
    { type: 'Body', title: 'Body', assets: Body, defaultOpen: true },
    { type: 'Equipment', title: 'Equipment', assets: Equipment, defaultOpen: Body.length === 0 },
    { type: 'Clothing', title: 'Clothing', assets: Clothing, defaultOpen: Body.length === 0 && Equipment.length === 0 },
    { type: 'Background', title: 'Background', assets: Background, defaultOpen: false }
  ], [Body, Equipment, Clothing, Background]);

  const hasAnyAssets = categories.some(category => category.assets.length > 0);
  const totalAssetCount = categories.reduce((sum, category) => sum + category.assets.length, 0);
  const { assetNavExpanded } = useNavStore()
  const handleClearAll = () => {
    clearAllAssets();
  };

  const clearAssetsByCategory = (type: string) => {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    clearAssets(type as any);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-gray-950/20 backdrop-blur-sm rounded-lg border border-sky-900/30 p-4"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-sky-200">Selected Assets</h2>
        </div>
        <div className={`flex space-x-2 transition-all duration-300 
          ${assetNavExpanded && 'lg:pr-40 3xl:pr-10'}`}>
          <BuilderGenSketch
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
            hasAnyAssets={hasAnyAssets}
          />
          {hasAnyAssets && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              title='Clear all'
              disabled={isGenerating}
              onClick={handleClearAll}
              className={`px-3 py-2 rounded-md relative cursor-pointer transition-colors duration-200 hover:text-red-100
                ${!isGenerating
                  ? 'bg-gray-900/20 hover:bg-gray-900/40 text-gray-400 border border-sky-900/50'
                  : 'bg-gray-700/20 text-gray-500 cursor-not-allowed border border-gray-700/50'
                }`}
              aria-label="Clear all selected assets"
            >
              <div className='absolute top-1 right-1 text-xs'> {totalAssetCount}</div>
              <EraserIcon className="h-4 w-4" />

            </motion.button>
          )}
        </div>
      </div>

      <div className="my-4 max-h-[70vh] overflow-y-auto pr-1">
        {categories.map(category => (
          <BuilderAssetGroup
            key={category.type}
            title={category.title}
            assets={category.assets}
            type={category.type}
            //@ts-expect-error Ignore
            onRemove={removeAsset}
            onClearCategory={clearAssetsByCategory}
            defaultOpen={category.defaultOpen}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default BuilderAction;