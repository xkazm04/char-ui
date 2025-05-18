import GlowingText from "@/app/components/landing/GlowingText";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const techStacks = [
  {
    name: "Next.js",
    logo: "/logos/nextjs.svg", 
    description: "Production-grade React framework"
  },
  {
    name: "MongoDB",
    logo: "/logos/mongo.svg",
    description: "NoSQL database for text data, images, and vectors"
  },
  {
    name: "Google Cloud",
    logo: "/logos/cloud.svg",
    description: "Cloud infrastructure & ML services"
  },
  {
    name: "Meshy",
    logo: "/logos/meshy.svg",
    description: "Text/Image to 3D model generation"
  }
];

const LanTechStack = () => {
  const [loadedImages, setLoadedImages] = useState<boolean[]>(techStacks.map(() => false));

  useEffect(() => {
    techStacks.forEach((_, index) => {
      const loadTime = 300 + Math.random() * 700; // Randomized loading simulation
      setTimeout(() => {
        setLoadedImages(prev => {
          const updated = [...prev];
          updated[index] = true;
          return updated;
        });
      }, loadTime);
    });
  }, []);

  return (
    <div className="py-16 bg-[#0a0a18]/80 relative">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%2038bdf8\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
        className="container mx-auto px-6 relative z-10"
      >
        <h3 className="text-2xl font-bold text-center mb-10"><GlowingText>Tech Stack</GlowingText></h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
          {techStacks.map((tech, index) => (
            <motion.div 
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 mb-4 relative rounded-lg flex items-center justify-center">
                {!loadedImages[index] ? (
                  <div className="w-16 h-16 rounded-md bg-sky-800/20 animate-pulse"></div>
                ) : (
                  <motion.img 
                    src={tech.logo} 
                    alt={tech.name}
                    className="h-14 object-contain"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  />
                )}
              </div>
              <h4 className="text-sky-400 font-medium mb-1">{tech.name}</h4>
              <p className="text-gray-400 text-sm">{tech.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default LanTechStack;