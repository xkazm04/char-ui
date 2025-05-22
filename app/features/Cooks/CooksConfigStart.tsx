import { DataSourceConfig } from "@/app/types/config";

type Props = {
    dataConfigs: DataSourceConfig[];
    isRunning: boolean;
    setIsRunning: (isRunning: boolean) => void;
    agentNames: string[];
}

const CooksConfigStart = ({dataConfigs, isRunning, setIsRunning, agentNames }: Props) => {
    const handleStart = async () => {
        setIsRunning(true);

        try {
            // const response = await fetch(`${serverUrl}/api/agents/run`, {
            //   method: 'POST',
            //   headers: {
            //     'Content-Type': 'application/json',
            //   },
            //   body: JSON.stringify({
            //     user_id: "user123",  
            //     message: "Generate character variations"
            //   }),
            // });

            // if (response.ok) {
            //   const data = await response.json();
            //   // Process the response data
            //   // setLogs based on the events from the response
            // }

            // Placeholder for now
            const newLogs = [];
            for (const agent of agentNames) {
                const agentLog = `Sample output from ${agent} agent.`;
                newLogs.push([agentLog]);
            }
        } catch (error) {
            console.error("Error running agent workflow:", error);
        } finally {
            setIsRunning(false);
        }
    };
    return <>
        <div className="flex justify-end mt-4">
            <button
                onClick={handleStart}
                disabled={isRunning || dataConfigs.length === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded text-sm transition-colors
                        ${isRunning || dataConfigs.length === 0
                        ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
            >
                {isRunning ? (
                    <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Running...
                    </>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Start Workflow
                    </>
                )}
            </button>
        </div>
    </>
}

export default CooksConfigStart;