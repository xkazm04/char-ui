import { WORKFLOW_STEPS } from "@/app/data/landing"
import { cn } from "@/app/lib/utils"
import { m } from "framer-motion"

type Props = {
    activeStep: number;
    handleStepChange: (step: number) => void;
}

const LanHowStepper = ({activeStep, handleStepChange}: Props) => {
    return <>
        <div className="flex justify-center items-center">
            <div className="grid grid-cols-4 md:grid-cols-4 gap-5 md:gap-6 max-w-3xl">
                {WORKFLOW_STEPS.map((item, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleStepChange(idx)}
                        className={cn(
                            "relative flex flex-col items-center text-center p-2 px-4 rounded-lg transition-all duration-300 group",
                            activeStep === idx
                                ? "bg-slate-800/80 shadow-lg scale-105"
                                : "bg-slate-900/40 hover:bg-slate-800/60"
                        )}
                    >
                        <span
                            className={cn(
                                "flex items-center justify-center h-8 w-8 rounded-full mb-2 transition-colors",
                                activeStep === idx ? "text-sky-400" : "text-gray-400"
                            )}
                        >
                            {item.icon}
                        </span>
                        <span
                            className={cn(
                                "text-xs xl:text-sm font-medium",
                                activeStep === idx ? "text-white" : "text-gray-400"
                            )}
                        >
                            {item.title}
                        </span>
                        {activeStep === idx && (
                            <m.span
                                layoutId="activeIndicator"
                                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-sky-500 rounded-full"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                    </button>
                ))}
            </div>
        </div>
    </>
}

export default LanHowStepper;