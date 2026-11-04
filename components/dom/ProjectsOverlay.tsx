'use client';

import React, { useState } from 'react';
import { PROJECTS_DATA } from '@/config/portfolioData';
import type { ProjectItem } from '@/types/portfolio';
import { ProjectDetailModal } from './ProjectDetailModal';
import { ProjectGalleryModal } from './ProjectGalleryModal';

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
  const [detailModalProject, setDetailModalProject] = useState<ProjectItem | null>(null);
  const [galleryModalProject, setGalleryModalProject] = useState<ProjectItem | null>(null);
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
        id="scene-work"
        aria-label="Selected Work: Digital Project Gallery"
        className={`absolute inset-0 flex flex-col justify-center px-4 sm:px-10 lg:px-14 pt-16 sm:pt-20 pointer-events-none transition-opacity duration-200 ease-out ${
          isVisible ? 'visible' : 'invisible'
        }`}
        style={{ opacity }}
      >
        {/* Left safe-area panel: Constrained to ~44% max width so exhibition display & Farouk stay visible on right */}
        <div className="w-full max-w-lg lg:max-w-xl mr-auto pointer-events-auto">
          {/* Editorial Section Label */}
          <div className="flex items-center gap-2.5 mb-2 sm:mb-3">
            <span className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono tracking-wider border border-[#BA5227]/30 bg-[#BA5227]/10 text-[#E59368]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#BA5227]" />
              SELECTED WORK
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[#D4C9BC] uppercase">
              Project Showcase
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold tracking-tight text-[#FAF8F5] mb-1 sm:mb-2">
            Selected Work
          </h2>
          <p className="text-[11px] sm:text-xs text-[#D6CEC2] font-body leading-relaxed mb-3 sm:mb-4 line-clamp-2">
            Production systems and architectures spanning cross-platform mobile systems, responsive web platforms, and interactive 3D commerce.
          </p>

          {/* Main Photo-First Exhibition Card */}
          <div className="rounded-2xl border border-[#E8E2D8]/15 bg-[#15100E]/85 backdrop-blur-xl shadow-2xl p-4 sm:p-5 transition-all">
            {/* Visual Anchor Scene Indicator */}
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase border border-[#E8E2D8]/15 bg-[#1C1512] text-[#D6CEC2]">
                {activeProject.categoryLabel}
              </span>

              {activeProject.visualAnchor && (
                <span className="text-[10px] font-mono text-[#D4AF37] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                  <span>Display: {activeProject.visualAnchor.label}</span>
                </span>
              )}
            </div>

            {/* Large Interactive Project Cover Preview (Photo-First) */}
            <div
              onClick={() => setGalleryModalProject(activeProject)}
              role="button"
              tabIndex={0}
              aria-label={`Open ${activeProject.name} image gallery`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setGalleryModalProject(activeProject);
                }
              }}
              className="group relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-[#0E0C0A] border border-[#E8E2D8]/15 mb-3 cursor-pointer select-none"
            >
              {activeProject.coverImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={activeProject.coverImage.src}
                  alt={activeProject.coverImage.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}

              {/* Hover Badge / Action Prompt */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E0C0A]/80 via-transparent to-transparent opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                <span className="text-[11px] font-mono font-semibold text-[#FAF8F5] inline-flex items-center gap-1.5 bg-[#1C1512]/90 px-2.5 py-1 rounded-md border border-[#E8E2D8]/20 backdrop-blur-sm">
                  <span>Explore Gallery</span>
                  <svg className="w-3 h-3 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
                <span className="text-[10px] font-mono text-[#FAF8F5]/70 bg-black/50 px-2 py-0.5 rounded">
                  {activeProject.galleryImages ? `${activeProject.galleryImages.length} Slides` : '1 View'}
                </span>
              </div>
            </div>

            {/* Title & Tagline */}
            <div className="mb-2">
              <h3 className="text-lg sm:text-xl font-heading font-bold text-[#FAF8F5] leading-tight">
                {activeProject.name}
              </h3>
              <p className="text-xs font-mono text-[#E59368] mt-0.5">
                {activeProject.tagline}
              </p>
            </div>

            {/* Concise Summary */}
            <p className="text-xs text-[#D6CEC2] font-body leading-relaxed mb-3 line-clamp-2">
              {activeProject.description}
            </p>

            {/* Horizontal Project Thumbnail Rail */}
            <div className="mb-3 pt-2.5 border-t border-[#E8E2D8]/10">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono tracking-wider text-[#A89D8F] uppercase">
                  Project Gallery Rail ({projectsList.length})
                </span>
                <span className="text-[10px] font-mono text-[#D4AF37]">
                  Click to switch scene
                </span>
              </div>

              <div
                role="tablist"
                aria-label="Project Thumbnails"
                className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none"
              >
                {projectsList.map((proj, idx) => {
                  const isActive = proj.id === selectedProjectId;
                  return (
                    <button
                      key={proj.id}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => onSelectProject(proj.id)}
                      className={`group relative flex-shrink-0 w-20 sm:w-24 aspect-[16/10] rounded-lg overflow-hidden border transition-all cursor-pointer ${
                        isActive
                          ? 'border-[#BA5227] ring-2 ring-[#BA5227]/40 scale-105'
                          : 'border-[#E8E2D8]/15 opacity-60 hover:opacity-100 hover:border-[#E8E2D8]/40'
                      }`}
                      title={proj.name}
                    >
                      {proj.coverImage && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={proj.coverImage.src}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors flex items-end p-1">
                        <span className="text-[8px] font-mono font-bold text-[#FAF8F5] truncate">
                          0{idx + 1}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-[#E8E2D8]/10">
              <button
                onClick={() => setGalleryModalProject(activeProject)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold bg-[#BA5227] text-[#FAF8F5] hover:bg-[#CF6234] transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
              >
                <span>Explore Gallery</span>
                <svg className="w-3.5 h-3.5 text-[#FAF8F5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>

              <button
                onClick={() => setDetailModalProject(activeProject)}
                className="px-3 py-1.5 rounded-lg text-xs font-mono border border-[#E8E2D8]/20 bg-[#1C1512] text-[#D6CEC2] hover:text-[#FAF8F5] hover:border-[#BA5227]/50 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Architecture</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={detailModalProject}
        isOpen={Boolean(detailModalProject)}
        onClose={() => setDetailModalProject(null)}
      />

      {/* Photo-First Project Gallery Lightbox */}
      <ProjectGalleryModal
        project={galleryModalProject}
        isOpen={Boolean(galleryModalProject)}
        onClose={() => setGalleryModalProject(null)}
      />
    </>
  );
}
