"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/app/lib/utils";

type LoadingVariant = 
  | "spinner" 
  | "dots" 
  | "pulse" 
  | "progress" 
  | "skeleton";

type LoadingSize = "sm" | "md" | "lg";

type LoadingProps = {
  variant?: LoadingVariant;
  size?: LoadingSize;
  text?: string;
  progress?: number;
  className?: string;
  textClassName?: string;
  color?: string;
};

const sizeMap = {
  sm: {
    spinner: "h-4 w-4",
    dots: "h-1 w-1",
    pulse: "h-4 w-4",
    progress: "h-1",
    text: "text-xs",
  },
  md: {
    spinner: "h-8 w-8",
    dots: "h-2 w-2",
    pulse: "h-8 w-8",
    progress: "h-2",
    text: "text-sm",
  },
  lg: {
    spinner: "h-12 w-12",
    dots: "h-3 w-3",
    pulse: "h-12 w-12",
    progress: "h-3",
    text: "text-base",
  },
};

export function Loading({
  variant = "spinner",
  size = "md",
  text,
  progress = 0,
  className,
  textClassName,
  color = "currentColor",
}: LoadingProps) {
  const renderLoader = () => {
    switch (variant) {
      case "spinner":
        return (
          <div className={cn("relative", className)}>
            <motion.svg
              className={cn(sizeMap[size].spinner)}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke={color}
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill={color}
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </motion.svg>
          </div>
        );

      case "dots":
        return (
          <div className={cn("flex space-x-2", className)}>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={cn(
                  "rounded-full bg-current",
                  sizeMap[size].dots
                )}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        );

      case "pulse":
        return (
          <motion.div
            className={cn(
              "rounded-full bg-current",
              sizeMap[size].pulse,
              className
            )}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );

      case "progress":
        return (
          <div
            className={cn(
              "w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700",
              sizeMap[size].progress,
              className
            )}
          >
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        );

      case "skeleton":
        return (
          <div
            className={cn(
              "w-full rounded-md bg-gray-200 dark:bg-gray-700",
              className
            )}
          >
            <motion.div
              className="h-full w-full rounded-md bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ["calc(-100%)", "calc(100%)"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {renderLoader()}
      {text && (
        <p
          className={cn(
            "mt-2 text-center text-gray-500 dark:text-gray-400",
            sizeMap[size].text,
            textClassName
          )}
        >
          {text}
        </p>
      )}
    </div>
  );
}

