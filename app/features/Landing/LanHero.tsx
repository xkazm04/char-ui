import { useRef } from "react";
import GlowingText from "@/app/components/landing/GlowingText";
import { NavTabTypes } from "@/app/types/nav";
import { m } from "framer-motion";
import { Divider } from "@/app/components/ui/diviiders";
import LanHeroTech from "./LanHeroTech";
import LanHeroCta from "./LanHeroCta";
import LanHeroEffects from "./LanHeroEffects";
import { MorphingText } from "@/components/magicui/morphing-text";

type Props = {
    setTab: (tab: NavTabTypes) => void;
}

const LanHero = ({ setTab }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const phrases = ["Play", "Characters", "Art", "Elements", "Animations"];

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
                                    Piksels
                                </GlowingText>
                                To
                            </span>
                            <MorphingText texts={phrases}/>
                        </m.h1>
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
                    <LanHeroTech />

                </m.div>
            </div>
        </section>
    );
};

export default LanHero;