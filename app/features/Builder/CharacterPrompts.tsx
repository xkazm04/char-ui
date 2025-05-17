import { useAssetStore } from "@/app/store/assetStore";
import { useCharacterStore } from "@/app/store/charStore";

const CharacterPrompts = () => {
    const { assetPrompt } = useAssetStore()
    const { currentCharacter: char} = useCharacterStore();
    return <div className="hidden xl:block">
        <div
            className={`w-full max-w-[400px] px-4 outline-none py-2 text-gray-200 rounded-lg text-sm 
        transition-all duration-200 tracking-wide bg-gray-800/50 border border-gray-700/50
        focus:outline-hidden overflow-hidden`}
        >
            <h2 className="text-lg font-semibold mb-2">Generation Prompt</h2>
            <div>{char?.description || ''} {assetPrompt}</div>
        </div>
    </div>
}

export default CharacterPrompts;