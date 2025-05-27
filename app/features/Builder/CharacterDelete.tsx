import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import ConfirmationModal from "../../components/ui/modal/ConfirmationModal";
import { useDeleteGeneration } from "../../functions/genFns";

interface CharacterDeleteProps {
  generationId: string;
}

const CharacterDelete = ({ 
  generationId, 
}: CharacterDeleteProps) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const deleteGenerationMutation = useDeleteGeneration();

  const handleDeleteClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteGenerationMutation.mutateAsync(generationId);
      setShowConfirmModal(false);
    } catch (error) {
      console.error('Failed to delete generation:', error);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-2 rounded hover:bg-gray-800/50 transition-colors cursor-pointer text-red-200 hover:text-red-400"
        onClick={handleDeleteClick}
        aria-label="Delete Generation"
        title="Delete Generation"
        disabled={deleteGenerationMutation.isPending}
      >
        <X size={18} />
      </motion.button>

      <ConfirmationModal
        isOpen={showConfirmModal}
        title="Delete Generation"
        message={`U sure? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={deleteGenerationMutation.isPending}
        variant="danger"
      />
    </>
  );
};

export default CharacterDelete;