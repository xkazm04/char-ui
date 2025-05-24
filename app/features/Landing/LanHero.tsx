import { useRef, useState, useEffect } from "react";
import GlowingText from "@/app/components/landing/GlowingText";
import { NavTabTypes } from "@/app/types/nav";
import { m } from "framer-motion";
import { Divider } from "@/app/components/ui/diviiders";
import LanHeroTech from "./LanHeroTech";
import LanHeroCta from "./LanHeroCta";
import LanHeroEffects from "./LanHeroEffects";

type Props = {
    setTab: (tab: NavTabTypes) => void;
}

const LanHero = ({ setTab }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [typedText, setTypedText] = useState("");
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

    const phrases = ["Play", "Characters", "Environments", "UI Elements", "Animations"];

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
            <LanHeroEffects />

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

                    <LanHeroCta handleTryDemo={handleTryDemo}/>
                    {/* Technical Features Grid - TBD rozhýbat */}
                    <LanHeroTech />

                </m.div>
            </div>
        </section>
    );
};

export default LanHero;