import CooksLogItem from "./CooksLogItem";
import { useSessionLogs, AgentLog } from "@/app/functions/agentLogsFns";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import CooksLogHeader from "./CooksLogHeader";

interface CooksLogProps {
    sessionId?: string;
    agents: string[];
    mockMode?: boolean; // For backward compatibility
}

const CooksLog = ({ sessionId, agents, mockMode = false }: CooksLogProps) => {
    const [isAutoRefresh, setIsAutoRefresh] = useState(true);
    const [filter, setFilter] = useState<string>('all');

    const { data: realLogs = [], isLoading, error, refetch } = useSessionLogs(sessionId || '', !!sessionId && !mockMode);
    const mockLogs: AgentLog[] = [
        {
            id: "1",
            session_id: "test-session",
            agent_name: "analyst",
            output: "Research Agent has identified key topics related to climate change: rising temperatures, melting ice caps, and increased frequency of extreme weather events. According to the IPCC report, global temperatures have increased by approximately 1°C since pre-industrial times.",
            timestamp: new Date(Date.now() - 30000).toISOString()
        },
        {
            id: "2",
            session_id: "test-session",
            agent_name: "artist",
            output: "Analysis shows clear correlation between CO2 emissions and temperature rise. Data patterns indicate accelerating effects over the past decade. Three main contributors identified: energy production (42%), transportation (23%), industrial processes (19%).",
            timestamp: new Date(Date.now() - 20000).toISOString()
        },
        {
            id: "3",
            session_id: "test-session",
            agent_name: "critic",
            output: "Error in data processing: Unable to complete analysis due to inconsistent measurement units in source data. Recommend standardizing to metric tons CO2 equivalent across all datasets before reprocessing.",
            timestamp: new Date(Date.now() - 10000).toISOString()
        }
    ];

    const logs = mockMode || !sessionId ? mockLogs : realLogs;

    const filteredLogs = filter === 'all'
        ? logs
        : logs.filter(log => log.agent_name === filter);

    useEffect(() => {
        if (isAutoRefresh && sessionId && !mockMode) {
            const interval = setInterval(() => {
                refetch();
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [isAutoRefresh, sessionId, mockMode, refetch]);

    if (isLoading && !mockMode) {
        return (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 mt-4 max-w-[1400px]">
                <div className="flex items-center justify-center h-32">
                    <motion.div
                        className="flex space-x-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="w-3 h-3 bg-blue-500 rounded-full"
                                animate={{
                                    y: [0, -10, 0],
                                    opacity: [0.5, 1, 0.5]
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: i * 0.2
                                }}
                            />
                        ))}
                    </motion.div>
                </div>
            </div>
        );
    }

    if (error && !mockMode) {
        return (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-red-700/50 p-6 mt-4 max-w-[1400px]">
                <div className="text-red-400 text-center">
                    <h3 className="text-lg font-medium mb-2">Error Loading Logs</h3>
                    <p className="text-sm text-gray-300">{error.message}</p>
                    <button
                        onClick={() => refetch()}
                        className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 mt-4 max-w-[1400px] shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <CooksLogHeader
                filteredLogs={filteredLogs}
                filter={filter}
                setFilter={setFilter}
                agents={agents}
                sessionId={sessionId}
                mockMode={mockMode}
                isAutoRefresh={isAutoRefresh}
                setIsAutoRefresh={setIsAutoRefresh}
            />

            {filteredLogs.length === 0 && <div className="text-gray-400 text-sm italic text-center py-8">
                {sessionId ? "No logs found for this session yet." : "No logs yet. Start the workflow to see results here."}
            </div>}

            <div className="overflow-x-auto rounded-lg border border-gray-700/30">
                <table className="min-w-full divide-y divide-gray-700/30">
                    <thead className="bg-gray-900/50">
                        <tr>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-16">
                                #
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-24">
                                Time
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-32">
                                Agent
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Output
                            </th>
                            <th className="px-3 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider w-20">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/20">
                        <AnimatePresence>
                            {filteredLogs.map((log, logIndex) => (
                                <CooksLogItem
                                    key={log.id}
                                    log={log}
                                    logIndex={logIndex}
                                    agentNames={agents}
                                />
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* Session Info */}
            {sessionId && (
                <motion.div
                    className="mt-4 p-3 bg-gray-900/30 rounded-lg border border-gray-700/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <p className="text-xs text-gray-400">
                        Session ID: <span className="font-mono text-gray-300">{sessionId}</span>
                        {!mockMode && (
                            <span className="ml-3">
                                Last updated: {new Date().toLocaleTimeString()}
                            </span>
                        )}
                    </p>
                </motion.div>
            )}
        </motion.div>
    );
};

export default CooksLog;