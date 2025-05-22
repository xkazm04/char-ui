import { useState, useEffect } from "react";
import { useCreatePrompt, usePrompts, useUpdatePrompt } from "../../functions/promptFns";
import { motion } from "framer-motion";
import { AlertCircle, Loader2 } from "lucide-react";
import PromptHeader from "./PromptHeader";
import PromptMain from "./PromptMain";
import PromptFooter from "./PromptFooter";
import { 
  agentConfigs, 
  groupPromptsByAgent, 
  getEnabledAgents, 
  getAllAgents, 
  getAgentDescription,
  getActivePrompt,
  isAgentEnabled,
  canManageAgent,
} from "../../helpers/promptHelpers";

const CooksPrompts = () => {
  const { data: allPrompts = [], isLoading } = usePrompts();
  const createPromptMutation = useCreatePrompt();
  const updatePromptMutation = useUpdatePrompt();
  const promptsByAgent = groupPromptsByAgent(allPrompts);

  const enabledAgents = getEnabledAgents(promptsByAgent);

  const [expandedAgents, setExpandedAgents] = useState<string[]>(enabledAgents);
  const [activePrompts, setActivePrompts] = useState<Record<string, string>>({});
  const [editStates, setEditStates] = useState<Record<string, { 
    isEditing: boolean, 
    isSaving: boolean, 
    isActivating: boolean,
    error: string | null 
  }>>({});

  // Initialize active prompts and edit states
  useEffect(() => {
    const newActivePrompts: Record<string, string> = {};
    const newEditStates: Record<string, { 
      isEditing: boolean, 
      isSaving: boolean, 
      isActivating: boolean,
      error: string | null 
    }> = {};
    
    Object.entries(promptsByAgent).forEach(([agent, prompts]) => {
      // Find enabled prompt for this agent or use the first one
      const activePrompt = prompts.find(p => p.enabled) || prompts[0];
      if (activePrompt) {
        newActivePrompts[agent] = activePrompt._id;
        
        // Preserve existing edit state if possible
        newEditStates[agent] = editStates[agent] || { 
          isEditing: false, 
          isSaving: false, 
          isActivating: false,
          error: null 
        };
      }
    });
    
    setActivePrompts(newActivePrompts);
    setEditStates(prev => ({...prev, ...newEditStates}));
  }, [allPrompts]);

  // Toggle agent enabled state
  const toggleAgent = async (agent: string, isEnabled: boolean) => {
    const agentPrompts = promptsByAgent[agent] || [];

    if (isEnabled) {
      // Enable the agent - create a prompt if none exists
      if (agentPrompts.length === 0) {
        const agentConfig = agentConfigs.find(config => config.name === agent) || {
          name: agent,
          description: "",
          defaultPrompt: "Write instructions for this agent..."
        };

        setEditStates(prev => ({
          ...prev,
          [agent]: { ...prev[agent], isEditing: false, isSaving: true, error: null }
        }));

        try {
          await createPromptMutation.mutateAsync({
            agent,
            name: `${agent}-default`,
            prompt: agentConfig.defaultPrompt,
            enabled: true
          });

          // Expand the agent after creating prompt
          setExpandedAgents(prev => [...prev, agent]);
        } catch (error) {
          setEditStates(prev => ({
            ...prev,
            [agent]: { 
              ...prev[agent],
              isEditing: false, 
              isSaving: false, 
              error: error instanceof Error ? error.message : "Failed to create prompt" 
            }
          }));
        }
      } else {
        // Enable an existing prompt
        const promptToEnable = agentPrompts[0];
        
        setEditStates(prev => ({
          ...prev,
          [agent]: { ...prev[agent], isEditing: false, isSaving: true, error: null }
        }));

        try {
          await updatePromptMutation.mutateAsync({
            promptId: promptToEnable._id,
            promptData: { enabled: true }
          });

          // Expand the agent after enabling
          setExpandedAgents(prev => [...prev, agent]);
        } catch (error) {
          setEditStates(prev => ({
            ...prev,
            [agent]: { 
              ...prev[agent],
              isEditing: false, 
              isSaving: false, 
              error: error instanceof Error ? error.message : "Failed to enable prompt" 
            }
          }));
        }
      }
    } else {
      // Disable all prompts for this agent
      const enabledPrompts = agentPrompts.filter(p => p.enabled);
      
      setEditStates(prev => ({
        ...prev,
        [agent]: { ...prev[agent], isEditing: false, isSaving: true, error: null }
      }));

      try {
        for (const prompt of enabledPrompts) {
          await updatePromptMutation.mutateAsync({
            promptId: prompt._id,
            promptData: { enabled: false }
          });
        }

        // Don't collapse anymore, just leave it expanded with lower opacity
        // setExpandedAgents(prev => prev.filter(a => a !== agent));
      } catch (error) {
        setEditStates(prev => ({
          ...prev,
          [agent]: { 
            ...prev[agent],
            isEditing: false, 
            isSaving: false, 
            error: error instanceof Error ? error.message : "Failed to disable prompt" 
          }
        }));
      }
    }

    // Reset the edit state after all operations
    setEditStates(prev => ({
      ...prev,
      [agent]: { ...prev[agent], isEditing: false, isSaving: false, error: null }
    }));
  };

  // Set a prompt as active (enabled) for an agent
  const setActivePrompt = async (promptId: string, isEnabled: boolean) => {
    const prompt = allPrompts.find(p => p._id === promptId);
    if (!prompt) return;
    
    const agent = prompt.agent;
    const agentPrompts = promptsByAgent[agent] || [];
    
    // Mark this agent as activating a prompt
    setEditStates(prev => ({
      ...prev,
      [agent]: { ...prev[agent], isActivating: true, error: null }
    }));

    try {
      // First, disable all prompts for this agent (except the one we're enabling)
      for (const p of agentPrompts.filter(p => p.enabled)) {
        if (p._id !== promptId) {
          await updatePromptMutation.mutateAsync({
            promptId: p._id,
            promptData: { enabled: false }
          });
        }
      }
      
      // Then enable this prompt
      await updatePromptMutation.mutateAsync({
        promptId,
        promptData: { enabled: isEnabled }
      });
    } catch (error) {
      setEditStates(prev => ({
        ...prev,
        [agent]: { 
          ...prev[agent], 
          error: error instanceof Error ? error.message : "Failed to set active prompt" 
        }
      }));
    } finally {
      // Clear the activating state
      setEditStates(prev => ({
        ...prev,
        [agent]: { ...prev[agent], isActivating: false }
      }));
    }
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-4 mt-4 flex-wrap">
      {getAllAgents(promptsByAgent).map(agent => {
        const isEnabled = isAgentEnabled(agent, promptsByAgent);
        const canManage = canManageAgent(agent, promptsByAgent);
        const isSaving = editStates[agent]?.isSaving || false;
        const isEditing = editStates[agent]?.isEditing || false;
        const isActivating = editStates[agent]?.isActivating || false;
        const errorMessage = editStates[agent]?.error || null;
        const isExpanded = expandedAgents.includes(agent);
        const activePrompt = getActivePrompt(agent, promptsByAgent, activePrompts);
        const agentPrompts = promptsByAgent[agent] || [];
        
        return (
          <motion.div
            key={agent}
            className={`rounded-lg border w-[450px] ${isEnabled ? 'border-sky-600/50' : 'border-gray-700'} bg-gray-800 overflow-hidden`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            layout
          >
            {/* Header Component */}
            <PromptHeader
              agent={agent}
              description={getAgentDescription(agent)}
              isEnabled={isEnabled}
              canManage={canManage}
              isSaving={isSaving}
              isPending={createPromptMutation.isPending}
              isExpanded={isExpanded}
              toggleAgent={toggleAgent}
            />
            
            {/* Error message */}
            {errorMessage && (
              <div className="bg-red-900/20 border-t border-b border-red-800 px-4 py-2 flex items-center">
                <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                <p className="text-xs text-red-400">{errorMessage}</p>
              </div>
            )}
            
            {/* Main Content Component */}
            <div className={!isEnabled ? "opacity-50" : ""}>
              <PromptMain
                isEnabled={true} // Always render, just opacity changes
                isExpanded={isExpanded}
                activePrompt={activePrompt}
                agentPrompts={agentPrompts}
                activePromptId={activePrompts[agent] || ""}
                agent={agent}
                isEditing={isEditing}
                isPending={updatePromptMutation.isPending}
                isActivating={isActivating}
                isSaving={isSaving} 
                allPrompts={allPrompts}
                setEditStates={setEditStates}
                setActivePrompts={setActivePrompts}
                setActivePrompt={setActivePrompt}
              />
            </div>
            
            {/* Footer Component */}
            <PromptFooter
              isEnabled={isEnabled}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default CooksPrompts;