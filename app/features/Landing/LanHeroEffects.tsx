import { m } from "framer-motion";
import { useScroll, useTransform, useSpring } from "framer-motion";

const LanHeroEffects = () => {
    const { scrollY } = useScroll();
    const y1 = useSpring(useTransform(scrollY, [0, 1000], [0, -200]), { stiffness: 100, damping: 30 });
    const y2 = useSpring(useTransform(scrollY, [0, 1000], [0, -100]), { stiffness: 100, damping: 30 });
    const opacity = useSpring(useTransform(scrollY, [0, 500], [1, 0]), { stiffness: 100, damping: 30 });
    
    return (
        <m.div 
            className="absolute inset-0 z-0" 
            style={{ opacity }}
        >
            {/* Code Matrix Background - Increased opacity */}
            <div className="absolute inset-0 opacity-20">
                {Array.from({ length: 50 }).map((_, i) => (
                    <m.div
                        key={i}
                        className="absolute text-sky-400 font-mono text-xs select-none pointer-events-none"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -20, 0],
                            opacity: [0, 1, 0]
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2
                        }}
                    >
                        {Math.random() > 0.5 ? '01' : 'AI'}
                    </m.div>
                ))}
            </div>

            {/* Neural Network Visualization - Increased opacity */}
            <svg className="absolute inset-0 w-full h-full opacity-4" viewBox="0 0 1200 800">
                {/* Nodes */}
                {Array.from({ length: 20 }).map((_, i) => (
                    <m.circle
                        key={i}
                        cx={100 + (i % 5) * 250}
                        cy={150 + Math.floor(i / 5) * 150}
                        r="4"
                        fill="currentColor"
                        className="text-sky-400"
                        animate={{
                            r: [3, 6, 3],
                            opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.1
                        }}
                    />
                ))}
                {/* Connections */}
                {Array.from({ length: 15 }).map((_, i) => (
                    <m.line
                        key={i}
                        x1={100 + (i % 4) * 250}
                        y1={150 + Math.floor(i / 4) * 150}
                        x2={350 + (i % 4) * 250}
                        y2={150 + Math.floor(i / 4) * 150}
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-sky-500"
                        animate={{
                            opacity: [0.3, 0.8, 0.3]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 0.2
                        }}
                    />
                ))}
            </svg>

            {/* Enhanced Light Effects with fallback gradients */}
            <m.div
                className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
                style={{ 
                    y: y1,
                    background: 'radial-gradient(circle, rgba(14, 165, 233, 0.3) 0%, rgba(14, 165, 233, 0.1) 50%, transparent 100%)'
                }}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.3, 0.1]
                }}
                transition={{ duration: 8, repeat: Infinity }}
            />
            <m.div
                className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl"
                style={{ 
                    y: y2,
                    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, rgba(236, 72, 153, 0.15) 50%, transparent 100%)'
                }}
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 10, repeat: Infinity, delay: 2 }}
            />
        </m.div>
    );
};

export default LanHeroEffects;