import { m, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";

type Props = {
    icon: React.ReactNode;
    title: string;
    desc: string;
    features?: string[];
    index: number;
    color?: string;
    borderColor?: string;
    glowColor?: string;
}

const UcCard = ({ icon, title, desc, features = [], index, color, borderColor, glowColor }: Props) => {
    const shouldReduceMotion = useReducedMotion();
    
    return (
        <m.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
            className={`bg-gradient-to-br ${color || 'from-slate-900/80 to-slate-800/80'} backdrop-blur-xl
                       border ${borderColor || 'border-gray-700/50'} rounded-2xl lg:rounded-3xl overflow-hidden 
                       transition-all duration-500 hover:shadow-2xl ${glowColor || 'hover:shadow-sky-500/20'} 
                       group relative`}
            whileHover={{ y: shouldReduceMotion ? 0 : -8, scale: shouldReduceMotion ? 1 : 1.02 }}
        >
            {/* Subtle animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            
            <div className="relative z-10 p-8 lg:p-10">
                {/* Header */}
                <div className="flex items-start mb-6">
                    <m.div
                        className="w-16 h-16 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl flex items-center justify-center border border-white/20 mr-4 group-hover:scale-110 transition-transform duration-300"
                        whileHover={{ rotate: shouldReduceMotion ? 0 : 10 }}
                    >
                        <div className="text-sky-400 group-hover:text-sky-300 transition-colors">
                            {icon}
                        </div>
                    </m.div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2 text-white group-hover:text-sky-200 transition-colors">
                            {title}
                        </h3>
                        <p className="text-gray-400 text-sm lg:text-base leading-relaxed group-hover:text-gray-300 transition-colors">
                            {desc}
                        </p>
                    </div>
                </div>
                
                {/* Features List */}
                {features.length > 0 && (
                    <div className="space-y-3 mb-6">
                        {features.map((feature, idx) => (
                            <m.div
                                key={idx}
                                className="flex items-center gap-3"
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: (index * 0.1) + (idx * 0.05) + 0.3 }}
                            >
                                <Sparkles className="w-3 h-3 text-sky-500" />
                                <span className="text-gray-300 text-sm group-hover:text-white transition-colors">
                                    {feature}
                                </span>
                            </m.div>
                        ))}
                    </div>
                )}
                
            </div>
            
            {/* Animated bottom border */}
            <div className="h-1 w-0 bg-gradient-to-r from-sky-500/20 to-gray-400/20 group-hover:w-full transition-all duration-500" />
        </m.div>
    );
};

export default UcCard;