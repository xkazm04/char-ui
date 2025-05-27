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
    if (!path) {
      setIsLoading(false);
      setError(new Error('No model path provided'));
      return;
    }

    setIsLoading(true);
    setError(null);
    setModel(null);

    let isMounted = true;

    const loadModel = async () => {
      try {
        console.log(`Loading ${format} model from:`, path);
        let result;
        
        switch (format) {
          case 'obj': {
            const { OBJLoader } = await import('three/examples/jsm/loaders/OBJLoader.js');
            const loader = new OBJLoader();
            
            // Add error handling for network requests
            result = await new Promise((resolve, reject) => {
              loader.load(
                path,
                (object) => {
                  console.log('OBJ loaded successfully:', object);
                  resolve(object);
                },
                (progress) => {
                  console.log('OBJ loading progress:', progress);
                },
                (error) => {
                  console.error('OBJ loading error:', error);
                  reject(new Error(`Failed to load OBJ model`));
                }
              );
            });
            
            if (isMounted) setModel(result as THREE.Group);
            break;
          }
            
          case 'fbx': {
            const { FBXLoader } = await import('three/examples/jsm/loaders/FBXLoader.js');
            const loader = new FBXLoader();
            
            result = await new Promise((resolve, reject) => {
              loader.load(
                path,
                (object) => {
                  console.log('FBX loaded successfully:', object);
                  resolve(object);
                },
                (progress) => {
                  console.log('FBX loading progress:', progress);
                },
                (error) => {
                  console.error('FBX loading error:', error);
                  reject(new Error(`Failed to load FBX model`));
                }
              );
            });
            
            if (isMounted) setModel(result as THREE.Group);
            break;
          }
            
          case 'glb': {
            const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
            const loader = new GLTFLoader();
            
            result = await new Promise((resolve, reject) => {
              loader.load(
                path,
                (gltf) => {
                  console.log('GLB loaded successfully:', gltf);
                  resolve(gltf);
                },
                (progress) => {
                  console.log('GLB loading progress:', progress);
                },
                (error) => {
                  console.error('GLB loading error:', error);
                  reject(new Error(`Failed to load GLB model`));
                }
              );
            });
            
            if (isMounted) {
              //eslint-disable-next-line @typescript-eslint/no-explicit-any
              const gltfResult = result as any;
              
              // Center and scale the model
              const scene = gltfResult.scene;
              const box = new THREE.Box3().setFromObject(scene);
              const center = box.getCenter(new THREE.Vector3());
              const size = box.getSize(new THREE.Vector3());
              
              // Center the model
              scene.position.sub(center);
              
              // Scale the model to fit in a reasonable size (max dimension = 2)
              const maxDim = Math.max(size.x, size.y, size.z);
              if (maxDim > 0) {
                const scale = 2 / maxDim;
                scene.scale.setScalar(scale);
              }
              
              setModel(scene);
            }
            break;
          }
            
          case 'stl': {
            const { STLLoader } = await import('three/examples/jsm/loaders/STLLoader.js');
            const loader = new STLLoader();
            
            const geometry = await new Promise<THREE.BufferGeometry>((resolve, reject) => {
              loader.load(
                path,
                (geometry) => {
                  console.log('STL loaded successfully:', geometry);
                  resolve(geometry);
                },
                (progress) => {
                  console.log('STL loading progress:', progress);
                },
                (error) => {
                  console.error('STL loading error:', error);
                  reject(new Error(`Failed to load STL model`));
                }
              );
            });
            
            if (isMounted) {
              // Center and scale the geometry
              geometry.computeBoundingBox();
              const boundingBox = geometry.boundingBox!;
              const center = boundingBox.getCenter(new THREE.Vector3());
              const size = boundingBox.getSize(new THREE.Vector3());
              
              geometry.translate(-center.x, -center.y, -center.z);
              
              const material = new THREE.MeshStandardMaterial({ 
                color: 0xaaaaaa, 
                roughness: 0.5, 
                metalness: 0.5 
              });
              
              const mesh = new THREE.Mesh(geometry, material);
              
              // Scale the mesh to fit in a reasonable size
              const maxDim = Math.max(size.x, size.y, size.z);
              if (maxDim > 0) {
                const scale = 2 / maxDim;
                mesh.scale.setScalar(scale);
              }
              
              setModel(mesh);
            }
            break;
          }
          
          case 'blend': {
            throw new Error('Blend files require conversion to GLB, OBJ, or FBX formats before use');
          }
          
          case 'usdz': {
            throw new Error('USDZ format is primarily for AR on iOS and requires special handling');
          }
            
          default:
            throw new Error(`Unsupported format: ${format}`);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error loading model:', err);
          const errorMessage = err instanceof Error ? err.message : String(err);
          
          // Provide more specific error messages
          if (errorMessage.includes('CORS')) {
            setError(new Error('Model loading blocked by CORS policy. The model URL may not allow cross-origin requests.'));
          } else if (errorMessage.includes('404') || errorMessage.includes('Not Found')) {
            setError(new Error('Model file not found. The URL may be invalid or expired.'));
          } else if (errorMessage.includes('NetworkError') || errorMessage.includes('Failed to fetch')) {
            setError(new Error('Network error while loading model. Please check your internet connection.'));
          } else {
            setError(new Error(`Failed to load ${format.toUpperCase()} model: ${errorMessage}`));
          }
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