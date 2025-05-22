import { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { PromptModel } from "@/app/types/prompt";

type Props = {
    activePrompt: PromptModel | undefined;
    setActivePrompt: (promptId: string, isEnabled: boolean) => Promise<void>;
    setActivePrompts: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    agentPrompts: PromptModel[];
    activePromptId: string;
    agent: string;
    isActivating: boolean;
}

const PromptMainSwitch = ({activePrompt, setActivePrompt, setActivePrompts, agentPrompts, activePromptId, agent, isActivating}: Props) => {
    const [activatingPromptId, setActivatingPromptId] = useState<string | null>(null);
    const handleActivatePrompt = async (promptId: string) => {
        setActivatingPromptId(promptId);
        await setActivePrompt(promptId, true);
        setActivatingPromptId(null);
    };

    const switchActivePrompt = (agent: string, promptId: string) => {
        setActivePrompts((prev: Record<string, string>) => ({
            ...prev,
            [agent]: promptId
        }));
    };
    return <>
        <div className="flex justify-between items-center mb-3">
            <div className="flex overflow-x-auto space-x-2 pb-1">
                {agentPrompts.map((prompt) => (
                    <button
                        key={prompt._id}
                        className={`px-3 py-1 text-xs rounded-md whitespace-nowrap transition-colors ${activePromptId === prompt._id
                            ? 'bg-sky-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        onClick={() => switchActivePrompt(agent, prompt._id)}
                    >
                        {prompt.name || `Variant ${prompt._id.slice(-4)}`}
                        {prompt.enabled && (
                            <span className="ml-1 text-xs bg-green-500 text-white rounded-full w-2 h-2 inline-block"></span>
                        )}
                    </button>
                ))}
            </div>

            {/* Activate button - only show if not already enabled */}
            {activePrompt && !activePrompt.enabled && (
                <button
                    onClick={() => handleActivatePrompt(activePrompt._id)}
                    disabled={!!activatingPromptId || isActivating}
                    className={`text-xs flex items-center gap-1 px-2 py-1 rounded 
                            ${!!activatingPromptId || isActivating
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-700 hover:bg-sky-600 text-gray-300 hover:text-white cursor-pointer transition-colors'
                        }`}
                    title="Set as active prompt"
                >
                    {activatingPromptId === activePrompt._id || isActivating ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                        <CheckCircle className="w-3 h-3" />
                    )}
                    <span>Set Active</span>
                </button>
            )}
        </div>
    </>
}

export default PromptMainSwitch;