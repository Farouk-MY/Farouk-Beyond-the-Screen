'use client';

import React from 'react';
import { useLoading } from '@/hooks/useLoadingProgress';
import { useTranslation } from '@/context/LocaleContext';
import { LoadingProgress } from './LoadingProgress';

export function NarrativeLoader() {
  const { loadingState, progress, isComplete, skipLoading } = useLoading();
  const { t, isRtl } = useTranslation();

  // Completely remove from render tree once complete to guarantee zero click blocking
  if (isComplete) {
    return null;
  }

  const isRevealing = loadingState === 'REVEALING';

  return (
    <div
      id="narrative-loader"
      aria-label="Experience Preloader"
      className={`fixed inset-0 z-50 flex flex-col justify-between items-center p-6 sm:p-10 lg:p-14 bg-[#0E0C0A] text-[#FAF8F5] select-none transition-all duration-500 ease-out ${
        isRevealing
          ? 'opacity-0 scale-[1.03] blur-[2px] pointer-events-none'
          : 'opacity-100 scale-100 pointer-events-auto'
      }`}
    >
      {/* Background Architectural Ambient Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#241712]/35 via-[#0E0C0A]/90 to-[#0E0C0A] pointer-events-none" />

      {/* Accessible Status Announcement Region */}
      <div role="status" aria-live="polite" className="sr-only">
        {t.common.loadingExperience}: {progress}%
      </div>

      {/* --- TOP BAR: Scene Classification & Skip Action --- */}
      <div className="relative z-10 w-full flex items-center justify-between text-[10px] sm:text-[11px] font-mono tracking-widest text-[#A89D8F]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#BA5227] animate-pulse" />
          <span className="text-[#D4AF37] uppercase">ACT 01 / 05</span>
          <span className="text-white/20">•</span>
          <span className="uppercase text-[#FAF8F5]/80">THE STUDIO</span>
        </div>

        <button
          onClick={skipLoading}
          className="px-3 py-1 rounded-full border border-white/10 hover:border-[#D4AF37]/50 text-[#A89D8F] hover:text-[#FAF8F5] hover:bg-white/[0.04] transition-all cursor-pointer font-mono text-[10px] uppercase tracking-wider flex items-center gap-1 active:scale-95"
          title={t.common.skipIntro}
          aria-label={t.common.skipIntro}
        >
          <span>{t.common.skipIntro}</span>
          <span className={isRtl ? 'rtl-flip' : ''}>↗</span>
        </button>
      </div>

      {/* --- CENTERPIECE: FM Monogram, Editorial Identity & Real-time Progress --- */}
      <div className="relative z-10 flex flex-col items-center text-center gap-6 max-w-lg my-auto">
        {/* Custom FM Monogram Vector Medallion with Bronze Glow */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#1A120E] border border-[#D4AF37]/45 p-3.5 shadow-[0_0_35px_rgba(212,175,55,0.18)] flex items-center justify-center transition-transform duration-300">
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <rect x="12" y="12" width="7" height="40" rx="1.5" fill="#FAF8F5" />
            <path
              d="M12 13.5C12 12.6716 12.6716 12 13.5 12H50.5C51.3284 12 52 12.6716 52 13.5V18.5C52 19.3284 51.3284 20 50.5 20H13.5C12.6716 20 12 19.3284 12 18.5V13.5Z"
              fill="#FAF8F5"
            />
            <rect x="12" y="28" width="18" height="6" rx="1.2" fill="#BA5227" />
            <path
              d="M30 19L36.5 36.5C36.8 37.3 37.9 37.3 38.2 36.5L44.5 19H50.5L40.2 46C39.5 47.8 36.9 47.8 36.2 46L27 21.5L30 19Z"
              fill="#FAF8F5"
            />
            <rect x="45" y="19" width="7" height="33" rx="1.5" fill="#FAF8F5" />
            <circle cx="37.5" cy="28" r="2.2" fill="#D4AF37" />
          </svg>

          {/* Concentric subtle decorative ring */}
          <div className="absolute -inset-2 rounded-full border border-[#BA5227]/25 pointer-events-none animate-pulse" />
        </div>

        {/* Narrative Brand Typography */}
        <div className="flex flex-col items-center gap-1.5">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold tracking-[0.24em] uppercase text-[#FAF8F5] drop-shadow-md">
            {t.hero.name}
          </h1>
          <p className="text-xs sm:text-sm font-mono tracking-[0.32em] uppercase text-[#E59368] drop-shadow-sm font-medium">
            BEYOND THE SCREEN
          </p>
          <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.18em] uppercase text-[#A89D8F] mt-1">
            {t.hero.role}
          </span>
        </div>

        {/* Real-time Progress Bar & Percentage Counter */}
        <div className="w-full mt-2">
          <LoadingProgress
            targetProgress={progress}
            statusMessage={progress >= 100 ? 'PREPARING REVEAL...' : undefined}
            isRtl={isRtl}
          />
        </div>
      </div>

      {/* --- BOTTOM BAR: Architectural Telemetry & Audio Indicator --- */}
      <div className="relative z-10 w-full flex flex-col sm:flex-row items-center justify-between gap-2 text-[9px] sm:text-[10px] font-mono tracking-widest text-[#7D7368]">
        <div className="flex items-center gap-2">
          <span>CINEMATIC ARCHITECTURE</span>
          <span className="text-white/10">•</span>
          <span>5-ACT EXPERIENCE</span>
        </div>

        <div className="flex items-center gap-1.5 text-[#D4AF37]/80">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
          <span>PROCEDURAL SOUND ENGINE READY</span>
        </div>
      </div>
    </div>
  );
}

