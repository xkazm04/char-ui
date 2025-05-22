import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  label?: string;
  size?: "sm" | "md" | "lg";
}

const LoadingSpinner = ({ label = "Loading...", size = "md" }: LoadingSpinnerProps) => {
  const sizeMap = {
    sm: { spinner: 16, text: "text-xs" },
    md: { spinner: 24, text: "text-sm" },
    lg: { spinner: 32, text: "text-base" }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center p-8 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Loader2 
        className={`animate-spin text-sky-500 mb-2`} 
        size={sizeMap[size].spinner}
      />
      <p className={`${sizeMap[size].text} text-gray-400`}>{label}</p>
    </motion.div>
  );
};

export default LoadingSpinner;