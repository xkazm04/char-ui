import { Trash, X, Save, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { AssetType } from "@/app/types/asset";
import { handleDelete, handleSave, useAllAssets } from "@/app/functions/assetFns";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

type Props = {
    asset: AssetType
    modalRef: React.RefObject<HTMLDivElement>;
    setShowModal: (show: boolean) => void;
}

const AssetItemModal = ({asset, modalRef, setShowModal }: Props) => {
    const { refetch } = useAllAssets();
    const [genValue, setGenValue] = useState(asset.gen || "");
    const initialGenValue = asset.gen || ""; 
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
        document.body.style.overflow = 'hidden';
        
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);


    const modalContent = (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100]" onClick={() => setShowModal(false)}>
            <motion.div
                ref={modalRef}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800 rounded-lg p-3 sm:p-4 w-[95%] sm:max-w-md max-h-[90vh] overflow-y-auto shadow-xl border border-gray-700"
                onClick={(e) => e.stopPropagation()} 
            >
                <div className="flex justify-between items-center mb-2 sm:mb-3 pb-2 border-b border-gray-700">
                    <h3 className="text-base sm:text-lg font-semibold text-white truncate pr-2">{asset.name}</h3>
                    <button 
                        onClick={() => setShowModal(false)} 
                        className="hover:bg-gray-700 p-1 rounded-full transition-colors"
                        aria-label="Close modal"
                    >
                        <X size={18} className="text-gray-400" />
                    </button>
                </div>

                {asset.image_url && (
                    <div className="mb-3 flex justify-center bg-gray-900 rounded-md p-1">
                        <Image
                            src={asset.image_url}
                            alt={asset.name}
                            width={180}
                            height={180}
                            className="rounded object-contain max-h-32 sm:max-h-40"
                        />
                    </div>
                )}
                <div className="space-y-3 mb-4 text-sm">
                    {/* Mobile-optimized content layout */}
                    <div className="flex flex-col sm:flex-row sm:items-start">
                        <span className="text-gray-400 text-sm sm:w-24 sm:pt-0.5 mb-1 sm:mb-0">Type:</span>
                        <div className="flex flex-row">
                            <span className="text-white text-sm">{asset.type}</span>
                            {asset.subcategory && (
                                <div className="flex items-center text-sm">
                                    <ChevronRight size={12} className="text-gray-500 mx-0.5" />
                                    <span className="text-gray-300">{asset.subcategory}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {asset.description && (
                        <div className="flex flex-col sm:flex-row sm:items-start">
                            <span className="text-gray-400 text-sm sm:w-24 sm:pt-0.5 mb-1 sm:mb-0">Description:</span>
                            <p className="text-white flex-1 text-sm">{asset.description}</p>
                        </div>
                    )}
                    
                    {/* Gen field - always editable, mobile optimized */}
                    <div className="flex flex-col sm:flex-row sm:items-start">
                        <span className="text-gray-400 text-sm sm:w-24 sm:pt-0.5 mb-1 sm:mb-0">Gen:</span>
                        <div className="flex-1">
                            <div className="flex flex-col">
                                <textarea 
                                    value={genValue}
                                    onChange={(e) => setGenValue(e.target.value)}
                                    className="bg-gray-700 text-white text-sm p-2 rounded-md w-full min-h-[60px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="Add generation details..."
                                />
                                <div className="flex justify-end gap-2 mt-2">
                                    <button 
                                        onClick={() => {handleSave(genValue, asset._id)}}
                                        disabled={genValue === initialGenValue}
                                        className={`px-2 py-1 text-sm flex items-center gap-1 rounded-lg transition-colors duration-200 ${
                                            genValue === initialGenValue
                                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                                : 'bg-blue-900/40 hover:bg-blue-800/60 text-blue-300 border cursor-pointer border-sky-500/20'
                                        }`}
                                    >
                                        <Save size={12} />
                                        <span className="hidden sm:inline">Save</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons with improved styling */}
                <div className="flex justify-end gap-2 pt-3 border-t border-gray-700">
                    <button
                        onClick={() => { handleDelete(asset, ()=>{ setShowModal(false); refetch()})}}
                        className="flex cursor-pointer items-center gap-1 px-2.5 py-1.5 text-sm bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded transition-colors"
                        aria-label="Delete asset"
                    >
                        <Trash size={14} />
                        <span>Delete</span>
                    </button>
                    <button
                        onClick={() => setShowModal(false)}
                        className="flex cursor-pointer items-center gap-1 px-2.5 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
                        aria-label="Close modal"
                    >
                        <span>Close</span>
                    </button>
                </div>
            </motion.div>
        </div>
    );

    return mounted ? createPortal(modalContent, document.body) : null;
}

export default AssetItemModal;