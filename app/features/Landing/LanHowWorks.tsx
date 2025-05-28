import { useState, useEffect } from "react";
import { useReducedMotion, m, AnimatePresence } from "framer-motion";
import GlowingText from "@/app/components/landing/GlowingText";
import { WORKFLOW_STEPS } from "@/app/data/landing";
import LanHowStepper from "./LanHowStepper";
import LanHowCarousel from "./LanHowCarousel";

const LanHowWorks = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [autoplay, setAutoplay] = useState(true);
    const [direction, setDirection] = useState(1);
    const shouldReduceMotion = useReducedMotion();
    const [description, setDescription] = useState(WORKFLOW_STEPS[0].longDesc || "");


    useEffect(() => {
        setDescription(WORKFLOW_STEPS[activeStep].longDesc || "");
    }, [activeStep]);

    useEffect(() => {
        if (!autoplay) return;

        const currentTimeout = WORKFLOW_STEPS[activeStep].timeout;
        const interval = setInterval(() => {
            setDirection(1);
            setActiveStep((prev) => (prev + 1) % WORKFLOW_STEPS.length);
        }, currentTimeout);

        return () => clearInterval(interval);
    }, [autoplay, activeStep]);

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

    const handleStepChange = (step: number) => {
        setDirection(step > activeStep ? 1 : -1);
        setActiveStep(step);
        setAutoplay(false);
    };

    const descriptionVariants = shouldReduceMotion
        ? {
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
        }
        : {
            hidden: { 
                opacity: 0,
                x: -50,
                clipPath: "inset(0 100% 0 0)"
            },
            visible: { 
                opacity: 1,
                x: 0,
                clipPath: "inset(0 0% 0 0)",
                transition: {
                    duration: 0.8,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    clipPath: {
                        duration: 0.6,
                        ease: "easeOut"
                    }
                }
            },
        };

    return (
        <section className="py-20 lg:py-50 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-[#0a0a18] via-[#0d0d24] to-[#0c0c1d] overflow-hidden">
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
                    <AnimatePresence mode="wait">
                        <m.p
                            key={activeStep}
                            variants={descriptionVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="text-gray-300 mx-auto text-lg lg:text-xl leading-relaxed"
                        >
                            {description}
                        </m.p>
                    </AnimatePresence>
                </m.div>

                {/* Enhanced Carousel */}
                <LanHowCarousel
                    activeStep={activeStep}
                    direction={direction}
                    autoplay={autoplay}
                    onNext={handleNext}
                    onPrev={handlePrev}
                />

                {/* Enhanced Step Navigation */}
                <LanHowStepper
                    activeStep={activeStep}
                    handleStepChange={handleStepChange}
                />
            </div>
        </section>
    );
};

export default LanHowWorks;