import { ReactNode } from "react";

interface ModalActionsProps {
    children: ReactNode;
    className?: string;
    align?: 'left' | 'center' | 'right' | 'between';
}

const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between'
};

const ModalActions = ({ children, className = '', align = 'right' }: ModalActionsProps) => {
    return (
        <div className={`p-6 bg-gray-900/50 border-t border-gray-700/50 flex items-center gap-3 ${alignClasses[align]} ${className}`}>
            {children}
        </div>
    );
};

export default ModalActions;