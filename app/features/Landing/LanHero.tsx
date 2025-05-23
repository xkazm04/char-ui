import { useRef, useState, useEffect } from "react";
import GlowingText from "@/app/components/landing/GlowingText";
import { NavTabTypes } from "@/app/types/nav";
import { m, useReducedMotion, useScroll, useTransform, useSpring } from "framer-motion";
import { LucidePlay, Sparkles, ArrowRight, Zap, Github, Star, Users, Cpu, Gitlab, BotIcon } from "lucide-react";
import { Divider } from "@/app/components/ui/diviiders";
import { techStacks } from "@/app/constants/landing";
import Image from "next/image";

type Props = {
    setTab: (tab: NavTabTypes) => void;
}

const LanHero = ({ setTab }: Props) => {
    const shouldReduceMotion = useReducedMotion();
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [typedText, setTypedText] = useState("");
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

    const phrases = ["Play", "Characters", "Environments", "UI Elements", "Animations"];

    // Enhanced parallax with spring physics
    const { scrollY } = useScroll();
    const y1 = useSpring(useTransform(scrollY, [0, 1000], [0, -200]), { stiffness: 100, damping: 30 });
    const y2 = useSpring(useTransform(scrollY, [0, 1000], [0, -100]), { stiffness: 100, damping: 30 });
    const opacity = useSpring(useTransform(scrollY, [0, 500], [1, 0]), { stiffness: 100, damping: 30 });

    // Typewriter effect
    useEffect(() => {
        const currentPhrase = phrases[currentPhraseIndex];
        let currentIndex = 0;
        const isDeleting = typedText.length > currentPhrase.length;

        const timer = setTimeout(() => {
            if (!isDeleting && currentIndex < currentPhrase.length) {
                setTypedText(currentPhrase.slice(0, currentIndex + 1));
                currentIndex++;
            } else if (isDeleting && typedText.length > 0) {
                setTypedText(typedText.slice(0, -1));
            } else if (isDeleting && typedText.length === 0) {
                setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
            } else {
                setTimeout(() => setTypedText(currentPhrase + "|"), 2000);
            }
        }, isDeleting ? 50 : 100);

        return () => clearTimeout(timer);
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [typedText, currentPhraseIndex]);

    // Enhanced mouse tracking
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

    const handleTryDemo = () => {
        setTab('assets');
        setTimeout(() => {
            document.getElementById('main-content')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 100);
    };

    return (
        <section
            ref={containerRef}
            className="relative w-full min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden"
        >
            {/* Enhanced Background Effects */}
            <m.div className="absolute inset-0 -z-10" style={{ opacity }}>
                {/* Code Matrix Background */}
                <div className="absolute inset-0 opacity-5">
                    {Array.from({ length: 50 }).map((_, i) => (
                        <m.div
                            key={i}
                            className="absolute text-sky-400 font-mono text-xs"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [0, -20, 0],
                                opacity: [0, 0.8, 0]
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

                {/* Neural Network Visualization */}
                <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 1200 800">
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
                                opacity: [0.3, 1, 0.3]
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
                            strokeWidth="1"
                            className="text-sky-500"
                            animate={{
                                opacity: [0.1, 0.6, 0.1]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                delay: i * 0.2
                            }}
                        />
                    ))}
                </svg>

                {/* Enhanced Light Effects */}
                <m.div
                    className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-radial from-sky-500/20 via-sky-600/10 to-transparent blur-3xl"
                    style={{ y: y1 }}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
                <m.div
                    className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-radial from-purple-500/15 via-pink-500/10 to-transparent blur-3xl"
                    style={{ y: y2 }}
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.2, 0.5, 0.2]
                    }}
                    transition={{ duration: 10, repeat: Infinity, delay: 2 }}
                />
            </m.div>

            <div className="max-w-7xl mx-auto w-full">
                <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="relative z-10"
                >
                    {/* Enhanced Typography with Typewriter */}
                    <div className="text-center mb-12">
                        <m.h1
                            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-[0.9] mb-6"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                        >
                            <span className="block relative text-white/90 mb-2">
                                From  
                                <GlowingText>
                                    Pixels
                                </GlowingText>
                                To
                            </span>
                            <span className="block relative">
                                <span className="relative inline-block min-w-[300px] text-left">
                                    <m.span
                                        className="text-sky-400"
                                        animate={{ opacity: [0, 1, 0] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    >
                                        {typedText.includes("|") ? "|" : ""}
                                    </m.span>
                                </span>
                            </span>
                        </m.h1>

                        {/* Professional Subtitle */}
                        <m.p
                            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                        >
                            Hackathon project by Devpost and Google Cloud
                        </m.p>
                    </div>

                    <Divider />

                    {/* Enhanced CTA Section */}
                    <m.div
                        className="flex flex-col items-center gap-6 mt-5"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1, duration: 0.8 }}
                    >
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Primary CTA */}
                            <m.button
                                className="group relative px-8 py-4 bg-gradient-to-r from-sky-600 to-blue-700 rounded-xl font-semibold text-white flex items-center gap-3 overflow-hidden"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleTryDemo}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative flex items-center gap-3">
                                    <LucidePlay className="w-5 h-5 fill-current" />
                                    <span>Demo app</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </m.button>

                            {/* Secondary CTA */}
                            <m.button
                                className="px-8 py-4 border border-white/20 rounded-xl font-semibold text-white backdrop-blur-sm hover:bg-white/5 transition-colors flex items-center gap-3"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Gitlab className="w-5 h-5" />
                                <span>Open sourced</span>
                            </m.button>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex items-center gap-6 text-sm text-gray-400 mt-4">
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4" />
                                <span>Powered by</span>
                            </div>
                        </div>
                    </m.div>

                    {/* Technical Features Grid - TBD rozhýbat */}

                    <m.div
                        className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4, duration: 0.8 }}
                    >
                        {techStacks.map((t, index) => (
                            <m.div
                                key={index}
                                className="group flex flex-col justify-between relative p-6 rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm hover:bg-black/5 transition-all"
                                whileHover={{ y: -5 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                <Image
                                    src={t.logo}
                                    alt={t.name}
                                    fill
                                    className="absolute top-4 right-4 opacity-7 hover:opacity-20 transition-all z-10 duraiton-200 ease-linear"
                                    />
                                <div className="text-sky-400 font-mono text-sm">-></div>
                            </m.div>
                        ))}
                    </m.div>
                </m.div>
            </div>
        </section>
    );
};

export default LanHero;