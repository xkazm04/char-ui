export const CodeSnippetSkeleton = () => (
  <div className="w-80 h-64 bg-[#0d1230]/70 rounded-lg animate-pulse p-4">
    <div className="flex mb-4">
      <div className="w-3 h-3 rounded-full bg-sky-900/40 mr-2"></div>
      <div className="w-3 h-3 rounded-full bg-sky-900/40 mr-2"></div>
      <div className="w-3 h-3 rounded-full bg-sky-900/40"></div>
    </div>
    <div className="space-y-2">
      <div className="h-3 w-full bg-sky-900/40 rounded"></div>
      <div className="h-3 w-4/5 bg-sky-900/40 rounded"></div>
      <div className="h-3 w-3/5 bg-sky-900/40 rounded"></div>
    </div>
  </div>
);