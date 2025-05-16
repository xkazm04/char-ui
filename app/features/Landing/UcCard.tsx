import { m, useReducedMotion } from "framer-motion";

type Props = {
    icon: React.ReactNode;
    title: string;
    desc: string;
    index: number;
}

const UcCard = ({ icon, title, desc, index }: Props) => {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <m.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-100px" }}
      className="bg-gradient-to-br from-[#0d1230] to-[#131836] border border-sky-900/50
                 rounded-2xl overflow-hidden transition-all duration-500
                 hover:shadow-lg hover:shadow-sky-900/20 group"
      whileHover={{ y: shouldReduceMotion ? 0 : -5 }}
    >
      <div className="p-6">
        <div className="flex items-start mb-4">
          <m.div
            className="w-12 h-12 bg-sky-900/30 rounded-xl flex items-center justify-center border border-sky-700/30 mr-4"
            whileHover={{ rotate: shouldReduceMotion ? 0 : 10 }}
          >
            {icon}
          </m.div>
          <div>
            <h3 className="text-xl font-bold mb-1 text-white">{title}</h3>
            <p className="text-gray-400 text-sm">{desc}</p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-sky-900/30">
          <button 
            className="flex items-center text-sky-400 text-sm group-hover:text-sky-300 transition-colors
                     focus:outline-none focus:ring-2 focus:ring-sky-400 rounded-md px-2 py-1"
            aria-label={`Learn more about ${title}`}
          >
            <span>Learn more</span>
            <m.span 
              className="ml-2"
              initial={{ x: 0 }}
              whileHover={{ x: shouldReduceMotion ? 0 : 3 }}
            >
              →
            </m.span>
          </button>
        </div>
      </div>
      
      <div className="h-1 w-0 bg-gradient-to-r from-sky-500 to-sky-400 group-hover:w-full transition-all duration-300"></div>
    </m.div>
  );
};

export default UcCard;