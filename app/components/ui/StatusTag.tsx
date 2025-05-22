import { CookStatusType } from "@/app/types/cooks";

const StatusTag = ({ status }: { status: CookStatusType }) => {
    const getStatusStyles = () => {
        switch (status) {
            case "success":
                return "bg-green-900 text-green-300 border-green-700";
            case "error":
                return "bg-red-900 text-red-300 border-red-700";
            case "running":
                return "bg-blue-900 text-blue-300 border-blue-700";
            case "waiting":
                return "bg-gray-700 text-gray-300 border-gray-600";
        }
    };

    const getStatusIcon = () => {
        switch (status) {
            case "success":
                return (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                );
            case "error":
                return (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                );
            case "running":
                return (
                    <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                );
            case "waiting":
                return (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    return (
        <span className={`inline-flex items-center w-[70px] px-1.5 py-0.5 rounded text-xs font-medium border ${getStatusStyles()}`}>
            {getStatusIcon()}
            <span className="ml-1 capitalize text-2xs">{status}</span>
        </span>
    );
};

export default StatusTag;