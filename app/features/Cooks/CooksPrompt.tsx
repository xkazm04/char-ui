import { useState } from "react";

interface CooksPromptProps {
    name: string;
    prompt: string;
    onChange: (prompt: string) => void;
}

const CooksPrompt = ({ name, prompt, onChange }: CooksPromptProps) => {
    const [value, setValue] = useState(prompt);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
        onChange(e.target.value);
    };

    return (
        <div className={`bg-gray-800 rounded-lg border border-gray-700 p-4 transition-all duration-300 ease-in-out
           'w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)]`}
        >
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-200">{name}</h3>
            </div>
            
            <div className="relative">
                <textarea
                    className="w-full bg-gray-700/70 border border-gray-600 rounded-md p-3 text-sm text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={5}
                    value={value}
                    onChange={handleChange}
                    placeholder="Enter prompt instructions for this agent..."
                ></textarea>
                
                <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                    {value.length} chars
                </div>
            </div>
        </div>
    );
};

export default CooksPrompt;