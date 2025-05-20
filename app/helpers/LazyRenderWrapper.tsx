import React, { useState, useRef, useEffect } from 'react';

interface LazyRenderWrapperProps {
  children: React.ReactNode;
  placeholderHeight?: string | number; // e.g., '200px' or 200
  rootMargin?: string;
  once?: boolean; // Only trigger once
}

const LazyRenderWrapper: React.FC<LazyRenderWrapperProps> = ({
  children,
  placeholderHeight = '200px', // Adjust based on AssetGroupItem's typical height
  rootMargin = '200px 0px', // Load items 200px before they enter viewport
  once = true,
}) => {
  const [isInView, setIsInView] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once && targetRef.current) {
            observer.unobserve(targetRef.current);
          }
        } else if (!once) {
          // Optional: if you want to un-render when out of view again
          // setIsInView(false);
        }
      },
      {
        rootMargin, // How far from the viewport to trigger
      }
    );

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
    };
  }, [rootMargin, once]);

  if (isInView) {
    return <>{children}</>;
  }

  return (
    <div
      ref={targetRef}
      style={{ height: placeholderHeight, width: '100%' }}
      className="bg-gray-800/10 rounded-md" // Optional: visual placeholder
    />
  );
};

export default LazyRenderWrapper;