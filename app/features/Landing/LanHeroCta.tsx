import { m } from "framer-motion"
import { LucidePlay, ArrowRight, Gitlab, Zap } from "lucide-react"

type Props = {
    handleTryDemo: () => void
}

const LanHeroCta = ({handleTryDemo}: Props) => {
    return <m.div
        className="flex flex-col items-center gap-6 mt-5"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.8 }}
    >
        <div className="flex flex-col sm:flex-row gap-4">
            {/* Primary CTA */}
            <m.button
                className="group relative px-8 py-4 bg-gradient-to-r from-sky-600 to-blue-700 rounded-xl font-semibold text-white flex items-center gap-3 overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleTryDemo}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center gap-3">
                    <LucidePlay className="w-5 h-5 fill-current" />
                    <span>Demo app</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
            </m.button>

            <m.button
                className="px-8 py-4 border border-white/20 rounded-xl font-semibold text-white backdrop-blur-sm hover:bg-white/5 transition-colors flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <Gitlab className="w-5 h-5" />
                <span>Open sourced</span>
            </m.button>
        </div>

        {/* Trust Indicators */}
        <div className="flex items-center gap-6 text-sm text-gray-400 mt-4">
            <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>Powered by</span>
            </div>
        </div>
    </m.div>
}

export default LanHeroCta