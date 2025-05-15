import { motion, AnimatePresence } from "framer-motion";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState, DragEvent } from "react";
import { Asset } from "./AssetAnalysisResult";

const dropzoneVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: "easeIn" } },
};

type Props = {
    selectedFile: File | null;
    setSelectedFile: (file: File | null) => void;
    setOpenaiAssets: (assets: Asset[]) => void;
    setGeminiAssets: (assets: Asset[]) => void;
    setGroqAssets: (assets: Asset[]) => void; 
}

const AssetAnalysisUploadImage = ({selectedFile, setSelectedFile, setOpenaiAssets, setGroqAssets, setGeminiAssets}: Props) => {
    const [isDragActive, setIsDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setOpenaiAssets([]);
            setGeminiAssets([]);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            setSelectedFile(file);
            setOpenaiAssets([]);
            setGeminiAssets([]);
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragActive(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragActive(false);
    };

    // Remove selected file
    const handleRemoveFile = () => {
        setSelectedFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setGroqAssets([]);
        setOpenaiAssets([]);
        setGeminiAssets([]);
    };
    return <div className="min-w-[400px] rounded-lg flex flex-col justify-between">
        <h2 className="text-lg font-semibold mb-4 text-sky-100">Upload Image</h2>
        <div className="flex-grow relative">
            <AnimatePresence mode="wait">
                {!selectedFile ? (
                    <motion.div
                        key="dropzone"
                        variants={dropzoneVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className={`absolute min-h-[200px] inset-0 border-2 border-dashed rounded-lg p-8 cursor-pointer flex flex-col items-center justify-center transition-colors
                ${isDragActive ? 'border-sky-800 bg-gray-700/50' : 'border-gray-600'}
              `}
                        onClick={() => fileInputRef.current?.click()}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                    >
                        <ImagePlus className="h-12 w-12 text-sky-200 mb-2" />
                        <p className="text-gray-300 text-center">
                            Drag & drop or click to select an image file
                        </p>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="preview"
                        variants={dropzoneVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <button
                            onClick={handleRemoveFile}
                            className="absolute top-2 right-2 bg-gray-900/50 hover:bg-gray-900/80 
                text-red-400 hover:text-red-300 rounded-full p-1.5 text-xs z-10 transition-all"
                        >
                            <X size={16} />
                        </button>
                        <div
                            className="relative w-full h-full overflow-hidden rounded-lg cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                            title="Change image"
                        >
                            <Image
                                src={URL.createObjectURL(selectedFile)}
                                alt="Selected image preview"
                                className="object-contain"
                                fill
                                sizes="(max-width: 400px) 100vw"
                                style={{ transition: 'opacity 0.3s linear' }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    </div>
}

export default AssetAnalysisUploadImage;