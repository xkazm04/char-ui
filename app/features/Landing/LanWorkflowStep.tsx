import { m, useReducedMotion } from "framer-motion";
type Props = {
    item: {
        step: number;
        icon: React.ReactNode;
        title: string;
        desc: string;
    };
    index: number;
}
const LanWorkflowStep = ({ item, index }: Props) => {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <m.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      viewport={{ once: true, margin: "-100px" }}
      className="flex-1 relative"
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-sky-900/30 rounded-full border border-sky-700/40
                     flex items-center justify-center mb-5 relative">
          <span className="absolute -top-2 -right-1 w-6 h-6 rounded-full bg-sky-500 text-white
                        text-xs flex items-center justify-center font-semibold">
            {item.step}
          </span>
          <m.div 
            whileHover={{ rotate: shouldReduceMotion ? 0 : 15 }}
            className="text-sky-400"
          >
            {item.icon}
          </m.div>
        </div>
        
        <div className="bg-[#0d1230]/80 p-5 rounded-xl border border-sky-900/30 h-full w-full">
          <h3 className="text-lg font-semibold mb-2 text-sky-400">{item.title}</h3>
          <p className="text-gray-300 text-sm">{item.desc}</p>
        </div>
      </div>
    </m.div>
  );
};

export default LanWorkflowStep;