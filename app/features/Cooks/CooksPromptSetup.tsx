import { useCreatePrompt } from "@/app/functions/promptFns";
import Image from "next/image";

const CooksPromptSetup = () => {
    const createPrompt = useCreatePrompt();
    const agentconfigs = [
        {
            name: "Cooks",
            description: "Cooks is a character generator that creates character variations based on the provided prompts.",
        },
        {
            name: "Cooks-2",
            description: "Cooks-2 is a character generator that creates character variations based on the provided prompts.",
        },
        {
            name: "Cooks-3",
            description: "Cooks-3 is a character generator that creates character variations based on the provided prompts.",
        }
    ]
    return <>
        <div className="flex flex-col gap-4">
            <p className="text-gray-500">Please configure the prompts for each agent.</p>
            <div className="flex flex-row gap-2">
                {agentconfigs.map((config, index) => (
                    <div key={index} className="flex flex-col gap-2 p-4 border rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold">{config.name}</h3>
                        <p className="text-gray-600">{config.description}</p>
                        <Image
                            src="/landing/jinx_superman.png"
                            alt="Cooks"
                            width={200}
                            height={200}
                            className="rounded-lg shadow-lg"
                        />
                        <button
                            onClick={() => createPrompt.mutate({ agent: config.name, prompt: "Sample prompt" })}
                            className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        >
                            Create Prompt
                        </button>

                        {createPrompt.isLoading && <p className="text-gray-500">Creating prompt...</p>}
                        {createPrompt.isError && <p className="text-red-500">Error: {createPrompt.error.message}</p>}
                        {createPrompt.isSuccess && <p className="text-green-500">Prompt created successfully!</p>}
                    </div>
                ))}
            </div>
        </div>
    </>
}
export default CooksPromptSetup;