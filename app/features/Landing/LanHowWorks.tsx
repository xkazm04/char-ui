import LanWorkflowStep from "./LanWorkflowStep"
import { useReducedMotion, m } from "framer-motion";
import { LucideUploadCloud, LucideWand2, LucideCode, LucideSparkles } from "lucide-react";

const LanHowWorks = () => {
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

        // TBD key section to improve
    return <>
        <section className="py-24 px-6 md:px-16 relative bg-gradient-to-b from-[#0a0a18] to-[#0c0c1d]">
            <div className="max-w-7xl mx-auto">
                <m.div
                    initial="hidden"
                    whileInView="visible"
                    variants={staggerAnimation}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">Create 3D assets in four simple steps</p>
                </m.div>

                <div className="relative">
                    {/* Connection line */}
                    <div className="hidden md:block absolute top-24 left-0 w-full h-1 bg-gradient-to-r from-sky-900/0 via-sky-900/50 to-sky-900/0"></div>

                    <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                        {[
                            { step: 1, title: "Upload", icon: <LucideUploadCloud className="h-6 w-6" />, desc: "Upload your reference images" },
                            { step: 2, title: "Process", icon: <LucideSparkles className="h-6 w-6" />, desc: "Our AI detects and extracts assets" },
                            { step: 3, title: "Customize", icon: <LucideWand2 className="h-6 w-6" />, desc: "Apply styles and make adjustments" },
                            { step: 4, title: "Export", icon: <LucideCode className="h-6 w-6" />, desc: "Get game-ready assets and code" },
                        ].map((item, idx) => (
                            <LanWorkflowStep key={idx} item={item} index={idx} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    </>
}

export default LanHowWorks;