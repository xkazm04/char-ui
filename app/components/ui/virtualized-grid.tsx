"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { performance } from "@/app/styles/design-tokens";

interface VirtualizedGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number;
  itemWidth: number;
  gap?: number;
  overscan?: number;
  className?: string;
  onEndReached?: () => void;
  endReachedThreshold?: number;
  loadingIndicator?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  getItemKey: (item: T) => string;
  columnCount?: number;
  autoColumns?: boolean;
}

export function VirtualizedGrid<T>({
  items,
  renderItem,
  itemHeight,
  itemWidth,
  gap = 8,
  overscan = 5,
  className = "",
  onEndReached,
  endReachedThreshold = 0.8,
  loadingIndicator,
  emptyComponent,
  getItemKey,
  columnCount: propColumnCount,
  autoColumns = true,
}: VirtualizedGridProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
  const [columnCount, setColumnCount] = useState(propColumnCount || 3);
  const [isLoading, setIsLoading] = useState(false);
  const loadingRef = useRef(false);
  const lastScrollTop = useRef(0);
  const scrollDirectionRef = useRef<"up" | "down">("down");

  // Calculate the number of columns based on container width
  const calculateColumnCount = useCallback(() => {
    if (!autoColumns || propColumnCount) return;
    
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const calculatedColumns = Math.floor(
        (containerWidth + gap) / (itemWidth + gap)
      );
      setColumnCount(Math.max(1, calculatedColumns));
    }
  }, [autoColumns, gap, itemWidth, propColumnCount]);

  // Calculate the total height of the grid
  const totalHeight = Math.ceil(items.length / columnCount) * (itemHeight + gap) - gap;

  // Calculate which items should be visible
  const calculateVisibleRange = useCallback(() => {
    if (!containerRef.current) return;

    const { scrollTop, clientHeight } = containerRef.current;
    const scrollDirection = scrollTop > lastScrollTop.current ? "down" : "up";
    scrollDirectionRef.current = scrollDirection;
    lastScrollTop.current = scrollTop;

    // Calculate visible rows
    const rowHeight = itemHeight + gap;
    const startRow = Math.floor(scrollTop / rowHeight);
    const endRow = Math.ceil((scrollTop + clientHeight) / rowHeight);
    
    // Add overscan for smoother scrolling
    const overscanStart = Math.max(0, startRow - (scrollDirection === "up" ? overscan : 0));
    const overscanEnd = Math.min(
      Math.ceil(items.length / columnCount),
      endRow + (scrollDirection === "down" ? overscan : 0)
    );

    // Calculate item indices
    const startIndex = overscanStart * columnCount;
    const endIndex = Math.min(items.length, (overscanEnd + 1) * columnCount);

    setVisibleRange({ start: startIndex, end: endIndex });

    // Check if we need to load more items
    if (
      onEndReached &&
      !loadingRef.current &&
      scrollDirection === "down" &&
      scrollTop + clientHeight >= totalHeight * endReachedThreshold
    ) {
      loadingRef.current = true;
      setIsLoading(true);
      onEndReached();
    }
  }, [columnCount, gap, itemHeight, items.length, onEndReached, overscan, totalHeight, endReachedThreshold]);

  // Handle scroll events
  const handleScroll = useCallback(() => {
    window.requestAnimationFrame(calculateVisibleRange);
  }, [calculateVisibleRange]);

  // Initialize and handle resize
  useEffect(() => {
    calculateColumnCount();
    calculateVisibleRange();

    const resizeObserver = new ResizeObserver(() => {
      calculateColumnCount();
      calculateVisibleRange();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", calculateColumnCount);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", calculateColumnCount);
    };
  }, [calculateColumnCount, calculateVisibleRange]);

  // Reset loading state when items change
  useEffect(() => {
    loadingRef.current = false;
    setIsLoading(false);
    calculateVisibleRange();
  }, [items, calculateVisibleRange]);

  // Render visible items
  const visibleItems = items.slice(visibleRange.start, visibleRange.end);

  // Calculate positions for each visible item
  const getItemStyle = (index: number) => {
    const adjustedIndex = index + visibleRange.start;
    const row = Math.floor(adjustedIndex / columnCount);
    const col = adjustedIndex % columnCount;
    
    return {
      position: "absolute" as const,
      top: row * (itemHeight + gap),
      left: col * (itemWidth + gap),
      width: itemWidth,
      height: itemHeight,
    };
  };

  if (items.length === 0 && emptyComponent) {
    return <>{emptyComponent}</>;
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-auto ${className}`}
      style={{ height: "100%" }}
      onScroll={handleScroll}
    >
      <div
        className="relative"
        style={{
          height: totalHeight,
          width: "100%",
        }}
      >
        {visibleItems.map((item, index) => (
          <div
            key={getItemKey(item)}
            style={getItemStyle(index)}
            className="absolute"
          >
            {renderItem(item, index + visibleRange.start)}
          </div>
        ))}
      </div>
      {isLoading && loadingIndicator && (
        <div className="sticky bottom-0 w-full">{loadingIndicator}</div>
      )}
    </div>
  );
}

