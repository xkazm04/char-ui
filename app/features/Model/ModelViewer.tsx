import { useState, useRef, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useProgress, Html } from '@react-three/drei';
import { ErrorBoundary } from 'react-error-boundary';
import ModelGallery from './ModelGallery';
import ModelVariantsBar from './ModelVariantsBar';
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
}

const Loader = () => {
  const { progress, active } = useProgress();
  
  if (!active) return null;
  
  return (
    <Html center>
      <div className="bg-gray-900 bg-opacity-80 p-4 rounded-lg shadow-lg">
        <div className="flex flex-col items-center">
          <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-yellow-500 transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-gray-300">{progress.toFixed(0)}% loaded</p>
        </div>
      </div>
    </Html>
  );
};

// Error fallback
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => {
  return (
    <div className="text-center p-4 flex flex-col items-center justify-center h-full">
      <h2 className="text-red-500 text-xl mb-2">Error loading model</h2>
      <p className="text-sm text-gray-300 mb-4">{error.message}</p>
      <button 
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-yellow-500 text-gray-900 rounded hover:bg-yellow-400 transition-colors"
      >
        Try again
      </button>
    </div>
  );
};

const ModelViewer: React.FC<ModelViewerProps> = ({ 
  models, 
  variants = ['Default', 'Wireframe', 'Textured', 'Animated'], 
  defaultModel, 
  defaultVariant 
}) => {
  const [selectedModelId, setSelectedModelId] = useState<string>(defaultModel || (models.length > 0 ? models[0].id : ''));
  const [selectedVariant, setSelectedVariant] = useState<string>(defaultVariant || (variants.length > 0 ? variants[0] : 'Default'));
  const controlsRef = useRef<any>(null);

  const selectedModel = models.find(model => model.id === selectedModelId) || models[0];

  // Reset camera when changing models
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, [selectedModelId]);

  return (
    <div className="flex flex-col w-full h-full bg-gray-950">
      {/* Top bar for variants */}
      <ModelVariantsBar 
        variants={variants}
        selectedVariant={selectedVariant}
        onSelectVariant={setSelectedVariant}
      />
      
      {/* Main 3D viewer */}
      <div className="flex-1 relative">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => {
            // Reset state when error boundary is reset
            setSelectedModelId(defaultModel || (models.length > 0 ? models[0].id : ''));
          }}
        >
          <Canvas
            shadows
            dpr={[1, 2]}
            camera={{ position: [0, 0, 4], fov: 50 }}
            gl={{ preserveDrawingBuffer: true }}
          >
            <color attach="background" args={['#050505']} />
            <fog attach="fog" args={['#050505', 10, 20]} />
            
            <Suspense fallback={<Loader />}>
              <ModelView modelInfo={selectedModel} variant={selectedVariant} />
            </Suspense>
            
            <OrbitControls 
              ref={controlsRef}
              autoRotate={false}
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={2}
              maxDistance={10}
            />
          </Canvas>
        </ErrorBoundary>
      </div>
      
      {/* Bottom gallery */}
      <ModelGallery 
        models={models}
        selectedModelId={selectedModelId}
        onSelectModel={setSelectedModelId}
      />
    </div>
  );
}
export default ModelViewer;