import { Trash } from "lucide-react";

type Props = {
    isDeleting: boolean;
    setShowModal: (show: boolean) => void;
    handleDeleteClick: () => void;
}

const AssetModalFooter = ({isDeleting, setShowModal, handleDeleteClick}: Props) => {
    return <div className="flex justify-between items-center p-6 border-t border-gray-700/50">
        <button
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 hover:text-red-300 rounded-lg border border-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isDeleting ? (
                <>
                    <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                    Deleting...
                </>
            ) : (
                <>
                    <Trash size={16} />
                    Delete Asset
                </>
            )}
        </button>

        <button
            onClick={() => setShowModal(false)}
            className="px-6 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white rounded-lg border border-gray-600/30 transition-colors"
        >
            Close
        </button>
    </div>
}

export default AssetModalFooter;