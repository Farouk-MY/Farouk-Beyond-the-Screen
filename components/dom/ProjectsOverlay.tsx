'use client';

import React, { useState, useRef, useMemo } from 'react';
import { PROJECTS_DATA } from '@/config/portfolioData';
import type { ProjectItem } from '@/types/portfolio';
import { ProjectDetailModal } from './ProjectDetailModal';
import { ProjectGalleryModal } from './ProjectGalleryModal';
import { ProjectShowcaseGraphic } from './ProjectShowcaseGraphic';
import { getWorkPresentationState } from '@/config/cinematicTimeline';

interface ProjectsOverlayProps {
  opacity: number;
  selectedProjectId?: string;
  onSelectProject: (projectId: string) => void;
  globalProgress?: number;
}

export function ProjectsOverlay({
  opacity,
  onSelectProject,
  globalProgress = 0.5,
}: ProjectsOverlayProps) {
  const [detailModalProject, setDetailModalProject] = useState<ProjectItem | null>(null);
  const [galleryModalProject, setGalleryModalProject] = useState<ProjectItem | null>(null);

  const projects = PROJECTS_DATA;
  const projectCount = projects.length;

  // Derive continuous presentation state from global scroll progress
  const workState = useMemo(() => {
    return getWorkPresentationState(globalProgress, projectCount);
  }, [globalProgress, projectCount]);

  const activeIndex = Math.max(0, Math.min(projectCount - 1, workState.activeProjectIndex));
  const activeProject = projects[activeIndex] || projects[0];

  // Touch swipe support for mobile
  const touchStartXRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0 && activeIndex < projectCount - 1) {
        onSelectProject(projects[activeIndex + 1].id);
      } else if (deltaX > 0 && activeIndex > 0) {
        onSelectProject(projects[activeIndex - 1].id);
      }
    }
    touchStartXRef.current = null;
  };

  // Visibility and fade scaling derived from work timeline state
  const isVisible = opacity > 0.01 && workState.isInWork;
  const stageOpacity = opacity * workState.carouselOpacity;
  const stageScale = workState.carouselScale;

  return (
    <>
      <section
        id="scene-work"
        aria-label="Interactive Architectural Exhibition: Selected Work"
        className={`fixed inset-0 z-20 flex flex-col justify-center items-start p-4 sm:p-8 lg:p-12 xl:p-16 pt-20 sm:pt-24 pb-6 pointer-events-none transition-opacity duration-300 ease-out select-none ${
          isVisible ? 'visible' : 'invisible'
        }`}
        style={{
          opacity: stageOpacity,
          transform: `scale(${stageScale.toFixed(3)})`,
          transition: 'transform 0.25s ease-out, opacity 0.25s ease-out',
        }}
      >
        {/* --- UNIFIED ARCHITECTURAL EXHIBITION CONSOLE (Preserves Farouk and Wall Display on Right) --- */}
        <div
          className="w-full max-w-[480px] lg:max-w-[520px] xl:max-w-[550px] rounded-3xl bg-[#0D0A08]/85 backdrop-blur-2xl border border-[#D4AF37]/30 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.9)] p-4 sm:p-5 flex flex-col gap-3.5 pointer-events-auto transition-all duration-300"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* 1. Header Bar: Section Pill, Category & Project Step Counter */}
          <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#E8E2D8]/10">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono tracking-widest border border-[#D4AF37]/40 bg-[#1A1411]/80 text-[#E59368]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#BA5227] animate-pulse" />
                03 / WORK
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono text-[#D4AF37] uppercase tracking-wider font-semibold truncate">
                {activeProject.categoryLabel}
              </span>
            </div>

            {/* Step Counter Capsule */}
            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/60 border border-[#E8E2D8]/15 text-[11px] font-mono shadow-sm shrink-0">
              <span className="text-[#D4AF37] font-bold">
                {String(activeIndex + 1).padStart(2, '0')}
              </span>
              <span className="text-[#A89D8F]">/</span>
              <span className="text-[#A89D8F]">
                {String(projectCount).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* 2. Interactive High-Craft UI Showcase Viewport */}
          <div
            className="relative w-full aspect-[16/9] rounded-2xl cursor-pointer overflow-hidden bg-gradient-to-br from-[#1A1310] via-[#0D0A08] to-[#0A0706] border border-[#D4AF37]/35 shadow-inner group transition-transform duration-300 hover:scale-[1.01]"
            onClick={() => setGalleryModalProject(activeProject)}
            role="button"
            tabIndex={0}
            aria-label={`View ${activeProject.name} Gallery`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setGalleryModalProject(activeProject);
              }
            }}
          >
            {/* Real Project Interface Graphic Component */}
            <ProjectShowcaseGraphic projectId={activeProject.id} />

            {/* Anti-reflective Glass Gloss & Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.03] via-transparent to-white/[0.05] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

            {/* Floating Explore Gallery Pill */}
            <div className="absolute bottom-2.5 right-2.5 px-3 py-1 rounded-full bg-[#18120F]/90 border border-[#D4AF37]/50 text-[10px] font-mono font-semibold text-[#FAF8F5] backdrop-blur-md flex items-center gap-1.5 shadow-lg group-hover:bg-[#BA5227] group-hover:border-white transition-all">
              <span>View Gallery</span>
              <span className="text-[#D4AF37] group-hover:text-white transition-colors">↗</span>
            </div>

            {/* Status Chip */}
            <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[9px] font-mono tracking-wider bg-black/75 text-[#D4AF37] border border-[#D4AF37]/30 backdrop-blur-sm">
              {activeProject.status}
            </div>
          </div>

          {/* 3. Refined Project Metadata & Architectural Details */}
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-[#FAF8F5] leading-tight truncate">
                  {activeProject.name}
                </h3>
                <p className="text-xs font-mono text-[#E59368] mt-0.5 truncate font-medium">
                  {activeProject.tagline}
                </p>
              </div>

              {/* Action Buttons: Gallery & Architecture Specs */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setGalleryModalProject(activeProject)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold bg-[#BA5227] text-[#FAF8F5] hover:bg-[#CF6234] transition-all cursor-pointer inline-flex items-center gap-1 shadow-sm active:scale-95"
                >
                  <span>Gallery</span>
                  <span className="text-[10px]">↗</span>
                </button>

                <button
                  onClick={() => setDetailModalProject(activeProject)}
                  className="px-3 py-1.5 rounded-xl text-xs font-mono border border-[#E8E2D8]/20 bg-[#1A1411] text-[#D6CEC2] hover:text-[#FAF8F5] hover:border-[#D4AF37]/60 transition-colors inline-flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  <span>Specs</span>
                  <span className="text-[10px]">&rarr;</span>
                </button>
              </div>
            </div>

            {/* Concise Engineering Description */}
            <p className="text-xs text-[#D6CEC2] font-body leading-relaxed line-clamp-2">
              {activeProject.description}
            </p>

            {/* Technology Badges & Interactive Project Step Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E8E2D8]/10">
              <div className="flex flex-wrap gap-1.5">
                {activeProject.technologies.slice(0, 4).map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-md text-[10px] font-mono border border-[#E8E2D8]/15 bg-black/40 text-[#FAF8F5]"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Step Navigation Pill Rail */}
              {projectCount > 1 && (
                <div
                  className="flex items-center gap-1.5 p-1 rounded-full bg-black/50 border border-[#E8E2D8]/10"
                  role="tablist"
                  aria-label="Select Project Step"
                >
                  {projects.map((p, i) => {
                    const isCurrent = i === activeIndex;
                    return (
                      <button
                        key={p.id}
                        role="tab"
                        aria-selected={isCurrent}
                        onClick={() => onSelectProject(p.id)}
                        aria-label={`Jump to ${p.name}`}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          isCurrent
                            ? 'w-6 bg-[#D4AF37]'
                            : 'w-2 bg-[#E8E2D8]/20 hover:bg-[#E8E2D8]/50'
                        }`}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Deep Architecture Details Modal */}
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
