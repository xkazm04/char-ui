import { motion, AnimatePresence } from "framer-motion";
import { Palette, X } from "lucide-react";
import { useEffect } from "react";
import { IMAGE_STYLES, type ImageStyle } from "@/app/constants/imageStyles";

interface StylePickerModalProps {
  isOpen: boolean;
  selectedStyle: ImageStyle;
  onStyleSelect: (style: ImageStyle) => void;
  onClose: () => void;
}

const StylePickerModal = ({
  isOpen,
  selectedStyle,
  onStyleSelect,
  onClose
}: StylePickerModalProps) => {
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleStyleClick = (style: ImageStyle) => {
    onStyleSelect(style);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-gray-900/95 backdrop-blur-md rounded-lg shadow-2xl border border-gray-600/50 w-full max-w-2xl max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-700/20 rounded-lg">
                  <Palette className="h-5 w-5 text-sky-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Choose Art Style</h3>
                  <p className="text-sm text-gray-400">Select a style to enhance your character generation</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors text-gray-400 hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {IMAGE_STYLES.map((style, index) => (
                  <motion.button
                    key={style.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: index * 0.05 }
                    }}
                    whileHover={{ 
                      scale: 1.02,
                      backgroundColor: "rgba(55, 65, 81, 0.4)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleStyleClick(style)}
                    className={`p-4 rounded-lg text-left transition-all duration-200 border ${
                      selectedStyle.id === style.id 
                        ? 'bg-sky-700/30 border-sky-500/60 shadow-lg ring-2 ring-sky-500/30' 
                        : 'bg-gray-800/40 border-gray-600/30 hover:border-gray-500/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl flex-shrink-0 mt-1">
                        {style.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-200 text-base">
                            {style.name}
                          </h4>
                          {selectedStyle.id === style.id && (
                            <motion.div 
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              className="w-3 h-3 bg-sky-400 rounded-full flex-shrink-0"
                            />
                          )}
                        </div>
                        <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                          {style.description}
                        </p>
                        {style.prompt && (
                          <div className="mt-3 p-2 bg-gray-900/50 rounded text-xs text-gray-500 border border-gray-700/50">
                            Preview: {style.prompt.slice(0, 80)}...
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center p-4 border-t border-gray-700/50 bg-gray-900/50">
              <div className="text-xs text-gray-400">
                Press <kbd className="px-2 py-1 bg-gray-800 rounded text-gray-300">Esc</kbd> to close
              </div>
              <div className="text-xs text-gray-400">
                Currently selected: <span className="text-sky-400 font-medium">{selectedStyle.name}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StylePickerModal;