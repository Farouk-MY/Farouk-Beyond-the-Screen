'use client';

import React, { useState, useRef, useMemo } from 'react';
import { PROJECTS_DATA } from '@/config/portfolioData';
import type { ProjectItem } from '@/types/portfolio';
import { ProjectDetailModal } from './ProjectDetailModal';
import { ProjectGalleryModal } from './ProjectGalleryModal';
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
        className={`fixed inset-0 z-20 flex flex-col justify-start items-start p-4 sm:p-8 lg:p-12 xl:p-16 pt-24 sm:pt-28 pb-6 pointer-events-none transition-opacity duration-300 ease-out select-none ${
          isVisible ? 'visible' : 'invisible'
        }`}
        style={{
          opacity: stageOpacity,
          transform: `scale(${stageScale.toFixed(3)})`,
          transition: 'transform 0.25s ease-out, opacity 0.25s ease-out',
        }}
      >
        {/* --- LEFT-SIDE EDITORIAL EXHIBITION COLUMN (Keeps Farouk on the right completely visible!) --- */}
        <div
          className="w-full max-w-lg lg:max-w-xl xl:max-w-[580px] flex flex-col gap-3 sm:gap-4 pointer-events-auto"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* 1. Header Bar: Section Pill, Subtitle & Project Step Counter */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono tracking-widest border border-[#D4AF37]/40 bg-[#15100E]/80 backdrop-blur-md text-[#E59368] shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#BA5227] animate-pulse" />
                03 / SELECTED WORK
              </span>
              <span className="hidden sm:inline-block text-[11px] font-mono tracking-wider text-[#D4C9BC] uppercase">
                Architectural Exhibition
              </span>
            </div>

            {/* Step Counter Capsule */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#15100E]/80 border border-[#E8E2D8]/15 backdrop-blur-md text-[11px] font-mono text-[#FAF8F5] shadow-sm">
              <span className="text-[#D4AF37] font-bold">
                {String(activeIndex + 1).padStart(2, '0')}
              </span>
              <span className="text-[#A89D8F]">/</span>
              <span className="text-[#A89D8F]">
                {String(projectCount).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* 2. Left-Side 3D Architectural Project Screen Frame */}
          <div
            className="relative w-full aspect-[16/10] rounded-2xl cursor-pointer overflow-hidden transition-all duration-300 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.85)] group"
            style={{
              perspective: '1000px',
              transformStyle: 'preserve-3d',
            }}
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
            {/* Physical Walnut Bezel + Bronze Trim Frame */}
            <div className="relative w-full h-full rounded-2xl bg-[#120D0B] border border-[#D4AF37]/35 p-2 sm:p-2.5 shadow-inner flex flex-col justify-between transition-transform duration-300 group-hover:scale-[1.01]">
              {/* Inner Obsidian Display Bed */}
              <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#0A0706] border border-[#E8E2D8]/10 flex items-center justify-center">
                {/* Active Project Cover Image (Object Contain ensures zero UI clipping) */}
                {activeProject.coverImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={activeProject.id}
                    src={activeProject.coverImage.src}
                    alt={activeProject.coverImage.alt}
                    className="w-full h-full object-contain select-none transition-opacity duration-300"
                  />
                )}

                {/* Anti-reflective Glass Gloss Layer */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.04] via-transparent to-white/[0.06] pointer-events-none" />

                {/* Subtle Inner Glass Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                {/* Architecture Spec Badge */}
                {activeProject.coverImage?.isPlaceholder && (
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[9px] font-mono tracking-wider bg-black/75 text-[#D4AF37] border border-[#D4AF37]/40 backdrop-blur-sm shadow-sm">
                    ARCHITECTURAL SPEC
                  </div>
                )}

                {/* Interactive Explore Gallery Pill */}
                <div className="absolute bottom-2.5 right-2.5 px-3 py-1 rounded-full bg-[#1C1512]/90 border border-[#D4AF37]/50 text-[10px] font-mono font-semibold text-[#FAF8F5] backdrop-blur-md flex items-center gap-1.5 shadow-lg group-hover:bg-[#BA5227] group-hover:border-[#FAF8F5] transition-all">
                  <span>Explore Gallery</span>
                  <span className="text-[#D4AF37] group-hover:text-white transition-colors">↗</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Refined Project Metadata & Spec Pedestal Card */}
          <div className="w-full rounded-2xl border border-[#D4AF37]/25 bg-[#140F0C]/90 backdrop-blur-xl p-3.5 sm:p-4.5 shadow-2xl">
            {/* Header: Category, Status, Title, Tagline & Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase border border-[#BA5227]/40 bg-[#BA5227]/10 text-[#E59368] font-bold">
                    {activeProject.categoryLabel}
                  </span>
                  <span className="text-[10px] font-mono text-[#D4AF37]">
                    {activeProject.status}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-heading font-bold text-[#FAF8F5] leading-tight truncate">
                  {activeProject.name}
                </h3>
                <p className="text-xs font-mono text-[#E59368] mt-0.5 truncate">
                  {activeProject.tagline}
                </p>
              </div>

              {/* Action Buttons: Gallery & Architecture Specs */}
              <div className="flex items-center gap-2 self-start sm:self-center flex-shrink-0">
                <button
                  onClick={() => setGalleryModalProject(activeProject)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold bg-[#BA5227] text-[#FAF8F5] hover:bg-[#CF6234] transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <span>Gallery</span>
                  <span className="text-[10px]">↗</span>
                </button>

                <button
                  onClick={() => setDetailModalProject(activeProject)}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono border border-[#E8E2D8]/20 bg-[#1C1512] text-[#D6CEC2] hover:text-[#FAF8F5] hover:border-[#D4AF37]/60 transition-colors inline-flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <span>Architecture</span>
                  <span className="text-[10px]">&rarr;</span>
                </button>
              </div>
            </div>

            {/* Concise Description */}
            <p className="text-xs text-[#D6CEC2] font-body leading-relaxed mb-2.5 line-clamp-2">
              {activeProject.description}
            </p>

            {/* Technology Badges & Interactive Step Dot Rail */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E8E2D8]/10">
              <div className="flex flex-wrap gap-1.5">
                {activeProject.technologies.slice(0, 5).map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded text-[10px] font-mono border border-[#E8E2D8]/10 bg-[#1C1512] text-[#FAF8F5]"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Interactive Step Dot Rail (Clicking jumps smoothly to project) */}
              {projectCount > 1 && (
                <div
                  className="flex items-center gap-1.5"
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
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
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
