import { useReducedMotion, m, AnimatePresence } from "framer-motion";
import { LucideChevronLeft, LucideChevronRight } from "lucide-react";
import Image from "next/image";
import { WORKFLOW_STEPS } from "@/app/data/landing";

interface LanHowCarouselProps {
    activeStep: number;
    direction: number;
    autoplay: boolean;
    onNext: () => void;
    onPrev: () => void;
}

const LanHowCarousel = ({ activeStep, direction, autoplay, onNext, onPrev }: LanHowCarouselProps) => {
    const shouldReduceMotion = useReducedMotion();

    const slideVariants = shouldReduceMotion
        ? {
            enter: { opacity: 0 },
            center: { opacity: 1 },
            exit: { opacity: 0 },
        }
        : {
            enter: (direction: number) => ({
                x: direction > 0 ? "100%" : "-100%",
                opacity: 0,
                scale: 0.8,
            }),
            center: {
                x: 0,
                opacity: 1,
                scale: 1,
            },
            exit: (direction: number) => ({
                x: direction < 0 ? "100%" : "-100%",
                opacity: 0,
                scale: 0.8,
            }),
        };

    return (
        <div className="mb-12 lg:mb-16 relative">
            <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl shadow-2xl border border-white/10">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <m.div
                        key={activeStep}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ 
                            type: "spring", 
                            stiffness: 300, 
                            damping: 30,
                            duration: 0.5
                        }}
                        className="relative"
                    >
                        <div className="flex flex-col lg:flex-row">
                            {/* Enhanced Image Section */}
                            <div className="lg:w-3/5 relative min-w-[1000px]">
                                <div className="aspect-[16/10] lg:aspect-auto lg:h-[600px] relative overflow-hidden">
                                    <Image
                                        src={WORKFLOW_STEPS[activeStep].image || "/landing/superman_flying.png"}
                                        alt={WORKFLOW_STEPS[activeStep].title}
                                        fill
                                        className="object-cover transition-all duration-1000 ease-out hover:scale-105"
                                        style={{ objectPosition: "center" }}
                                        priority={activeStep === 0}
                                        unoptimized
                                    />
                                    
                                    {/* Enhanced Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent lg:hidden" />
                                    
                                    {/* Progress Bar */}
                                    {autoplay && (
                                        <div className="absolute bottom-0 left-0 right-0 h-[1px]">
                                            <m.div
                                                className="h-full bg-gradient-to-r from-gray-500 to-white"
                                                initial={{ width: "0%" }}
                                                animate={{ width: "100%" }}
                                                transition={{ 
                                                    duration: WORKFLOW_STEPS[activeStep].timeout / 1000, 
                                                    ease: "linear" 
                                                }}
                                                key={activeStep}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Enhanced Content Section */}
                            <div className="lg:w-2/5 p-8 lg:p-12 flex flex-col justify-center relative">
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-sky-500/50 to-gray-200/50 rounded-full" />                                        
                                <div className="absolute top-6 left-6 flex items-center gap-3">
                                    <div className="w-12 h-12 bg-sky-600/90 backdrop-blur-md rounded-full flex items-center justify-center text-white font-bold text-lg border border-sky-400/50">
                                        {WORKFLOW_STEPS[activeStep].icon}
                                    </div>
                                    <div className="hidden sm:block">
                                        <div className="text-sky-400 font-semibold text-lg">{activeStep + 1}/{WORKFLOW_STEPS.length}</div>
                                        <div className="text-sky-300 text-xl">{WORKFLOW_STEPS[activeStep].title}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </m.div>
                </AnimatePresence>

                {/* Enhanced Navigation */}
                <div className="absolute inset-y-0 left-0 flex items-center">
                    <m.button
                        onClick={onPrev}
                        className="ml-4 lg:ml-6 h-12 w-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/70 transition-all focus:outline-none focus:ring-2 focus:ring-sky-400 group border border-white/20"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Previous step"
                    >
                        <LucideChevronLeft className="h-6 w-6 group-hover:scale-110 transition-transform" />
                    </m.button>
                </div>
                
                <div className="absolute inset-y-0 right-0 flex items-center">
                    <m.button
                        onClick={onNext}
                        className="mr-4 lg:mr-6 h-12 w-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/70 transition-all focus:outline-none focus:ring-2 focus:ring-sky-400 group border border-white/20"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Next step"
                    >
                        <LucideChevronRight className="h-6 w-6 group-hover:scale-110 transition-transform" />
                    </m.button>
                </div>
            </div>
        </div>
    );
};

export default LanHowCarousel;