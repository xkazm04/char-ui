import CooksConfig from "./CooksConfig";
import CooksPrompt from "./CooksPrompt";
import CooksLog from "./CooksLog";
import { useState } from "react";
import Image from "next/image";
import { usePrompts } from "../../functions/promptFns";
import { useDataConfigs } from "../../functions/configFns";
import CooksError from "./CooksError";
import { PromptModel } from "@/app/types/prompt";
import CooksPromptSetup from "./CooksPromptSetup";

const CooksLayout = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [logs, setLogs] = useState<Array<Array<string>>>([]);
    const [isWorking, setIsWorking] = useState(false);
    
    const { data: prompts = [], isLoading: isLoadingPrompts } = usePrompts();
    const { data: dataConfigs = [], isLoading: isLoadingConfigs, isError: isConfError, error: errConfig } = useDataConfigs();
    
    const promptsByAgent: Record<string, PromptModel[]> = {};
    prompts.forEach(prompt => {
        if (!promptsByAgent[prompt.agent]) {
            promptsByAgent[prompt.agent] = [];
        }
        promptsByAgent[prompt.agent].push(prompt);
    });

    const agentNames = Object.keys(promptsByAgent);

    const handleStart = async () => {
        setIsRunning(true);
        setIsWorking(true);
        
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
            setLogs(newLogs);
        } catch (error) {
            console.error("Error running agent workflow:", error);
        } finally {
            setIsRunning(false);
            setTimeout(() => setIsWorking(false), 3000);
        }
    };

    return (
        <div className="flex flex-col p-4 gap-4 relative h-full">            
            {/* Loading States */}
            {(isLoadingPrompts || isLoadingConfigs) && (
                <div className="flex justify-center items-center text-gray-400 py-4">
                    <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading configuration...
                </div>
            )}
            
            {/* Main Content */}
            {!isLoadingConfigs && !isConfError && <CooksConfig 
                dataConfigs={dataConfigs}
                onStart={handleStart}
                isRunning={isRunning}
            />}
            {isConfError && (
                <div className="flex flex-col absolute right-0 text-gray-400 py-4">
                    <CooksError error={errConfig} />
                </div>
            )}
            
            <div className="flex flex-wrap gap-4">
                {Object.entries(promptsByAgent).map(([agent, agentPrompts]) => (
                    <CooksPrompt 
                        key={agent}
                        agent={agent}
                        prompts={agentPrompts}
                    />
                ))}
                {Object.keys(promptsByAgent).length == 0 && <>
                    <CooksPromptSetup />
                </>}
            </div>
            
            <CooksLog agents={agentNames} logs={logs} />
        </div>
    );
};

export default CooksLayout;