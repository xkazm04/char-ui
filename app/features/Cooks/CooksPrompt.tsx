import { useState } from "react";
import {useUpdatePrompt } from "../../functions/promptFns";
import { PromptModel } from "@/app/types/prompt";

interface CooksPromptProps {
    agent: string;
    prompts: PromptModel[];
}

const CooksPrompt = ({ agent, prompts }: CooksPromptProps) => {
    const [activeTab, setActiveTab] = useState<string>(prompts.length > 0 ? prompts[0]._id : "");
    const updatePromptMutation = useUpdatePrompt();

    const handleChange = (promptId: string, newPromptText: string) => {
        updatePromptMutation.mutate({
            promptId,
            promptData: {
                prompt: newPromptText
            }
        });
    };

    const toggleEnabled = (prompt: PromptModel) => {
        // If enabling this prompt, disable all others for this agent
        if (!prompt.enabled) {
            // Disable all prompts for this agent
            prompts.forEach(p => {
                if (p._id !== prompt._id && p.enabled) {
                    updatePromptMutation.mutate({
                        promptId: p._id,
                        promptData: { enabled: false }
                    });
                }
            });
        }
        
        // Toggle this prompt's enabled state
        updatePromptMutation.mutate({
            promptId: prompt._id, 
            promptData: { enabled: !prompt.enabled }
        });
    };

    // If no prompts, show empty state
    if (prompts.length === 0) {
        return (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)]">
                <h3 className="text-sm font-medium text-gray-200 mb-2">{agent}</h3>
                <p className="text-sm text-gray-400">No prompts available</p>
            </div>
        );
    }

    const activePrompt = prompts.find(p => p._id === activeTab) || prompts[0];

    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)]">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-200 capitalize">{agent}</h3>
                
                <div className="flex items-center">
                    <span className="text-xs text-gray-400 mr-2">Enabled</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={activePrompt.enabled}
                            onChange={() => toggleEnabled(activePrompt)}
                        />
                        <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>

            {/* Tab navigation if multiple prompts */}
            {prompts.length > 1 && (
                <div className="flex overflow-x-auto space-x-2 mb-3 pb-1">
                    {prompts.map((prompt) => (
                        <button
                            key={prompt._id}
                            className={`px-3 py-1 text-xs rounded-md whitespace-nowrap transition-colors ${
                                activeTab === prompt._id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                            onClick={() => setActiveTab(prompt._id)}
                        >
                            {prompt.name || `Prompt ${prompt._id.slice(-4)}`}
                            {prompt.enabled && <span className="ml-1 text-xs bg-green-500 text-white rounded-full w-2 h-2 inline-block"></span>}
                        </button>
                    ))}
                </div>
            )}
            
            <div className="relative">
                <textarea
                    className={`w-full bg-gray-700/70 border ${
                        updatePromptMutation.isPending ? 'border-yellow-600' : 'border-gray-600'
                    } rounded-md p-3 text-sm outline-none text-white resize-none focus:ring-1 focus:ring-blue-500 focus:border-transparent`}
                    rows={8}
                    value={activePrompt.prompt}
                    onChange={(e) => handleChange(activePrompt._id, e.target.value)}
                    placeholder="Enter prompt instructions for this agent..."
                    disabled={updatePromptMutation.isPending}
                ></textarea>
                
                <div className="absolute bottom-2 right-2 flex items-center text-xs">
                    {updatePromptMutation.isPending && (
                        <svg className="animate-spin h-3 w-3 text-yellow-500 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    )}
                    <span className="text-gray-400">
                        {activePrompt.prompt.length} chars
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CooksPrompt;