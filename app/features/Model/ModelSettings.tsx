import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Sun, Eye, Moon, Palette } from 'lucide-react';
import { ModelInfo } from './ModelViewer';

type Props = {
    showSettings: boolean;
    showFloor: boolean;
    setShowFloor: (show: boolean) => void;
    autoRotate: boolean;
    setAutoRotate: (rotate: boolean) => void;
    lightingPreset: string;
    setLightingPreset: (preset: string) => void;
    getModelData: ModelInfo;
    gen: { meshy?: { meshy_id?: string } };
    createdDate: string;
}

const ModelSettings = ({
    showSettings, 
    showFloor, 
    setShowFloor, 
    autoRotate, 
    setAutoRotate, 
    lightingPreset,
    setLightingPreset,
    getModelData, 
    gen, 
    createdDate
}: Props) => {
    const lightingPresets = [
        { id: 'studio', name: 'Studio', icon: Sun, desc: 'Clean, professional lighting' },
        { id: 'environment', name: 'Natural', icon: Eye, desc: 'Soft environmental lighting' },
        { id: 'dramatic', name: 'Dramatic', icon: Moon, desc: 'High contrast with moving accent light' }
    ];

    return (
        <AnimatePresence>
            {showSettings && (
                <motion.div
                    initial={{ opacity: 0, x: 320, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 320, scale: 0.9 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="absolute top-20 right-4 w-80 bg-gray-900/95 backdrop-blur-xl rounded-xl border border-gray-700/50 shadow-2xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-sky-600/20 to-sky-500/20 p-4 border-b border-gray-700/50">
                        <h3 className="text-lg font-semibold text-white flex items-center">
                            <Settings className="h-5 w-5 mr-2 text-sky-400" />
                            Viewer Settings
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">Customize your 3D viewing experience</p>
                    </div>

                    <div className="p-4 space-y-6">
                        {/* Lighting Presets */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center">
                                <Palette className="h-4 w-4 mr-2 text-sky-400" />
                                Lighting Preset
                            </label>
                            <div className="space-y-2">
                                {lightingPresets.map((preset) => {
                                    const IconComponent = preset.icon;
                                    return (
                                        <motion.button
                                            key={preset.id}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setLightingPreset(preset.id)}
                                            className={`w-full flex items-start p-3 rounded-lg text-sm transition-all ${
                                                lightingPreset === preset.id
                                                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30 shadow-md'
                                                    : 'bg-gray-800/50 text-gray-300 border border-gray-600/50 hover:bg-gray-700/50 hover:border-gray-500/50'
                                            }`}
                                        >
                                            <IconComponent size={16} className="mr-3 mt-0.5 flex-shrink-0" />
                                            <div className="text-left">
                                                <div className="font-medium">{preset.name}</div>
                                                <div className="text-xs opacity-70 mt-0.5">{preset.desc}</div>
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Environment Settings */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3">
                                Environment
                            </label>
                            <div className="space-y-2">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setShowFloor(!showFloor)}
                                    className={`w-full p-3 rounded-lg text-sm transition-all flex items-center justify-between ${
                                        showFloor
                                            ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                                            : 'bg-gray-800/50 text-gray-300 border border-gray-600/50 hover:bg-gray-700/50'
                                    }`}
                                >
                                    <span>Show Floor & Shadows</span>
                                    <div className={`w-4 h-4 rounded-full border-2 ${showFloor ? 'bg-sky-400 border-sky-400' : 'border-gray-500'}`} />
                                </motion.button>
                            </div>
                        </div>

                        {/* Animation */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3">
                                Animation
                            </label>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setAutoRotate(!autoRotate)}
                                className={`w-full p-3 rounded-lg text-sm transition-all flex items-center justify-between ${
                                    autoRotate
                                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                                        : 'bg-gray-800/50 text-gray-300 border border-gray-600/50 hover:bg-gray-700/50'
                                }`}
                            >
                                <span>Auto-Rotate Model</span>
                                <div className={`w-4 h-4 rounded-full border-2 transition-all ${autoRotate ? 'bg-sky-400 border-sky-400' : 'border-gray-500'}`} />
                            </motion.button>
                        </div>

                        {/* Model Info */}
                        <div className="pt-4 border-t border-gray-700/50">
                            <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                                <span className="w-2 h-2 bg-sky-400 rounded-full mr-2"></span>
                                Model Information
                            </h4>
                            <div className="bg-gray-800/30 rounded-lg p-3 space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-400">Format:</span>
                                    <span className="text-gray-300 font-medium">{getModelData.format.toUpperCase()}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-400">Generated:</span>
                                    <span className="text-gray-300">{createdDate}</span>
                                </div>
                                {gen.meshy?.meshy_id && (
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-400">Meshy ID:</span>
                                        <span className="text-gray-300 font-mono">{gen.meshy.meshy_id.slice(0, 8)}...</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Keyboard Shortcuts */}
                        <div className="pt-2 border-t border-gray-700/30">
                            <h4 className="text-xs font-medium text-gray-400 mb-2">Keyboard Shortcuts</h4>
                            <div className="grid grid-cols-2 gap-1 text-xs text-gray-500">
                                <div><kbd className="px-1 py-0.5 bg-gray-800 rounded">R</kbd> Auto-rotate</div>
                                <div><kbd className="px-1 py-0.5 bg-gray-800 rounded">F</kbd> Toggle floor</div>
                                <div><kbd className="px-1 py-0.5 bg-gray-800 rounded">W</kbd> Wireframe</div>
                                <div><kbd className="px-1 py-0.5 bg-gray-800 rounded">D</kbd> Default</div>
                                <div><kbd className="px-1 py-0.5 bg-gray-800 rounded">1-3</kbd> Lighting</div>
                                <div><kbd className="px-1 py-0.5 bg-gray-800 rounded">ESC</kbd> Close</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default ModelSettings;
