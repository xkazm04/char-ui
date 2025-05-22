import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useCharacterStore } from '@/app/store/charStore';
import { LucideUsers, ChevronUp, ChevronDown } from 'lucide-react';
import CharacterSelector from './CharacterSelector';
import { useNavStore } from '@/app/store/navStore';
import GlowingText from '@/app/components/landing/GlowingText';
import { useAssetStore } from '@/app/store/assetStore';

export default function CharacterCard() {
  const { currentCharacter } = useCharacterStore();
  const { charNavExpanded, setCharNavExpanded } = useNavStore()
  const { isGenerating } = useAssetStore()

  return (
    <div className="relative w-full max-w-[300px] h-full overflow-hidden">
      {/* Main content */}
      <motion.div
        className="w-full flex flex-col overflow-hidden"
        animate={{
          height: charNavExpanded ? "15%" : "100%",
          opacity: 1
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          {currentCharacter  && (
            <Image
              //@ts-expect-error Ignore
              src={isGenerating ? currentCharacter.gif_url : currentCharacter.image_url}
              alt={'Character Background'}
              fill
              className="object-cover opacity-50"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a18]/90 to-[#0a0a18]/40"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.15),transparent_70%)]"></div>
        </div>

        {/* Content overlay */}
        <div className="relative flex-1 flex flex-col h-full justify-end ">
          {!isGenerating && 
          <div className={`absolute left-10 z-0  text-2xl font-medium
            ${charNavExpanded ? 'top-[5%]' : 'top-[40%]'}
          `}>
            <GlowingText>{currentCharacter?.name}</GlowingText>
          </div>}

          {/* Character selector toggle button */}
          <motion.button
            onClick={() => setCharNavExpanded(!charNavExpanded)}
            className="w-full py-2 flex items-center justify-center gap-2 backdrop-blur-sm cursor-pointer hover:brightness-125"
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            <LucideUsers className="h-4 w-4 text-sky-300" />
            <span className="text-sm font-medium text-sky-300">
              {!charNavExpanded ? <ChevronUp /> : <ChevronDown />}
            </span>
          </motion.button>
        </div>
      </motion.div>

      {/* Character selector panel */}
      <AnimatePresence>
        {charNavExpanded && (
          <CharacterSelector />
        )}
      </AnimatePresence>
    </div>
  );
}