
import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';


const FactCheckGesture = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [result, setResult] = useState(null); // 'true', 'false', or null
  const [dotPosition, setDotPosition] = useState({ x: 20, y: 15 }); // Start left
  const [trailOpacity, setTrailOpacity] = useState(0.3);
  const [showVContent, setShowVContent] = useState(false);
  const [fillProgress, setFillProgress] = useState(0); // 0 to 1 for wiper fill effect

  const centerX = 50; // Center X position (%)
  const floorY = 85;  // Floor Y position (%)
  const leftX = 20;   // Left swing position (50% wider spread)
  const rightX = 80;  // Right swing position (50% wider spread)
  const dotY = 15;    // Dot Y position (slightly higher for better V shape)



  const getFillColor = () => {
    if (result === 'true') return '#10B981'; // Green
    if (result === 'false') return '#EF4444'; // Red
    return '#06B6D4'; // Cyan default
  }

  const triggerGesture = (truthValue) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setResult(truthValue); // Set result immediately for color
    setShowVContent(false);
    setTrailOpacity(0.6);
    setFillProgress(0);
    
    // Animate dot from left to right with fill progress
    const animateWiper = () => {
      const duration = 700;
      const startTime = Date.now();
      const startX = leftX;
      const endX = rightX;
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Smooth easing
        const eased = 1 - Math.pow(1 - progress, 3);
        
        const currentX = startX + (endX - startX) * eased;
        setDotPosition({ x: currentX, y: dotY });
        setFillProgress(eased);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    };
    
    // Start wiper animation
    setTimeout(animateWiper, 100);
    
    // Show V content at peak
    setTimeout(() => {
      setShowVContent(true);
      setTrailOpacity(0.8);
    }, 700);
    
    // Fade out V content before wipe back
    setTimeout(() => {
      setShowVContent(false);
      setTrailOpacity(0.4);
    }, 1300);
    
    // Wipe back to left (reverse animation)
    setTimeout(() => {
      const animateWiperBack = () => {
        const duration = 500;
        const startTime = Date.now();
        const startX = rightX;
        const endX = leftX;
        const startFill = 1;
        const endFill = 0;
        
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Smooth easing
          const eased = 1 - Math.pow(1 - progress, 2);
          
          const currentX = startX + (endX - startX) * eased;
          const currentFill = startFill + (endFill - startFill) * eased;
          
          setDotPosition({ x: currentX, y: dotY });
          setFillProgress(currentFill);
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        
        requestAnimationFrame(animate);
      };
      
      animateWiperBack();
    }, 1500);
    
    // Clear result and reset
    setTimeout(() => {
      setResult(null);
      setFillProgress(0);
      setTrailOpacity(0.3);
      setIsAnimating(false);
    }, 2300);
  };

  const getGlowColor = () => {
    if (result === 'true') return '#10B981'; // Green
    if (result === 'false') return '#EF4444'; // Red
    return '#06B6D4'; // Cyan default
  };

  const getTrailGradient = () => {
    const color = getGlowColor();
    return `linear-gradient(45deg, ${color}40, ${color}10)`;
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gray-900 rounded-lg p-8">
      <div className="relative w-full h-64 mb-8">
        {/* SVG Container */}
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 100 100" 
          className="absolute inset-0"
        >
          {/* Gradient Definitions */}
          <defs>
            <radialGradient id="dotGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={getGlowColor()} stopOpacity="1" />
              <stop offset="70%" stopColor={getGlowColor()} stopOpacity="0.6" />
              <stop offset="100%" stopColor={getGlowColor()} stopOpacity="0" />
            </radialGradient>
            <linearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={getGlowColor()} stopOpacity="0.1" />
              <stop offset="30%" stopColor={getGlowColor()} stopOpacity="0.4" />
              <stop offset="50%" stopColor={getGlowColor()} stopOpacity="0.8" />
              <stop offset="70%" stopColor={getGlowColor()} stopOpacity="0.4" />
              <stop offset="100%" stopColor={getGlowColor()} stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="centerGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="40%" stopColor="transparent" />
              <stop offset="50%" stopColor={getGlowColor()} stopOpacity="0.6" />
              <stop offset="60%" stopColor="transparent" />
            </linearGradient>
            
            {/* Wiper Fill Effect */}
            <mask id="wiperMask">
              <rect width="100%" height="100%" fill="black" />
              {/* Create wiper fill area */}
              <polygon
                points={`${leftX},${dotY} ${centerX},${floorY} ${leftX + (rightX - leftX) * fillProgress},${dotY}`}
                fill="white"
              />
            </mask>
            
            {/* V-Shape Fill Pattern */}
            <pattern id="vFillPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="100%" height="100%" fill={getFillColor()} fillOpacity="0.08" />
              <circle cx="20" cy="20" r="1" fill={getFillColor()} fillOpacity="0.1" />
              <circle cx="80" cy="80" r="1" fill={getFillColor()} fillOpacity="0.1" />
            </pattern>
          </defs>
          
          {/* V-Shape Background Fill */}
          {fillProgress > 0 && (
            <polygon
              points={`${leftX},${dotY} ${centerX},${floorY} ${rightX},${dotY}`}
              fill="url(#vFillPattern)"
              mask="url(#wiperMask)"
              className="transition-opacity duration-200"
              style={{
                filter: `drop-shadow(0 0 20px ${getFillColor()}20)`,
              }}
            />
          )}
          
          {/* Straight Line Trails */}
          <line
            x1={dotPosition.x}
            y1={dotPosition.y}
            x2={centerX}
            y2={floorY}
            stroke={getGlowColor()}
            strokeWidth="1"
            strokeOpacity={trailOpacity * 0.3}
            className="transition-all duration-500 ease-in-out"
          />
          
          {/* Center Glow Line - more prominent in the middle */}
          <line
            x1={dotPosition.x}
            y1={dotPosition.y}
            x2={centerX}
            y2={floorY}
            stroke="url(#centerGlow)"
            strokeWidth="3"
            className="transition-all duration-500 ease-in-out"
            style={{
              filter: `drop-shadow(0 0 4px ${getGlowColor()}40)`,
              opacity: trailOpacity,
            }}
          />
          
          {/* Secondary trail for smooth visual effect */}
          <line
            x1={dotPosition.x}
            y1={dotPosition.y}
            x2={centerX}
            y2={floorY}
            stroke={getGlowColor()}
            strokeWidth="0.5"
            strokeOpacity={trailOpacity * 0.6}
            className="transition-all duration-700 ease-in-out"
            style={{
              filter: `blur(1px)`,
            }}
          />
                    
          {/* Main Glowing Dot */}
          <circle
            cx={dotPosition.x}
            cy={dotPosition.y}
            r="4"
            fill="url(#dotGlow)"
            className="transition-all duration-700 ease-in-out"
            style={{
              filter: `drop-shadow(0 0 12px ${getGlowColor()})`,
            }}
          />
          
          {/* Outer Glow Ring */}
          <circle
            cx={dotPosition.x}
            cy={dotPosition.y}
            r="8"
            fill="none"
            stroke={getGlowColor()}
            strokeWidth="1"
            strokeOpacity="0.3"
            className="transition-all duration-700 ease-in-out animate-pulse"
          />
        </svg>
        
        {/* V-Shape Content Area */}
        {showVContent && (
          <div 
            className="absolute flex items-center justify-center transition-all duration-500 ease-out"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div 
              className="rounded-full p-4 backdrop-blur-sm animate-pulse"
              style={{
                backgroundColor: `${getGlowColor()}15`,
                border: `2px solid ${getGlowColor()}40`,
                boxShadow: `0 0 30px ${getGlowColor()}40, inset 0 0 20px ${getGlowColor()}20`,
              }}
            >
              {result === 'true' ? (
                <Check size={24} color={getGlowColor()} strokeWidth={2.5} />
              ) : (
                <X size={24} color={getGlowColor()} strokeWidth={2.5} />
              )}
            </div>
            
            {/* Expanding ring effect */}
            <div
              className="absolute inset-0 rounded-full border animate-ping"
              style={{
                borderColor: `${getGlowColor()}30`,
                animationDuration: '1s',
              }}
            />
          </div>
        )}
        
      </div>
      
      {/* Control Buttons */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => triggerGesture('true')}
          disabled={isAnimating}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
        >
          <Check size={18} />
          True
        </button>
        
        <button
          onClick={() => triggerGesture('false')}
          disabled={isAnimating}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
        >
          <X size={18} />
          False
        </button>
      </div>
      
      {/* Status Indicator */}
      <div className="mt-4 text-center">
        <div className="text-sm text-gray-400">
          {isAnimating ? (
            <span className="animate-pulse">Analyzing statement...</span>
          ) : (
            "Click a button to trigger fact-check gesture"
          )}
        </div>
      </div>
    </div>
  );
};

export default FactCheckGesture;