import { useRef, useState, useEffect } from "react";
import GlowingText from "@/app/components/landing/GlowingText";
import { NavTabTypes } from "@/app/types/nav";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { LucidePlay } from "lucide-react";

type Props = {
    setTab: (tab: NavTabTypes) => void;
}

const LanHero = ({ setTab }: Props) => {
    const shouldReduceMotion = useReducedMotion();
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    
    // Parallax scroll effect
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, -100]);
    const y2 = useTransform(scrollY, [0, 500], [0, -50]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            setMousePosition({ 
                x: (x / rect.width - 0.5) * 20, 
                y: (y / rect.height - 0.5) * 20 
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Dynamic background grid pattern
    const gridCount = 15;
    const gridItems = Array.from({ length: gridCount });

    return (
        <section 
            ref={containerRef}
            className="relative min-h-[70vh] pt-2 pb-5 px-6 overflow-hidden flex items-center"
        >
            {/* Dynamic background animation */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-[#0a0a18]"></div>
                <div className="absolute inset-0">
                    <div className="grid grid-cols-5 h-full">
                        {gridItems.map((_, i) => (
                            <m.div
                                key={i}
                                className="bg-sky-600/5 border-[0.5px] border-sky-500/10"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ 
                                    delay: i * 0.03, 
                                    duration: 1 
                                }}
                            />
                        ))}
                    </div>
                </div>
                
                {/* Abstract background shapes */}
                <m.div 
                    className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full bg-gradient-to-r from-sky-600/20 to-sky-600/20 blur-3xl"
                    style={{ y: y1 }}
                />
                <m.div 
                    className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-gradient-to-tr from-purple-600/20 to-fuchsia-600/20 blur-3xl"
                    style={{ y: y2 }}
                />
            </div>

            <div className="max-w-7xl mx-auto w-full">
                <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative z-10"
                >
                    <m.div
                        initial={{ y: shouldReduceMotion ? 0 : 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-center"
                    >
                        {/* Modern badge with glow effect */}
                        <m.div
                            initial={{ scale: shouldReduceMotion ? 1 : 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
                            className="mb-6 inline-block relative"
                        >
                            <span className="absolute inset-0 bg-sky-500/20 blur-md rounded-full"></span>
                            <span className="relative bg-gradient-to-r from-sky-900/80 to-sky-900/80 backdrop-blur-sm border border-sky-700/40 text-sky-400 px-5 py-2 rounded-full text-sm font-medium flex items-center">
                                <m.span 
                                    className="w-2 h-2 rounded-full bg-sky-400 mr-2"
                                    animate={{ scale: [1, 1.5, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                Advanced Image Analytics
                            </span>
                        </m.div>

                        {/* Perspective heading */}
                        <m.div
                            style={{ 
                                rotateX: shouldReduceMotion ? 0 : mousePosition.y * 0.05,
                                rotateY: shouldReduceMotion ? 0 : mousePosition.x * -0.05,
                            }}
                            transition={{ type: "spring", stiffness: 400 }}
                            className="perspective-1000 mb-6"
                        >
                            <m.h1
                                className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70"
                                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                            >
                                From <GlowingText>
                                    Pixels
                                    <span className="absolute -inset-1 bg-sky-500/20 blur-xl rounded-full -z-10"></span>
                                </GlowingText> to{" "}
                                <m.span
                                    animate={{ 
                                        color: ["#60a5fa", "#818cf8", "#60a5fa"]
                                    }}
                                    transition={{ 
                                        duration: 4, 
                                        repeat: Infinity,
                                        repeatType: "reverse"
                                    }}
                                    className="relative inline-block"
                                >
                                    Playable
                                    <m.span 
                                        className="absolute -bottom-2 left-0 w-full h-[3px] bg-gradient-to-r from-sky-500 via-sky-600 to-sky-500"
                                        animate={{ 
                                            backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"]
                                        }}
                                        transition={{ 
                                            duration: 4, 
                                            repeat: Infinity
                                        }}
                                    />
                                </m.span>
                            </m.h1>
                        </m.div>

                        {/* Animated highlight paragraph */}
                        <m.div
                            className="max-w-2xl mx-auto mb-12 sm:mb-16 relative"
                            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                        >
                            <m.span 
                                className="absolute -inset-1 bg-sky-800/10 blur-xl rounded-full -z-10"
                                animate={{ 
                                    opacity: [0.4, 0.8, 0.4]
                                }}
                                transition={{ 
                                    duration: 3, 
                                    repeat: Infinity
                                }}
                            />
                            <p className="text-lg sm:text-xl md:text-2xl text-gray-200 leading-relaxed font-light">
                                Transform 2D images into stylized, composable game assets — 
                                <span className="text-white font-medium bg-gradient-to-r from-sky-500 to-sky-500 bg-[length:0_2px] hover:bg-[length:100%_2px] bg-no-repeat bg-left-bottom transition-all duration-500">
                                    no coding required
                                </span>.
                            </p>
                        </m.div>

                        {/* Enhanced button group with hover effects */}
                        <m.div
                            className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6"
                            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.6 }}
                        >
                            <m.div
                                whileHover={{ scale: shouldReduceMotion ? 1 : 1.03 }}
                                whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                                className="relative group"
                            >
                                {/* Simplified gradient border that's more visible */}
                                <m.span 
                                    className="absolute -inset-0.5 bg-sky-500/40 rounded-xl blur-sm opacity-70 group-hover:opacity-100 transition duration-300"
                                />
                                <button
                                    className="relative bg-[#0a0a18] px-8 py-4 rounded-xl font-medium cursor-pointer
                                    flex items-center justify-center gap-3 group border border-sky-600/50
                                    focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-[#15182d]"
                                    aria-label="Try interactive demo"
                                    onClick={() => {
                                        setTab('assets');
                                        document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                >
                                    <span className="relative w-10 h-10 flex items-center justify-center">
                                        <span className="absolute inset-0 bg-sky-600 rounded-full opacity-20 group-hover:opacity-30 transition-opacity"></span>
                                        <LucidePlay className="w-5 h-5 text-sky-400 group-hover:text-sky-300 transition-colors" fill="currentColor" />
                                    </span>
                                    <span className="text-sky-400 group-hover:text-sky-300 transition-colors font-semibold">
                                        Try Demo
                                    </span>
                                </button>
                            </m.div>
                            
                            <m.button
                                className="text-white border border-sky-700/50 hover:border-sky-500/80 cursor-pointer
                                px-8 py-4 rounded-xl backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-all duration-300
                                flex items-center justify-center gap-3 group
                                focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-[#15182d]"
                                whileHover={{ scale: shouldReduceMotion ? 1 : 1.03 }}
                                whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                                aria-label="View use cases"
                                onClick={() => {
                                    document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                <span className="w-10 h-10 flex items-center justify-center">
                                    <span className="absolute inset-0 bg-sky-600 rounded-full opacity-0 group-hover:opacity-10 transition-opacity"></span>
                                    <span className="text-xl" aria-hidden="true">📚</span>
                                </span>
                                <span className="text-gray-300 group-hover:text-white transition-colors">
                                    Use Cases
                                </span>
                            </m.button>
                        </m.div>
                    </m.div>
                </m.div>
            
            </div>
            
            {/* Gradient light effect */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/3 bg-sky-500/10 blur-[100px] rounded-full"></div>
            </div>
        </section>
    );
};

export default LanHero;