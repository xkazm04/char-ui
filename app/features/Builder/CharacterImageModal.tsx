import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { GenType, UsedAssets } from "@/app/types/gen";
import { downloadImage } from "@/app/utils/downloadHelpers";
import CharModalHeader from "@/app/components/ui/modal/CharImageModal/CharModalHeader";
import Image from "next/image";
import CharModalControls from "@/app/components/ui/modal/CharImageModal/CharModalControls";
import CharModalInfo from "@/app/components/ui/modal/CharImageModal/CharModalInfo";

interface CharacterImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  gen: GenType;
  usedAssets?: UsedAssets[];
}

const CharacterImageModal = ({
  isOpen,
  onClose,
  gen,
  usedAssets
}: CharacterImageModalProps) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showInfo, setShowInfo] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === '=') {
        handleZoomIn();
      } else if (event.key === '-') {
        handleZoomOut();
      } else if (event.key === 'r') {
        handleReset();
      } else if (event.key === 'i') {
        setShowInfo(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setZoom(1);
      setPosition({ x: 0, y: 0 });
      setImageLoaded(false);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev * 1.2, 5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev / 1.2, 0.1));
  }, []);

  const handleReset = useCallback(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleDownload = useCallback(async () => {
    const filename = gen.image_url.split('/').pop() || 'character-sketch.png';
    await downloadImage(gen.image_url, filename);
  }, [gen.image_url]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  }, [zoom, position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }, [isDragging, dragStart, zoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  }, [handleZoomIn, handleZoomOut]);

  const createdDate = new Date(gen.created_at || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md"
          onClick={onClose}
        >
          {/* Header */}
          <CharModalHeader
            createdDate={createdDate}
            showInfo={showInfo}
            setShowInfo={setShowInfo}
            onClose={onClose}
            />

          {/* Image Container */}
          <div 
            className="flex items-center justify-center h-full p-20"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onWheel={handleWheel}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-full max-h-full"
              style={{
                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
              }}
            >
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-lg">
                  <div className="w-8 h-8 border-2 border-sky-500 rounded-full animate-spin border-t-transparent"></div>
                </div>
              )}
              
              <Image
                src={gen.image_url}
                alt="Character image"
                width={800}
                height={1000}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                onLoad={() => setImageLoaded(true)}
                priority
              />
            </motion.div>
          </div>

          {/* Controls */}
          <CharModalControls
            handleZoomIn={handleZoomIn}
            handleZoomOut={handleZoomOut}
            handleReset={handleReset}
            handleDownload={handleDownload}
            zoom={zoom}
          />
          {/* Info Panel */}
          <AnimatePresence>
            {showInfo && usedAssets && (
              <CharModalInfo usedAssets={usedAssets} />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (typeof window === 'undefined') return null;

  return createPortal(modalContent, document.body);
};

export default CharacterImageModal;