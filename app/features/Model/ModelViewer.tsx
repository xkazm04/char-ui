import { useState, useRef, Suspense, useEffect, memo } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, useProgress, Html } from '@react-three/drei';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
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
  defaultModel?: string;
  showFloor?: boolean;
  autoRotate?: boolean;
  lightingPreset?: string;
}

const Loader = () => {
  const { progress, active } = useProgress();
  
  if (!active) return null;
  
  return (
    <Html center>
      <div className="bg-gray-900/95 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-sky-500/30">
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
            <div 
              className="absolute inset-0 border-4 border-sky-500 rounded-full animate-spin border-t-transparent transition-all duration-300"
              style={{ 
                transform: `rotate(${progress * 3.6}deg)`,
                borderColor: `hsl(${200 + progress}, 70%, 50%)`
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-sky-400">{Math.round(progress)}%</span>
            </div>
          </div>
          
          {/* Loading stages */}
          <div className="mt-3 text-xs text-gray-500">
            {progress < 30 && "Downloading model..."}
            {progress >= 30 && progress < 70 && "Processing geometry..."}
            {progress >= 70 && progress < 90 && "Applying materials..."}
            {progress >= 90 && "Almost ready!"}
          </div>
        </div>
      </div>
    </Html>
  );
};

const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => {
  return (
    <Html center>
      <div className="text-center p-8 flex flex-col items-center justify-center bg-gray-900/95 backdrop-blur-sm rounded-xl border border-red-500/30 max-w-md">
        <div className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-full flex items-center justify-center mb-6 border border-red-500/30">
          <span className="text-red-400 text-3xl">⚠</span>
        </div>
        <h2 className="text-red-400 text-xl mb-3 font-bold">Failed to Load 3D Model</h2>
        <p className="text-sm text-gray-300 mb-6 leading-relaxed">{error.message}</p>
        <div className="flex space-x-3">
          <button 
            onClick={resetErrorBoundary}
            className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors font-medium shadow-lg"
          >
            Try Again
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors font-medium"
          >
            Reload Page
          </button>
        </div>
      </div>
    </Html>
  );
};

const ModelViewer: React.FC<ModelViewerProps> = ({ 
  models, 
  defaultModel, 
  autoRotate = false,
  lightingPreset = 'studio',
}) => {
  const [selectedModelId, setSelectedModelId] = useState<string>(defaultModel || (models.length > 0 ? models[0].id : ''));
  const controlsRef = useRef<OrbitControlsImpl>(null);

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


  return (
    <div className="flex flex-col w-full h-full relative overflow-hidden">
      {/* Subtle vignette overlay */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/20"></div>
      </div>
      
      <div className="flex-1 relative">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => {
            setSelectedModelId(defaultModel || (models.length > 0 ? models[0].id : ''));
          }}
        >
          <Canvas
            shadows={false}
            dpr={[1, 2]}
            camera={{ position: [0, 0, 4], fov: 45 }}
            gl={{ 
              preserveDrawingBuffer: true,
              alpha: false,
              antialias: true,
              powerPreference: "high-performance",
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 0.8 // Reduced exposure for darker look
            }}
          >
            <color attach="background" args={['#0f0f14']} />
            
            <Suspense fallback={<Loader />}>
              <ModelView 
                modelInfo={selectedModel} 
                showFloor={false}
                lightingPreset={lightingPreset}
              />
            </Suspense>
            
            <OrbitControls 
              ref={controlsRef}
              autoRotate={autoRotate}
              autoRotateSpeed={0.8}
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={1.5}
              maxDistance={12}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI - Math.PI / 6}
              dampingFactor={0.08}
              enableDamping={true}
              zoomSpeed={0.8}
              panSpeed={0.8}
              rotateSpeed={0.6}
            />
          </Canvas>
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default memo(ModelViewer);