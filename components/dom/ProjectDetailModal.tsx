'use client';

import React, { useEffect, useRef } from 'react';
import type { ProjectItem } from '@/types/portfolio';
import { useSmoothScroll } from '@/components/providers/SmoothScrollProvider';

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectDetailModal({ project, isOpen, onClose }: ProjectDetailModalProps) {
  const modalContentRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { getLenis } = useSmoothScroll();

  // Close on Escape key & Lock background scroll & Manage focus
  useEffect(() => {
    if (!isOpen) return;

    const lenis = getLenis();
    if (lenis) lenis.stop();

    // Focus close button on open
    const prevActiveElement = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    // Prevent background scroll while modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Trap focus inside modal
      if (e.key === 'Tab' && modalContentRef.current) {
        const focusableElements = modalContentRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      if (lenis) lenis.start();
      prevActiveElement?.focus();
    };
  }, [isOpen, onClose, getLenis]);

  if (!isOpen || !project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-[#0E0C0A]/90 backdrop-blur-xl pointer-events-auto select-none"
      onClick={onClose}
    >
      <div
        ref={modalContentRef}
        className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-3xl border border-[#D4AF37]/25 bg-[#17110E] p-6 sm:p-8 text-[#FAF8F5] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 mb-4 border-b border-[#E8E2D8]/10 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full uppercase border border-[#BA5227]/30 bg-[#BA5227]/10 text-[#E59368] font-bold">
                {project.categoryLabel}
              </span>
              <span className="text-[10px] font-mono text-[#D4AF37]">
                Status: {project.status}
              </span>
            </div>
            <h2 id="modal-project-title" className="text-2xl sm:text-3xl font-heading font-bold text-[#FAF8F5]">
              {project.name}
            </h2>
            <p className="text-xs sm:text-sm text-[#E59368] font-mono mt-0.5">
              {project.tagline}
            </p>
          </div>

          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close project modal"
            className="rounded-full p-2 text-[#D6CEC2] hover:bg-white/10 hover:text-[#FAF8F5] transition-colors cursor-pointer border border-[#E8E2D8]/15 bg-[#1C1512]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#A89D8F] mb-2">
            Overview
          </h3>
          <p className="text-sm text-[#D6CEC2] leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Architecture & Implementation Overview */}
        <div className="mb-6 p-4 rounded-2xl border border-[#E8E2D8]/10 bg-[#140F0C]">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            Architecture Overview
          </h3>
          <p className="text-xs text-[#D6CEC2] leading-relaxed">
            {project.architectureOverview}
          </p>
        </div>

        {/* Key Features */}
        <div className="mb-6">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#A89D8F] mb-3">
            Core Technical Highlights
          </h3>
          <ul className="space-y-2">
            {project.keyFeatures.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-[#D6CEC2]">
                <span className="text-[#BA5227] mt-0.5 font-bold font-mono">0{idx + 1}.</span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Technologies Stack */}
        <div className="mb-6">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#A89D8F] mb-2">
            Technologies &amp; Architecture
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-md text-xs font-mono border border-[#E8E2D8]/10 bg-[#1C1512] text-[#FAF8F5]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Verified Metrics (if any) */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="mb-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {project.metrics.map((m, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-[#E8E2D8]/10 bg-[#140F0C] text-center"
              >
                <div className="text-base font-mono font-bold text-[#E59368]">{m.value}</div>
                <div className="text-[10px] font-mono text-[#A89D8F] uppercase mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Links & Close */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E8E2D8]/10">
          <div className="flex items-center gap-3">
            {project.links.github ? (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl text-xs font-mono border border-[#E8E2D8]/20 bg-[#1C1512] text-[#FAF8F5] hover:bg-white/10 transition-colors inline-flex items-center gap-1.5"
              >
                <span>GitHub Source</span>
                <span>&rarr;</span>
              </a>
            ) : (
              <span className="text-[11px] font-mono text-[#A89D8F] italic">
                Closed-source or private client architecture
              </span>
            )}

            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl text-xs font-mono bg-[#BA5227] text-[#FAF8F5] hover:bg-[#CF6234] transition-colors inline-flex items-center gap-1.5 font-bold"
              >
                <span>Live Deployment</span>
                <span>&rarr;</span>
              </a>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-mono border border-[#E8E2D8]/20 bg-[#1C1512] text-[#D6CEC2] hover:text-[#FAF8F5] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
