'use client';

import React, { useState } from 'react';
import { PROJECTS_DATA } from '@/config/portfolioData';
import type { ProjectItem } from '@/types/portfolio';
import { ProjectDetailModal } from './ProjectDetailModal';

interface ProjectsOverlayProps {
  opacity: number;
  selectedProjectId: string;
  onSelectProject: (projectId: string) => void;
}

export function ProjectsOverlay({
  opacity,
  selectedProjectId,
  onSelectProject,
}: ProjectsOverlayProps) {
  const [modalProject, setModalProject] = useState<ProjectItem | null>(null);
  const [projectsList, setProjectsList] = useState<ProjectItem[]>(PROJECTS_DATA);

  // Expose test automation hooks for dynamic project scalability testing
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    (window as unknown as { __FAROUK_INJECT_PROJECT?: (p: ProjectItem) => void }).__FAROUK_INJECT_PROJECT = (newProj: ProjectItem) => {
      setProjectsList((prev) => [...prev, newProj]);
    };
    (window as unknown as { __FAROUK_RESET_PROJECTS?: () => void }).__FAROUK_RESET_PROJECTS = () => {
      setProjectsList(PROJECTS_DATA);
    };
  }, []);

  const activeProject =
    projectsList.find((p) => p.id === selectedProjectId) || projectsList[0];

  const isVisible = opacity > 0.01;

  return (
    <>
      <section
        id="act-3-work"
        aria-label="Act III — The Work: Digital Project Gallery"
        className={`absolute inset-0 flex flex-col justify-center p-6 sm:p-12 lg:p-16 pt-20 sm:pt-24 pointer-events-none transition-opacity duration-200 ease-out ${
          isVisible ? 'visible' : 'invisible'
        }`}
        style={{ opacity }}
      >
        {/* Left-aligned editorial container allowing exhibition display wall & Farouk to remain visible on right */}
        <div className="max-w-xl lg:max-w-2xl mr-auto pointer-events-auto">
          {/* Chapter Badging */}
          <div className="flex items-center gap-2.5 mb-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono tracking-wider border border-[#BA5227]/30 bg-[#BA5227]/10 text-[#E59368]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#BA5227]" />
              ACT III — THE WORK
            </span>
            <span className="text-[11px] font-mono tracking-widest text-[#B5A99B] uppercase">
              Digital Project Gallery
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold tracking-tight text-[#FAF8F5] mb-2">
            Selected Works
          </h2>
          <p className="text-xs sm:text-sm text-[#D6CEC2] font-body leading-relaxed mb-4 max-w-lg">
            Production implementations and architectures spanning cross-platform mobile systems, responsive web platforms, and interactive 3D commerce.
          </p>

          {/* Compact Project Selector Tabs (Scrollable & Keyboard Navigable) */}
          <div
            role="tablist"
            aria-label="Project Exhibition Selector"
            className="flex items-center gap-1.5 p-1 rounded-xl border border-[#E8E2D8]/15 bg-[#1C1512]/75 backdrop-blur-md mb-4 max-w-full overflow-x-auto scrollbar-none"
            onKeyDown={(e) => {
              const currentIndex = projectsList.findIndex((p) => p.id === selectedProjectId);
              if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % projectsList.length;
                onSelectProject(projectsList[nextIndex].id);
              } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                const prevIndex = (currentIndex - 1 + projectsList.length) % projectsList.length;
                onSelectProject(projectsList[prevIndex].id);
              }
            }}
          >
            {projectsList.map((proj, idx) => {
              const isActive = proj.id === selectedProjectId;
              return (
                <button
                  key={proj.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onSelectProject(proj.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#BA5227] text-[#FAF8F5] shadow-sm font-bold'
                      : 'text-[#B5A99B] hover:text-[#FAF8F5] hover:bg-white/5'
                  }`}
                >
                  0{idx + 1} / {proj.name}
                </button>
              );
            })}
          </div>

          {/* Active Project Exhibition Card */}
          <div className="p-5 sm:p-6 rounded-2xl border border-[#E8E2D8]/15 bg-[#1C1512]/80 backdrop-blur-md shadow-xl transition-all">
            {/* Card Header & Visual Sync Badge */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full uppercase border border-[#BA5227]/30 bg-[#BA5227]/10 text-[#E59368]">
                {activeProject.categoryLabel}
              </span>

              {activeProject.visualAnchor && (
                <span className="text-[10px] font-mono text-[#D4AF37] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                  <span>Display: {activeProject.visualAnchor.label}</span>
                </span>
              )}
            </div>

            {/* Title & Tagline */}
            <h3 className="text-xl sm:text-2xl font-heading font-bold text-[#FAF8F5] mb-1">
              {activeProject.name}
            </h3>
            <p className="text-xs font-mono text-[#E59368] mb-3">
              {activeProject.tagline}
            </p>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#D6CEC2] font-body leading-relaxed mb-4">
              {activeProject.description}
            </p>

            {/* Tech Stack Chips */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {activeProject.technologies.slice(0, 5).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 rounded-md text-[10px] font-mono border border-[#E8E2D8]/10 bg-[#2A201A]/60 text-[#FAF8F5]"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-3 border-t border-[#E8E2D8]/10">
              <button
                onClick={() => setModalProject(activeProject)}
                className="px-4 py-2 rounded-lg text-xs font-mono font-medium bg-[#BA5227] text-[#FAF8F5] hover:bg-[#CF6234] transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>Inspect Architecture</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {activeProject.links.github && (
                <a
                  href={activeProject.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg text-xs font-mono border border-[#E8E2D8]/20 bg-[#2A201A]/40 text-[#D6CEC2] hover:text-[#FAF8F5] hover:border-[#BA5227]/40 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Repository</span>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={modalProject}
        isOpen={Boolean(modalProject)}
        onClose={() => setModalProject(null)}
      />
    </>
  );
}
