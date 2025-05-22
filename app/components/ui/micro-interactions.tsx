"use client";

import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { cn } from "@/app/lib/utils";
import { durations, easings } from "@/app/styles/design-tokens";

// Hover Card with subtle animation
interface HoverCardProps {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
  hoverRotate?: number;
  hoverElevation?: boolean;
  hoverGlow?: boolean;
  glowColor?: string;
  disabled?: boolean;
}

export function HoverCard({
  children,
  className,
  hoverScale = 1.02,
  hoverRotate = 0,
  hoverElevation = true,
  hoverGlow = false,
  glowColor = "rgba(var(--color-primary), 0.3)",
  disabled = false,
}: HoverCardProps) {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-lg transition-all",
        hoverElevation && "hover:shadow-lg",
        className
      )}
      whileHover={
        disabled
          ? {}
          : {
              scale: hoverScale,
              rotate: hoverRotate,
              transition: { duration: durations.fast / 1000 },
            }
      }
    >
      {hoverGlow && !disabled && (
        <motion.div
          className="absolute inset-0 z-0 opacity-0"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: durations.fast / 1000 }}
          style={{
            boxShadow: `0 0 20px 5px ${glowColor}`,
            borderRadius: "inherit",
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

// Animated Icon Button
interface AnimatedIconButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  animationType?: "bounce" | "pulse" | "rotate" | "shake" | "none";
  tooltip?: string;
  tooltipSide?: "top" | "right" | "bottom" | "left";
  ariaLabel: string;
}

export function AnimatedIconButton({
  icon,
  onClick,
  className,
  variant = "default",
  size = "md",
  disabled = false,
  animationType = "bounce",
  tooltip,
  tooltipSide = "top",
  ariaLabel,
}: AnimatedIconButtonProps) {
  const [showTooltip, setShowTooltip] = React.useState(false);

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };

  const getAnimationVariants = (): Variants => {
    switch (animationType) {
      case "bounce":
        return {
          hover: { y: [0, -4, 0], transition: { repeat: 1 } },
          tap: { scale: 0.9 },
        };
      case "pulse":
        return {
          hover: {
            scale: [1, 1.1, 1],
            transition: { repeat: 1, duration: 0.3 },
          },
          tap: { scale: 0.9 },
        };
      case "rotate":
        return {
          hover: { rotate: [0, 15, 0], transition: { repeat: 1 } },
          tap: { scale: 0.9 },
        };
      case "shake":
        return {
          hover: {
            x: [0, -3, 3, -3, 3, 0],
            transition: { repeat: 1, duration: 0.4 },
          },
          tap: { scale: 0.9 },
        };
      case "none":
      default:
        return {
          hover: {},
          tap: { scale: 0.9 },
        };
    }
  };

  const tooltipPositions = {
    top: "-top-10 left-1/2 -translate-x-1/2",
    right: "top-1/2 -right-24 -translate-y-1/2",
    bottom: "-bottom-10 left-1/2 -translate-x-1/2",
    left: "top-1/2 -left-24 -translate-y-1/2",
  };

  const tooltipArrowPositions = {
    top: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45",
    right: "left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 rotate-45",
    bottom: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45",
    left: "right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45",
  };

  return (
    <div className="relative">
      <motion.button
        className={cn(
          "flex items-center justify-center rounded-full",
          sizeClasses[size],
          variantClasses[variant],
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
        onClick={disabled ? undefined : onClick}
        whileHover={disabled ? {} : "hover"}
        whileTap={disabled ? {} : "tap"}
        variants={getAnimationVariants()}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label={ariaLabel}
        disabled={disabled}
      >
        {icon}
      </motion.button>

      <AnimatePresence>
        {tooltip && showTooltip && (
          <motion.div
            className={cn(
              "absolute z-50 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white shadow-lg dark:bg-gray-800",
              tooltipPositions[tooltipSide]
            )}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            <span
              className={cn(
                "absolute h-2 w-2 bg-gray-900 dark:bg-gray-800",
                tooltipArrowPositions[tooltipSide]
              )}
            />
            {tooltip}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Animated Text
interface AnimatedTextProps {
  text: string;
  className?: string;
  animationType?: "typewriter" | "fade" | "wave" | "highlight" | "none";
  highlightColor?: string;
  staggerChildren?: boolean;
  delay?: number;
  duration?: number;
}

export function AnimatedText({
  text,
  className,
  animationType = "fade",
  highlightColor = "var(--brand-primary)",
  staggerChildren = true,
  delay = 0,
  duration = 0.5,
}: AnimatedTextProps) {
  const getAnimationVariants = (): {
    container: Variants;
    item: Variants;
  } => {
    switch (animationType) {
      case "typewriter":
        return {
          container: {
            hidden: {},
            visible: {
              transition: {
                staggerChildren: staggerChildren ? 0.05 : 0,
                delayChildren: delay,
              },
            },
          },
          item: {
            hidden: { opacity: 0, y: 5 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.1 },
            },
          },
        };
      case "wave":
        return {
          container: {
            hidden: {},
            visible: {
              transition: {
                staggerChildren: staggerChildren ? 0.05 : 0,
                delayChildren: delay,
              },
            },
          },
          item: {
            hidden: { y: 20, opacity: 0 },
            visible: {
              y: 0,
              opacity: 1,
              transition: {
                type: "spring",
                damping: 12,
                stiffness: 200,
              },
            },
          },
        };
      case "highlight":
        return {
          container: {
            hidden: {},
            visible: {},
          },
          item: {
            hidden: {},
            visible: {},
          },
        };
      case "fade":
      default:
        return {
          container: {
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { duration, delay },
            },
          },
          item: {
            hidden: {},
            visible: {},
          },
        };
    }
  };

  const { container, item } = getAnimationVariants();

  if (animationType === "highlight") {
    return (
      <div className={cn("relative inline-block", className)}>
        <span>{text}</span>
        <motion.div
          className="absolute bottom-0 left-0 h-[30%] w-full rounded-sm"
          style={{ backgroundColor: highlightColor }}
          initial={{ width: 0, opacity: 0.7 }}
          animate={{ width: "100%", opacity: 0.3 }}
          transition={{ delay, duration: duration * 2, ease: "easeOut" }}
        />
      </div>
    );
  }

  if (animationType === "typewriter" || animationType === "wave") {
    return (
      <motion.div
        className={cn("flex", className)}
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {text.split("").map((char, index) => (
          <motion.span key={`${char}-${index}`} variants={item}>
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {text}
    </motion.div>
  );
}

// Notification Badge
interface NotificationBadgeProps {
  count?: number;
  variant?: "dot" | "count";
  className?: string;
  maxCount?: number;
  pulseAnimation?: boolean;
}

export function NotificationBadge({
  count = 0,
  variant = "count",
  className,
  maxCount = 99,
  pulseAnimation = true,
}: NotificationBadgeProps) {
  if (count === 0) return null;

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  return (
    <div className={cn("relative", className)}>
      {variant === "dot" ? (
        <motion.div
          className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-destructive"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          {...(pulseAnimation && {
            whileInView: {
              scale: [1, 1.2, 1],
              transition: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 2,
              },
            },
          })}
        />
      ) : (
        <motion.div
          className="absolute -right-2 -top-2 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-xs font-medium text-white"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          {displayCount}
        </motion.div>
      )}
    </div>
  );
}

// Animated Feedback Message
interface FeedbackMessageProps {
  message: string;
  type: "success" | "error" | "info" | "warning";
  visible: boolean;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseTime?: number;
  className?: string;
  icon?: React.ReactNode;
}

export function FeedbackMessage({
  message,
  type,
  visible,
  onClose,
  autoClose = true,
  autoCloseTime = 5000,
  className,
  icon,
}: FeedbackMessageProps) {
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (visible && autoClose) {
      timer = setTimeout(() => {
        onClose?.();
      }, autoCloseTime);
    }
    return () => clearTimeout(timer);
  }, [visible, autoClose, autoCloseTime, onClose]);

  const typeStyles = {
    success: "bg-success/10 text-success border-success/20",
    error: "bg-destructive/10 text-destructive border-destructive/20",
    info: "bg-info/10 text-info border-info/20",
    warning: "bg-warning/10 text-warning border-warning/20",
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={cn(
            "flex items-center gap-2 rounded-md border p-3",
            typeStyles[type],
            className
          )}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {icon && <div className="flex-shrink-0">{icon}</div>}
          <p className="flex-1 text-sm">{message}</p>
          {onClose && (
            <button
              onClick={onClose}
              className="flex-shrink-0 rounded-full p-1 hover:bg-black/5"
              aria-label="Close message"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

