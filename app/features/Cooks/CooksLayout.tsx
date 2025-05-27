import { lazy, Suspense } from "react";
import { usePrompts } from "../../functions/promptFns";
import { useDataConfigs } from "../../functions/configFns";
import CooksError from "./CooksError";
import { PromptModel } from "@/app/types/prompt";
import CooksMaster from "./CooksMaster";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import LoadingSpinner from "../../components/anim/LoadingSpinner";

const CooksConfig = lazy(() => import("./CooksConfig"));
const CooksPrompts = lazy(() => import("./CooksPrompts"));
const CooksLog = lazy(() => import("./CooksLog"));


// Animation variants for fade in
const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 }
    }
};

const CooksLayout = () => {
    const { data: prompts = [], isLoading: isLoadingPrompts } = usePrompts();
    const { data: dataConfigs = [], isLoading: isLoadingConfigs, isError: isConfError, error: errConfig } = useDataConfigs();

    const promptsByAgent: Record<string, PromptModel[]> = {};
    prompts.forEach(prompt => {
        if (!promptsByAgent[prompt.agent]) {
            promptsByAgent[prompt.agent] = [];
        }
        promptsByAgent[prompt.agent].push(prompt);
    });

    const agentNames = Object.keys(promptsByAgent);

    // Global loading state for initial data fetch
    if (isLoadingConfigs || isLoadingPrompts) {
        return (
            <div className="flex flex-col py-4 lg:px-4 px-2 2xl-px-10 gap-4 relative h-full">
                <div className="flex justify-center items-center text-gray-400 py-4">
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    <span>Loading configuration...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col py-4 lg:px-4 px-2 2xl-px-10 gap-4 relative h-full">
            <AnimatePresence>
                {!isConfError ? (
                    <motion.div
                        className="flex flex-row gap-4"
                        variants={fadeIn}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.3 }}
                    >
                        <Suspense fallback={<LoadingSpinner label="Loading configuration..." size="md" />}>
                            <motion.div
                                className="w-full"
                                variants={fadeIn}
                                initial="hidden"
                                animate="visible"
                                transition={{ duration: 0.3 }}
                            >
                                <CooksConfig
                                    dataConfigs={dataConfigs}
                                    agentNames={agentNames}
                                />
                            </motion.div>
                        </Suspense>
                        <motion.div
                            variants={fadeIn}
                            initial="hidden"
                            animate="visible"
                            transition={{ duration: 0.3, delay: 0.1 }}
                        >
                            <CooksMaster />
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div
                        className="flex flex-col absolute right-0 text-gray-400 py-4"
                        variants={fadeIn}
                        initial="hidden"
                        animate="visible"
                    >
                        <CooksError error={errConfig} />
                    </motion.div>
                )}
            </AnimatePresence>

            <Suspense fallback={<LoadingSpinner label="Loading prompts..." size="md" />}>
                <motion.div
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    <CooksPrompts />
                </motion.div>
            </Suspense>

            <Suspense fallback={<LoadingSpinner label="Loading logs..." size="md" />}>
                <motion.div
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.4, delay: 0.3 }}
                >
                    <CooksLog agents={agentNames}  />
                </motion.div>
            </Suspense>
        </div>
    );
};

export default CooksLayout;