import GlowingText from "@/app/components/landing/GlowingText";
import { m, useReducedMotion } from "framer-motion";

const LanCallTo = () => {
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
        <section className="py-24 px-6 md:px-16 bg-[#0c0c1d] relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.08),transparent_70%)]" aria-hidden="true"></div>
            <div className="max-w-4xl mx-auto text-center relative z-10">
                <m.div
                    initial="hidden"
                    whileInView="visible"
                    variants={staggerAnimation}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        TBD <GlowingText>glowing</GlowingText> TBD
                    </h2>
                    <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                        TBD paragraph
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <m.button
                            className="bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 
                        text-lg px-8 py-4 rounded-xl shadow-lg shadow-sky-500/20 font-medium 
                        transition-all duration-300 flex items-center justify-center gap-2
                        focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-[#0c0c1d]"
                            whileHover={{ scale: shouldReduceMotion ? 1 : 1.03 }}
                            whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                            aria-label="Join beta program"
                        >
                            <span className="text-xl" aria-hidden="true">🚀</span>
                            Try Demo
                        </m.button>
                    </div>
                </m.div>
            </div>
        </section>
    </>
}

export default LanCallTo;