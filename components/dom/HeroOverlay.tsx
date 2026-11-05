'use client';

import React from 'react';
import { DEVELOPER_PROFILE } from '@/config/portfolioData';

interface HeroOverlayProps {
  opacity: number;
  onExploreWork: () => void;
  onContactClick: () => void;
}

export function HeroOverlay({ opacity, onExploreWork, onContactClick }: HeroOverlayProps) {
  const isVisible = opacity > 0.01;

  return (
    <section
      id="scene-studio"
      aria-label="Studio: Architectural Workspace"
      className={`absolute inset-0 flex flex-col justify-between p-6 sm:p-12 lg:p-16 pt-28 sm:pt-32 lg:pt-36 pointer-events-none transition-opacity duration-200 ease-out ${
        isVisible ? 'visible' : 'invisible'
      }`}
      style={{ opacity }}
    >
      {/* Editorial Content — Positioned in the clean upper-left negative space above desk */}
      <div className="max-w-[88vw] sm:max-w-lg lg:max-w-xl pointer-events-auto">
        {/* Understated Section Label — Generously cleared below the top header */}
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono tracking-wider border border-[#BA5227]/40 bg-[#15100E]/80 backdrop-blur-md text-[#E59368] shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#BA5227] animate-pulse" />
            01 / STUDIO
          </span>
          <span className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-[#D4C9BC]">
            Architectural Workspace
          </span>
        </div>

        {/* Developer Name & Core Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight leading-[1.08] mb-2 text-[#FAF8F5] drop-shadow-sm">
          {DEVELOPER_PROFILE.name}
        </h1>

        <p className="text-base sm:text-lg lg:text-xl font-body font-medium tracking-tight mb-4 text-[#E59368] drop-shadow-sm">
          Software Developer <span className="text-[#D4AF37]/50 font-mono">|</span> Mobile &amp; Web Development
        </p>

        {/* Concise Editorial Statement */}
        <p className="text-xs sm:text-sm font-body leading-relaxed mb-6 sm:mb-7 max-w-md sm:max-w-lg text-[#D6CEC2] drop-shadow-sm">
          {DEVELOPER_PROFILE.bioIntroduction}
        </p>

        {/* Primary Actions */}
        <div className="flex flex-wrap items-center gap-3 mb-6 sm:mb-7">
          <button
            onClick={onExploreWork}
            className="px-6 py-2.5 rounded-full text-xs font-mono font-semibold tracking-wider transition-all duration-200 cursor-pointer bg-[#BA5227] text-[#FAF8F5] hover:bg-[#CF6234] hover:shadow-lg hover:shadow-[#BA5227]/25 inline-flex items-center gap-1.5 active:scale-95 shadow-sm"
          >
            <span>Explore Work</span>
            <span className="text-xs">&rarr;</span>
          </button>
          <button
            onClick={onContactClick}
            className="px-6 py-2.5 rounded-full text-xs font-mono font-medium tracking-wider transition-all duration-200 cursor-pointer border border-[#E8E2D8]/20 bg-[#15100E]/80 text-[#FAF8F5] hover:bg-[#1C1512] hover:border-[#D4AF37]/50 backdrop-blur-md active:scale-95 shadow-sm"
          >
            <span>Get In Touch</span>
            <span className="text-xs">↗</span>
          </button>
        </div>

        {/* Architectural Focus Badges */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px] font-mono text-[#D4C9BC] max-w-md sm:max-w-lg pt-4 border-t border-[#E8E2D8]/15">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[#E8E2D8]/10 bg-[#15100E]/70 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#BA5227]" />
            Mobile &amp; Web Engineering
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[#E8E2D8]/10 bg-[#15100E]/70 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            Clean Architecture
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[#E8E2D8]/10 bg-[#15100E]/70 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E59368]" />
            Interactive Cinematic Portfolio
          </span>
        </div>
      </div>

      {/* Subtle Scroll Prompt */}
      <div className="pb-4 sm:pb-6 flex items-center gap-3 text-[11px] font-mono text-[#D4C9BC] pointer-events-none select-none">
        <div className="w-4 h-7 rounded-full flex items-start justify-center p-1 border border-[#E8E2D8]/25 bg-[#15100E]/60 backdrop-blur-md shadow-sm">
          <div className="w-1 h-2 rounded-full bg-[#BA5227] animate-bounce" />
        </div>
        <span className="tracking-wider uppercase text-[10px] text-[#A89D8F]">
          Scroll to explore portfolio film
        </span>
      </div>
    </section>
  );
}
