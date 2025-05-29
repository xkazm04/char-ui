import { Sparkles } from "lucide-react";
import UcCard from "./UcCard";
import { m, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import GlowingText from "@/app/components/landing/GlowingText";
import { useCases } from "@/app/constants/landing";

const LanUseCases = () => {
    const [isLoading, setIsLoading] = useState(true);
    const shouldReduceMotion = useReducedMotion();
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);


    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { 
            opacity: 0, 
            y: shouldReduceMotion ? 0 : 30,
            scale: shouldReduceMotion ? 1 : 0.9
        },
        visible: { 
            opacity: 1, 
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    };

    return (
        <section id="use-cases" className="py-16 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0c0c1d] via-[#0a0a18] to-[#0d0d24] relative overflow-hidden">
            {/* Enhanced Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" aria-hidden="true" />
            </div>
            
            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Enhanced Header */}
                <m.div
                    initial="hidden"
                    whileInView="visible"
                    variants={containerVariants}
                    viewport={{ once: true, margin: "-100px" }}
                    className="text-center mb-16 lg:mb-20"
                >
                    <m.div variants={itemVariants} className="mb-6">
                        <h2 className="text-4xl lg:text-6xl font-bold mb-4">
                            <GlowingText>Use Cases</GlowingText>
                        </h2>
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <Sparkles className="w-5 h-5 text-sky-400" />
                            <span className="text-sky-400 font-medium text-sm lg:text-base tracking-wider uppercase">
                                Real-world Applications
                            </span>
                            <Sparkles className="w-5 h-5 text-sky-400" />
                        </div>
                    </m.div>
                    
                    <m.p 
                        variants={itemVariants}
                        className="text-gray-300 max-w-3xl mx-auto text-lg lg:text-xl leading-relaxed"
                    >
                        Possible usabilities of Piksel Play in the gaming and storytelling industries, showcasing how it can revolutionize asset generation and analysis.
                    </m.p>
                </m.div>

                {/* Enhanced Cards Grid */}
                <m.div 
                    className="grid gap-6 lg:gap-8 md:grid-cols-1 xl:grid-cols-3"
                    initial="hidden"
                    whileInView="visible"
                    variants={containerVariants}
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {isLoading ? (
                        // Enhanced Skeleton loaders
                        Array(3).fill(0).map((_, i) => (
                            <m.div 
                                key={i} 
                                variants={itemVariants}
                                className="bg-gradient-to-br from-slate-900/60 to-slate-800/60 rounded-2xl lg:rounded-3xl p-8 animate-pulse border border-gray-700/30"
                            >
                                <div className="flex items-start mb-6">
                                    <div className="w-16 h-16 bg-sky-900/30 rounded-2xl mr-4" />
                                    <div className="flex-1">
                                        <div className="h-7 bg-sky-900/30 rounded-lg w-3/4 mb-3" />
                                        <div className="h-4 bg-sky-900/30 rounded w-full mb-2" />
                                        <div className="h-4 bg-sky-900/30 rounded w-4/5" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-3 bg-sky-900/30 rounded w-full" />
                                    <div className="h-3 bg-sky-900/30 rounded w-5/6" />
                                    <div className="h-3 bg-sky-900/30 rounded w-4/5" />
                                </div>
                            </m.div>
                        ))
                    ) : (
                        useCases.map((useCase, index) => (
                            <m.div key={index} variants={itemVariants}>
                                <UcCard
                                    icon={useCase.icon}
                                    title={useCase.title}
                                    desc={useCase.desc}
                                    features={useCase.features}
                                    index={index}
                                    color={useCase.color}
                                    borderColor={useCase.borderColor}
                                    glowColor={useCase.glowColor}
                                />
                            </m.div>
                        ))
                    )}
                </m.div>
            </div>
        </section>
    );
}

export default LanUseCases;