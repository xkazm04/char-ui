import { ReactNode } from "react";

interface ModalHeaderProps {
    title: string;
    subtitle?: string;
    icon?: ReactNode;
    className?: string;
}

const ModalHeader = ({ title, subtitle, icon, className = '' }: ModalHeaderProps) => {
    return (
        <div className={`p-6 border-b border-gray-700/50 ${className}`}>
            <div className="flex items-start gap-3">
                {icon && (
                    <div className="p-3 bg-gray-700/30 rounded-xl border border-gray-600/30">
                        {icon}
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-white mb-1 truncate">{title}</h2>
                    {subtitle && (
                        <p className="text-gray-400 text-sm">{subtitle}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModalHeader;