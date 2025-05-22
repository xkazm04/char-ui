import { Loader2 } from "lucide-react";
import { Switch } from "@/app/components/ui/switch";

interface PromptHeaderProps {
  agent: string;
  description: string;
  isEnabled: boolean;
  canManage: boolean;
  isSaving: boolean;
  isPending: boolean;
  isExpanded: boolean;
  toggleAgent: (agent: string, isEnabled: boolean) => Promise<void>;
}

const PromptHeader = ({
  agent,
  description,
  isEnabled,
  canManage,
  isSaving,
  isPending,
  isExpanded,
  toggleAgent
}: PromptHeaderProps) => {
  return (
    <div className={`p-4 flex justify-between items-center ${isExpanded ? 'border-b border-gray-700' : ''}`}>
      <div className="flex flex-col">
        <h3 className="text-sm font-medium text-gray-200 capitalize">
          {agent}
          {isSaving && (
            <Loader2 className="inline-block ml-2 w-3 h-3 text-sky-500 animate-spin" />
          )}
        </h3>
        <p className="text-xs text-gray-400 mt-1">{description}</p>
      </div>
      
      <Switch
        checked={isEnabled}
        onCheckedChange={(checked) => toggleAgent(agent, checked)}
        className="data-[state=checked]:bg-sky-600"
        disabled={!canManage || isSaving || isPending}
      />
    </div>
  );
};

export default PromptHeader;