import GlowingText from '@/app/components/landing/GlowingText';
import { useNavStore } from '@/app/store/navStore';
import { NavTabTypes } from '@/app/types/nav';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

type Props = {
  tab: NavTabTypes;
  setTab: (tab: NavTabTypes) => void;
}

interface NavButtonProps {
  children: React.ReactNode;
  value: NavTabTypes;
}

const Navbar = ({ tab, setTab }: Props) => {
  const { assetNavExpanded, setAssetNavExpanded} = useNavStore()
  const NavButton = ({ children, value }: NavButtonProps) => {
    const active = value === tab;
    return (
      <button
        onClick={() => setTab(value)}
        className={`
        relative px-3 py-1.5 rounded-l-none rounded-lg text-lg font-medium transition-colors duration-200 ease-linear cursor-pointer
        border border-gray-400/10
        ${active
            ? 'text-sky-300'
            : 'text-gray-400 bg-sky-800/5 hover:text-white hover:bg-gray-800'}
      `}
      >
        {children}
        {active && (
          <motion.div
            layoutId="activeNavIndicator"
            className="absolute bottom-0 left-0 right-0 w-0.5 h-full bg-sky-500 rounded-full"
            transition={{ type: 'spring', duration: 0.5 }}
          />
        )}
      </button>
    );
  }

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 w-[80%]">
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-6">
          {/* Logo - TBD route to landing */}
          <div className="absolute top-2 left-4 cursor-pointer hidden md:block">
            <h1 className="text-lg font-bold text-white">Pixel <GlowingText>Play</GlowingText></h1>
          </div>
          <nav className="flex flex-row gap-3">
            <NavButton value='assets'>Assets</NavButton>
            <NavButton value='builder'>Builder</NavButton>
            <NavButton value='styles'>Spy</NavButton>
          </nav>
        </div>
      </div>

      <div className="hidden md:flex items-center justify-between mt-2 text-xs text-gray-400">
        <div className="flex space-x-4">
          <div className="hover:text-white flex items-center gap-1">
            <HelpCircle className="w-3 h-3" />
            <span>View</span>
          </div>
          <button 
            onClick={() => setAssetNavExpanded(!assetNavExpanded)}
            className={`${assetNavExpanded && 'text-sky-400'} hover:brightness-125 cursor-pointer flex items-center gap-1`}
            >Asset list
          </button>
          <div>Character list</div>
        </div>
      </div>
    </header>
  );
}


export default Navbar;