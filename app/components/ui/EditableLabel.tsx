import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LucideCheck, LucideX } from "lucide-react";
import GlowingText from "../landing/GlowingText";

interface EditableLabelProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const EditableLabel = ({ label, value, onChange, placeholder }: EditableLabelProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    onChange(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="w-full mb-4 absolute top-2 max-w-[250px]">
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="editing"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex items-center"
          >
            <input
              type="text"
              ref={inputRef}
              maxLength={25}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-3 py-2 bg-[#0d1230] border border-sky-900/50 rounded-md text-white text-sm
                       focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-transparent"
              placeholder={placeholder}
            />
            <div className="flex space-x-2 ml-2">
              <button
                onClick={handleSave}
                className="text-green-400 hover:text-green-300 transition-colors"
                aria-label="Save changes"
              >
                <LucideCheck className="h-4 w-4" />
              </button>
              <button
                onClick={handleCancel}
                className="text-red-400 hover:text-red-300 transition-colors"
                aria-label="Cancel editing"
              >
                <LucideX className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="display"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsEditing(true)}
            className="cursor-pointer"
          >
            <div className="text-sm font-medium text-sky-300 mb-1"><GlowingText>{label}</GlowingText></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EditableLabel;