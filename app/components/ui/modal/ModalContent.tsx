import { ReactNode } from "react";

interface ModalContentProps {
    children: ReactNode;
    className?: string;
    scrollable?: boolean;
}

const ModalContent = ({ children, className = '', scrollable = true }: ModalContentProps) => {
    return (
        <div className={`p-6 ${scrollable ? 'overflow-y-auto max-h-[60vh]' : ''} ${className}`}>
            {children}
        </div>
    );
};

export default ModalContent;