import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useCharacterStore } from '@/app/store/charStore';
import { LucideChevronUp, LucideUsers, ChevronUp, ChevronDown } from 'lucide-react';
import EditableLabel from '@/app/components/ui/EditableLabel';

export const JinxImgUrl = 'https://cdn.leonardo.ai/users/65d71243-f7c2-4204-a1b3-433aaf62da5b/generations/8e6f6b74-4e98-4162-8b6a-6a0eaea1e0ee/variations/Default_Silhouette_of_a_young_lightskinned_woman_with_blue_hai_0_8e6f6b74-4e98-4162-8b6a-6a0eaea1e0ee_0.png';

export default function CharacterCard() {
  const { currentCharacter, updateCharacter } = useCharacterStore();
  const [name, setName] = useState('');
  const [isCharacterSelectorOpen, setIsCharacterSelectorOpen] = useState(false);

  useEffect(() => {
    if (currentCharacter) {
      setName(currentCharacter.name || '');
    }
  }, [currentCharacter]);

  const handleNameChange = (newValue: string) => {
    setName(newValue);
    if (currentCharacter) {
      updateCharacter({ ...currentCharacter, name: newValue });
    }
  };

  const toggleCharacterSelector = () => {
    setIsCharacterSelectorOpen(!isCharacterSelectorOpen);
  };


  return (
    <div className="relative w-full max-w-[300px] h-full overflow-hidden">
      {/* Main content */}
      <motion.div
        className="w-full flex flex-col overflow-hidden"
        animate={{
          height: isCharacterSelectorOpen ? "33%" : "100%",
          opacity: 1
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0 ">
          <Image
            src={JinxImgUrl}
            alt={'Character Background'}
            fill
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a18]/90 to-[#0a0a18]/40"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.15),transparent_70%)]"></div>
        </div>

        {/* Content overlay */}
        <div className="relative z-10 flex-1 flex flex-col">
          <div className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-sky-900/50 scrollbar-track-transparent">
            <EditableLabel
              label="Character Name"
              value={name}
              onChange={handleNameChange}
              placeholder="Enter character name..."
            />
          </div>

          {/* Character selector toggle button */}
          <motion.button
            onClick={toggleCharacterSelector}
            className="w-full py-2 flex items-center justify-center gap-2 backdrop-blur-sm cursor-pointer hover:brightness-125"
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            <LucideUsers className="h-4 w-4 text-sky-300" />
            <span className="text-sm font-medium text-sky-300">
              {!isCharacterSelectorOpen ? <ChevronUp /> : <ChevronDown />}
            </span>
          </motion.button>
        </div>
      </motion.div>

      {/* Character selector panel */}
      <AnimatePresence>
        {isCharacterSelectorOpen && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-[#0a0a18]/95 backdrop-blur-md border-t border-sky-900/30"
            initial={{ height: 0 }}
            animate={{ height: "67%" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <div className="p-4 h-full overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-sky-300">Characters</h3>
                <button
                  onClick={toggleCharacterSelector}
                  className="text-gray-400 hover:text-sky-400 transition-colors"
                >
                  <LucideChevronUp className="h-5 w-5" />
                </button>
              </div>

              <div className="h-[calc(100%-2rem)] flex items-center justify-center">
                <p className="text-gray-500 italic">Character selector content will go here</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}