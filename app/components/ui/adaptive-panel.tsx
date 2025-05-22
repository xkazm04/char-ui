"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/app/lib/utils";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";

interface AdaptivePanelProps {
  children: React.ReactNode;
  title?: string;
  defaultWidth?: string;
  minWidth?: string;
  maxWidth?: string;
  position?: "left" | "right";
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  collapsible?: boolean;
  resizable?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  onWidthChange?: (width: string) => void;
  fullscreenable?: boolean;
  importance?: "low" | "medium" | "high";
}

export function AdaptivePanel({
  children,
  title,
  defaultWidth = "300px",
  minWidth = "200px",
  maxWidth = "600px",
  position = "right",
  className,
  headerClassName,
  bodyClassName,
  collapsible = true,
  resizable = true,
  defaultCollapsed = false,
  onCollapsedChange,
  onWidthChange,
  fullscreenable = false,
  importance = "medium",
}: AdaptivePanelProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [width, setWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  // Responsive behavior based on importance
  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      
      // Auto-collapse on small screens based on importance
      if (windowWidth < 768 && importance === "low" && !collapsed) {
        setCollapsed(true);
        onCollapsedChange?.(true);
      } else if (windowWidth < 640 && importance === "medium" && !collapsed) {
        setCollapsed(true);
        onCollapsedChange?.(true);
      }
      
      // Adjust width based on screen size
      if (windowWidth < 1024 && !collapsed) {
        const newWidth = Math.min(parseInt(width), windowWidth * 0.4) + "px";
        setWidth(newWidth);
        onWidthChange?.(newWidth);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [collapsed, importance, onCollapsedChange, onWidthChange, width]);

  // Handle resize logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const dx = e.clientX - startXRef.current;
      let newWidth = position === "right" 
        ? startWidthRef.current - dx 
        : startWidthRef.current + dx;
      
      // Enforce min/max constraints
      newWidth = Math.max(parseInt(minWidth), Math.min(parseInt(maxWidth), newWidth));
      
      setWidth(`${newWidth}px`);
      onWidthChange?.(`${newWidth}px`);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, maxWidth, minWidth, onWidthChange, position]);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = panelRef.current?.offsetWidth || parseInt(defaultWidth);
    document.body.style.cursor = position === "right" ? "w-resize" : "e-resize";
    document.body.style.userSelect = "none";
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
    onCollapsedChange?.(!collapsed);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      // Save current width before going fullscreen
      startWidthRef.current = panelRef.current?.offsetWidth || parseInt(defaultWidth);
    } else {
      // Restore previous width
      setWidth(`${startWidthRef.current}px`);
      onWidthChange?.(`${startWidthRef.current}px`);
    }
  };

  return (
    <div className={cn("relative flex h-full", className)}>
      {/* Resize handle */}
      {resizable && !collapsed && !isFullscreen && (
        <div
          className={cn(
            "absolute top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/20 active:bg-primary/40 z-10",
            position === "right" ? "left-0" : "right-0"
          )}
          onMouseDown={handleResizeStart}
        />
      )}

      {/* Panel content */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            ref={panelRef}
            className={cn(
              "flex flex-col overflow-hidden border-gray-200 dark:border-gray-800",
              position === "right" ? "border-l" : "border-r",
              isFullscreen ? "fixed inset-0 z-50 bg-background" : ""
            )}
            style={{ width: isFullscreen ? "100%" : width }}
            initial={{ 
              [position]: "-100%", 
              opacity: 0 
            }}
            animate={{ 
              [position]: 0, 
              opacity: 1 
            }}
            exit={{ 
              [position]: "-100%", 
              opacity: 0 
            }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300 
            }}
          >
            {/* Panel header */}
            <div
              className={cn(
                "flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2 dark:border-gray-800 dark:bg-gray-900",
                headerClassName
              )}
            >
              {title && <h3 className="font-medium">{title}</h3>}
              <div className="flex items-center space-x-1">
                {fullscreenable && (
                  <button
                    onClick={toggleFullscreen}
                    className="rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-800"
                    aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                  >
                    {isFullscreen ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
                  </button>
                )}
                {collapsible && (
                  <button
                    onClick={toggleCollapse}
                    className="rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-800"
                    aria-label="Collapse panel"
                  >
                    {position === "right" ? (
                      <ChevronRight className="h-4 w-4" />
                    ) : (
                      <ChevronLeft className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Panel body */}
            <div className={cn("flex-1 overflow-auto p-4", bodyClassName)}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed state toggle button */}
      {collapsed && collapsible && (
        <button
          onClick={toggleCollapse}
          className={cn(
            "absolute top-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90",
            position === "right" ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2"
          )}
          aria-label="Expand panel"
        >
          {position === "right" ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      )}
    </div>
  );
}

