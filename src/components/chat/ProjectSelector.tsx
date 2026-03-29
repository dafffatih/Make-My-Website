"use client";

export default function ProjectSelector({
  projects,
  onSelectProject,
  onCreateNew,
}: {
  projects: any[];
  onSelectProject: (id: string) => void;
  onCreateNew: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-[linear-gradient(135deg,#c3c0ff_0%,#4f46e5_100%)] flex items-center justify-center shadow-lg shadow-primary/20 mb-4">
        <span className="material-symbols-outlined text-white text-3xl">assignment</span>
      </div>
      <h2 className="text-2xl font-extrabold text-white tracking-tight">Your Projects</h2>
      <p className="text-on-surface-variant text-sm max-w-sm">
        Select an existing project to view its progress, or start a new project brief to begin working with us.
      </p>

      {projects.length > 0 && (
        <div className="w-full max-w-md space-y-3 mt-4">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelectProject(p.id)}
              className="w-full text-left bg-surface-container-high hover:bg-surface-container-highest transition-all duration-300 p-5 rounded-2xl group border border-outline-variant/10 flex items-center justify-between"
            >
              <div>
                <h3 className="font-bold text-white group-hover:text-primary transition-colors">{p.name}</h3>
                <span className="text-xs text-on-surface-variant uppercase tracking-widest block mt-1">
                  Package: {p.package}
                </span>
                <span className="text-xs text-on-surface-variant uppercase tracking-widest block mt-1">
                  Stage: {p.status}
                </span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
                chevron_right
              </span>
            </button>
          ))}
        </div>
      )}

      <button
        onClick={onCreateNew}
        className="w-full max-w-md py-4 rounded-xl bg-primary text-white font-bold uppercase text-xs tracking-widest hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-95"
      >
        Start New Project
      </button>
    </div>
  );
}
