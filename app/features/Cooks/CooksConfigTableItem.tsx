import { useState } from "react";
import { useDeleteDataConfig } from "../../functions/configFns";
import { useQueryClient } from "@tanstack/react-query";
import { Edit, Trash2Icon, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { DataSourceConfig } from "@/app/types/config";

type Props = {
    openEditModal: (config: DataSourceConfig) => void;
    dataConfigs: DataSourceConfig[];
    config: DataSourceConfig;
};

const CooksConfigTableItem = ({openEditModal, dataConfigs, config}: Props) => {
    const [deletingIds, setDeletingIds] = useState<string[]>([]);
    const deleteMutation = useDeleteDataConfig();
    const queryClient = useQueryClient();

    const handleDeleteConfig = async (configId: string) => {
        const previousConfigs = dataConfigs;
        const updatedConfigs = dataConfigs.filter(config => config._id !== configId);
        queryClient.setQueryData(['dataConfigs'], updatedConfigs);

        try {
            await deleteMutation.mutateAsync(configId);
        } catch (error) {
            console.error("Failed to delete config:", error);
            queryClient.setQueryData(['dataConfigs'], previousConfigs);
        }
    };
    const handleDelete = async (configId: string) => {
        setDeletingIds(prev => [...prev, configId]);

        try {
            await handleDeleteConfig(configId);
        } finally {
            setDeletingIds(prev => prev.filter(id => id !== configId));
        }
    };


    return <motion.tr
        key={config._id}
        className={`hover:bg-gray-750 transition-colors duration-150 ${deletingIds.includes(config._id) ? 'opacity-50' : ''
            }`}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{
            opacity: 0,
            height: 0,
            transition: { duration: 0.2 }
        }}
        transition={{ duration: 0.2 }}
    >
        <td className="px-4 py-3 text-sm text-gray-200 font-medium">{config.name}</td>
        <td className="px-4 py-3 text-sm text-gray-300">
            <span className="px-2 py-1 text-xs rounded-full bg-gray-700">{config.data_type}</span>
        </td>
        <td className="px-4 py-3 text-xs text-gray-400 truncate">
            <div className="truncate max-w-full font-mono">{config.api_endpoint}</div>
        </td>
        <td className="px-4 py-3 text-right">
            <div className="flex justify-end space-x-2">
                <button
                    onClick={() => openEditModal(config)}
                    disabled={deletingIds.includes(config._id)}
                    className="p-1 rounded-full bg-gray-700 hover:bg-blue-600 text-gray-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Edit"
                >
                    <Edit size={14} />
                </button>
                <button
                    onClick={() => handleDelete(config._id)}
                    disabled={deletingIds.includes(config._id)}
                    className="p-1 rounded-full bg-gray-700 hover:bg-red-600 text-gray-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete"
                >
                    {deletingIds.includes(config._id) ? (
                        <Loader2 size={14} className="animate-spin" />
                    ) : (
                        <Trash2Icon size={14} />
                    )}
                </button>
            </div>
        </td>
    </motion.tr>
}

export default CooksConfigTableItem;