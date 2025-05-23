type Props = {
    icon: React.ReactNode;
    onClick: () => void;
    active?: boolean;
    label: string;
}

export const IconButton = ({ icon, onClick, active, label }: Props) => (
    <button
        title={label}
        aria-label={label}
        onClick={onClick}
        className={`p-1.5 rounded-md transition-all duration-200 ease-linear cursor-pointer 
            ${active ? 'bg-sky-600/10 text-sky-200' : 'text-gray-400 hover:text-sky-300'
            }`}
    >
        {icon}
    </button>
);
