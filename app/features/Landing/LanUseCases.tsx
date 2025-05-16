import { LucideCode, Gamepad2, LucideShoppingBasket } from "lucide-react";
import UcCard from "./UcCard";
import { m, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const LanUseCases = () => {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1200);

        return () => clearTimeout(timer);
    }, []);
    const shouldReduceMotion = useReducedMotion();
    const staggerAnimation = shouldReduceMotion
        ? {
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
        }
        : {
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
        };
    return <>

        <section id="main-content" className="py-24 px-6 md:px-16 bg-[#0c0c1d] relative">
            <div className="absolute inset-0 bg-grid-pattern opacity-5" aria-hidden="true"></div>
            <div className="relative z-10 max-w-7xl mx-auto">
                <m.div
                    initial="hidden"
                    whileInView="visible"
                    variants={staggerAnimation}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Use Cases</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">Possible ways to commercialize implemented concepts</p>
                </m.div>

                <div className="grid gap-6 sm:gap-8 md:grid-cols-1 xl:grid-cols-3">
                    {isLoading ? (
                        // Skeleton loaders for use cases
                        Array(4).fill(0).map((_, i) => (
                            <div key={i} className="bg-[#0d1230]/60 rounded-xl p-6 animate-pulse">
                                <div className="w-14 h-14 bg-sky-900/30 rounded-xl mb-5"></div>
                                <div className="h-6 bg-sky-900/30 rounded w-3/4 mb-4"></div>
                                <div className="h-4 bg-sky-900/30 rounded w-full mb-2"></div>
                                <div className="h-4 bg-sky-900/30 rounded w-4/5"></div>
                            </div>
                        ))
                    ) : (
                        <>
                            <UcCard
                                icon={<Gamepad2 className="h-8 w-8 text-sky-500" />}
                                title="Game Asset Generation"
                                desc="Auto-extract gear, weapons, armor from any image."
                                index={0}
                            />
                            <UcCard
                                icon={<LucideShoppingBasket className="h-8 w-8 text-sky-500" />}
                                title="E-shop virtual stylist"
                                desc="Apply stylization from one image to assets and characters."
                                index={1}
                            />
                            <UcCard
                                icon={<LucideCode className="h-8 w-8 text-sky-500" />}
                                title="Security intelligence"
                                desc="Identify and track people of interest based on distinct clothing."
                                index={2}
                            />
                        </>
                    )}
                </div>
            </div>
        </section>
    </>
}

export default LanUseCases;