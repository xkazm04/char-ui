import { User, Shield, Shirt, Image, Maximize2, Minimize2 } from 'lucide-react';

const MAIN_CATEGORIES = [
  { id: "Body", icon: User, color: "border-blue-500/50" },
  { id: "Equipment", icon: Shield, color: "border-red-500/50" },
  { id: "Clothing", icon: Shirt, color: "border-green-500/50" },
  { id: "Background", icon: Image, color: "border-purple-500/50" }
];

type Props = {
    setIsFullScreen: (isFullScreen: boolean) => void;
    isFullScreen: boolean;
    setActiveCategory: (category: string | null) => void;
    activeCategory: string | null;
}

const AssetManCatSelector = ({setIsFullScreen, isFullScreen, setActiveCategory, activeCategory}: Props) => {
    const toggleFullScreen = () => {
        setIsFullScreen(prev => !prev);
    };
    return <>
        <div className="flex justify-center py-2 px-3 border-b border-gray-800 relative">
            <button
                onClick={toggleFullScreen}
                className="p-2 rounded-md text-xs flex flex-row absolute left-5 items-center gap-1
                border-1 bg-gray-800 border-gray-700 hover:bg-gray-700
                transition-all"
                title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
            >
                {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>

            <div className="flex gap-3">
                <button
                    onClick={() => setActiveCategory(null)}
                    className={`p-2 rounded-md text-xs flex flex-col items-center
                  border-2 ${activeCategory === null ? 'bg-gray-700 border-white' : 'bg-gray-800 border-gray-700 hover:bg-gray-700'}
                  transition-all`}
                    title="All Categories"
                >
                    <span className="text-[10px] font-medium">ALL</span>
                </button>

                {MAIN_CATEGORIES.map(category => {
                    const Icon = category.icon;
                    return (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`p-2 rounded-md text-xs flex flex-row items-center gap-1
                      border-1 ${activeCategory === category.id
                                    ? `bg-gray-700 ${category.color}`
                                    : `bg-gray-800 border-gray-700 hover:bg-gray-700 hover:${category.color}`}
                      transition-all`}
                            title={category.id}
                        >
                            <Icon size={16} />
                            <span className="text-[10px] hidden 2xl:block font-medium">{category.id.toUpperCase()}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    </>
}

export default AssetManCatSelector;