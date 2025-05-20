import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Note: You might need to install framer-motion

interface CooksLogProps {
    agents: string[];
    logs: Array<Array<string>>;
}

// Added status type for workflow iterations
type StatusType = "success" | "error" | "running" | "waiting";

interface ExpandedCell {
    row: number;
    col: number;
}

// Status tag component
const StatusTag = ({ status }: { status: StatusType }) => {
    const getStatusStyles = () => {
        switch (status) {
            case "success":
                return "bg-green-900 text-green-300 border-green-700";
            case "error":
                return "bg-red-900 text-red-300 border-red-700";
            case "running":
                return "bg-blue-900 text-blue-300 border-blue-700";
            case "waiting":
                return "bg-gray-700 text-gray-300 border-gray-600";
        }
    };

    const getStatusIcon = () => {
        switch (status) {
            case "success":
                return (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                );
            case "error":
                return (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                );
            case "running":
                return (
                    <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                );
            case "waiting":
                return (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    return (
        <span className={`inline-flex items-center w-[70px] px-1.5 py-0.5 rounded text-xs font-medium border ${getStatusStyles()}`}>
            {getStatusIcon()}
            <span className="ml-1 capitalize text-2xs">{status}</span>
        </span>
    );
};

const CooksLog = ({ agents, logs }: CooksLogProps) => {
    const [expandedCell, setExpandedCell] = useState<ExpandedCell | null>(null);
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);
    const [compactView, setCompactView] = useState(true);
    
    // Example statuses for mock UI
    const mockStatuses: StatusType[] = ["success", "success", "error"];
    
    // Function to truncate text
    const truncateText = (text: string, maxLength: number = compactView ? 30 : 50) => {
        return text.length > maxLength 
            ? text.substring(0, maxLength) + '...'
            : text;
    };
    
    const handleCellClick = (row: number, col: number) => {
        if (expandedCell?.row === row && expandedCell?.col === col) {
            setExpandedCell(null);
        } else {
            setExpandedCell({ row, col });
        }
    };

    // Generate mock logs if none are provided
    const displayLogs = logs.length > 0 ? logs : [
        [
            "Research Agent has identified key topics related to climate change: rising temperatures, melting ice caps, and increased frequency of extreme weather events. According to the IPCC report, global temperatures have increased by approximately 1°C since pre-industrial times.",
            "Analysis shows clear correlation between CO2 emissions and temperature rise. Data patterns indicate accelerating effects over the past decade. Three main contributors identified: energy production (42%), transportation (23%), industrial processes (19%).",
            "Climate change is primarily driven by human activities that increase greenhouse gas concentrations. Key impacts include rising temperatures, melting ice caps, and more frequent extreme weather. Mitigation requires global cooperation on emission reduction."
        ],
        [
            "Research on renewable energy sources reveals significant cost reductions in solar (89% since 2010) and wind (70%) technologies. Battery storage costs have declined 85% in the same period. Adoption rates vary significantly by region.",
            "Analysis indicates renewable energy is now cost-competitive with fossil fuels in 67% of global markets. Investment trends show 3.2x increase in developing nations. Technical challenges remain in grid integration and storage at scale.",
            "Renewable energy technologies have reached economic parity with conventional sources in most markets. Solar and wind lead in cost reduction and adoption. Key challenges include grid modernization, storage solutions, and policy consistency."
        ],
        [
            "Research into carbon capture technologies identifies three promising approaches: direct air capture (DAC), bioenergy with carbon capture (BECCS), and enhanced weathering. Current costs range from $100-$600 per ton CO2 depending on method.",
            "Error in data processing: Unable to complete analysis due to inconsistent measurement units in source data. Recommend standardizing to metric tons CO2 equivalent across all datasets before reprocessing.",
            "Unable to generate summary due to incomplete analysis in previous step. Please resolve data inconsistency issues and rerun the workflow."
        ]
    ];

    if (displayLogs.length === 0) {
        return (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 mt-4">
                <h3 className="text-sm font-medium text-gray-200 mb-2">Workflow Logs</h3>
                <div className="text-gray-400 text-sm italic">No logs yet. Start the workflow to see results here.</div>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 mt-4 max-w-[1200px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-gray-200">Workflow Logs</h3>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setCompactView(!compactView)}
                        className="text-xs flex items-center gap-1 text-gray-400 hover:text-gray-200 transition-colors"
                    >
                        {compactView ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                                </svg>
                                <span>Expand View</span>
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12V4m0 0h-4m4 0l-5 5M4 12v8m0 0h4m-4 0l5-5" />
                                </svg>
                                <span>Compact View</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
            
            <div className="">
                <table className={`divide-y divide-gray-700 ${compactView ? 'table-compact' : ''}`}>
                    <thead>
                        <tr>
                            <th className={`${compactView ? 'px-2 py-1' : 'px-4 py-2'} text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-16`}>
                                <span className={compactView ? 'text-2xs' : 'text-xs'}>Iter</span>
                            </th>
                            {agents.map((agent, index) => (
                                <th key={index} className={`${compactView ? 'px-2 py-1' : 'px-4 py-2'} text-left text-xs font-medium text-gray-400 uppercase tracking-wider`}>
                                    <span className={compactView ? 'text-2xs' : 'text-xs'}>{agent}</span>
                                </th>
                            ))}
                            <th className={`${compactView ? 'px-2 py-1' : 'px-4 py-2'} text-center text-xs font-medium text-gray-400 uppercase tracking-wider w-16`}>
                                <span className={compactView ? 'text-2xs' : 'text-xs'}>Status</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {displayLogs.map((row, rowIndex) => (
                            <motion.tr 
                                key={rowIndex} 
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
                                <td className={`${compactView ? 'px-2 py-1' : 'px-4 py-3'} ${compactView ? 'text-2xs' : 'text-xs'} text-gray-300 font-medium`}>
                                    {rowIndex + 1}
                                </td>
                                {row.map((cell, colIndex) => (
                                    <td 
                                        key={colIndex} 
                                        className={`relative ${compactView ? 'px-2 py-1' : 'px-4 py-3'} ${compactView ? 'text-2xs' : 'text-xs'} text-gray-300 transition-all duration-300 
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
                                <td className={`${compactView ? 'px-2 py-1' : 'px-4 py-3'} text-center`}>
                                    <StatusTag status={mockStatuses[rowIndex] || "waiting"} />
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add custom CSS for smaller screens */}
            <style jsx>{`
                @media (max-width: 640px) {
                    .table-compact th, .table-compact td {
                        padding: 0.25rem 0.5rem;
                        font-size: 0.65rem;
                    }
                }
                
                /* Custom text size */
                .text-2xs {
                    font-size: 0.65rem;
                }
            `}</style>
        </div>
    );
};

export default CooksLog;