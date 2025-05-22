import CooksLogItem from "./CooksLogItem";

interface CooksLogProps {
    agents: string[];
    logs: Array<Array<string>>;
}


const CooksLog = ({ agents, logs }: CooksLogProps) => {
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
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                        <tr>
                            <th className="px-2 py-1 lg:px-4 lg:py-2 text-left text-2xs lg:text-xs font-medium text-gray-400 uppercase tracking-wider w-16">
                                <span>Iter</span>
                            </th>
                            {agents.map((agent, index) => (
                                <th key={index} className="px-2 py-1 lg:px-4 lg:py-2 text-left text-2xs lg:text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    <span>{agent}</span>
                                </th>
                            ))}
                            <th className="px-2 py-1 lg:px-4 lg:py-2 text-center text-2xs lg:text-xs font-medium text-gray-400 uppercase tracking-wider w-16">
                                <span>Status</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {displayLogs.map((row, rowIndex) => (
                            <CooksLogItem row={row} key={rowIndex} rowIndex={rowIndex}/>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add custom CSS for smaller screens */}
            <style jsx>{`
                /* Custom text size */
                .text-2xs {
                    font-size: 0.65rem;
                }
                
                /* Custom background color for alternating rows */
                .bg-gray-850 {
                    background-color: rgba(31, 41, 55, 0.85);
                }
                
                /* Hover color for rows */
                .bg-gray-750 {
                    background-color: rgba(55, 65, 81, 0.5);
                }
            `}</style>
        </div>
    );
};

export default CooksLog;