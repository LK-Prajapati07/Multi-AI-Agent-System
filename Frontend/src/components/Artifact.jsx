const Artifact = () => {
  return (
    <aside
      className="
        hidden lg:flex
        h-full w-62.5
        shrink-0
        flex-col
        overflow-hidden
        border-l border-white/10
        bg-[#05070d]
      "
    >
      {/* Header */}
      <div className="flex h-12 items-center justify-between border-b border-white/10 px-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />

          <span className="text-sm font-medium text-white">
            Artifact
          </span>
        </div>

        <button className="text-xs text-white/40 transition hover:text-white">
          Close
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="rounded-xl border border-white/10 bg-white/3 p-4">
          <p className="text-xs text-white/40">
            No artifact generated
          </p>

          <p className="mt-2 text-sm text-white/70">
            AI-generated code, files and previews will appear here.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Artifact;