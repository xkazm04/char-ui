import { motion } from "framer-motion";

type Props = {
    progress: number; 
}
const ProgressBar = ({progress}: Props) => (
    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-800">
        <motion.div
            className="h-full bg-gradient-to-r from-sky-500 to-indigo-600"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
        />
    </div>
);

export default ProgressBar;