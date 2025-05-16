import GlowingText from "@/app/components/landing/GlowingText";
import { m, useReducedMotion } from "framer-motion";
const LanHero = () => {
    const shouldReduceMotion = useReducedMotion();
    return <>
        <div className="max-w-7xl mx-auto">
            <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative z-10"
            >
                <m.div
                    initial={{ y: shouldReduceMotion ? 0 : 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center"
                >
                    <m.div
                        initial={{ scale: shouldReduceMotion ? 1 : 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
                        className="mb-2 inline-block"
                    >
                        <span className="bg-sky-900/30 border border-sky-700/40 text-sky-400 text-xs px-3 py-1 rounded-full">
                            Image analytics
                        </span>
                    </m.div>

                    <m.h1
                        className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 tracking-tight"
                        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        From <GlowingText>Pixels</GlowingText> to Playable
                    </m.h1>

                    <m.p
                        className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8 sm:mb-12"
                        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                    >
                        Turn 2D images into stylized, composable game assets — no manual modeling required.
                    </m.p>

                    <m.div
                        className="flex flex-col sm:flex-row justify-center gap-4"
                        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                    >
                        <m.button
                            className="bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 
                            text-lg px-8 py-4 rounded-xl shadow-lg shadow-sky-500/20 font-medium 
                            transition-all duration-300 flex items-center justify-center gap-2
                            focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-[#15182d]"
                            whileHover={{ scale: shouldReduceMotion ? 1 : 1.03 }}
                            whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                            aria-label="Try interactive demo"
                        >
                            <span className="text-xl" aria-hidden="true">🎮</span>
                            Try Demo
                        </m.button>
                        <m.button
                            className="text-white border border-sky-700/50 hover:border-sky-500 
                             px-8 py-4 rounded-xl hover:bg-sky-900/20 transition-all duration-300
                             flex items-center justify-center gap-2
                             focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-[#15182d]"
                            whileHover={{ scale: shouldReduceMotion ? 1 : 1.03 }}
                            whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                            aria-label="View use cases"
                            onClick={() => {
                                document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            <span className="text-xl" aria-hidden="true">📚</span>
                            See Use Cases
                        </m.button>
                    </m.div>
                </m.div>
            </m.div>
        </div>
    </>
}

export default LanHero;