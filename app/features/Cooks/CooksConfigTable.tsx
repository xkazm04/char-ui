import { DataSourceConfig } from "@/app/types/config";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import CooksConfigTableItem from "./CooksConfigTableItem";

interface CooksConfigTableProps {
  dataConfigs: DataSourceConfig[];
  openEditModal: (config: DataSourceConfig) => void;
  onGenerateDefaults?: () => Promise<void>;
}

const CooksConfigTable = ({ 
  dataConfigs, 
  openEditModal, 
  onGenerateDefaults 
}: CooksConfigTableProps) => {
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleGenerateDefaults = async () => {
    if (onGenerateDefaults) {
      setLoading(true);
      await onGenerateDefaults();
      setLoading(false);
    }
  };

  return (
    <div className="overflow-x-auto mb-4 rounded-lg border border-gray-700 shadow">
      <table className="min-w-full divide-y divide-gray-700 table-fixed">
        <thead className="bg-gray-750">
          <tr>
            <th scope="col" className="w-1/4 px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
            <th scope="col" className="w-1/5 px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
            <th scope="col" className="w-2/5 px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">API Endpoint</th>
            <th scope="col" className="w-1/6 px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {isInitialLoad ? (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center">
                <Loader2 className="w-6 h-6 mx-auto animate-spin text-sky-500" />
              </td>
            </tr>
          ) : (
            <AnimatePresence mode="wait">
              {dataConfigs.length === 0 ? (
                <motion.tr
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <td colSpan={4} className="px-4 py-8 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <p className="text-sm text-gray-400">
                        No data configurations found
                      </p>
                      {onGenerateDefaults && (
                        <button 
                          onClick={handleGenerateDefaults}
                          disabled={loading}
                          className="flex items-center gap-2 px-3 py-1 text-xs bg-sky-600 hover:bg-sky-700 text-white rounded transition-colors"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>Generate Default Configurations</>
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ) : (
                <>
                  <AnimatePresence>
                    {dataConfigs.map((config) => (
                        <CooksConfigTableItem 
                            key={config._id}
                            dataConfigs={dataConfigs}
                            config={config}
                            openEditModal={openEditModal}
                        />
                    ))}
                  </AnimatePresence>
                </>
              )}
            </AnimatePresence>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CooksConfigTable;