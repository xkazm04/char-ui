import { motion } from "framer-motion";
import { fadeEffect } from "@/app/components/anim/variants";
import { useState } from "react";

type Props = {
    children: React.ReactNode;
    isSaved?: boolean;
    idx?: number;
    typeStyles: {
        gradient: string;
        border: string;
    };
}

const AnalysisCard = ({ children, isSaved, idx, typeStyles }: Props) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <motion.div
            key={`asset-${idx}`}
            layout="position"
            variants={fadeEffect}
            initial="initial"
            animate="animate"
            exit="exit"
            onHoverStart={() => !isSaved && setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className={`relative flex flex-col bg-gradient-to-br ${typeStyles.gradient} 
                backdrop-blur-sm rounded-xl border ${typeStyles.border} hover:border-opacity-60
                transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/5
                overflow-hidden group ${isHovered && !isSaved ? 'scale-[1.01]' : 'scale-100'}
                ${isSaved ? 'pointer-events-none' : ''}`}
        >
            {!isSaved && (
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-sky-500/2 via-gray-500/2 to-pink-500/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    animate={{
                        background: isHovered ? [
                            "linear-gradient(45deg, rgba(14, 165, 233, 0.02), rgba(168, 85, 247, 0.02), rgba(236, 72, 153, 0.02))",
                            "linear-gradient(225deg, rgba(168, 85, 247, 0.02), rgba(236, 72, 153, 0.02), rgba(14, 165, 233, 0.02))"
                        ] : "linear-gradient(45deg, rgba(14, 165, 233, 0), rgba(168, 85, 247, 0), rgba(236, 72, 153, 0))"
                    }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                />
            )}
            {children}
        </motion.div>
    );
}

export default AnalysisCard;