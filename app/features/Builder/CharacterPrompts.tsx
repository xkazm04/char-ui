import { useAssetStore } from "@/app/store/assetStore";
import { useCharacterStore } from "@/app/store/charStore";
import { usePromptStore } from "@/app/store/promptStore";
import { User, Image, Palette } from "lucide-react";

const CharacterPrompts = () => {
    const { assetPrompt } = useAssetStore()
    const { currentCharacter: char } = useCharacterStore();
    const { stylePrompt, promptLimit } = usePromptStore()

    const promptSections = [
        {
            id: 'character',
            title: 'Character Description',
            content: char?.description || '',
            icon: User,
            color: 'blue',
            isEmpty: !char?.description
        },
        {
            id: 'asset',
            title: 'Asset Prompt',
            content: assetPrompt || '',
            icon: Image,
            color: 'green',
            isEmpty: !assetPrompt
        },
        {
            id: 'style',
            title: 'Style Prompt',
            content: stylePrompt || '',
            icon: Palette,
            color: 'purple',
            isEmpty: !stylePrompt
        }
    ];

    const getColorClasses = (color: string, isEmpty: boolean) => {
        const baseClasses = isEmpty
            ? 'border-gray-600/30 bg-gray-800/20'
            : 'border-gray-600/50 bg-gray-800/40';

        const accentClasses = {
            blue: isEmpty ? '' : 'border-l-blue-500/60',
            green: isEmpty ? '' : 'border-l-green-500/60',
            purple: isEmpty ? '' : 'border-l-purple-500/60'
        };

        return `${baseClasses} ${accentClasses[color as keyof typeof accentClasses]} border-l-2`;
    };

    const totalLength = promptSections.reduce((acc, s) => acc + s.content.length, 0);
    const isOverLimit = promptLimit && totalLength > promptLimit;


    return (
        <div className="hidden xl:block">
            <div className="w-full max-w-[400px] space-y-4">
                <h2 className="text-lg font-semibold text-gray-200 px-1">
                    Generation Prompt
                </h2>

                <div className="space-y-3">
                    {promptSections.map((section) => {
                        const Icon = section.icon;
                        return (
                            <div
                                key={section.id}
                                className={`
                                    relative p-3 rounded-lg transition-all duration-200
                                    ${getColorClasses(section.color, section.isEmpty)}
                                    hover:bg-gray-800/60 group
                                `}
                            >
                                {/* Header */}
                                <div className="flex items-center gap-2 mb-2">
                                    <Icon className={`
                                        w-4 h-4 transition-colors
                                        ${section.isEmpty
                                            ? 'text-gray-500'
                                            : `text-${section.color}-400`
                                        }
                                    `} />
                                    <span className={`
                                        text-sm font-medium
                                        ${section.isEmpty
                                            ? 'text-gray-500'
                                            : 'text-gray-300'
                                        }
                                    `}>
                                        {section.title}
                                    </span>
                                    {!section.isEmpty && (
                                        <div className={`
                                            w-2 h-2 rounded-full 
                                            bg-${section.color}-500/60
                                        `} />
                                    )}
                                </div>

                                {/* Content */}
                                <div className={`
                                    text-sm leading-relaxed tracking-wide
                                    ${section.isEmpty
                                        ? 'text-gray-600 italic'
                                        : 'text-gray-200'
                                    }
                                `}>
                                    {section.content || `No ${section.title.toLowerCase()} specified`}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Summary section */}
                <div className="mt-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700/30">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>Total sections: {promptSections.filter(s => !s.isEmpty).length}/3</span>
                        <span className={`${isOverLimit ? 'text-red-400 font-medium' : 'text-gray-400'}`}>
                            Total length: {promptSections.reduce((acc, s) => acc + s.content.length, 0)} chars
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CharacterPrompts;