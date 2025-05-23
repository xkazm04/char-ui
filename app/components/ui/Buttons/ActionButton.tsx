import { motion } from "framer-motion"

type Props = {
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
}

const ActionButton = ({children, onClick, disabled}: Props) => {
    return <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        disabled={disabled}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 text-sm font-medium cursor-pointer bg-sky-500/10 border-sky-400/20 text-sky-400 hover:bg-sky-500/20 hover:text-sky-300"
    >{children}
    </motion.button>
}
export default ActionButton