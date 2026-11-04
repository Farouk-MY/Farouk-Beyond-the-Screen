'use client';

import React, { useEffect, useRef } from 'react';
import type { ProjectItem } from '@/types/portfolio';

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectDetailModal({ project, isOpen, onClose }: ProjectDetailModalProps) {
  const modalContentRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close on Escape key & Lock background scroll & Manage focus
  useEffect(() => {
    if (!isOpen) return;

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
      prevActiveElement?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0E0C0A]/85 backdrop-blur-md pointer-events-auto"
      onClick={onClose}
    >
      <div
        ref={modalContentRef}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border border-[#E8E2D8]/20 bg-[#1C1512] p-6 sm:p-8 text-[#FAF8F5] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 mb-4 border-b border-[#E8E2D8]/10 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full uppercase border border-[#BA5227]/30 bg-[#BA5227]/10 text-[#E59368]">
                {project.categoryLabel}
              </span>
              <span className="text-[10px] font-mono text-[#A89D8F]">
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
            className="p-1.5 rounded-lg border border-[#E8E2D8]/20 bg-[#2A201A]/60 text-[#A89D8F] hover:text-[#FAF8F5] hover:border-[#BA5227]/50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#BA5227]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Project Description */}
        <div className="mb-5">
          <h3 className="text-xs font-mono font-semibold tracking-wider text-[#A89D8F] uppercase mb-1.5">
            Architecture Overview
          </h3>
          <p className="text-xs sm:text-sm text-[#D6CEC2] font-body leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Architectural Details */}
        <div className="mb-5 p-4 rounded-xl border border-[#E8E2D8]/10 bg-[#2A201A]/40">
          <h3 className="text-xs font-mono font-semibold tracking-wider text-[#D4AF37] uppercase mb-1.5">
            System Architecture
          </h3>
          <p className="text-xs sm:text-sm text-[#D6CEC2] font-body leading-relaxed">
            {project.architectureOverview}
          </p>
        </div>

        {/* Key Features List */}
        <div className="mb-5">
          <h3 className="text-xs font-mono font-semibold tracking-wider text-[#A89D8F] uppercase mb-2">
            Key Technical Implementations
          </h3>
          <ul className="space-y-2">
            {project.keyFeatures.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#D6CEC2] font-body">
                <span className="w-1.5 h-1.5 rounded-full bg-[#BA5227] mt-1.5 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Technologies Stack */}
        <div className="mb-6">
          <h3 className="text-xs font-mono font-semibold tracking-wider text-[#A89D8F] uppercase mb-2">
            Technologies Used
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-md text-xs font-mono border border-[#E8E2D8]/10 bg-[#2A201A]/50 text-[#FAF8F5]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Action Links & Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E8E2D8]/10">
          <div className="text-[11px] font-mono text-[#A89D8F]">
            {project.links.github ? (
              <span>Source available on verified GitHub profile</span>
            ) : (
              <span>Internal Architecture Baseline / Production Prototype</span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg text-xs font-mono font-semibold bg-[#BA5227] text-[#FAF8F5] hover:bg-[#CF6234] transition-colors inline-flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#BA5227]"
              >
                <span>GitHub Profile</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-mono border border-[#E8E2D8]/20 bg-[#2A201A]/50 text-[#A89D8F] hover:text-[#FAF8F5] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#BA5227]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
