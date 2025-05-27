import React, { useState, useRef, useEffect } from 'react';

interface LazyRenderWrapperProps {
  children: React.ReactNode;
  placeholderHeight?: string | number; // e.g., '200px' or 200
  rootMargin?: string;
  once?: boolean; // Only trigger once
}

const LazyRenderWrapper: React.FC<LazyRenderWrapperProps> = ({
  children,
  placeholderHeight = '200px', 
  rootMargin = '200px 0px',
  once = true,
}) => {
  const [isInView, setIsInView] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentElement = targetRef.current;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once && targetRef.current) {
            observer.unobserve(targetRef.current);
          }
        } else if (!once) {
        }
      },
      {
        rootMargin, 
      }
    );

    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
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