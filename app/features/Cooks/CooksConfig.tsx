import Image from "next/image";
import { useState } from "react";
import { useDeleteDataConfig } from "../../functions/configFns";
import { DataSourceConfig, CreateDataSourceConfig } from "@/app/types/config";
import { Edit, PackageIcon, PlusIcon, Trash2Icon } from "lucide-react";
import CooksConfigModal from "./CooksConfigModal";

interface CooksConfigProps {
    dataConfigs: DataSourceConfig[];
    onStart: () => void;
    isRunning: boolean;
}


const CooksConfig = ({ dataConfigs, onStart, isRunning }: CooksConfigProps) => {
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [selectedConfig, setSelectedConfig] = useState<DataSourceConfig | null>(null);
    const [newConfig, setNewConfig] = useState<CreateDataSourceConfig>({
        name: "",
        data_type: "",
        api_endpoint: "",
        description: ""
    });

    const deleteMutation = useDeleteDataConfig();

    const handleDeleteConfig = async (configId: string) => {
        try {
            await deleteMutation.mutateAsync(configId);
        } catch (error) {
            console.error("Failed to delete config:", error);
        }
    };

    const openEditModal = (config: DataSourceConfig) => {
        setSelectedConfig(config);
        setNewConfig({
            name: config.name,
            data_type: config.data_type,
            api_endpoint: config.api_endpoint,
            description: config.description || ""
        });
        setShowConfigModal(true);
    };

    const openCreateModal = () => {
        setSelectedConfig(null);
        resetForm();
        setShowConfigModal(true);
    };

    const resetForm = () => {
        setNewConfig({
            name: "",
            data_type: "",
            api_endpoint: "",
            description: ""
        });
    };

    return (
        <div className="flex flex-row gap-2">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 w-full max-w-[800px] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-gray-200">Agent Workflow Configuration</h3>
                    <button
                        title="Apply template"
                        className="text-xs text-sky-600 hover:text-sky-700 px-2 py-1 rounded cursor-pointer"
                    >
                        <PackageIcon/>
                    </button>
                    <button
                        onClick={openCreateModal}
                        title="Add Data Configuration"
                        className="text-xs text-sky-600 hover:text-sky-700 px-2 py-1 rounded cursor-pointer"
                    >
                        <PlusIcon />
                    </button>
                </div>

                {/* Data Configs Table */}
                <div className="overflow-x-auto mb-4">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Name</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Data Type</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">API Endpoint</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {dataConfigs.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-3 text-center text-sm text-gray-400">
                                        No data configurations found. Add one to connect to external APIs.
                                    </td>
                                </tr>
                            ) : (
                                dataConfigs.map((config) => (
                                    <tr key={config._id} className="hover:bg-gray-750">
                                        <td className="px-4 py-2 text-xs text-gray-300">{config.name}</td>
                                        <td className="px-4 py-2 text-xs text-gray-300">{config.data_type}</td>
                                        <td className="px-4 py-2 text-xs text-gray-300 truncate max-w-[200px]">
                                            {config.api_endpoint}
                                        </td>
                                        <td className="px-4 py-2 text-right">
                                            <button
                                                onClick={() => openEditModal(config)}
                                                className="text-xs text-blue-500 hover:text-blue-400 mr-2"
                                            >
                                                <Edit size={15} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteConfig(config._id)}
                                                className="text-xs text-red-500 hover:text-red-400"
                                            >
                                                <Trash2Icon size={15} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* API Key Section */}
                {/* <div className="mt-2">
                    <h4 className="text-xs font-mono text-gray-400 mb-1">API Key for External Services</h4>
                    <div className="flex items-center">
                        <input 
                            type="password" 
                            placeholder="Insert your API key if needed"
                            className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white flex-grow"
                        />
                        <button className="ml-2 text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded">
                            Save
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">API key will be stored securely in your .env file</p>
                </div> */}

                {/* Start Button */}
                <div className="flex justify-end mt-4">
                    <button
                        onClick={onStart}
                        disabled={isRunning || dataConfigs.length === 0}
                        className={`flex items-center gap-2 px-3 py-1 rounded text-sm  transition-colors cursor-pointer
                        ${isRunning || dataConfigs.length === 0
                                ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                                : 'border border-green-600/60 hover:bg-green-700/50 text-white'
                            }`}
                    >
                        {isRunning ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Running...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Start Workflow
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className={`w-[200px] h-[150px]
            ${isRunning ? "opacity-90 animate-pulse" : "opacity-20"}
            relative sm:hidden md:block`}>
                <Image
                    src={"/landing/vial.png"}
                    alt="vial"
                    fill
                    className="object-contain"
                />
            </div>

            {/* Modal for create/edit */}
            {showConfigModal && (
                <CooksConfigModal
                    selectedConfig={selectedConfig}
                    setShowConfigModal={setShowConfigModal}
                    resetForm={resetForm}
                    setSelectedConfig={setSelectedConfig}
                    newConfig={newConfig}
                    setNewConfig={setNewConfig}
                />
            )}
        </div>
    );
};

export default CooksConfig;