"use client";

import { useState } from "react";
import { 
  Settings, 
  Hourglass, 
  Code, 
  Rocket, 
  FileEdit, 
  CheckCircle2, 
  ArrowLeft, 
  Check 
} from "lucide-react";
import Stage1Setup from "./stages/Stage1Setup";
import Stage2Payment from "./stages/Stage2Payment";
import Stage3Development from "./stages/Stage3Development";
import Stage4Finalize from "./stages/Stage4Finalize";
import Stage5Revision from "./stages/Stage5Revision";

const STAGES = [
  { label: "Project Setup", icon: Settings, num: 1 },
  { label: "Deposit Payment", icon: Hourglass, num: 2 },
  { label: "In Development", icon: Code, num: 3 },
  { label: "Final Delivery", icon: Rocket, num: 4 },
  { label: "Revisions", icon: FileEdit, num: 5 },
];

export default function ProjectProgressPanel({ 
  project, 
  isNew, 
  onBack, 
  onProjectCreated,
  refreshProject
}: { 
  project?: any, 
  isNew: boolean, 
  onBack: () => void,
  onProjectCreated: (prj: any) => void,
  refreshProject: () => void
}) {
  const currentStage = project && project.status <= 6 ? project.status : 1;

  const renderStage = () => {
    switch (currentStage) {
      case 1:
        return <Stage1Setup onProjectCreated={onProjectCreated} />;
      case 2:
        return <Stage2Payment project={project} onPaymentComplete={refreshProject} />;
      case 3:
        return <Stage3Development project={project} />;
      case 4:
        return <Stage4Finalize project={project} onPaymentComplete={refreshProject} />;
      case 5:
        return <Stage5Revision project={project} onRevisionSubmit={refreshProject} />;
      case 6:
        return (
          <div className="p-8 text-center text-white flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold">Project Completed!</h3>
            <p className="mt-2 text-sm text-zinc-400 max-w-sm">
              Thanks for trusting Make My Website for your digital presence. Your project is now fully deployed and finalized.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col w-full relative">
      <button 
        onClick={onBack}
        className="absolute top-4 left-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-white"
        title="Go back to projects list"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>

      <div className="w-full px-8 pt-12 pb-6 border-b border-outline-variant/10">
        <div className="text-center mb-8">
          <h2 className="text-md font-bold text-white tracking-widest uppercase">{project ? project.name : "New Project"}</h2>
        </div>
        
        <div className="relative flex items-center justify-between px-2 max-w-sm mx-auto w-full">
          <div className="absolute top-[14px] left-[10%] right-[10%] h-[2px] bg-surface-container-highest" />

          {STAGES.map((step, i) => {
            const isCompleted = step.num < currentStage;
            const isActive = step.num === currentStage;
            const isUpcoming = step.num > currentStage;

            return (
              <div key={i} className="relative z-10 flex flex-col items-center flex-1">
                <div className={`
                  w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300
                  ${isCompleted ? 'bg-primary-container text-on-primary-container shadow-[0_0_12px_rgba(79,70,229,0.3)]' : ''}
                  ${isActive ? 'bg-primary-container text-on-primary-container ring-[3px] ring-primary/30 shadow-[0_0_20px_rgba(79,70,229,0.4)]' : ''}
                  ${isUpcoming ? 'bg-surface-container-highest text-on-surface-variant/40' : ''}
                `}>
                  {isCompleted ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <step.icon className={`w-3.5 h-3.5 ${isActive ? 'animate-pulse' : ''}`} />
                  )}
                </div>
                <span className={`
                  text-[9px] mt-2 text-center leading-tight font-medium tracking-wide whitespace-nowrap
                  ${isCompleted ? 'text-primary' : ''}
                  ${isActive ? 'text-on-surface font-bold' : ''}
                  ${isUpcoming ? 'text-on-surface-variant/40' : ''}
                `}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full">
        {renderStage()}
      </div>
    </div>
  );
}
