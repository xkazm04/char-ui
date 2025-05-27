import StatusTag from "@/app/components/ui/StatusTag";
import { CookStatusType } from "@/app/types/cooks";
import { AgentLog } from "@/app/functions/agentLogsFns";
import { motion } from "framer-motion";
import { useState } from "react";
import CooksLogItemOutput from "./CooksLogItemOutput";

interface ExpandedCell {
    logIndex: number;
}

type Props = {
    log: AgentLog;
    logIndex: number;
    agentNames: string[];
}

const CooksLogItem = ({ log, logIndex }: Props) => {
    const [expandedCell, setExpandedCell] = useState<ExpandedCell | null>(null);
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);
    
    // Determine status based on output content
    const getStatus = (output: string): CookStatusType => {
        const lowerOutput = output.toLowerCase();
        if (lowerOutput.includes('error') || lowerOutput.includes('failed')) {
            return 'error';
        }
        if (lowerOutput.includes('success') || lowerOutput.includes('completed')) {
            return 'success';
        }
        return 'waiting';
    };


    const handleCellClick = (logIndex: number) => {
        if (expandedCell?.logIndex === logIndex) {
            setExpandedCell(null);
        } else {
            setExpandedCell({ logIndex });
        }
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getAgentColor = (agentName: string) => {
        const colors = {
            'analyst': 'text-blue-400 bg-blue-900/20',
            'artist': 'text-purple-400 bg-purple-900/20', 
            'critic': 'text-orange-400 bg-orange-900/20',
            'coordinator': 'text-green-400 bg-green-900/20'
        };
        return colors[agentName as keyof typeof colors] || 'text-gray-400 bg-gray-900/20';
    };

    return (
        <motion.tr
            className={`${logIndex % 2 === 0 ? 'bg-gray-800/50' : 'bg-gray-850/50'} 
                       ${hoveredRow === logIndex ? 'bg-gray-700/70 shadow-lg' : ''} 
                       border-b border-gray-700/30 transition-all duration-300`}
            onMouseEnter={() => setHoveredRow(logIndex)}
            onMouseLeave={() => setHoveredRow(null)}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                duration: 0.4,
                delay: logIndex * 0.05,
                ease: [0.4, 0.0, 0.2, 1]
            }}
        >
            {/* Row Number */}
            <td className="px-3 py-4 text-xs text-gray-400 font-mono">
                <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: logIndex * 0.05 + 0.2 }}
                    className="inline-flex items-center justify-center w-6 h-6 bg-gray-700 rounded-full text-xs"
                >
                    {logIndex + 1}
                </motion.span>
            </td>

            {/* Timestamp */}
            <td className="px-3 py-4 text-xs text-gray-400 font-mono">
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: logIndex * 0.05 + 0.1 }}
                >
                    {formatTimestamp(log.timestamp)}
                </motion.div>
            </td>

            {/* Agent Name */}
            <td className="px-3 py-4">
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: logIndex * 0.05 + 0.15 }}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getAgentColor(log.agent_name)}`}
                >
                    <div className="w-2 h-2 rounded-full bg-current mr-2 animate-pulse" />
                    {log.agent_name}
                </motion.div>
            </td>

            {/* Output */}
            <td
                className={`relative px-3 py-4 text-xs text-gray-300 transition-all duration-300 cursor-pointer
                           ${expandedCell?.logIndex === logIndex
                    ? 'bg-gray-600/30 rounded-lg shadow-inner'
                    : 'hover:bg-gray-700/30'}`}
                onClick={() => handleCellClick(logIndex)}
            >
                <CooksLogItemOutput
                    log={log}
                    expandedCell={expandedCell}
                    setExpandedCell={setExpandedCell}
                    logIndex={logIndex}
                />
            </td>

            {/* Status */}
            <td className="px-3 py-4 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: logIndex * 0.05 + 0.3 }}
                >
                    <StatusTag status={getStatus(log.output)} />
                </motion.div>
            </td>
        </motion.tr>
    );
};

export default CooksLogItem;