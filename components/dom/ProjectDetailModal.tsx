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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#07080B]/85 backdrop-blur-md pointer-events-auto"
      onClick={onClose}
    >
      <div
        ref={modalContentRef}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-[#1C222D] bg-[#0E1117] p-6 sm:p-8 text-[#F3F6FA] shadow-[0_25px_60px_rgba(0,0,0,0.85)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 mb-4 border-b border-[#1C222D] pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full uppercase border border-[#00F2FE]/40 bg-[#00F2FE]/10 text-[#00F2FE]">
                {project.categoryLabel}
              </span>
              <span className="text-[10px] font-mono text-[#8E9CAE]">
                Status: {project.status}
              </span>
            </div>
            <h2 id="modal-project-title" className="text-2xl sm:text-3xl font-extrabold text-[#F3F6FA]">
              {project.name}
            </h2>
            <p className="text-xs sm:text-sm text-[#00F2FE] font-mono mt-0.5">
              {project.tagline}
            </p>
          </div>

          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close project modal"
            className="p-1.5 rounded-lg border border-[#1C222D] bg-[#11141A] text-[#8E9CAE] hover:text-[#F3F6FA] hover:border-[#00F2FE]/50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#00F2FE]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Project Description */}
        <div className="mb-6">
          <h3 className="text-xs font-mono font-semibold tracking-wider text-[#8E9CAE] uppercase mb-2">
            Overview
          </h3>
          <p className="text-xs sm:text-sm text-[#D1D9E6] leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Architecture Overview */}
        <div className="mb-6 p-4 rounded-xl border border-[#1C222D] bg-[#11141A]/70">
          <h3 className="text-xs font-mono font-semibold tracking-wider text-[#FF9F43] uppercase mb-1.5">
            Architectural Engineering
          </h3>
          <p className="text-xs sm:text-sm text-[#8E9CAE] leading-relaxed">
            {project.architectureOverview}
          </p>
        </div>

        {/* Key Features List */}
        <div className="mb-6">
          <h3 className="text-xs font-mono font-semibold tracking-wider text-[#8E9CAE] uppercase mb-2.5">
            Core Technical Features
          </h3>
          <ul className="space-y-2">
            {project.keyFeatures.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#D1D9E6]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F2FE] mt-1.5 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Technologies Stack */}
        <div className="mb-6">
          <h3 className="text-xs font-mono font-semibold tracking-wider text-[#8E9CAE] uppercase mb-2.5">
            Technology Stack
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-md text-xs font-mono border border-[#1C222D] bg-[#11141A] text-[#F3F6FA]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Action Links & Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#1C222D]">
          <div className="text-[11px] font-mono text-[#8E9CAE]">
            {project.links.github ? (
              <span>Source available on verified repository</span>
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
                className="px-4 py-2 rounded-lg text-xs font-mono font-semibold bg-[#00F2FE] text-[#07080B] hover:bg-[#38F9D7] transition-colors inline-flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#00F2FE]"
              >
                <span>GitHub Repository</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-mono border border-[#1C222D] bg-[#11141A] text-[#8E9CAE] hover:text-[#F3F6FA] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#00F2FE]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
