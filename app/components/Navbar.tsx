import { useNavStore } from '@/app/store/navStore';
import { NavTabTypes } from '@/app/types/nav';
import { motion } from 'framer-motion';
import { HelpCircle, PackageIcon, PersonStandingIcon, TestTube } from 'lucide-react';
import { useEffect } from 'react';

type Props = {
  tab: NavTabTypes;
  setTab: (tab: NavTabTypes) => void;
}

interface NavButtonProps {
  label: string;
  value: NavTabTypes;
  icon?: React.ReactNode;
}

const Navbar = ({ tab, setTab }: Props) => {
  const { assetNavExpanded, setAssetNavExpanded} = useNavStore();

  useEffect(() => {
    const savedTab = localStorage.getItem('pixelSelectedTab') as NavTabTypes | null;
    if (savedTab && savedTab !== tab) {
      setTab(savedTab);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem('pixelSelectedTab', tab);
  }, [tab]);

  const NavOptions = [
    { value: 'assets', icon: <PackageIcon className="w-4 h-4" />, label: 'Asset Extractor' },
    { value: 'builder', icon: <PersonStandingIcon className="w-4 h-4" />, label: 'Character Builder' },
    { value: 'cooks', icon: <TestTube className="w-4 h-4" />, label: 'Cooks' },
  ];

  const NavButton = ({ label, value, icon }: NavButtonProps) => {
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
        <div className="flex items-center gap-1">
          {icon}
          <span>{label}</span>
        </div>
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
          <nav className="flex flex-row gap-3">
            {NavOptions.map((option) => (
              <NavButton
                key={option.value}
                label={option.label}
                value={option.value}
                icon={option.icon}
              />
            ))}
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
