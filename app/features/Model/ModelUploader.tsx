import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ModelFormat } from '@/app/types/model';

interface ModelUploaderProps {
  onModelUpload: (file: File, format: ModelFormat) => void;
  supportedFormats?: ModelFormat[];
}

const defaultSupportedFormats: ModelFormat[] = ['obj', 'fbx', 'glb', 'stl'];

const ModelUploader: React.FC<ModelUploaderProps> = ({
  onModelUpload,
  supportedFormats = defaultSupportedFormats
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    
    if (acceptedFiles.length === 0) {
      setError('No files were uploaded');
      return;
    }
    
    const file = acceptedFiles[0];
    const extension = file.name.split('.').pop()?.toLowerCase() as ModelFormat;
    
    if (!extension || !supportedFormats.includes(extension as ModelFormat)) {
      setError(`Unsupported file format. Please upload: ${supportedFormats.join(', ')}`);
      return;
    }
    
    onModelUpload(file, extension as ModelFormat);
  }, [onModelUpload, supportedFormats]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'model/gltf-binary': ['.glb'],
      'model/gltf+json': ['.gltf'],
      'model/obj': ['.obj'],
      'model/fbx': ['.fbx'],
      'model/stl': ['.stl'],
    },
    multiple: false
  });

  React.useEffect(() => {
    setIsDragging(isDragActive);
  }, [isDragActive]);

  return (
    <div 
      {...getRootProps()} 
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
        ${isDragging ? 'border-yellow-500 bg-yellow-500 bg-opacity-10' : 'border-gray-700 bg-gray-800 hover:bg-gray-700'}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-2">
        <svg
          className={`w-12 h-12 ${isDragging ? 'text-yellow-500' : 'text-gray-400'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p className="text-gray-300">
          {isDragging ? (
            <span className="font-medium">Drop your 3D model here</span>
          ) : (
            <span>
              Drag & drop your 3D model, or <span className="text-yellow-500 font-medium">browse</span>
            </span>
          )}
        </p>
        <p className="text-xs text-gray-500">
          Supported formats: {supportedFormats.join(', ')}
        </p>
        {error && (
          <p className="text-sm text-red-500 mt-2">{error}</p>
        )}
      </div>
    </div>
  );
};

export default ModelUploader;