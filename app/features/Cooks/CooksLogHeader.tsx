import { AgentLog } from "@/app/functions/agentLogsFns";
import { motion } from "framer-motion";

type Props = {
    filteredLogs: AgentLog[];
    filter: string;
    setFilter: (value: string) => void;
    agents: string[];
    sessionId?: string;
    mockMode?: boolean; 
    isAutoRefresh: boolean;
    setIsAutoRefresh: (value: boolean) => void;
}

const CooksLogHeader = ({filteredLogs, filter, setFilter, agents, sessionId, mockMode, isAutoRefresh, setIsAutoRefresh}: Props) => {
    return <>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center gap-3">
                <h3 className="text-lg font-medium text-gray-200">Workflow Logs</h3>
                <motion.div
                    className="flex items-center gap-2 px-3 py-1 bg-gray-700/50 rounded-full text-xs text-gray-300"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    {filteredLogs.length} entries
                </motion.div>
            </div>

            <div className="flex items-center gap-3">
                {/* Agent Filter */}
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-3 py-1 bg-gray-700 border border-gray-600 rounded-lg text-xs text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">All Agents</option>
                    {agents.map(agent => (
                        <option key={agent} value={agent}>{agent}</option>
                    ))}
                </select>

                {/* Auto-refresh toggle */}
                {sessionId && !mockMode && (
                    <motion.button
                        onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                        className={`px-3 py-1 rounded-lg text-xs transition-all ${isAutoRefresh
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {isAutoRefresh ? '● Live' : '○ Paused'}
                    </motion.button>
                )}
            </div>
        </div>
    </>
}

export default CooksLogHeader;