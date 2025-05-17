import { useState, useEffect } from 'react';
import * as THREE from 'three';
import { ModelFormat } from './ModelViewer';

interface UseModelLoaderProps {
  path: string;
  format: ModelFormat;
}

interface UseModelLoaderResult {
  model: THREE.Group | THREE.Mesh | null;
  error: Error | null;
  isLoading: boolean;
}

const useModelLoader = ({ path, format }: UseModelLoaderProps): UseModelLoaderResult => {
  const [model, setModel] = useState<THREE.Group | THREE.Mesh | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setModel(null);

    let isMounted = true;

    const loadModel = async () => {
      try {
        let result;
        
        switch (format) {
          case 'obj': {
            // Dynamic import OBJLoader only when needed
            const { OBJLoader } = await import('three/examples/jsm/loaders/OBJLoader');
            const loader = new OBJLoader();
            result = await loader.loadAsync(path);
            if (isMounted) setModel(result);
            break;
          }
            
          case 'fbx': {
            // Dynamic import FBXLoader only when needed
            const { FBXLoader } = await import('three/examples/jsm/loaders/FBXLoader');
            const loader = new FBXLoader();
            result = await loader.loadAsync(path);
            if (isMounted) setModel(result);
            break;
          }
            
          case 'glb': {
            // Dynamic import GLTFLoader only when needed
            const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader');
            const loader = new GLTFLoader();
            result = await loader.loadAsync(path);
            if (isMounted) setModel(result.scene);
            break;
          }
            
          case 'stl': {
            // Dynamic import STLLoader only when needed
            const { STLLoader } = await import('three/examples/jsm/loaders/STLLoader');
            const loader = new STLLoader();
            const geometry = await loader.loadAsync(path);
            if (isMounted) {
              const material = new THREE.MeshStandardMaterial({ 
                color: 0xaaaaaa, 
                roughness: 0.5, 
                metalness: 0.5 
              });
              const mesh = new THREE.Mesh(geometry, material);
              setModel(mesh);
            }
            break;
          }
          
          case 'blend': {
            // Not directly supported, inform the user
            throw new Error('Blend files require conversion to GLB, OBJ, or FBX formats before use');
          }
          
          case 'usdz': {
            // Not directly supported in three.js
            throw new Error('USDZ format is primarily for AR on iOS and requires special handling');
          }
            
          default:
            throw new Error(`Unsupported format: ${format}`);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error loading model:', err);
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadModel();

    return () => {
      isMounted = false;
    };
  }, [path, format]);

  return { model, error, isLoading };
};

export default useModelLoader;