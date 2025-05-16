
import ParticleGrid from "@/app/components/landing/ParticleGrid";
import { LazyMotion, domAnimation } from "framer-motion";
import dynamic from "next/dynamic";
import LanHero from "./LanHero";
import LanFooter from "./LanFooter";
import LanCallTo from "./LanCallTo";
import LanHowWorks from "./LanHowWorks";
import LanUseCases from "./LanUseCases";


const LanTechStack = dynamic(() => import('./LanTechStack'), {
    ssr: false,
    loading: () => <TechStackSkeleton />
});

const TechStackSkeleton = () => (
    <div className="py-16 bg-[#0a0a18]/80 w-full">
        <div className="flex justify-center gap-8 flex-wrap">
            {[1, 2, 3].map(i => (
                <div key={i} className="w-36 h-12 bg-sky-900/30 rounded-lg animate-pulse"></div>
            ))}
        </div>
    </div>
);


const LandingLayout = () => {
    /* TBD next week
    *  Images for use cses
    *  Background animation
    *  How it works rework
    */
    return (
        <LazyMotion features={domAnimation}>
            <div className="bg-gradient-to-br from-[#0a0a18] to-[#15182d] text-white min-h-screen w-full font-sans overflow-hidden">
                <div
                    className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'repeat',
                    }}
                    aria-hidden="true"
                ></div>

                {/* Hero Section with Particles */}
                <section className="relative py-24 sm:py-32 px-4 sm:px-8 md:px-16 overflow-hidden">
                    <a href="#main-content"
                        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-sky-900 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
                        aria-label="Skip to main content">
                        Skip to main content
                    </a>

                    <ParticleGrid />
                    <LanHero />
                </section>

                {/* Core Sections */}
                <LanHowWorks />
                <LanCallTo />
                <LanTechStack />
                <LanUseCases />
                <LanFooter />


            </div>
        </LazyMotion>
    );
};

export default LandingLayout;