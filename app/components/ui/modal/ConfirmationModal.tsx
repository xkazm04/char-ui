import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  variant?: 'danger' | 'warning' | 'info';
}

const ConfirmationModal = ({
  isOpen,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
  variant = 'danger'
}: ConfirmationModalProps) => {
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (event.key === 'Enter' && !isLoading) {
        event.preventDefault();
        onConfirm();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        onCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onConfirm, onCancel, isLoading]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const variantStyles = {
    danger: {
      icon: 'text-red-400',
      confirmButton: 'bg-red-900 hover:bg-red-800 focus:ring-red-700',
      border: 'border-red-200/20'
    },
    warning: {
      icon: 'text-yellow-400',
      confirmButton: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
      border: 'border-yellow-500/20'
    },
    info: {
      icon: 'text-blue-400',
      confirmButton: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
      border: 'border-blue-500/20'
    }
  };

  const styles = variantStyles[variant];

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onCancel}
          style={{ margin: 0 }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className={`bg-gray-900 rounded-lg shadow-xl border ${styles.border} w-full max-w-md p-6`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start space-x-3">
              <div className={`flex-shrink-0 ${styles.icon}`}>
                <AlertTriangle size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-white mb-2">
                  {title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {message}
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition-colors"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 disabled:opacity-50 transition-colors ${styles.confirmButton}`}
              >
                {isLoading ? 'Deleting...' : confirmText}
              </button>
            </div>
            
            <div className="mt-3 text-xs text-gray-400 text-center">
              Press <kbd className="px-1 py-0.5 bg-gray-800 rounded text-gray-300">Enter</kbd> to confirm or <kbd className="px-1 py-0.5 bg-gray-800 rounded text-gray-300">Esc</kbd> to cancel
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Only render portal if we're in the browser
  if (typeof window === 'undefined') return null;

  return createPortal(modalContent, document.body);
};

export default ConfirmationModal;