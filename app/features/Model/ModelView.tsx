import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { 
  Environment, 
  ContactShadows, 
  Html,
  Center,
  AccumulativeShadows,
  RandomizedLight,
} from '@react-three/drei';
import useModelLoader from './useModelLoader';
import { ModelInfo } from './ModelViewer';
import PatternedBackground from '@/app/components/3d/PatternedBackground';
import LightingSystem from '@/app/components/3d/LightingSystem';

interface ModelViewProps {
  modelInfo: ModelInfo;
  showFloor?: boolean;
  lightingPreset?: string;
}

const ModelView: React.FC<ModelViewProps> = ({ 
  modelInfo, 
  showFloor = true,
  lightingPreset = 'studio'
}) => {
  const { model, error, isLoading } = useModelLoader({
    path: modelInfo.path,
    format: modelInfo.format
  });

  const groupRef = useRef<THREE.Group>(null);
  const originalMaterials = useRef<Map<THREE.Mesh, THREE.Material | THREE.Material[]>>(new Map());

  // Animation effect
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    }
  });

  if (error) {
    return (
      <Html center>
        <div className="bg-red-900/80 p-4 text-white rounded-lg text-center max-w-md">
          <div className="text-4xl mb-2">⚠️</div>
          <h3 className="font-semibold mb-2">Model Load Error</h3>
        </div>
      </Html>
    );
  }

  if (isLoading || !model) {
    return (
      <Html center>
        <div className="bg-gray-900/90 p-6 rounded-lg border border-sky-500/20">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-2 border-sky-500 rounded-full animate-spin border-t-transparent mb-3"></div>
          </div>
        </div>
      </Html>
    );
  }

  // Store original materials on first load
  if (originalMaterials.current.size === 0) {
    model.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        originalMaterials.current.set(child, child.material);
      }
    });
  }

  return (
    <>
      <PatternedBackground  />
      
      <group ref={groupRef}>
        <Center>
          <primitive object={model} scale={1} />
        </Center>
        
        {showFloor && (
          <>
            {/* Soft shadows */}
            <AccumulativeShadows 
              temporal 
              frames={60} 
              alphaTest={0.85} 
              scale={10} 
              position={[0, -0.49, 0]}
              color="#000000"
              opacity={0.6}
            >
              <RandomizedLight 
                amount={8} 
                radius={5} 
                intensity={1} 
                ambient={0.5} 
                position={[5, 5, -10]} 
              />
            </AccumulativeShadows>
            
            <ContactShadows 
              opacity={0.4} 
              scale={10} 
              blur={2} 
              far={10} 
              resolution={512} 
              color="#000000" 
            />
          </>
        )}
      </group>
      
      <LightingSystem preset={lightingPreset} showFloor={showFloor} />
      <Environment preset="city" backgroundIntensity={0.1} /> {/* Much lower intensity */}
    </>
  );
};

export default ModelView;