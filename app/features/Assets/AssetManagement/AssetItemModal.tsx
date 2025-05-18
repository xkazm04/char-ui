import { Edit, Trash, X } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { AssetType } from "@/app/types/asset";
import { useAssets } from "@/app/functions/assetFns";

type Props = {
    asset: AssetType
    modalRef: React.RefObject<HTMLDivElement>;
    setShowModal: (show: boolean) => void;
}

const AssetItemModal = ({asset, modalRef, setShowModal }: Props) => {
    const { refetch } = useAssets();
    const handleDelete = async () => {
        if (confirm(`Are you sure you want to delete "${asset.name}"?`)) {
            try {
                const response = await fetch(`http://localhost:8000/assets/${asset._id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setShowModal(false);
                    refetch();
                } else {
                    alert('Failed to delete asset');
                }
            } catch (error) {
                console.error('Error deleting asset:', error);
                alert('Error deleting asset');
            }
        }
    };

    return <>
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <motion.div
                ref={modalRef}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gray-800 rounded-lg p-5 max-w-md w-full max-h-[80vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">{asset.name}</h3>
                    <button onClick={() => setShowModal(false)} className="hover:bg-gray-700 p-1 rounded">
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                {asset.image_url && (
                    <div className="mb-4 flex justify-center">
                        <Image
                            src={asset.image_url}
                            alt={asset.name}
                            width={200}
                            height={200}
                            className="rounded-md object-contain"
                        />
                    </div>
                )}

                <div className="space-y-3 mb-6">
                    <div>
                        <span className="text-gray-400 text-sm">Type:</span>
                        <span className="ml-2 text-white">{asset.type}</span>
                    </div>

                    {asset.description && (
                        <div>
                            <span className="text-gray-400 text-sm">Description:</span>
                            <p className="text-white mt-1">{asset.description}</p>
                        </div>
                    )}

                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-700">
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-1 px-3 py-1 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded transition-colors"
                    >
                        <Trash size={16} />
                        <span>Delete</span>
                    </button>
                    <button
                        onClick={() => {
                            alert("Edit functionality would open a form to edit the asset metadata");
                        }}
                        className="flex items-center gap-1 px-3 py-1 bg-sky-900/30 hover:bg-sky-900/50 text-sky-400 rounded transition-colors"
                    >
                        <Edit size={16} />
                        <span>Edit</span>
                    </button>
                </div>
            </motion.div>
        </div>
    </>
}

export default AssetItemModal;