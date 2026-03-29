"use client";

import { useEffect, useState } from "react";
import { getUserProjects } from "@/app/actions/project";
import ProjectSelector from "./ProjectSelector";
import ProjectProgressPanel from "./ProjectProgressPanel";

export default function ProjectManager({ mobileView }: { mobileView: "chat" | "project" }) {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getUserProjects();
      setProjects(data);
      if (data.length === 1) {
        setActiveProjectId(data[0].id);
      }
    } catch (error) {
      console.error("Failed to load projects", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProject = (id: string) => {
    setActiveProjectId(id);
    setIsNewProject(false);
  };

  const handleCreateNew = () => {
    setActiveProjectId(null);
    setIsNewProject(true);
  };

  const handleProjectCreated = (newProject: any) => {
    setProjects([newProject, ...projects]);
    setActiveProjectId(newProject.id);
    setIsNewProject(false);
  };

  const goBackToList = () => {
    setActiveProjectId(null);
    setIsNewProject(false);
  };

  const activeProject = projects.find((p) => p.id === activeProjectId);

  return (
    <aside className={`${mobileView === "project" ? "flex" : "hidden"} md:flex w-full md:w-1/2 flex-col bg-surface-container-low md:border-l border-outline-variant/10 overflow-y-auto custom-scrollbar`}>
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
        </div>
      ) : activeProjectId || isNewProject ? (
        <ProjectProgressPanel 
          project={activeProject} 
          isNew={isNewProject} 
          onBack={goBackToList} 
          onProjectCreated={handleProjectCreated}
          refreshProject={fetchProjects}
        />
      ) : (
        <ProjectSelector 
          projects={projects} 
          onSelectProject={handleSelectProject} 
          onCreateNew={handleCreateNew} 
        />
      )}
    </aside>
  );
}
