import { useState } from "react";
import { useCreateDataConfig } from "../../functions/configFns";
import { DataSourceConfig, CreateDataSourceConfig } from "@/app/types/config";
import { PlusIcon } from "lucide-react";
import CooksConfigModal from "./CooksConfigModal";
import CooksConfigTable from "./CooksConfigTable";
import CooksConfigStart from "./CooksConfigStart";

interface CooksConfigProps {
    dataConfigs: DataSourceConfig[];
    agentNames: string[];
}

const defaultConfigOptions = [
    { name: "Assets", data_type: "assets", api_endpoint: "http://localhost:8000/assets/", description: "" },
    { name: "Characters", data_type: "characters", api_endpoint: "http://localhost:8000/characters/", description: "" },
    { name: "Generations", data_type: "generations", api_endpoint: "http://localhost:8000/generations/", description: "" },
];

const CooksConfig = ({ dataConfigs, agentNames }: CooksConfigProps) => {
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const createMutation = useCreateDataConfig();
    const [selectedConfig, setSelectedConfig] = useState<DataSourceConfig | null>(null);
    const [newConfig, setNewConfig] = useState<CreateDataSourceConfig>({
        name: "",
        data_type: "",
        api_endpoint: "",
        description: ""
    });

    const generateDefaultConfigs = async () => {
        for (const config of defaultConfigOptions) {
            try {
                await createMutation.mutateAsync({
                    name: config.name,
                    data_type: config.data_type,
                    api_endpoint: config.api_endpoint,
                    description: config.description
                });
            } catch (error) {
                console.error(`Failed to create default config ${config.name}:`, error);
            }
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
                        onClick={openCreateModal}
                        title="Add Data Configuration"
                        className="text-xs bg-sky-600 hover:bg-sky-700 text-white px-2 py-1 rounded flex items-center gap-1 transition-colors"
                    >
                        <PlusIcon size={14} />
                        <span>Add Config</span>
                    </button>
                </div>

                {/* Data Configs Table - now with optional generation function */}
                <CooksConfigTable
                    dataConfigs={dataConfigs}
                    openEditModal={openEditModal}
                    onGenerateDefaults={generateDefaultConfigs}
                />

                {/* Start workflow */}
                <CooksConfigStart
                    dataConfigs={dataConfigs}
                    isRunning={isRunning}
                    setIsRunning={setIsRunning}
                    agentNames={agentNames}
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