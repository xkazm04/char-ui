import { useState, useEffect } from "react";
import { useReducedMotion, m, AnimatePresence } from "framer-motion";
import { LucideChevronLeft, LucideChevronRight } from "lucide-react";
import GlowingText from "@/app/components/landing/GlowingText";
import Image from "next/image";
import { WORKFLOW_STEPS } from "@/app/data/landing";
import LanHowStepper from "./LanHowStepper";

const LanHowWorks = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [autoplay, setAutoplay] = useState(true);
    const [direction, setDirection] = useState(1);
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        if (!autoplay) return;

        const interval = setInterval(() => {
            setDirection(1);
            setActiveStep((prev) => (prev + 1) % WORKFLOW_STEPS.length);
        }, 8000);

        return () => clearInterval(interval);
    }, [autoplay]);

    const handleNext = () => {
        setDirection(1);
        setActiveStep((prev) => (prev + 1) % WORKFLOW_STEPS.length);
        setAutoplay(false);
    };

    const handlePrev = () => {
        setDirection(-1);
        setActiveStep((prev) => (prev - 1 + WORKFLOW_STEPS.length) % WORKFLOW_STEPS.length);
        setAutoplay(false);
    };

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
        <section className="py-16 lg:py-32 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-[#0a0a18] via-[#0d0d24] to-[#0c0c1d] overflow-hidden">
            {/* Enhanced Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-20 -left-40 w-80 h-80 bg-sky-600/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-40 -right-40 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-blue-600/5 to-transparent rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Enhanced Header */}
                <m.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16 lg:mb-20"
                >
                    <h2 className="text-4xl lg:text-6xl font-bold mb-6">
                        <GlowingText>How it works</GlowingText>
                    </h2>
                    <p className="text-gray-300 max-w-3xl mx-auto text-lg lg:text-xl leading-relaxed">
                        Transform your creative vision into game-ready assets through our intelligent pipeline
                    </p>
                </m.div>

                {/* Enhanced Carousel */}
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
                                    <div className="lg:w-3/5 relative">
                                        <div className="aspect-[16/10] lg:aspect-auto lg:h-[600px] relative overflow-hidden">
                                            <Image
                                                src={WORKFLOW_STEPS[activeStep].image || "/landing/superman_flying.png"}
                                                alt={WORKFLOW_STEPS[activeStep].title}
                                                fill
                                                className="object-cover transition-all duration-1000 ease-out hover:scale-105"
                                                style={{ objectPosition: "center" }}
                                                priority={activeStep === 0}
                                            />
                                            
                                            {/* Enhanced Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent lg:hidden" />
                                            
                                            {/* Step Indicator on Image */}
                                            <div className="absolute top-6 left-6 flex items-center gap-3">
                                                <div className="w-12 h-12 bg-sky-600/90 backdrop-blur-md rounded-full flex items-center justify-center text-white font-bold text-lg border border-sky-400/50">
                                                    {activeStep + 1}
                                                </div>
                                                <div className="hidden sm:block">
                                                    <div className="text-white font-semibold text-sm">Step {activeStep + 1} of {WORKFLOW_STEPS.length}</div>
                                                    <div className="text-sky-300 text-xs">{WORKFLOW_STEPS[activeStep].title}</div>
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            {autoplay && (
                                                <div className="absolute bottom-0 left-0 right-0 h-1">
                                                    <m.div
                                                        className="h-full bg-gradient-to-r from-gray-500 to-white"
                                                        initial={{ width: "0%" }}
                                                        animate={{ width: "100%" }}
                                                        transition={{ duration: 5, ease: "linear" }}
                                                        key={activeStep}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Enhanced Content Section */}
                                    <div className="lg:w-2/5 p-8 lg:p-12 flex flex-col justify-center relative">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-sky-500/50 to-gray-200/50 rounded-full" />
                                        
                                        <div className="mb-6 flex items-center">
                                            <div className="w-16 h-16 bg-gradient-to-br from-sky-600/20 to-blue-700/20 rounded-2xl flex items-center justify-center mr-4 border border-sky-500/30">
                                                <div className="text-sky-400 scale-125">
                                                    {WORKFLOW_STEPS[activeStep].icon}
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-1">
                                                    {WORKFLOW_STEPS[activeStep].title}
                                                </h3>
                                                <div className="text-sky-400 text-sm font-medium">
                                                    Step {activeStep + 1}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <p className="text-gray-300 text-lg lg:text-xl leading-relaxed mb-8">
                                            {WORKFLOW_STEPS[activeStep].longDesc}
                                        </p>

                                        {/* Feature Highlights */}
                                        <div className="space-y-3">
                                            {WORKFLOW_STEPS[activeStep].features?.map((feature, index) => (
                                                <m.div
                                                    key={index}
                                                    className="flex items-center gap-3"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 + 0.3 }}
                                                >
                                                    <div className="w-2 h-2 bg-sky-500 rounded-full" />
                                                    <span className="text-gray-300">{feature}</span>
                                                </m.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </m.div>
                        </AnimatePresence>

                        {/* Enhanced Navigation */}
                        <div className="absolute inset-y-0 left-0 flex items-center">
                            <m.button
                                onClick={handlePrev}
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
                                onClick={handleNext}
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

                {/* Enhanced Step Navigation */}
                <LanHowStepper
                    activeStep={activeStep}
                    handleStepChange={(step) => {
                        setDirection(step > activeStep ? 1 : -1);
                        setActiveStep(step);
                        setAutoplay(false);
                    }}
                />
            </div>
        </section>
    );
};

export default LanHowWorks;