import { useAssetStore } from "@/app/store/assetStore";
import { useCharacterStore } from "@/app/store/charStore";
import { usePromptStore } from "@/app/store/promptStore";
import { User, MapPin, Shirt, Sword } from "lucide-react";

const CharacterPrompts = () => {
    const { getPromptByCategory } = useAssetStore()
    const { currentCharacter: char } = useCharacterStore();
    const { promptLimit } = usePromptStore()

    // Match the structure from BuilderGenSketch
    const charPrompt = char?.description || ''
    const bodyPrompt = getPromptByCategory('Body')
    const clothingPrompt = getPromptByCategory('Clothing')
    const backgroundPrompt = getPromptByCategory('Background')
    const equipmentPrompt = getPromptByCategory('Equipment')

    const headPrompt = bodyPrompt || char?.default_facial || ''
    const finalClothingPrompt = clothingPrompt || char?.default_clothing || ''
    const bgPrompt = backgroundPrompt || "Person standing in the dark with black background."
    const equipPrompt = equipmentPrompt || ''

    const fullPrompt = bgPrompt + charPrompt + headPrompt + finalClothingPrompt + equipPrompt;

    const promptSections = [
        {
            id: 'background',
            title: 'Background',
            content: bgPrompt,
            icon: MapPin,
            color: 'amber',
            isEmpty: !backgroundPrompt
        },
        {
            id: 'character',
            title: 'Character',
            content: charPrompt,
            icon: User,
            color: 'blue',
            isEmpty: !charPrompt
        },
        {
            id: 'head',
            title: 'Head/Face',
            content: headPrompt,
            icon: User,
            color: 'cyan',
            isEmpty: !headPrompt
        },
        {
            id: 'clothing',
            title: 'Clothing',
            content: finalClothingPrompt,
            icon: Shirt,
            color: 'green',
            isEmpty: !finalClothingPrompt
        },
        {
            id: 'equipment',
            title: 'Equipment',
            content: equipPrompt,
            icon: Sword,
            color: 'orange',
            isEmpty: !equipPrompt
        }
        // {
        //     id: 'style',
        //     title: 'Style',
        //     content: stylePrompt,
        //     icon: Palette,
        //     color: 'purple',
        //     isEmpty: !stylePrompt
        // }
    ];

    const getColorClasses = (color: string, isEmpty: boolean) => {
        const baseClasses = isEmpty
            ? 'border-gray-600/30 bg-gray-800/20'
            : 'border-gray-600/50 bg-gray-800/40';

        const accentClasses = {
            blue: isEmpty ? '' : 'border-l-blue-500/60',
            green: isEmpty ? '' : 'border-l-green-500/60',
            purple: isEmpty ? '' : 'border-l-purple-500/60',
            amber: isEmpty ? '' : 'border-l-amber-500/60',
            cyan: isEmpty ? '' : 'border-l-cyan-500/60',
            orange: isEmpty ? '' : 'border-l-orange-500/60'
        };

        return `${baseClasses} ${accentClasses[color as keyof typeof accentClasses]} border-l-2`;
    };

    const isOverLimit = promptLimit && fullPrompt.length > promptLimit;
    const activePrompts = promptSections.filter(s => !s.isEmpty);

    return (
        <div className="hidden xl:block">
            <div className="w-full max-w-[400px] space-y-4">
                <h2 className="text-lg font-semibold text-gray-200 px-1">
                    Generation Prompt
                </h2>

                <div className="space-y-2">
                    {promptSections.map((section) => {
                        const Icon = section.icon;
                        return (
                            <div
                                key={section.id}
                                className={`
                                    relative p-2.5 rounded-lg transition-all duration-200
                                    ${getColorClasses(section.color, section.isEmpty)}
                                    hover:bg-gray-800/60 group
                                `}
                            >
                                {/* Header */}
                                <div className="flex items-center gap-2 mb-1.5">
                                    <Icon className={`
                                        w-4 h-4 transition-colors
                                        ${section.isEmpty
                                            ? 'text-gray-500'
                                            : `text-${section.color}-400`
                                        }
                                    `} />
                                    <span className={`
                                        text-xs font-medium
                                        ${section.isEmpty
                                            ? 'text-gray-500'
                                            : 'text-gray-300'
                                        }
                                    `}>
                                        {section.title}
                                    </span>
                                    {!section.isEmpty && (
                                        <div className={`
                                            w-1.5 h-1.5 rounded-full 
                                            bg-${section.color}-500/60
                                        `} />
                                    )}
                                    <div className="ml-auto text-xs text-gray-500">
                                        {section.content.length}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className={`
                                    text-xs leading-relaxed max-h-16 overflow-y-auto
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
                <div className="mt-3 p-2.5 bg-gray-900/50 rounded-lg border border-gray-700/30">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">
                            Active: {activePrompts.length}/5
                        </span>
                        <span className={`font-medium ${isOverLimit ? 'text-red-400' : 'text-gray-400'}`}>
                            {fullPrompt.length} chars
                            {promptLimit && (
                                <span className="text-gray-500 ml-1">
                                    / {promptLimit}
                                </span>
                            )}
                        </span>
                    </div>
                    
                    {/* Preview of concatenated prompt */}
                    <div className="mt-2 pt-2 border-t border-gray-700/30">
                        <div className="text-xs text-gray-500 mb-1">Final Prompt Preview:</div>
                        <div className={`
                            text-xs max-h-[400px] overflow-y-auto bg-gray-800/30 p-1.5 rounded text-gray-300
                            ${isOverLimit ? 'border border-red-500/30' : ''}
                        `}>
                            {fullPrompt || 'No prompt content'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CharacterPrompts;