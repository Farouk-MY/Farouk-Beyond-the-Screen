'use client';

import React from 'react';
import { useTranslation } from '@/context/LocaleContext';
import { useAudio } from '@/context/AudioContext';

interface HeroOverlayProps {
  opacity: number;
  onExploreWork: () => void;
  onContactClick: () => void;
}

export function HeroOverlay({ opacity, onExploreWork, onContactClick }: HeroOverlayProps) {
  const { t, isRtl, locale } = useTranslation();
  const { playClick, playFeedback } = useAudio();
  const isVisible = opacity > 0.01;

  const handleExplore = () => {
    playClick('light');
    onExploreWork();
  };

  const handleContact = () => {
    playClick('light');
    onContactClick();
  };

  const handleDownloadCv = () => {
    playFeedback();
  };

  return (
    <section
      id="scene-studio"
      aria-label="Studio: Architectural Workspace"
      className={`absolute inset-0 flex flex-col justify-between p-4 sm:p-8 lg:p-12 pt-18 sm:pt-20 lg:pt-22 pb-4 sm:pb-5 pointer-events-none transition-opacity duration-200 ease-out select-none ${
        isVisible ? 'visible' : 'invisible'
      }`}
      style={{ opacity }}
    >
      {/* Editorial Content — Positioned in the clean upper negative space */}
      <div className="max-w-[88vw] sm:max-w-lg lg:max-w-xl pointer-events-auto">
        {/* Availability Pill & Section Label */}
        <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono tracking-wider border border-[#BA5227]/40 bg-[#15100E]/85 backdrop-blur-md text-[#E59368] shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#BA5227] animate-pulse" />
            {t.hero.eyebrow}
          </span>
          <span className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-[#D4C9BC] drop-shadow-sm">
            {t.hero.subEyebrow}
          </span>
        </div>

        {/* Developer Name & Core Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight leading-[1.08] mb-1.5 text-[#FAF8F5] drop-shadow-sm">
          {t.hero.name}
        </h1>

        <p className="text-sm sm:text-base lg:text-lg font-body font-medium tracking-tight mb-2.5 sm:mb-3 text-[#E59368] drop-shadow-sm">
          {t.hero.role}
        </p>

        {/* Concise Editorial Statement */}
        <p className="text-xs sm:text-[13px] font-body leading-relaxed mb-4 sm:mb-4.5 max-w-md sm:max-w-lg text-[#D6CEC2] drop-shadow-sm">
          {t.hero.bioIntro}
        </p>

        {/* Primary Actions: Explore, Contact, and Download CV */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-4 sm:mb-5">
          <button
            onClick={handleExplore}
            className="px-4 sm:px-5 py-2 rounded-full text-xs font-mono font-semibold tracking-wider transition-all duration-200 cursor-pointer bg-[#BA5227] text-[#FAF8F5] hover:bg-[#CF6234] hover:shadow-lg hover:shadow-[#BA5227]/25 inline-flex items-center gap-1.5 active:scale-95 shadow-sm"
          >
            <span>{t.common.exploreWork}</span>
            <span className={isRtl ? 'rtl-flip' : ''}>&rarr;</span>
          </button>

          <button
            onClick={handleContact}
            className="px-3.5 sm:px-4 py-2 rounded-full text-xs font-mono font-medium tracking-wider transition-all duration-200 cursor-pointer border border-[#E8E2D8]/20 bg-[#15100E]/80 text-[#FAF8F5] hover:bg-[#1C1512] hover:border-[#D4AF37]/50 backdrop-blur-md active:scale-95 shadow-sm inline-flex items-center gap-1.5"
          >
            <span>{t.common.getInTouch}</span>
            <span className="text-xs">↗</span>
          </button>

          {/* Localized CV PDF Download Button */}
          <a
            href={`/cv/farouk-messai-cv-${locale}.pdf`}
            download={`farouk-messai-cv-${locale}.pdf`}
            onClick={handleDownloadCv}
            className="px-4 sm:px-5 py-2.5 rounded-full text-xs font-mono font-medium tracking-wider transition-all duration-200 cursor-pointer border border-[#D4AF37]/35 bg-[#1A1411]/85 text-[#D4AF37] hover:text-[#FAF8F5] hover:border-[#D4AF37] hover:bg-[#2A1F18] backdrop-blur-md active:scale-95 shadow-sm inline-flex items-center gap-1.5"
            title={`${t.common.downloadCv} (PDF)`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>{t.common.downloadCv}</span>
          </a>
        </div>

        {/* Architectural Focus Badges */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px] font-mono text-[#D4C9BC] max-w-md sm:max-w-lg pt-4 border-t border-[#E8E2D8]/15">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[#E8E2D8]/10 bg-[#15100E]/70 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#BA5227]" />
            {t.hero.pillMobileWeb}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[#E8E2D8]/10 bg-[#15100E]/70 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            {t.hero.pillCleanArch}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[#E8E2D8]/10 bg-[#15100E]/70 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E59368]" />
            {t.hero.pillCinematic}
          </span>
        </div>
      </div>

      {/* Subtle Scroll Prompt */}
      <div className="pb-4 sm:pb-6 flex items-center gap-3 text-[11px] font-mono text-[#D4C9BC] pointer-events-none select-none">
        <div className="w-4 h-7 rounded-full flex items-start justify-center p-1 border border-[#E8E2D8]/25 bg-[#15100E]/60 backdrop-blur-md shadow-sm">
          <div className="w-1 h-2 rounded-full bg-[#BA5227] animate-bounce" />
        </div>
        <span className="tracking-wider uppercase text-[10px] text-[#A89D8F]">
          {t.common.scrollHint}
        </span>
      </div>
    </section>
  );
}
