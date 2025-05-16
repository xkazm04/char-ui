import { motion } from "framer-motion";

export default function FloatingCodeSnippet() {
  const codeSnippet = `
// Vectorize assets

const asset = {
  name: "red tie",
  description: "A stylish red tie for formal occasions.",
  vector_description: "["0.5, 0.6, 0.7, 0.8, 0.9, 1.0]",]
  type: "clothing"
};
`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateZ: -1 }}
      animate={{ opacity: 0.9, y: 0, rotateZ: 0 }}
      transition={{ delay: 1, duration: 0.8 }}
      className="absolute bottom-10 right-10 max-w-lg xl:block hidden z-10"
    >
      <motion.div
        className="bg-[#0f172a] border border-sky-800/40 rounded-lg shadow-xl shadow-sky-900/20 p-4 overflow-hidden"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-xs text-gray-400">asset-analysis</span>
        </div>
        <pre className="text-sm text-left overflow-auto text-gray-300 font-mono">
          <code>{codeSnippet}</code>
        </pre>
        <motion.div 
          className="absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-tr from-sky-500 to-blue-600 rounded-full opacity-20 blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </motion.div>
    </motion.div>
  );
}