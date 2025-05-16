const GlowingText = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="relative">
      <span className="text-sky-400 relative z-10">{children}</span>
      <span className="absolute inset-0 blur-md bg-sky-500/30 z-0"></span>
    </span>
  );
}

export default GlowingText;