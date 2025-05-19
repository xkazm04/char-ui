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
    const [direction, setDirection] = useState(1); // Track direction for animations
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        if (!autoplay) return;

        const interval = setInterval(() => {
            setDirection(1);
            setActiveStep((prev) => (prev + 1) % WORKFLOW_STEPS.length);
        }, 10000); 

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
                }),
                center: {
                    x: 0,
                    opacity: 1,
                },
                exit: (direction: number) => ({
                    x: direction < 0 ? "100%" : "-100%",
                    opacity: 0,
                }),
          };

    return (
        <section className="py-24 px-6 md:px-16 relative bg-gradient-to-b from-[#0a0a18] to-[#0c0c1d] overflow-hidden">
            <div className="absolute top-20 -left-36 w-72 h-72 bg-sky-600/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-40 -right-36 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl font-bold text-center mb-4">
                        <GlowingText>How it works</GlowingText>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Create stunning models in four simple steps
                    </p>
                </m.div>

                {/* Main Content & Image Area - Redesigned */}
                <div className="mb-16 relative overflow-hidden">
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                        <m.div
                            key={activeStep}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="w-full rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm shadow-xl"
                        >
                            <div className="flex flex-col md:flex-row">
                                {/* Image Section - Made larger and more prominent */}
                                <div className="md:w-3/5 aspect-[16/9] md:aspect-auto md:h-[500px] relative">
                                    <div className="absolute inset-0 overflow-hidden">
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={WORKFLOW_STEPS[activeStep].image || "/landing/superman_flying.png"}
                                                alt={WORKFLOW_STEPS[activeStep].title}
                                                fill
                                                className="object-cover transition-transform duration-700 ease-in-out hover:scale-105"
                                                style={{ objectPosition: "center" }}
                                                priority
                                            />
                                        </div>
                                        {/* Gradient overlay for better text readability */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,24,0.7)] to-transparent"></div>
                                    </div>
                                    
                                    {/* Step counter overlay - moved to image section */}
                                    <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full text-sm text-white/80 flex items-center">
                                        <span className="text-sky-400 mr-2">{activeStep + 1}</span> / {WORKFLOW_STEPS.length}
                                    </div>
                                </div>
                                
                                {/* Content Section */}
                                <div className="md:w-2/5 p-6 md:p-8 flex flex-col justify-center">
                                    <div className="mb-4 flex items-center">
                                        <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-sky-600/20 text-sky-400 mr-4">
                                            {WORKFLOW_STEPS[activeStep].icon}
                                        </span>
                                        <h3 className="text-xl md:text-2xl font-bold text-white">
                                            {WORKFLOW_STEPS[activeStep].title}
                                        </h3>
                                    </div>
                                    <p className="text-gray-300 text-lg mb-6">{WORKFLOW_STEPS[activeStep].longDesc}</p>
                                </div>
                            </div>
                        </m.div>
                    </AnimatePresence>

                    {/* Navigation Arrows */}
                    <div className="absolute inset-y-0 left-0 flex items-center">
                        <button
                            onClick={handlePrev}
                            className="ml-3 h-10 w-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-all focus:outline-none focus:ring-2 focus:ring-sky-400 group"
                            aria-label="Previous step"
                        >
                            <LucideChevronLeft className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center">
                        <button
                            onClick={handleNext}
                            className="mr-3 h-10 w-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-all focus:outline-none focus:ring-2 focus:ring-sky-400 group"
                            aria-label="Next step"
                        >
                            <LucideChevronRight className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Step Indicators - Made smaller and more compact */}
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