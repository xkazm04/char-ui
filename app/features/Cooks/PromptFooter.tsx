import { Divider } from '@/app/components/ui/diviiders';
import { Wand2, X } from 'lucide-react';

interface PromptFooterProps {
  isEnabled: boolean;
}

const PromptFooter = ({
  isEnabled,
}: PromptFooterProps) => {
  
  if (!isEnabled) return null;
  
  return (
    <>
      <Divider />
      <div 
        className="py-2 px-4 flex justify-center"
      >
        <div className="flex items-center space-x-6">
          {/* Improve button */}
          <button 
            className="group flex items-center text-xs opacity-50 hover:opacity-100
             text-gray-400 hover:text-sky-400 transition-all duration-200 ease-linear cursor-pointer"
            title="Enhance prompt with AI"
          >
            <Wand2 className="w-3.5 h-3.5 mr-1.5 group-hover:text-sky-400" />
            <span>Improve</span>
          </button>
          <button 
            className="group flex items-center text-xs opacity-50 hover:opacity-100
             text-gray-400 hover:text-red-400 transition-colors duration-200 ease-linear cursor-pointer"
            title="Delete prompt"
          >
            <X className="w-3.5 h-3.5 mr-1.5 group-hover:text-red-400" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default PromptFooter;