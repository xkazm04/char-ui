import React from 'react';
import ModelViewer, { ModelInfo } from './ModelViewer';

const demoModels: ModelInfo[] = [
  {
    id: 'model1',
    name: 'Character 1',
    path: '/models/jinx.glb',
    format: 'glb',
    thumbnail: '/thumbnails/kratos.jpg'
  },
  {
    id: 'model2',
    name: 'Character 2',
    path: '/models/jinx.glb',
    format: 'glb',
    thumbnail: '/thumbnails/kratos.jpg'
  },
];

const demoVariants = ['Default', 'Wireframe', 'Textured', 'Animated'];

export default function ModelLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <header className="py-4 px-6 bg-gray-900">
        <h1 className="text-xl font-bold text-white">3D Model Viewer</h1>
      </header>
      
      <main className="flex-1 flex">
        <div className="w-full h-[calc(100vh-6rem)]">
          <ModelViewer 
            models={demoModels} 
            variants={demoVariants}
            defaultModel="model1"
            defaultVariant="Default"
          />
        </div>
      </main>
    </div>
  );
}