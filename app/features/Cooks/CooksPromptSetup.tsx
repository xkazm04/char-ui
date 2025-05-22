import { Label } from "@/app/components/ui/label";
import { Switch } from "@/app/components/ui/switch";
import { useCreatePrompt } from "@/app/functions/promptFns";
import { CreatePromptModel } from "@/app/types/prompt";
import Image from "next/image";

const CooksPromptSetup = () => {
    const createPrompt = useCreatePrompt();
    const agentconfigs = [
        {
            name: "Cooks",
            description: "Cooks is a character generator that creates character variations based on the provided prompts.",
            isEnabled: true,
        },
        {
            name: "Cooks-2",
            description: "Cooks-2 is a character generator that creates character variations based on the provided prompts.",
            isEnabled: false,
        },
        {
            name: "Cooks-3",
            description: "Cooks-3 is a character generator that creates character variations based on the provided prompts.",
            isEnabled: true
        }
    ]

    const handleCreatePrompt = ({ agent, name, prompt, enabled = true }: CreatePromptModel) => {
        createPrompt.mutate({ agent, name, prompt, enabled });
    }
    return <>
        <div className="flex flex-row gap-4">
            <p className="text-gray-500">Please configure the prompts for each agent.</p>
            <div className="flex flex-row gap-2">
                {agentconfigs.map((prompt, index) => (
                    <div key={index} className="flex flex-col gap-1 rounded-lg shadow-md" title={prompt.description}>
                        <Label
                            className={`text-gray-400 text-xs`}
                            htmlFor={`${prompt.name}-mode`}
                        >
                            {prompt.name.charAt(0).toUpperCase() + prompt.name.slice(1)}
                        </Label>
                        <Switch
                            id={`${prompt.name}-mode`}
                            checked={prompt.isEnabled}
                            onCheckedChange={() => { }}
                            className="data-[state=checked]:bg-sky-600"
                        />

                        <button
                            onClick={() => handleCreatePrompt({
                                agent: prompt.name,
                                name: prompt.name,
                                prompt: prompt.description,
                                enabled: prompt.isEnabled
                            })}
                            className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        >
                            Create Prompt
                        </button>

                        {createPrompt.isError && <p className="text-red-500">Error: {createPrompt.error.message}</p>}
                        {createPrompt.isSuccess && <p className="text-green-500">Prompt created successfully!</p>}
                    </div>
                ))}
            </div>
        </div>
    </>
}
export default CooksPromptSetup;