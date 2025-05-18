import { ReactNode } from 'react';

export type ModelFormat = 'obj' | 'fbx' | 'glb' | 'usdz' | 'stl' | 'blend';

export interface ModelInfo {
  id: string;
  name: string;
  path: string;
  format: ModelFormat;
  thumbnail?: string;
  description?: string;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;
}

export interface ModelViewerProps {
  /**
   * Array of model information objects
   */
  models: ModelInfo[];
  
  /**
   * Array of variant names
   * @default ['Default', 'Wireframe', 'Textured', 'Animated']
   */
  variants?: string[];
  
  /**
   * ID of the default selected model
   * @default first model in the array
   */
  defaultModel?: string;
  
  /**
   * Name of the default selected variant
   * @default first variant in the array
   */
  defaultVariant?: string;
  
  /**
   * Custom lighting setup component
   */
  customLighting?: ReactNode;
  
  /**
   * Environment preset
   * @default 'city'
   */
  environmentPreset?: 'sunset' | 'dawn' | 'night' | 'warehouse' | 'forest' | 'apartment' | 'studio' | 'city' | 'park' | 'lobby';
  
  /**
   * Auto-rotate the camera
   * @default false
   */
  autoRotate?: boolean;
  
  /**
   * Enable shadows
   * @default true
   */
  shadows?: boolean;
  
  /**
   * Enable controls
   * @default true
   */
  enableControls?: boolean;
  
  /**
   * Enable pan
   * @default true
   */
  enablePan?: boolean;
  
  /**
   * Enable zoom
   * @default true
   */
  enableZoom?: boolean;
  
  /**
   * Background color
   * @default '#050505' (very dark gray)
   */
  backgroundColor?: string;
  
  /**
   * Event handler when a model is selected
   */
  onModelSelect?: (modelId: string) => void;
  
  /**
   * Event handler when a variant is selected
   */
  onVariantSelect?: (variant: string) => void;
}

export interface ModelGalleryProps {
  models: ModelInfo[];
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
}

export interface ModelVariantsBarProps {
  variants: string[];
  selectedVariant: string;
  onSelectVariant: (variant: string) => void;
}

export interface ModelViewProps {
  modelInfo: ModelInfo;
  variant: string;
}

export interface UseModelLoaderProps {
  path: string;
  format: ModelFormat;
}

export interface UseModelLoaderResult {
  //@ts-expect-error Ignore
  model: THREE.Group | THREE.Mesh | null;
  error: Error | null;
  isLoading: boolean;
}