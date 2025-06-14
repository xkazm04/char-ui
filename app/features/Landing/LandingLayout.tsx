import ParticleGrid from "@/app/components/landing/ParticleGrid";
import { LazyMotion, domAnimation } from "framer-motion";
import LanHero from "./LanHero";
import LanFooter from "./LanFooter";
import LanHowWorks from "./LanHowWorks";
import LanUseCases from "./LanUseCases";
import { NavTabTypes } from "@/app/types/nav";
import FactCheckGesture from "./Fc";


type Props = {
    setTab: (tab: NavTabTypes) => void;
}

const LandingLayout = ({setTab}: Props) => {
    return (
        <LazyMotion features={domAnimation}>
            <div className="bg-gradient-to-br from-[#0a0a18] via-[#0f0f23] to-[#15182d] text-white min-h-screen w-full font-sans overflow-hidden relative">
                {/* Enhanced Noise Texture */}
                <div
                    className="fixed inset-0 pointer-events-none z-0 opacity-[0.015]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'repeat',
                    }}
                    aria-hidden="true"
                />

                {/* Ambient Light Effects */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-sky-500/3 to-transparent rounded-full" />
                </div>

                {/* Skip Link for Accessibility */}
                <a href="#main-content"
                    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-sky-600 focus:text-white focus:rounded-lg focus:outline-none focus:ring-4 focus:ring-sky-400/50 focus:shadow-xl transition-all"
                    aria-label="Skip to main content">
                    Skip to main content
                </a>

                {/* Hero Section with Enhanced Particles */}
                <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                    <ParticleGrid />
                    <LanHero setTab={setTab} />
                    
                    {/* Scroll Indicator */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:block">
                        <div className="flex flex-col items-center space-y-2 animate-bounce">
                            <div className="w-6 h-10 border-2 border-sky-400/40 rounded-full flex justify-center">
                                <div className="w-1 h-3 bg-sky-400 rounded-full mt-2 animate-pulse" />
                            </div>
                            <span className="text-xs text-sky-400/60 font-medium tracking-wider">SCROLL</span>
                        </div>
                    </div>
                </section>
                            <FactCheckGesture />
                {/* Main Content with Enhanced Spacing */}
                <main id="main-content" className="relative z-10">
                    <LanHowWorks />
                    <LanUseCases />
                </main>

                <LanFooter />
            </div>
        </LazyMotion>
    );
};

export default LandingLayout;