"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { getImageWithCache } from "@/app/utils/imageCache";
import { cn } from "@/app/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  fallback?: React.ReactNode;
  showLoadingIndicator?: boolean;
  loadingIndicator?: React.ReactNode;
  fill?: boolean;
  width?: number;
  height?: number;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  base64Data?: string;
  contentType?: string;
}

export function OptimizedImage({
  src,
  alt,
  className,
  priority = false,
  onLoad,
  onError,
  fallback,
  showLoadingIndicator = true,
  loadingIndicator,
  fill = false,
  width,
  height,
  objectFit = "cover",
  base64Data,
  contentType,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(!base64Data);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>("");
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    setIsLoading(!base64Data);
    setHasError(false);

    // If we already have base64 data, use it directly
    if (base64Data && contentType) {
      setImageSrc(`data:${contentType};base64,${base64Data}`);
      setIsLoading(false);
      return;
    }

    // Otherwise, load the image from the URL with caching
    const loadImage = async () => {
      try {
        const cachedSrc = await getImageWithCache(src, priority);
        if (isMounted.current) {
          if (cachedSrc) {
            setImageSrc(cachedSrc);
            setIsLoading(false);
          } else {
            // If the image isn't loaded yet due to concurrent limits,
            // we'll use the original src and let Next.js handle it
            setImageSrc(src);
          }
        }
      } catch (error) {
        if (isMounted.current) {
          console.error("Error loading image:", error);
          setHasError(true);
          setIsLoading(false);
          onError?.();
        }
      }
    };

    loadImage();
  }, [src, base64Data, contentType, priority, onError]);

  const handleImageLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleImageError = () => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  };

  if (hasError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gray-800/50",
          className
        )}
        style={{ width: fill ? "100%" : width, height: fill ? "100%" : height }}
      >
        {fallback || (
          <span className="text-xs text-gray-400">Image unavailable</span>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn("relative", className)}
      style={{ width: fill ? "100%" : width, height: fill ? "100%" : height }}
    >
      <AnimatePresence>
        {isLoading && showLoadingIndicator && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-10"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {loadingIndicator || (
              <div className="w-4 h-4 border-2 border-t-transparent border-blue-400 rounded-full animate-spin" />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {imageSrc && (
        <Image
          src={imageSrc}
          alt={alt}
          className={cn(
            "transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          fill={fill}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          style={{ objectFit }}
          loading={priority ? "eager" : "lazy"}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
    </div>
  );
}

