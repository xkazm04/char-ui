import { ChangeEvent } from "react";

interface CooksConfigProps {
    iterations: number;
    setIterations: (iterations: number) => void;
    onStart: () => void;
    isRunning: boolean;
}

const CooksConfig = ({ iterations, setIterations, onStart, isRunning }: CooksConfigProps) => {
    const handleIterationChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value > 0) {
            setIterations(value);
        }
    };

    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 w-full">
            <h3 className="text-sm font-medium text-gray-200 mb-4">Agent Workflow Configuration</h3>
            
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex flex-col gap-1 w-full md:w-auto">
                    <label htmlFor="iterations" className="text-xs text-gray-300">
                        Number of Iterations
                    </label>
                    <input
                        id="iterations"
                        type="number"
                        min="1"
                        value={iterations}
                        onChange={handleIterationChange}
                        className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white w-full md:w-32"
                    />
                </div>
                
                <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0 md:ml-auto">
                    <button
                        onClick={onStart}
                        disabled={isRunning}
                        className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors
                            ${isRunning 
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
            </div>
            
            <h4 className="text-xs font-mono mt-4 text-gray-400">
                Insert your one-time API key for other than Groq
            </h4>
        </div>
    );
};

export default CooksConfig;