import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Copy, Loader2, ChevronLeft } from 'lucide-react';
import { useClickOutside } from '@/app/hooks/useClickOutside';
import PromptMaestroMd from './PromptMaestroMd';

interface MasterPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: string;
  updatedPrompt?: string; 
  onSave: (newPrompt: string) => void;
  isSaving?: boolean;
}

const PromptMaestroModal = ({
  isOpen,
  onClose,
  prompt,
  updatedPrompt,
  onSave,
  isSaving = false,
}: MasterPromptModalProps) => {
  const [editMode, setEditMode] = useState(false);
  const [localPrompt, setLocalPrompt] = useState(prompt);
  const [showDiff, setShowDiff] = useState(false);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  //@ts-expect-error Ignore
  useClickOutside(modalContentRef, () => {
    if (isOpen && !editMode) {
      onClose();
    }
  });

  // Update local prompt when external prompt changes
  useEffect(() => {
    if (prompt) {
      setLocalPrompt(prompt);
    }
  }, [prompt]);

  // Check if we have an updated prompt to show diff with
  useEffect(() => {
    if (updatedPrompt && updatedPrompt !== prompt) {
      setShowDiff(true);
    } else {
      setShowDiff(false);
    }
  }, [updatedPrompt, prompt]);

  // Handle saving changes
  const handleSave = () => {
    onSave(localPrompt);
    setEditMode(false);
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    if (!editMode) {
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 100);
    } else {
      setEditMode(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(localPrompt);
  };

  const acceptUpdatedPrompt = () => {
    if (updatedPrompt) {
      setLocalPrompt(updatedPrompt);
      setShowDiff(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            ref={modalContentRef}
            className="bg-gray-800 w-full h-full md:w-[90%] md:h-[90%] md:rounded-lg shadow-xl flex flex-col overflow-hidden border border-gray-700"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700 bg-gray-850">
              <div className="flex items-center">
                <button
                  onClick={onClose}
                  className="mr-3 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <h2 className="text-gray-200 font-medium">Master Prompt Editor</h2>
              </div>
              <div className="flex items-center space-x-2">
                {showDiff && (
                  <button
                    onClick={acceptUpdatedPrompt}
                    className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded flex items-center"
                    title="Accept improved prompt"
                  >
                    <span>Accept Changes</span>
                  </button>
                )}
                <button
                  onClick={handleCopy}
                  className="text-gray-400 hover:text-gray-200 transition-colors p-1.5 rounded"
                  title="Copy to clipboard"
                >
                  <Copy size={18} />
                </button>
                {!editMode ? (
                  <button
                    onClick={toggleEditMode}
                    className="text-xs bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded"
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`text-xs px-3 py-1.5 rounded flex items-center ${
                      isSaving 
                        ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                        : 'bg-sky-600 hover:bg-sky-700 text-white'
                    }`}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 size={14} className="mr-1.5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={14} className="mr-1.5" />
                        Save
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <PromptMaestroMd
              editMode={editMode}
              localPrompt={localPrompt}
              setLocalPrompt={setLocalPrompt}
              showDiff={showDiff}
              //@ts-expect-error Ignore
              textareaRef={textareaRef}
              updatedPrompt={updatedPrompt}
              />


            {/* Footer */}
            <div className="border-t border-gray-700 p-4 bg-gray-850 flex justify-between items-center">
              <div className="text-xs text-gray-400">
                {localPrompt.length.toLocaleString()} characters • 
                {localPrompt.split(/\s+/).length.toLocaleString()} words
              </div>
              {showDiff && !editMode && (
                <div className="bg-yellow-500/20 text-yellow-300 text-xs px-3 py-1 rounded-full">
                  Showing improved version with changes highlighted
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PromptMaestroModal;