'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, ImagePlus, Loader2, X } from 'lucide-react';
import Image from 'next/image';
import { AssetResponse } from './AssetAnalysisLayout';

// Response type definition


// Dummy response for testing
const dummyResponse: AssetResponse = {
  name: "Sample Asset",
  description: "This is a sample asset generated to demonstrate the UI. Edit the details to customize.",
  metadata: {
    id: "asset-123",
    created_at: "2025-05-14T12:00:00Z",
    tags: ["sample", "demo", "test"],
    attributes: {
      rarity: "common",
      category: "illustration"
    }
  },
  image_url: "/api/placeholder/400/300"
};

type Props = {
  setResponse: (response: AssetResponse | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setAssetName: (name: string) => void;
  setMetadataJson: (json: string) => void;
  setAssetDescription: (description: string) => void;
}

const AssetAnalysisUpload = ({ setResponse, isLoading, setIsLoading, setAssetName, setMetadataJson, setAssetDescription }: Props) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Create preview URL
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);

      // Reset previous results
      setResponse(null);
    }
  };

  // Remove selected file
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Process image (call backend API)
  const processImage = async () => {
    if (!selectedFile) return;

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const res = await fetch('http://localhost:8000/assets/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      console.log("Response:", res);
      const data = await res.json();

      // For demonstration, just use the first result (OpenAI or Gemini)
      // You can adapt this to show both results if needed
      const firstResult = Array.isArray(data) && data.length > 0 ? data[0] : null;

      if (firstResult) {
        setResponse({
          name: firstResult.name || "Unnamed Asset",
          description: firstResult.description || "",
          metadata: {
            ...firstResult,
          },
          image_url: previewUrl || "",
        });
        setAssetName(firstResult.name || "");
        setAssetDescription(firstResult.description || "");
        setMetadataJson(JSON.stringify(firstResult, null, 2));
      } else {
        setResponse(null);
        setAssetName("");
        setAssetDescription("");
        setMetadataJson("");
      }
    } catch (error) {
      setResponse(null);
      setAssetName("");
      setAssetDescription("");
      setMetadataJson("");
      // Optionally handle error UI here
      console.error("Image analysis failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-gray-800 min-w-[400px] min-h-[400px] rounded-lg p-4 border border-gray-700">
        <h2 className="text-lg font-semibold mb-4">Upload Image</h2>

        {!previewUrl ? (
          <div
            className="border-2 border-dashed border-gray-600 rounded-lg p-8 cursor-pointer hover:border-blue-500 transition-colors flex flex-col items-center justify-center"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImagePlus className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-gray-400 text-center">
              Click to select or drop an image file
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Supports: JPG, PNG, WebP
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        ) : (
          <div className="relative">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={previewUrl}
                alt="Selected image preview"
                className="object-cover"
                fill
              />
            </div>
            <button
              onClick={handleRemoveFile}
              className="absolute top-2 right-2 bg-gray-900 bg-opacity-70 rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <p className="text-sm text-gray-400 mt-2 truncate">
              {selectedFile?.name}
            </p>
          </div>
        )}

        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ backgroundColor: "#4f46e5" }}
          onClick={processImage}
          disabled={!selectedFile || isLoading}
          className={`mt-4 w-full py-2 rounded-lg font-medium flex items-center justify-center space-x-2
                ${!selectedFile || isLoading
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Upload className="h-5 w-5" />
              <span>Process Asset</span>
            </>
          )}
        </motion.button>
      </div>
    </>
  );
}

export default AssetAnalysisUpload;