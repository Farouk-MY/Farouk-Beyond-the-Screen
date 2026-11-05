'use client';

import React, { useEffect, useRef } from 'react';
import type { TranslationDictionary } from '@/config/translations/types';
import { useTranslation } from '@/context/LocaleContext';
import { useSmoothScroll } from '@/components/providers/SmoothScrollProvider';
import { useAudio } from '@/context/AudioContext';

type ProjectModalItem = TranslationDictionary['projects']['items'][number];

interface ProjectDetailModalProps {
  project: ProjectModalItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectDetailModal({ project, isOpen, onClose }: ProjectDetailModalProps) {
  const { t, isRtl } = useTranslation();
  const { playClick } = useAudio();
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

  const handleClose = () => {
    playClick('light');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-[#0E0C0A]/90 backdrop-blur-xl pointer-events-auto select-none"
      onClick={handleClose}
    >
      <div
        ref={modalContentRef}
        className={`relative w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-3xl border border-[#D4AF37]/30 bg-[#140F0C] p-6 sm:p-8 text-[#FAF8F5] shadow-2xl ${
          isRtl ? 'text-right' : 'text-left'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className={`flex items-start justify-between gap-4 mb-5 border-b border-[#E8E2D8]/10 pb-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div>
            <div className={`flex items-center gap-2 mb-1.5 ${isRtl ? 'flex-row-reverse justify-end' : ''}`}>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full uppercase border border-[#BA5227]/30 bg-[#BA5227]/10 text-[#E59368] font-bold">
                {project.categoryLabel}
              </span>
              <span className="text-[10px] font-mono text-[#D4AF37]">
                {t.common.status}: {project.status}
              </span>
            </div>
            <h2 id="modal-project-title" className="text-2xl sm:text-3xl font-heading font-extrabold text-[#FAF8F5]">
              {project.name}
            </h2>
            <p className="text-xs sm:text-sm text-[#E59368] font-mono mt-0.5 font-medium">
              {project.tagline}
            </p>
          </div>

          <button
            ref={closeButtonRef}
            onClick={handleClose}
            aria-label={t.common.close}
            className="rounded-full p-2 text-[#D6CEC2] hover:bg-white/10 hover:text-[#FAF8F5] transition-colors cursor-pointer border border-[#E8E2D8]/15 bg-[#1C1512] shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 1. Project Overview & Problem Statement */}
        <div className="mb-6 space-y-4">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#A89D8F] mb-1.5 font-bold">
              {t.common.projectDetails}
            </h3>
            <p className="text-sm text-[#D6CEC2] leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Problem & Solution Callout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl border border-red-500/20 bg-red-950/15">
              <h4 className="text-xs font-mono uppercase tracking-wider text-red-300 font-bold mb-1">
                {isRtl ? 'التحدي الهندسي والاحتياج' : 'Engineering Challenge'}
              </h4>
              <p className="text-xs text-[#E8DCD4] leading-relaxed">
                {project.caseStudy.problem}
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-[#D4AF37]/25 bg-[#D4AF37]/10">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] font-bold mb-1">
                {isRtl ? 'الحل المعماري المقترح' : 'Architectural Solution'}
              </h4>
              <p className="text-xs text-[#E8DCD4] leading-relaxed">
                {project.caseStudy.solution}
              </p>
            </div>
          </div>
        </div>

        {/* 2. Developer Role & Engineering Contribution */}
        <div className="mb-6 p-4 rounded-2xl border border-[#BA5227]/30 bg-[#BA5227]/10">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#E59368] mb-1.5 font-bold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#BA5227]" />
            {isRtl ? 'دوري ومساهمتي الهندسية' : 'Developer Role & Contribution'}
          </h3>
          <p className="text-xs text-[#FAF8F5] leading-relaxed">
            {project.caseStudy.role}
          </p>
        </div>

        {/* 3. System Architecture Overview */}
        <div className="mb-6 p-4 rounded-2xl border border-[#E8E2D8]/10 bg-[#1A1411]">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] mb-2 flex items-center gap-2 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            {t.common.architectureOverview}
          </h3>
          <p className="text-xs text-[#D6CEC2] leading-relaxed mb-3">
            {project.architectureOverview}
          </p>
          <p className="text-xs text-[#A89D8F] leading-relaxed border-t border-[#E8E2D8]/10 pt-2.5">
            {project.caseStudy.architecture}
          </p>
        </div>

        {/* 4. Key Architectural Decisions */}
        {project.caseStudy.decisions && project.caseStudy.decisions.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#A89D8F] mb-3 font-bold">
              {isRtl ? 'القرارات المعمارية المفتاحية' : 'Key Architectural Decisions'}
            </h3>
            <div className="space-y-2.5">
              {project.caseStudy.decisions.map((dec, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-[#E8E2D8]/10 bg-[#16110E]">
                  <div className="text-xs font-mono font-bold text-[#D4AF37] mb-1">
                    {dec.title}
                  </div>
                  <div className="text-xs text-[#D6CEC2] leading-relaxed">
                    {dec.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Core Capabilities */}
        <div className="mb-6">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#A89D8F] mb-3 font-bold">
            {t.common.keyFeatures}
          </h3>
          <ul className="space-y-2">
            {project.keyFeatures.map((feat, idx) => (
              <li key={idx} className={`flex items-start gap-2.5 text-xs text-[#D6CEC2] ${isRtl ? 'flex-row-reverse' : ''}`}>
                <span className="text-[#BA5227] font-bold font-mono">0{idx + 1}.</span>
                <span className="flex-1">{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 6. Technologies Stack */}
        <div className="mb-6">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#A89D8F] mb-2 font-bold">
            {t.common.technologies}
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

        {/* 7. Links & Close */}
        <div className={`flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E8E2D8]/10 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div className="flex items-center gap-3">
            {project.links.github ? (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl text-xs font-mono border border-[#E8E2D8]/20 bg-[#1C1512] text-[#FAF8F5] hover:bg-white/10 transition-colors inline-flex items-center gap-1.5"
              >
                <span>{t.common.githubSource}</span>
                <span className={isRtl ? 'rtl-flip' : ''}>&rarr;</span>
              </a>
            ) : (
              <span className="text-[11px] font-mono text-[#A89D8F] italic">
                {t.common.privateRepoNotice}
              </span>
            )}

            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl text-xs font-mono bg-[#BA5227] text-[#FAF8F5] hover:bg-[#CF6234] transition-colors inline-flex items-center gap-1.5 font-bold"
              >
                <span>{t.common.liveDemo}</span>
                <span className="text-xs">↗</span>
              </a>
            )}
          </div>

          <button
            onClick={handleClose}
            className="px-5 py-2 rounded-xl text-xs font-mono border border-[#E8E2D8]/20 bg-[#1C1512] text-[#D6CEC2] hover:text-[#FAF8F5] transition-colors cursor-pointer"
          >
            {t.common.close}
          </button>
        </div>
      </div>
    </div>
  );
}
