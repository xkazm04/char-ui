import CooksConfig from "./CooksConfig";
import CooksPrompt from "./CooksPrompt";
import CooksLog from "./CooksLog";
import { useState } from "react";
import Image from "next/image";

const CooksLayout = () => {
    const [iterations, setIterations] = useState(3);
    const [isRunning, setIsRunning] = useState(false);
    const [logs, setLogs] = useState<Array<Array<string>>>([]);
    const [isWorking, setIsWorking] = useState(false);
    
    // Example agent prompts - replace with actual prompts or make dynamic
    const agentPrompts = [
        { id: 1, name: "Research Agent", prompt: "Research the given topic and provide key insights." },
        { id: 2, name: "Analysis Agent", prompt: "Analyze the research and identify patterns." },
        { id: 3, name: "Summary Agent", prompt: "Create a concise summary of the findings." },
    ];

    const handleStart = () => {
        setIsRunning(true);
        // Simulate workflow execution
        const newLogs = [];
        for (let i = 0; i < iterations; i++) {
            const iterationLog = agentPrompts.map(agent => 
                `Sample output from ${agent.name} for iteration ${i+1}. This would contain the actual response from the agent based on its prompt and the outputs from previous agents.`
            );
            newLogs.push(iterationLog);
        }
        setLogs(newLogs);
        setIsRunning(false);
    };

    return (
        <div className="flex flex-col p-4 gap-4">
            <CooksConfig 
                iterations={iterations} 
                setIterations={setIterations} 
                onStart={handleStart}
                isRunning={isRunning}
            />
            {/* <div className="fixed bottom-0 opacity-5 z-0 bg-black h-full w-full">
                <Image
                    src={isWorking ? "/gifs/vial.gif" : "/landing/vial.png"}
                    alt="vial"
                    width={500}
                    height={300}
                    className="rounded-lg shadow-lg"
                    />
            </div> */}
            
            <div className="flex flex-wrap gap-4">
                {agentPrompts.map(agent => (
                    <CooksPrompt 
                        key={agent.id}
                        name={agent.name}
                        prompt={agent.prompt}
                        onChange={(newPrompt: string) => {
                            console.log(`Updated prompt for ${agent.name}:`, newPrompt);
                        }}
                    />
                ))}
            </div>
            
            <CooksLog agents={agentPrompts.map(a => a.name)} logs={logs} />
        </div>
    );
};

export default CooksLayout;