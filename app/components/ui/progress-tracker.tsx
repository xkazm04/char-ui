"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/app/lib/utils";
import { CheckCircle2, Circle, HelpCircle, Info } from "lucide-react";

export type ProgressStep = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  locked?: boolean;
  icon?: React.ReactNode;
};

export type ProgressLevel = {
  level: number;
  title: string;
  description: string;
  requiredSteps: number;
  maxSteps: number;
};

interface ProgressTrackerProps {
  steps: ProgressStep[];
  currentStepId?: string;
  orientation?: "horizontal" | "vertical";
  showLabels?: boolean;
  className?: string;
  onStepClick?: (stepId: string) => void;
  levels?: ProgressLevel[];
  showLevelInfo?: boolean;
}

export function ProgressTracker({
  steps,
  currentStepId,
  orientation = "horizontal",
  showLabels = true,
  className,
  onStepClick,
  levels,
  showLevelInfo = false,
}: ProgressTrackerProps) {
  const [activeStep, setActiveStep] = useState<string | undefined>(currentStepId);
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);
  const [currentLevel, setCurrentLevel] = useState<ProgressLevel | null>(null);
  const [completedSteps, setCompletedSteps] = useState(0);

  // Update active step when currentStepId changes
  useEffect(() => {
    if (currentStepId) {
      setActiveStep(currentStepId);
    }
  }, [currentStepId]);

  // Calculate completed steps and current level
  useEffect(() => {
    const completed = steps.filter(step => step.completed).length;
    setCompletedSteps(completed);

    if (levels && levels.length > 0) {
      // Find the highest level that the user qualifies for
      const qualifyingLevels = levels.filter(
        level => completed >= level.requiredSteps
      );
      
      if (qualifyingLevels.length > 0) {
        // Sort by level in descending order and take the highest
        const highestLevel = [...qualifyingLevels].sort(
          (a, b) => b.level - a.level
        )[0];
        setCurrentLevel(highestLevel);
      } else {
        setCurrentLevel(levels[0]); // Default to first level
      }
    }
  }, [steps, levels]);

  const handleStepClick = (stepId: string) => {
    const step = steps.find(s => s.id === stepId);
    if (step && !step.locked) {
      setActiveStep(stepId);
      onStepClick?.(stepId);
    }
  };

  const calculateProgress = () => {
    if (steps.length === 0) return 0;
    return (completedSteps / steps.length) * 100;
  };

  const progress = calculateProgress();

  return (
    <div className={cn("w-full", className)}>
      {/* Level information */}
      {levels && currentLevel && showLevelInfo && (
        <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">
                Level {currentLevel.level}: {currentLevel.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {currentLevel.description}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center">
                <span className="mr-2 text-sm font-medium">
                  {completedSteps}/{steps.length} completed
                </span>
                <Info className="h-4 w-4 text-gray-400" />
              </div>
              <div className="mt-1 h-2 w-24 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              {levels.length > 1 && currentLevel.level < levels.length && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {currentLevel.maxSteps - completedSteps} more to level{" "}
                  {currentLevel.level + 1}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Progress steps */}
      <div
        className={cn(
          "relative",
          orientation === "horizontal" ? "flex items-center" : "flex flex-col"
        )}
      >
        {/* Progress line */}
        <div
          className={cn(
            "absolute bg-gray-200 dark:bg-gray-700",
            orientation === "horizontal"
              ? "h-0.5 w-full"
              : "h-full w-0.5 left-4"
          )}
        >
          <motion.div
            className="bg-primary h-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              "relative flex",
              orientation === "horizontal"
                ? "flex-1 flex-col items-center"
                : "flex-row items-center py-2"
            )}
          >
            {/* Step indicator */}
            <button
              className={cn(
                "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-200",
                step.completed
                  ? "border-primary bg-primary text-primary-foreground"
                  : step.locked
                  ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed dark:border-gray-600 dark:bg-gray-800"
                  : "border-gray-300 bg-white text-gray-500 hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-gray-500",
                activeStep === step.id &&
                  "ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-900"
              )}
              onClick={() => handleStepClick(step.id)}
              onMouseEnter={() => setHoveredStep(step.id)}
              onMouseLeave={() => setHoveredStep(null)}
              disabled={step.locked}
              aria-current={activeStep === step.id ? "step" : undefined}
            >
              {step.icon ? (
                step.icon
              ) : step.completed ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : step.locked ? (
                <Circle className="h-5 w-5" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </button>

            {/* Step label */}
            {showLabels && (
              <div
                className={cn(
                  "text-center",
                  orientation === "horizontal"
                    ? "mt-2"
                    : "ml-4 flex-1"
                )}
              >
                <p
                  className={cn(
                    "text-sm font-medium",
                    step.completed
                      ? "text-primary"
                      : step.locked
                      ? "text-gray-400 dark:text-gray-500"
                      : "text-gray-700 dark:text-gray-300"
                  )}
                >
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {step.description}
                  </p>
                )}
              </div>
            )}

            {/* Tooltip on hover */}
            <AnimatePresence>
              {hoveredStep === step.id && step.description && !showLabels && (
                <motion.div
                  className="absolute left-1/2 top-10 z-20 w-48 -translate-x-1/2 rounded-md bg-gray-900 p-2 text-xs text-white shadow-lg dark:bg-gray-800"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-gray-900 dark:bg-gray-800" />
                  <p className="font-medium">{step.title}</p>
                  <p className="mt-1 text-gray-300">{step.description}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

