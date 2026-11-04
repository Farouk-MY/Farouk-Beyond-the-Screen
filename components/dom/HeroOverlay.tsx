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
      className={`absolute inset-0 flex flex-col justify-between p-4 sm:p-10 lg:p-14 pt-20 sm:pt-24 pointer-events-none transition-opacity duration-200 ease-out ${
        isVisible ? 'visible' : 'invisible'
      }`}
      style={{ opacity }}
    >
      {/* Editorial Content — Positioned in the clean upper-left wall area above desk */}
      <div className="max-w-[88vw] sm:max-w-lg lg:max-w-xl pointer-events-auto">
        {/* Understated Section Label */}
        <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono tracking-wider border border-[#BA5227]/30 bg-[#BA5227]/10 text-[#E59368]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#BA5227]" />
            STUDIO
          </span>
          <span className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-[#B5A99B]">
            Architectural Workspace
          </span>
        </div>

        {/* Developer Name & Core Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight leading-[1.08] mb-1.5 text-[#FAF8F5]">
          {DEVELOPER_PROFILE.name}
        </h1>

        <p className="text-base sm:text-xl font-body font-normal tracking-tight mb-3 sm:mb-4 text-[#E59368]">
          {DEVELOPER_PROFILE.title}
        </p>

        {/* Concise Editorial Statement */}
        <p className="text-xs sm:text-sm font-body leading-relaxed mb-5 sm:mb-6 max-w-md sm:max-w-lg text-[#D6CEC2]">
          {DEVELOPER_PROFILE.bioIntroduction}
        </p>

        {/* Primary Actions */}
        <div className="flex flex-wrap items-center gap-3 mb-6 sm:mb-8">
          <button
            onClick={onExploreWork}
            className="px-5 py-2.5 rounded-full text-xs font-mono font-medium tracking-wider transition-all duration-300 cursor-pointer bg-[#BA5227] text-[#FAF8F5] hover:bg-[#CF6234] hover:shadow-lg hover:shadow-[#BA5227]/20"
          >
            Explore Work &rarr;
          </button>
          <button
            onClick={onContactClick}
            className="px-5 py-2.5 rounded-full text-xs font-mono font-medium tracking-wider transition-all duration-300 cursor-pointer border border-[#E8E2D8]/20 bg-[#1C1512]/50 text-[#FAF8F5] hover:bg-[#1C1512]/80 backdrop-blur-sm"
          >
            Get In Touch
          </button>
        </div>

        {/* Architectural Focus Badges */}
        <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-[#A89D8F] pt-3 border-t border-[#E8E2D8]/10">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#BA5227]" />
            <span>Mobile &amp; Web Engineering</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B5A99B]" />
            <span>Clean Architecture</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span>Interactive Cinematic Portfolio</span>
          </div>
        </div>
      </div>

      {/* Subtle Scroll Prompt */}
      <div className="pb-3 flex items-center gap-2.5 text-[11px] font-mono text-[#A89D8F] pointer-events-none select-none">
        <div className="w-3.5 h-6 rounded-full flex items-start justify-center p-0.5 border border-[#E8E2D8]/20 bg-[#1C1512]/40 backdrop-blur-sm">
          <div className="w-1 h-1.5 rounded-full bg-[#BA5227] animate-bounce" />
        </div>
        <span>Scroll to explore portfolio film</span>
      </div>
    </section>
  );
}
