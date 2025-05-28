import { Save, Loader2, CheckCheck, AlertTriangle, Clock } from "lucide-react";

export const buttonConfig = {
    validating: {
        icon: Loader2,
        text: "Checking...",
        className: "bg-sky-500/20 border-sky-400/30 text-sky-300 cursor-wait",
        iconClassName: "animate-spin"
    },
    saving: {
        icon: Loader2,
        text: "Saving...",
        className: "bg-sky-500/20 border-sky-400/30 text-sky-300 cursor-wait",
        iconClassName: "animate-spin"
    },
    processing: {
        icon: Clock,
        text: "Processing...",
        className: "bg-orange-500/20 border-orange-400/30 text-orange-300 cursor-wait",
        iconClassName: "animate-pulse"
    },
    success: {
        icon: CheckCheck,
        text: "Saved!",
        className: "bg-green-500/20 border-green-400/30 text-green-300",
        iconClassName: ""
    },
    error: {
        icon: AlertTriangle,
        text: "Failed",
        className: "bg-red-500/20 border-red-400/30 text-red-300 hover:bg-red-500/30",
        iconClassName: ""
    },
    default: {
        icon: Save,
        text: "Save Asset",
        className: "bg-sky-500/10 border-sky-400/20 text-sky-400 hover:bg-sky-500/20 hover:text-sky-300",
        iconClassName: ""
    }
};