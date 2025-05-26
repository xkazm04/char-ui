import { useState, useRef, Suspense, useEffect, memo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useProgress, Html } from '@react-three/drei';
import { ErrorBoundary } from 'react-error-boundary';
import ModelView from './ModelView';

export type ModelFormat = 'obj' | 'fbx' | 'glb' | 'usdz' | 'stl' | 'blend';

export interface ModelInfo {
  id: string;
  name: string;
  path: string;
  format: ModelFormat;
  thumbnail?: string;
}

interface ModelViewerProps {
  models: ModelInfo[];
  variants?: string[];
  defaultModel?: string;
  defaultVariant?: string;
  showFloor?: boolean;
  autoRotate?: boolean;
  lightingPreset?: string;
  onModelChange?: (modelId: string) => void;
}

const Loader = () => {
  const { progress, active } = useProgress();
  
  if (!active) return null;
  
  return (
    <Html center>
      <div className="bg-gray-900 bg-opacity-90 p-6 rounded-lg shadow-xl border border-sky-500/20">
        <div className="flex flex-col items-center">
          <div className="w-48 h-3 bg-gray-700 rounded-full overflow-hidden mb-3">
            <div 
              className="h-full bg-gradient-to-r from-sky-500 to-sky-400 transition-all duration-300 rounded-full" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-300 font-medium">{progress.toFixed(0)}% loaded</p>
          <p className="text-xs text-gray-400 mt-1">Loading 3D model...</p>
        </div>
      </div>
    </Html>
  );
};

const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => {
  return (
    <Html center>
      <div className="text-center p-6 flex flex-col items-center justify-center bg-gray-900/90 rounded-lg border border-red-500/20">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
          <span className="text-red-400 text-2xl">⚠</span>
        </div>
        <h2 className="text-red-400 text-xl mb-3 font-semibold">Error loading 3D model</h2>
        <p className="text-sm text-gray-300 mb-4 max-w-md leading-relaxed">{error.message}</p>
        <button 
          onClick={resetErrorBoundary}
          className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors font-medium"
        >
          Try again
        </button>
      </div>
    </Html>
  );
};

const ModelViewer: React.FC<ModelViewerProps> = ({ 
  models, 
  variants = ['Default', 'Wireframe', 'Textured', 'Animated'], 
  defaultModel, 
  defaultVariant,
  showFloor = false,
  autoRotate = false,
  lightingPreset = 'studio',
  onModelChange
}) => {
  const [selectedModelId, setSelectedModelId] = useState<string>(defaultModel || (models.length > 0 ? models[0].id : ''));
  const [selectedVariant] = useState<string>(defaultVariant || (variants.length > 0 ? variants[0] : 'Default'));
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);

  const selectedModel = models.find(model => model.id === selectedModelId) || models[0];

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, [selectedModelId]);

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  const handleModelChange = (modelId: string) => {
    setSelectedModelId(modelId);
    onModelChange?.(modelId);
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex-1 relative">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => {
            setSelectedModelId(defaultModel || (models.length > 0 ? models[0].id : ''));
          }}
        >
          <Canvas
            shadows={showFloor}
            dpr={[1, 2]}
            camera={{ position: [0, 0, 4], fov: 50 }}
            gl={{ 
              preserveDrawingBuffer: true,
              alpha: false,
              antialias: true,
              powerPreference: "high-performance"
            }}
          >
            <color attach="background" args={['#000000']} />
            
            <Suspense fallback={<Loader />}>
              <ModelView 
                modelInfo={selectedModel} 
                variant={selectedVariant} 
                showFloor={showFloor}
                lightingPreset={lightingPreset}
              />
            </Suspense>
            
            <OrbitControls 
              ref={controlsRef}
              autoRotate={autoRotate}
              autoRotateSpeed={1}
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={2}
              maxDistance={10}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI - Math.PI / 6}
              dampingFactor={0.05}
              enableDamping={true}
            />
          </Canvas>
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default memo(ModelViewer);