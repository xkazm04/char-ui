import {motion} from "framer-motion";

const ParticleGrid = () => {
    return (
        <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(9,90,166,0.15),transparent_60%)]"></div>
            <motion.div 
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ duration: 1.5, delay: 0.2 }}
            >
                <div className="grid grid-cols-[repeat(auto-fill,minmax(20px,1fr))] grid-rows-[repeat(auto-fill,minmax(20px,1fr))] h-full w-full">
                    {Array(100).fill(0).map((_, i) => (
                        <motion.div 
                            key={i}
                            className="h-[1px] w-[1px] bg-sky-500/20 rounded-full"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ 
                                scale: Math.random() * 2 + 1,
                                opacity: Math.random() * 0.5 + 0.2
                            }}
                            transition={{ 
                                duration: Math.random() * 2 + 1,
                                repeat: Infinity,
                                repeatType: "reverse",
                                delay: Math.random() * 2
                            }}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
export default ParticleGrid;