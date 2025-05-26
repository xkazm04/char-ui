import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

const PatternedBackground = ({ lightingPreset }: { lightingPreset: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const starsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.005; // Slower rotation
    }
    if (starsRef.current) {
      starsRef.current.rotation.y = state.clock.getElapsedTime() * 0.002; // Much slower
      starsRef.current.rotation.x = state.clock.getElapsedTime() * 0.001;
    }
  });

  return (
    <>
      {/* Subtle Animated Stars */}
      <Stars
        ref={starsRef}
        radius={100}
        depth={60}
        count={800} 
        factor={1.5}
        saturation={0}
        fade
        speed={0.2} 
      />
      
      {/* Minimal Night Sky Background */}
      <mesh ref={meshRef} position={[0, 0, -20]} scale={[40, 40, 1]}>
        <planeGeometry args={[1, 1, 64, 64]} />
        <meshBasicMaterial>
          <primitive
            object={(() => {
              const canvas = document.createElement('canvas');
              canvas.width = 512;
              canvas.height = 512;
              const ctx = canvas.getContext('2d')!;
              
              // Create subtle dark gradient - more like modern dark UI
              const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
              gradient.addColorStop(0, '#0a0a0f'); // Very subtle blue-gray center
              gradient.addColorStop(0.4, '#0a0a0f'); // Darker
              gradient.addColorStop(0.7, '#0a0a0f'); // Even darker
              gradient.addColorStop(0.9, '#0a0a0f'); // Almost black
              gradient.addColorStop(1, '#0a0a0f'); // Pure dark
              
              ctx.fillStyle = gradient;
              ctx.fillRect(0, 0, 512, 512);
              
              // Very subtle nebula hints - barely visible
              ctx.globalCompositeOperation = 'screen';
              for (let i = 0; i < 3; i++) {
                const x = Math.random() * 512;
                const y = Math.random() * 512;
                const size = Math.random() * 150 + 100;
                
                const nebulaGradient = ctx.createRadialGradient(x, y, 0, x, y, size);
                // Much more subtle colors
                nebulaGradient.addColorStop(0, 'rgba(30, 30, 50, 0.03)');
                nebulaGradient.addColorStop(0.5, 'rgba(20, 20, 40, 0.02)');
                nebulaGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                
                ctx.fillStyle = nebulaGradient;
                ctx.fillRect(0, 0, 512, 512);
              }
              
              ctx.globalCompositeOperation = 'source-over';
              
              // Tiny, subtle distant stars
              ctx.fillStyle = '#ffffff';
              ctx.globalAlpha = 0.2; // Much more subtle
              for (let i = 0; i < 150; i++) { // Fewer stars
                const x = Math.random() * 512;
                const y = Math.random() * 512;
                const radius = Math.random() * 0.3 + 0.1; // Much smaller
                
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
              }
              
              // Even more subtle accent points
              ctx.fillStyle = '#e8e8e8'; // Neutral white-gray instead of colors
              ctx.globalAlpha = 0.15;
              for (let i = 0; i < 20; i++) { // Much fewer
                const x = Math.random() * 512;
                const y = Math.random() * 512;
                const radius = Math.random() * 0.4 + 0.2; // Tiny
                
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
                
                // Very subtle glow - no cross effects
                if (Math.random() > 0.7) {
                  ctx.globalAlpha = 0.05;
                  ctx.beginPath();
                  ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
                  ctx.fill();
                  ctx.globalAlpha = 0.15;
                }
              }
              
              // Remove shooting stars for cleaner look
              
              const texture = new THREE.CanvasTexture(canvas);
              texture.wrapS = THREE.RepeatWrapping;
              texture.wrapT = THREE.RepeatWrapping;
              texture.repeat.set(1, 1);
              return texture;
            })()}
            attach="map"
          />
        </meshBasicMaterial>
      </mesh>
    </>
  );
};

export default PatternedBackground;