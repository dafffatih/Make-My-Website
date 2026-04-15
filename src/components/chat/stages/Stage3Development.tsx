"use client";

import { updateProjectStage } from "@/app/actions/project";
import { Blocks, BellRing } from "lucide-react";

export default function Stage3Development({ project }: { project: any }) {
  if (!project) return null;

  // Temporary function for user to manually push it to stage 4 (for demonstration purposes since developer backend isn't here)
  const handleSimulateFinishDev = async () => {
    await updateProjectStage(project.id, 4);
    // Needs a page refresh to show new stage, or the parent `refreshProject` callback, 
    // but we can just use router.refresh() inside `updateProjectStage`.
  };

  return (
    <div className="p-8 pb-32 h-full flex flex-col items-center justify-center text-center space-y-6">
      <div className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center relative shadow-xl shadow-black/20">
        <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-primary animate-spin opacity-50"></div>
        <Blocks className="text-4xl text-primary animate-pulse w-10 h-10" />
      </div>

      <div className="max-w-md space-y-3 pt-4">
        <h3 className="text-2xl font-black text-white tracking-widest uppercase">In Development</h3>
        <p className="text-on-surface-variant text-sm leading-relaxed">
          Our team is currently building your project. We'll update you here if we need any clarifications. Once development is complete, you will be able to review the final product.
        </p>
      </div>

      <div className="mt-8 p-4 bg-primary/10 border border-primary/20 rounded-2xl max-w-sm">
        <p className="text-xs text-primary font-bold tracking-widest uppercase flex items-center justify-center gap-2">
          <BellRing className="w-4 h-4" />
          Please check back regularly
        </p>
      </div>

      {/* Development Override Button for testing */}
      <div className="mt-12 pt-8 border-t border-outline-variant/10 w-full max-w-sm">
        <button 
          onClick={handleSimulateFinishDev}
          className="text-xs text-on-surface-variant hover:text-white underline decoration-outline-variant/30 underline-offset-4 transition-colors"
        >
          [Demo] Simulate Development Completion
        </button>
      </div>
    </div>
  );
}
