export const fadeEffect = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const indicatorVariants = {
  groq: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
  gemini: { x: "100%", transition: { type: "spring", stiffness: 300, damping: 30 } },
};

