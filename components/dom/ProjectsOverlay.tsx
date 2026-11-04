'use client';

import React, { useState } from 'react';
import { PROJECTS_DATA } from '@/config/portfolioData';
import type { ProjectItem } from '@/types/portfolio';
import { ProjectDetailModal } from './ProjectDetailModal';

export function ProjectsOverlay() {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(PROJECTS_DATA[0].id);
  const [modalProject, setModalProject] = useState<ProjectItem | null>(null);

  const activeProject =
    PROJECTS_DATA.find((p) => p.id === selectedProjectId) || PROJECTS_DATA[0];

  return (
    <>
      <section
        id="act-3-work"
        aria-label="Act III — The Work: Digital Project Gallery"
        className="relative min-h-[175vh] flex flex-col justify-center p-6 sm:p-12 lg:p-16 pointer-events-none"
      >
        {/* Left-aligned container allowing the exhibition screen & Farouk to remain visible on the right */}
        <div className="max-w-2xl lg:max-w-3xl mr-auto pointer-events-auto">
          {/* Act Badging */}
          <div className="flex items-center gap-2.5 mb-4 justify-start">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono border border-[#FF9F43]/30 bg-[#FF9F43]/10 text-[#FF9F43] shadow-[0_0_12px_#FF9F4320]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF9F43]" />
              ACT III — THE WORK
            </span>
            <span className="text-[11px] font-mono tracking-widest text-[#8E9CAE] uppercase">
              Digital Project Gallery
            </span>
          </div>

          {/* Title & Description */}
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F3F6FA] text-left mb-3">
            Selected Works
          </h2>
          <p className="text-sm sm:text-base text-[#8E9CAE] leading-relaxed text-left mb-6 max-w-xl mr-auto">
            Production implementations and software architectures spanning dynamic web platforms, healthcare systems,
            and cross-platform mobile apps.
          </p>

          {/* Project Selector Tabs */}
          <div
            role="tablist"
            aria-label="Exhibition Pedestal Selector"
            className="flex flex-wrap items-center justify-start gap-1.5 p-1 rounded-xl border border-[#1C222D] bg-[#11141A]/90 backdrop-blur-md mb-6 mr-auto w-fit max-w-full"
            onKeyDown={(e) => {
              const currentIndex = PROJECTS_DATA.findIndex((p) => p.id === selectedProjectId);
              if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % PROJECTS_DATA.length;
                setSelectedProjectId(PROJECTS_DATA[nextIndex].id);
              } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                const prevIndex = (currentIndex - 1 + PROJECTS_DATA.length) % PROJECTS_DATA.length;
                setSelectedProjectId(PROJECTS_DATA[prevIndex].id);
              }
            }}
          >
            {PROJECTS_DATA.map((proj, idx) => {
              const isActive = proj.id === selectedProjectId;
              return (
                <button
                  key={proj.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelectedProjectId(proj.id)}
                  className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#FF9F43]/15 text-[#FF9F43] border border-[#FF9F43]/40 shadow-[0_0_12px_#FF9F4322]'
                      : 'text-[#8E9CAE] hover:text-[#F3F6FA] border border-transparent'
                  }`}
                >
                  0{idx + 1} / {proj.name}
                </button>
              );
            })}
          </div>

          {/* Active Project Exhibition Card */}
          <div className="p-6 sm:p-8 rounded-2xl border border-[#1C222D] bg-[#0E1117]/90 backdrop-blur-md shadow-2xl transition-all">
            {/* Card Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full uppercase border border-[#00F2FE]/40 bg-[#00F2FE]/10 text-[#00F2FE]">
                  {activeProject.categoryLabel}
                </span>
                <span className="text-[10px] font-mono text-[#8E9CAE]">
                  Status: {activeProject.status}
                </span>
              </div>
              <span className="text-xs font-mono text-[#FF9F43] font-bold">
                Pedestal 0{PROJECTS_DATA.findIndex((p) => p.id === activeProject.id) + 1}
              </span>
            </div>

            {/* Project Name & Tagline */}
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F3F6FA] mb-1">
              {activeProject.name}
            </h3>
            <p className="text-xs sm:text-sm font-mono text-[#00F2FE] mb-4">
              {activeProject.tagline}
            </p>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#8E9CAE] leading-relaxed mb-6">
              {activeProject.description}
            </p>

            {/* Architecture Metrics Grid */}
            {activeProject.metrics && (
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl border border-[#1C222D] bg-[#11141A]/70 mb-6 text-center">
                {activeProject.metrics.map((m, idx) => (
                  <div key={idx}>
                    <span className="block text-[10px] font-mono text-[#8E9CAE] uppercase">
                      {m.label}
                    </span>
                    <span className="block text-xs font-mono font-bold text-[#F3F6FA] mt-0.5">
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {activeProject.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-md text-[11px] font-mono border border-[#1C222D] bg-[#11141A] text-[#D1D9E6]"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#1C222D]">
              <button
                onClick={() => setModalProject(activeProject)}
                className="px-4 py-2 rounded-lg text-xs font-mono font-semibold tracking-wider bg-[#FF9F43] text-[#07080B] hover:bg-[#FFB76B] transition-all cursor-pointer inline-flex items-center gap-1.5"
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
                  className="px-3.5 py-2 rounded-lg text-xs font-mono border border-[#1C222D] bg-[#11141A] text-[#8E9CAE] hover:text-[#00F2FE] hover:border-[#00F2FE]/40 transition-colors inline-flex items-center gap-1.5"
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

