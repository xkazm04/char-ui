import { m, AnimatePresence } from 'framer-motion';
import { AlertTriangle, WifiOff } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

type Props = {
    genError: boolean;
    isOverLimit: boolean;
    targetRef: React.RefObject<HTMLElement>;
}

const BuilderGenErr = ({ genError, isOverLimit, targetRef }: Props) => {
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if ((genError || isOverLimit) && targetRef.current) {
            const rect = targetRef.current.getBoundingClientRect();
            setPosition({
                top: rect.top - 10,
                left: rect.left + rect.width / 2,
            });
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [genError, isOverLimit, targetRef]);

    // Early return if not visible
    if (!isVisible) return null;

    const tooltipContent = (
        <AnimatePresence>
            {isVisible && (
                <m.div
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.8 }}
                    transition={{ 
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                        duration: 0.2 
                    }}
                    className="fixed z-[9999] pointer-events-none"
                    style={{
                        top: position.top,
                        left: position.left,
                        transform: 'translateX(-50%) translateY(-100%)',
                    }}
                >
                    <div className="relative">
                        {/* Error Messages Container */}
                        <div className="bg-gray-900/95 backdrop-blur-sm border border-red-500/30 rounded-lg px-3 py-2 shadow-2xl max-w-xs">
                            {genError && (
                                <m.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="flex items-center gap-2 text-red-400 text-sm mb-1"
                                >
                                    <WifiOff className="w-4 h-4 flex-shrink-0" />
                                    <span className="whitespace-nowrap">Service unavailable</span>
                                </m.div>
                            )}

                            {isOverLimit && (
                                <m.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: genError ? 0.2 : 0.1 }}
                                    className={`flex items-center gap-2 text-orange-400 text-sm ${genError ? '' : 'mb-0'}`}
                                >
                                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                    <span className="whitespace-nowrap">Prompt too long</span>
                                </m.div>
                            )}
                        </div>

                        {/* Arrow pointing down to the button */}
                        <div 
                            className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0"
                            style={{
                                borderLeft: '6px solid transparent',
                                borderRight: '6px solid transparent',
                                borderTop: '6px solid rgb(17 24 39 / 0.95)',
                            }}
                        />
                        
                        {/* Arrow border */}
                        <div 
                            className="absolute left-1/2 transform -translate-x-1/2 w-0 h-0"
                            style={{
                                top: 'calc(100% - 1px)',
                                borderLeft: '7px solid transparent',
                                borderRight: '7px solid transparent',
                                borderTop: '7px solid rgb(239 68 68 / 0.3)',
                            }}
                        />
                    </div>
                </m.div>
            )}
        </AnimatePresence>
    );

    return createPortal(tooltipContent, document.body);
};

export default BuilderGenErr;