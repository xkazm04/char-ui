import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const LightingSystem = ({ preset, showFloor }: { preset: string; showFloor: boolean }) => {
  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  const fillLightRef = useRef<THREE.DirectionalLight>(null);
  const rimLightRef = useRef<THREE.SpotLight>(null);

  useFrame((state) => {
    if (preset === 'dramatic' && rimLightRef.current) {
      // Much slower movement
      rimLightRef.current.position.x = 2 * Math.sin(state.clock.getElapsedTime() * 0.2);
      rimLightRef.current.position.z = 2 * Math.cos(state.clock.getElapsedTime() * 0.2);
      rimLightRef.current.lookAt(0, 0, 0);
    }
  });

  const getLightingConfig = () => {
    switch (preset) {
      case 'dramatic':
        return {
          keyLight: { intensity: 0.8, color: '#f8f8ff', position: [4, 4, 4] }, // Much lower
          fillLight: { intensity: 0.15, color: '#e6e8ff', position: [-2, 2, -2] }, // Very subtle
          rimLight: { intensity: 0.3, color: '#ffffff' }, // Minimal rim
          ambient: { intensity: 0.08, color: '#2a2a35' } // Very low ambient
        };
      case 'environment':
        return {
          keyLight: { intensity: 0.6, color: '#ffffff', position: [3, 3, 3] },
          fillLight: { intensity: 0.12, color: '#f0f2ff', position: [-2, 2, -2] },
          rimLight: { intensity: 0.2, color: '#ffffff' },
          ambient: { intensity: 0.1, color: '#252530' }
        };
      default: // studio
        return {
          keyLight: { intensity: 0.7, color: '#ffffff', position: [3, 3, 3] },
          fillLight: { intensity: 0.1, color: '#f5f5ff', position: [-2, 2, -2] },
          rimLight: { intensity: 0.25, color: '#ffffff' },
          ambient: { intensity: 0.12, color: '#202025' } // Dark but not too dark
        };
    }
  };

  const config = getLightingConfig();

  return (
    <>
      {/* Key Light - primary illumination */}
      <directionalLight
        ref={keyLightRef}
        position={config.keyLight.position as [number, number, number]}
        intensity={config.keyLight.intensity}
        color={config.keyLight.color}
        castShadow={showFloor}
        shadow-mapSize={[1024, 1024]} // Reduced for performance
        shadow-camera-far={30}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />

      {/* Fill Light - very subtle */}
      <directionalLight
        ref={fillLightRef}
        position={config.fillLight.position as [number, number, number]}
        intensity={config.fillLight.intensity}
        color={config.fillLight.color}
      />

      {/* Rim Light - minimal accent */}
      <spotLight
        ref={rimLightRef}
        position={[2, 2, -2]}
        angle={0.5}
        penumbra={0.9}
        intensity={config.rimLight.intensity}
        color={config.rimLight.color}
        distance={15}
      />

      {/* Minimal Ambient Light */}
      <ambientLight
        intensity={config.ambient.intensity}
        color={config.ambient.color}
      />
    </>
  );
};

export default LightingSystem;