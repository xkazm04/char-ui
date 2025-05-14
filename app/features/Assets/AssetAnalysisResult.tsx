import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Edit, Loader2, Save, Upload } from "lucide-react";
import Image from "next/image";

type Props = {
    metadataJson: string;
    assetName: string;
    assetDescription: string;
    response: {
        image_url: string;
    } | null;
    isLoading: boolean;
    setAssetName: (name: string) => void;
    setAssetDescription: (description: string) => void;
    setMetadataJson: (json: string) => void;
}

const AssetAnalysisResult = ({metadataJson, assetName, assetDescription, response, isLoading, setAssetName, setAssetDescription, setMetadataJson}: Props) => {
    const [metadataError, setMetadataError] = useState('');
    const handleSave = () => {
        // Validate metadata JSON
        try {
            const parsedMetadata = JSON.parse(metadataJson);

            // Here you would normally submit to backend
            console.log("Saving asset:", {
                name: assetName,
                description: assetDescription,
                metadata: parsedMetadata,
                image_url: response?.image_url
            });

            setMetadataError('');

            // Show success notification (placeholder)
            alert("Asset saved successfully!");

        } catch (error) {
            console.error("Invalid JSON format", error);
            setMetadataError('Invalid JSON format');
        }
    };
    return <>
        <div className="">
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="bg-gray-800 rounded-lg p-6 flex flex-col items-center justify-center min-h-[300px] border border-gray-700"
                    >
                        <Loader2 className="h-12 w-12 text-indigo-500 animate-spin mb-4" />
                        <h3 className="text-lg font-medium text-white">Processing your asset</h3>
                        <p className="text-gray-400 mt-2 text-center">
                            This may take up to a minute. We are analyzing your image and generating metadata.
                        </p>
                    </motion.div>
                )}

                {!isLoading && response && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-gray-800 rounded-lg p-6 border border-gray-700"
                    >
                        <h2 className="text-lg font-semibold mb-4">Asset Details</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Generated image */}
                            <div>
                                <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-4">
                                    <Image
                                        src={response.image_url}
                                        alt="Processed asset"
                                        className="object-cover"
                                        fill
                                    />
                                </div>
                            </div>

                            {/* Asset details form */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Asset Name
                                    </label>
                                    <input
                                        type="text"
                                        value={assetName}
                                        onChange={(e) => setAssetName(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={assetDescription}
                                        onChange={(e) => setAssetDescription(e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Metadata section */}
                        <div className="mt-6">
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-300">
                                    Metadata
                                </label>
                                <div className="flex items-center text-xs text-gray-400">
                                    <Edit className="h-3 w-3 mr-1" />
                                    <span>Editable JSON</span>
                                </div>
                            </div>
                            <div className="relative">
                                <textarea
                                    value={metadataJson}
                                    onChange={(e) => setMetadataJson(e.target.value)}
                                    rows={8}
                                    className={`w-full px-3 py-2 bg-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white font-mono text-sm ${metadataError ? 'border-red-500' : 'border-gray-600'
                                        }`}
                                />
                                {metadataError && (
                                    <p className="text-red-500 text-xs mt-1">{metadataError}</p>
                                )}
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">

                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                onClick={handleSave}
                                className="px-6 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg flex items-center justify-center space-x-2 font-medium"
                            >
                                <Save className="h-4 w-4" />
                                <span>Save Asset</span>
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isLoading && !response && (
                <div className="bg-gray-800 rounded-lg p-6 flex flex-col items-center justify-center min-h-[300px] border border-gray-700">
                    <div className="text-center">
                        <div className="bg-gray-700 rounded-full p-4 inline-block mb-4">
                            <Upload className="h-6 w-6 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">Ready to Create Asset</h3>
                        <p className="text-gray-400 max-w-md mx-auto">
                            Upload an image and press Process Asset to begin. The system will analyze your image and generate metadata.
                        </p>
                    </div>
                </div>
            )}
        </div>
    </>
}
export default AssetAnalysisResult