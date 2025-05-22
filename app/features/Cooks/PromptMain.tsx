import { motion, AnimatePresence } from "framer-motion";
import { PromptModel } from "@/app/types/prompt";
import { handleTextareaResize } from "../../helpers/promptHelpers";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdatePrompt } from "@/app/functions/promptFns";
import PromptMainSwitch from "./PrompMainSwitch";

interface PromptMainProps {
  isEnabled: boolean;
  isExpanded: boolean;
  activePrompt: PromptModel | undefined;
  agentPrompts: PromptModel[];
  activePromptId: string;
  agent: string;
  isEditing: boolean;
  isPending: boolean;
  isActivating: boolean;
  isSaving: boolean;
  allPrompts: PromptModel[];
  setEditStates: React.Dispatch<React.SetStateAction<Record<string, { isEditing: boolean; error: string | null }>>>;
  setActivePrompts: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setActivePrompt: (promptId: string, isEnabled: boolean) => Promise<void>;
}

const PromptMain = ({
  isEnabled,
  isExpanded,
  activePrompt,
  agentPrompts,
  activePromptId,
  agent,
  isEditing,
  isPending,
  isActivating,
  isSaving,
  allPrompts,
  setEditStates,
  setActivePrompts,
  setActivePrompt,
}: PromptMainProps) => {
  
  const queryClient = useQueryClient();
  const updatePromptMutation = useUpdatePrompt();
  const updatePromptText = async (promptId: string, agent: string, newText: string) => {
    const updatedPrompts = allPrompts.map(p =>
      p._id === promptId ? { ...p, prompt: newText } : p
    );

    queryClient.setQueryData(['prompts'], updatedPrompts);

    try {
      await updatePromptMutation.mutateAsync({
        promptId,
        promptData: { prompt: newText }
      });
    } catch (error) {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });

      setEditStates(prev => ({
        ...prev,
        [agent]: {
          ...prev[agent],
          error: error instanceof Error ? error.message : "Failed to update prompt"
        }
      }));
    }
  };

  const toggleEditMode = (agent: string) => {
    setEditStates(prev => ({
      ...prev,
      [agent]: {
        ...prev[agent],
        isEditing: !prev[agent]?.isEditing,
        error: null
      }
    }));
  };


  if (!isEnabled) return null;

  return (
    <AnimatePresence>
      {isExpanded && activePrompt && (
        <motion.div
          className="p-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Multiple prompts selector */}
          {agentPrompts.length > 1 && (
            <PromptMainSwitch
              activePrompt={activePrompt}
              setActivePrompt={setActivePrompt}
              setActivePrompts={setActivePrompts}
              agentPrompts={agentPrompts}
              activePromptId={activePromptId}
              agent={agent}
              isActivating={isActivating}
            />
          )}

          {/* Prompt editing area */}
          <div className="relative">
            <textarea
              className={`w-full bg-gray-700/70 border 
                ${isEditing ? 'border-sky-600' : 'border-gray-600'}
                rounded-md p-3 text-sm outline-none text-white resize-none focus:ring-1 
                focus:ring-blue-500 focus:border-transparent min-h-[120px]`}
              value={activePrompt?.prompt || ""}
              onChange={(e) => {
                if (activePrompt) {
                  updatePromptText(activePrompt._id, agent, e.target.value);
                  handleTextareaResize(e);
                }
              }}
              onFocus={() => {
                if (!isEditing) toggleEditMode(agent);
              }}
              placeholder="Enter prompt instructions for this agent..."
              disabled={isPending || isActivating || isSaving}
              rows={5}
              onInput={handleTextareaResize}
            ></textarea>

            <div className="absolute bottom-2 right-2 flex items-center space-x-3 text-xs">
              {isPending && isEditing && (
                <span className="flex items-center">
                  <svg className="animate-spin h-3 w-3 text-yellow-500 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-yellow-500">Saving...</span>
                </span>
              )}
              <span className="text-gray-400">
                {activePrompt?.prompt.length || 0} chars
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PromptMain;