import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Sun, Eye, Moon } from 'lucide-react';
import { useState } from 'react';
import { ModelInfo } from './ModelViewer';

type Props = {
    showSettings: boolean;
    showFloor: boolean;
    setShowFloor: (show: boolean) => void;
    autoRotate: boolean;
    setAutoRotate: (rotate: boolean) => void;
    getModelData: ModelInfo;
    gen: { meshy?: { meshy_id?: string } };
    createdDate: string;
}

const ModelSettings = ({showSettings, showFloor, setShowFloor, autoRotate, setAutoRotate, getModelData, gen, createdDate}: Props) => {
     const [lightingPreset, setLightingPreset] = useState('studio');
      const lightingPresets = [
        { id: 'studio', name: 'Studio', icon: Sun },
        { id: 'environment', name: 'Environment', icon: Eye },
        { id: 'dramatic', name: 'Dramatic', icon: Moon }
      ];
    return <>
        <AnimatePresence>
            {showSettings && (
                <motion.div
                    initial={{ opacity: 0, x: 300 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 300 }}
                    className="absolute top-20 right-4 w-80 bg-gray-900/95 backdrop-blur-sm rounded-lg border border-gray-700 p-4"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <Settings className="h-5 w-5 mr-2 text-sky-400" />
                        3D Viewer Settings
                    </h3>

                    <div className="space-y-4">
                        {/* Environment Settings */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Environment
                            </label>
                            <div className="flex items-center space-x-2">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowFloor(!showFloor)}
                                    className={`flex-1 p-2 rounded-md text-sm transition-colors ${showFloor
                                            ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                                            : 'bg-gray-800/50 text-gray-300 border border-gray-600'
                                        }`}
                                >
                                    {showFloor ? 'Hide Floor' : 'Show Floor'}
                                </motion.button>
                            </div>
                        </div>

                        {/* Auto Rotate */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Animation
                            </label>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setAutoRotate(!autoRotate)}
                                className={`w-full p-2 rounded-md text-sm transition-colors ${autoRotate
                                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                                        : 'bg-gray-800/50 text-gray-300 border border-gray-600'
                                    }`}
                            >
                                {autoRotate ? 'Stop Auto-Rotate' : 'Start Auto-Rotate'}
                            </motion.button>
                        </div>

                        {/* Lighting Presets */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Lighting
                            </label>
                            <div className="grid grid-cols-1 gap-2">
                                {lightingPresets.map((preset) => {
                                    const IconComponent = preset.icon;
                                    return (
                                        <motion.button
                                            key={preset.id}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setLightingPreset(preset.id)}
                                            className={`flex items-center p-2 rounded-md text-sm transition-colors ${lightingPreset === preset.id
                                                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                                                    : 'bg-gray-800/50 text-gray-300 border border-gray-600 hover:bg-gray-700/50'
                                                }`}
                                        >
                                            <IconComponent size={16} className="mr-2" />
                                            {preset.name}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Model Info */}
                        <div className="pt-4 border-t border-gray-700">
                            <h4 className="text-sm font-medium text-gray-300 mb-2">Model Info</h4>
                            <div className="text-xs text-gray-400 space-y-1">
                                <div>Format: {getModelData.format.toUpperCase()}</div>
                                <div>Generated: {createdDate}</div>
                                {gen.meshy?.meshy_id && (
                                    <div>Meshy ID: {gen.meshy.meshy_id.slice(0, 8)}...</div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </>
}

export default ModelSettings;
