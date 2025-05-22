import { DataSourceConfig, CreateDataSourceConfig } from "@/app/types/config";
import {
    useCreateDataConfig,
    useUpdateDataConfig,
} from "../../functions/configFns";

type Props = {
    selectedConfig: DataSourceConfig | null;
    setShowConfigModal: (show: boolean) => void;
    resetForm: () => void;
    setSelectedConfig: (config: DataSourceConfig | null) => void;
    newConfig: CreateDataSourceConfig;
    setNewConfig: (config: CreateDataSourceConfig) => void;
}

const CooksConfigModal = ({ selectedConfig, setShowConfigModal, resetForm, setSelectedConfig, newConfig, setNewConfig }: Props) => {
    const createMutation = useCreateDataConfig();
    const updateMutation = useUpdateDataConfig(selectedConfig?._id || "");

    const handleCreateConfig = async () => {
        try {
            await createMutation.mutateAsync({
                name: newConfig.name,
                data_type: newConfig.data_type,
                api_endpoint: newConfig.api_endpoint,
                description: newConfig.description
            });
            setShowConfigModal(false);
            resetForm();
        } catch (error) {
            console.error("Failed to create config:", error);
        }
    };

    const handleUpdateConfig = async () => {
        if (!selectedConfig) return;

        try {
            await updateMutation.mutateAsync({
                name: newConfig.name,
                data_type: newConfig.data_type,
                api_endpoint: newConfig.api_endpoint,
                description: newConfig.description
            });
            setShowConfigModal(false);
            setSelectedConfig(null);
            resetForm();
        } catch (error) {
            console.error("Failed to update config:", error);
        }
    };
    return <>
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-5 w-full max-w-lg">
                <h3 className="text-lg font-medium text-gray-200 mb-4">
                    {selectedConfig ? 'Edit Data Configuration' : 'Add Data Configuration'}
                </h3>

                <div className="space-y-3">
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Name</label>
                        <input
                            type="text"
                            value={newConfig.name}
                            onChange={(e) => setNewConfig({ ...newConfig, name: e.target.value })}
                            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white outline-none"
                            placeholder="e.g., Character Assets API"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Data Type</label>
                        <input
                            type="text"
                            value={newConfig.data_type}
                            onChange={(e) => setNewConfig({ ...newConfig, data_type: e.target.value })}
                            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white outline-none"
                            placeholder="e.g., assets, characters"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-400 mb-1">API Endpoint</label>
                        <input
                            type="text"
                            value={newConfig.api_endpoint}
                            onChange={(e) => setNewConfig({ ...newConfig, api_endpoint: e.target.value })}
                            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white outline-none"
                            placeholder="e.g., https://api.example.com/assets"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Description (Optional)</label>
                        <textarea
                            value={newConfig.description}
                            onChange={(e) => setNewConfig({ ...newConfig, description: e.target.value })}
                            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white resize-none outline-none"
                            placeholder="Brief description of this data source"
                            rows={3}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-5">
                    <button
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm"
                        onClick={() => setShowConfigModal(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                        onClick={selectedConfig ? handleUpdateConfig : handleCreateConfig}
                        disabled={createMutation.isPending || updateMutation.isPending}
                    >
                        {(createMutation.isPending || updateMutation.isPending) ? (
                            <div className="flex items-center">
                                <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </div>
                        ) : (
                            selectedConfig ? 'Update' : 'Create'
                        )}
                    </button>
                </div>
            </div>
        </div>
    </>
}

export default CooksConfigModal;