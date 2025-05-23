import { motion } from "framer-motion"
import { Download } from "lucide-react"

type Props = {
    selectedSketches: Set<string>;
    setSelectedSketches: (sketches: Set<string>) => void;
}
const CharacterSketchGridBulk = ({selectedSketches, setSelectedSketches}: Props) => {
    return <>
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="p-4 bg-gradient-to-r from-sky-900/30 to-gray-900/30 border-t border-sky-900/30 backdrop-blur"
        >
            <div className="flex items-center justify-between">
                <span className="text-sm text-sky-300">
                    {selectedSketches.size} sketch{selectedSketches.size !== 1 ? 'es' : ''} selected
                </span>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-sky-600/80 hover:bg-sky-600 rounded-md text-sm text-white transition-colors">
                        <Download className="h-4 w-4" />
                        Download
                    </button>
                    <button
                        onClick={() => setSelectedSketches(new Set())}
                        className="px-3 py-1.5 bg-gray-600/80 hover:bg-gray-600 rounded-md text-sm text-white transition-colors"
                    >
                        Clear
                    </button>
                </div>
            </div>
        </motion.div>
    </>
}

export default CharacterSketchGridBulk