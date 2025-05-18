import { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { 
  Environment, 
  ContactShadows, 
  Html,
  BakeShadows,
  Center,
  AccumulativeShadows,
  RandomizedLight,
  GradientTexture,
  OrbitControls
} from '@react-three/drei';
import useModelLoader from './useModelLoader';
import { ModelInfo } from './ModelViewer';

interface ModelViewProps {
  modelInfo: ModelInfo;
  variant: string;
  showFloor?: boolean; // Add option to hide floor
}

const ModelView: React.FC<ModelViewProps> = ({ 
  modelInfo, 
  variant,
  showFloor = false // Default to false to hide floor
}) => {
  const { model, error, isLoading } = useModelLoader({
    path: modelInfo.path,
    format: modelInfo.format
  });

  const spotLightRef = useRef<THREE.SpotLight>(null);

  const wireframe = variant === 'Wireframe';
  const textured = variant === 'Textured';
  const animated = variant === 'Animated';

  // Animation effect
  useFrame((state) => {
    if (model && animated) {
      model.rotation.y = state.clock.getElapsedTime() * 0.3;
    }

    if (spotLightRef.current && model) {
      spotLightRef.current.position.x = 5 * Math.sin(state.clock.getElapsedTime() * 0.5);
      spotLightRef.current.position.z = 5 * Math.cos(state.clock.getElapsedTime() * 0.5);
      spotLightRef.current.lookAt(0, 0, 0);
    }
  });

  if (error) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
        <Html position={[0, 1.5, 0]}>
          <div className="bg-red-800 p-2 text-white rounded text-xs">
            Error loading model
          </div>
        </Html>
      </mesh>
    );
  }

  if (isLoading || !model) {
    return (
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="#444" wireframe />
      </mesh>
    );
  }

  // Apply material modification based on variant
  if (wireframe && model.traverse) {
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (Array.isArray(child.material)) {
          child.material.forEach(mat => {
            mat.wireframe = true;
          });
        } else if (child.material) {
          child.material.wireframe = true;
        }
      }
    });
  }

  // Enhance materials for better rendering
  model.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (child.material) {
        if (textured) {
          child.material.envMapIntensity = 1.2;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      }
    }
  });

  return (
    <>
      <group>
        <Center>
          <primitive object={model} scale={1} />
        </Center>
        
        {/* Only render shadows if showFloor is true */}
        {showFloor && (
          <>
            <AccumulativeShadows 
              temporal 
              frames={60} 
              alphaTest={0.85} 
              scale={10} 
              position={[0, -0.5, 0]}
            >
              <RandomizedLight 
                amount={4} 
                radius={9} 
                intensity={1} 
                ambient={0.25} 
                position={[5, 5, -10]} 
              />
            </AccumulativeShadows>
            
            <ContactShadows 
              opacity={0.6} 
              scale={10} 
              blur={1} 
              far={10} 
              resolution={256} 
              color="#000000" 
            />
          </>
        )}
      </group>
      
      <spotLight
        ref={spotLightRef}
        position={[5, 5, 5]}
        angle={0.3}
        penumbra={0.8}
        intensity={1}
        castShadow={showFloor} // Only cast shadow if we're showing the floor
        shadow-mapSize={[2048, 2048]}
      />
      
      <hemisphereLight intensity={0.5} color="#eaeaea" groundColor="#353535" />
      
      {/* Environment lighting still needed for model to look good */}
      <Environment preset="city" />
      
      {showFloor && <BakeShadows />}

      {variant === 'Studio' && showFloor && <Background variant={variant} />}

      <OrbitControls 
        enableDamping={true}
        dampingFactor={0.05}
        rotateSpeed={0.5}
        minDistance={2}
        maxDistance={10}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 1.5}
        target={[0, 0, 0]}
      />
    </>
  );
};

type VariantProps = {
    variant: string;
}

const Background = ({ variant }: VariantProps) => {
  return variant === 'Studio' ? (
    <mesh position={[0, 0, -15]} scale={[30, 30, 1]}>
      <planeGeometry />
      <meshBasicMaterial>
        <GradientTexture 
          stops={[0, 1]} 
          colors={['#202020', '#404040']} 
        />
      </meshBasicMaterial>
    </mesh>
  ) : null;
};

export default ModelView;