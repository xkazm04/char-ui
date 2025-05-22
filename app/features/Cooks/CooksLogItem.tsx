import StatusTag from "@/app/components/ui/StatusTag";
import { CookStatusType } from "@/app/types/cooks";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface ExpandedCell {
    row: number;
    col: number;
}
type Props = {
    row: string[];
    rowIndex: number;
}

const CooksLogItem = ({ row, rowIndex }: Props) => {
    const [expandedCell, setExpandedCell] = useState<ExpandedCell | null>(null);
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);
    const mockStatuses: CookStatusType[] = ["success", "success", "error"];

    // Function to truncate text - now using responsive design
    const truncateText = (text: string) => {
        const maxLength = {
            sm: 20,
            md: 30,
            lg: 50
        };

        return text.length > maxLength.lg
            ? <>
                <span className="hidden lg:inline">{text.substring(0, maxLength.lg)}...</span>
                <span className="hidden md:inline lg:hidden">{text.substring(0, maxLength.md)}...</span>
                <span className="inline md:hidden">{text.substring(0, maxLength.sm)}...</span>
            </>
            : text;
    };

    const handleCellClick = (row: number, col: number) => {
        if (expandedCell?.row === row && expandedCell?.col === col) {
            setExpandedCell(null);
        } else {
            setExpandedCell({ row, col });
        }
    };
    return <>
        <motion.tr
            className={`${rowIndex % 2 === 0 ? 'bg-gray-800' : 'bg-gray-850'} ${hoveredRow === rowIndex ? 'bg-gray-750' : ''}`}
            onMouseEnter={() => setHoveredRow(rowIndex)}
            onMouseLeave={() => setHoveredRow(null)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.3,
                delay: rowIndex * 0.1,
                ease: "easeOut"
            }}
        >
            <td className="px-2 py-1 lg:px-4 lg:py-3 text-2xs lg:text-xs text-gray-300 font-medium">
                {rowIndex + 1}
            </td>
            {row.map((cell, colIndex) => (
                <td
                    key={colIndex}
                    className={`relative px-2 py-1 lg:px-4 lg:py-3 text-2xs lg:text-xs text-gray-300 transition-all duration-300 
                                            ${expandedCell?.row === rowIndex && expandedCell?.col === colIndex
                            ? 'bg-gray-700 rounded-lg shadow-lg z-10'
                            : 'cursor-pointer hover:bg-gray-700'}`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                    <AnimatePresence>
                        {expandedCell?.row === rowIndex && expandedCell?.col === colIndex ? (
                            <motion.div
                                className="relative"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="whitespace-pre-wrap break-words max-h-64 overflow-y-auto pr-6">
                                    {cell}
                                </div>
                                <motion.button
                                    className="absolute top-0 right-0 bg-gray-600 hover:bg-gray-500 text-xs text-white rounded p-1"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setExpandedCell(null);
                                    }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </motion.button>
                            </motion.div>
                        ) : (
                            <motion.div
                                className="flex items-center gap-1"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <span className="truncate">{truncateText(cell)}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </td>
            ))}
            <td className="px-2 py-1 lg:px-4 lg:py-3 text-center">
                <StatusTag status={mockStatuses[rowIndex] || "waiting"} />
            </td>
        </motion.tr>
    </>
}

export default CooksLogItem;