import { useState, memo } from "react";
import { Label } from "@/app/components/ui/label";
import { Switch } from "@/app/components/ui/switch";
import { Input } from "@/app/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Save, X, Eye, EyeOff } from "lucide-react";
import { AssetTabConfig } from "./AssetAnalysisLayout";

const ModelSwitch = memo(({
    model,
    isEnabled,
    onToggle
}: {
    model: string;
    isEnabled: boolean;
    onToggle: () => void
}) => (
    <div className="flex items-center gap-2">
        <Switch
            id={`${model}-mode`}
            checked={isEnabled}
            onCheckedChange={onToggle}
            className="data-[state=checked]:bg-sky-600"
        />
        <Label
            className={`${isEnabled ? 'text-white' : 'text-gray-400'}`}
            htmlFor={`${model}-mode`}
        >
            {model.charAt(0).toUpperCase() + model.slice(1)}
        </Label>
    </div>
));

ModelSwitch.displayName = "ModelSwitch";

type ConfigItemProps = {
    model: keyof AssetTabConfig;
    config: AssetTabConfig;
    onUpdateConfig: (model: keyof AssetTabConfig, enabled: boolean, apiKey: string) => void;
    tooltip: string;
}

const AssetConfigItem = ({ model, config, onUpdateConfig, tooltip }: ConfigItemProps) => {
    const isEnabled = config[model].enabled;
    const savedApiKey = config[model].apiKey;

    const [localApiKey, setLocalApiKey] = useState(savedApiKey);
    const [editing, setEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const hasChanges = localApiKey !== savedApiKey;

    const handleToggleModel = () => {
        onUpdateConfig(model, !isEnabled, savedApiKey);
    };

    const handleSaveChanges = () => {
        onUpdateConfig(model, isEnabled, localApiKey);
        setEditing(false);
    };

    const handleCancelChanges = () => {
        setLocalApiKey(savedApiKey);
        setEditing(false);
    };

    const handleInputFocus = () => {
        setEditing(true);
    };

    const handleInputChange = (value: string) => {
        setLocalApiKey(value);
        setEditing(true);
    };

    return (
        <div className="flex flex-col gap-2">
            <div 
                className="flex items-center justify-between"
                title={tooltip}
                >
                <ModelSwitch
                    model={model}
                    isEnabled={isEnabled}
                    onToggle={handleToggleModel}
                />
            </div>

           {model !== 'groq' &&  <AnimatePresence mode="wait">
                {isEnabled && (
                    <motion.div
                        key={`${model}-input`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden rounded-lg"
                    >
                        <div className="pr-1 py-1">
                            <div className="relative">
                                <button
                                    type="button"
                                    onMouseDown={() => setShowPassword(true)}
                                    onMouseUp={() => setShowPassword(false)}
                                    onMouseLeave={() => setShowPassword(false)}
                                    className="absolute right-[46px] top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-200 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-3.5 w-3.5" />
                                    ) : (
                                        <Eye className="h-3.5 w-3.5" />
                                    )}
                                </button>
                                <Input
                                    id={`${model}-api-key`}
                                    type={showPassword ? "text" : "password"}
                                    value={localApiKey}
                                    onChange={(e) => handleInputChange(e.target.value)}
                                    onFocus={handleInputFocus}
                                    placeholder={`Enter ${model} API key`}
                                    className="bg-gray-800 border-gray-700 text-white h-8 text-xs pr-[72px] outline-none focus-visible:ring-sky-500/20 focus-visible:ring-offset-0"
                                />

                                <AnimatePresence>
                                    {editing && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="absolute right-1 top-1/2 -translate-y-1/2 flex"
                                        >
                                            <button
                                                onClick={handleSaveChanges}
                                                disabled={!hasChanges}
                                                className={`p-1 rounded-sm ${hasChanges ? 'text-sky-400 hover:text-sky-300 hover:bg-sky-900/30' : 'text-gray-500 cursor-not-allowed'}`}
                                            >
                                                <Save className="h-3.5 w-3.5" />
                                            </button>

                                            <button
                                                onClick={handleCancelChanges}
                                                className="p-1 rounded-sm text-gray-400 hover:text-gray-300 hover:bg-gray-700/50"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>}
        </div>
    );
};

export default AssetConfigItem;