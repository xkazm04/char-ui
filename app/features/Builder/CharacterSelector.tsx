import { characters } from "@/app/data/characters";
import { Character, useCharacterStore } from "@/app/store/charStore";
import { useNavStore } from "@/app/store/navStore";
import { motion } from "framer-motion";
import { LucideChevronUp } from "lucide-react"
import Image from "next/image";
import { useState } from "react";

const CharacterSelector = () => {
    const { currentCharacter, setCurrentCharacter } = useCharacterStore()
    const { charNavExpanded, setCharNavExpanded } = useNavStore()
    const [hoveredCharacter, setHoveredCharacter] = useState<string | null>(null);

    const shouldShowAvatarVariant = (charName: string) => {
        return charName === 'Joe' || charName === 'Jinx';
    };

    const getImageSrc = (char: Character) => {
        if (!shouldShowAvatarVariant(char.name)) {
            return char.image_url;
        }
        return hoveredCharacter === char.id ? (char.avatar_gif || char.image_url) : (char.avatar_url || char.image_url);
    };

    return <motion.div
        className="absolute bottom-0 left-0 right-0 bg-[#0a0a18]/95 backdrop-blur-md border-t border-sky-900/30"
        initial={{ height: 0 }}
        animate={{ height: "85%" }}
        exit={{ height: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
    >
        <div className="p-4 h-full overflow-y-auto">
            <span className="text-xs text-yellow-100 italic">Custom character models - In Progress</span>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-sky-300">Characters ({characters.length})</h3>
                <button
                    onClick={() => {
                        setCharNavExpanded(!charNavExpanded)
                    }}
                    className="text-gray-400 hover:text-sky-400 transition-colors"
                >
                    <LucideChevronUp className="h-5 w-5" />
                </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
                {characters.map((char) => (
                    <div
                        key={char.id}
                        className={`p-2 cursor-pointer hover:bg-gray-800/20 rounded-lg transition-colors duration-200 ease-linear
                            bg-sky-900/5 border border-sky-500/10
                            ${currentCharacter && currentCharacter.id === char.id && 'border border-sky-500'}
                            `}
                        onClick={() => {
                            setCurrentCharacter(char.id);
                            setCharNavExpanded(!charNavExpanded)
                        }}
                        onMouseEnter={() => shouldShowAvatarVariant(char.name) && setHoveredCharacter(char.id)}
                        onMouseLeave={() => shouldShowAvatarVariant(char.name) && setHoveredCharacter(null)}
                    >
                        <div className="flex flex-col items-center hover:opacity-90 transition-opacity duration-200">
                            <Image
                                src={getImageSrc(char)}
                                alt={char.name}
                                width={shouldShowAvatarVariant(char.name) ? 150 : 200}
                                height={shouldShowAvatarVariant(char.name) ? 150 : 200}
                                className="w-full h-auto rounded-lg mb-2"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </motion.div>
}

export default CharacterSelector;