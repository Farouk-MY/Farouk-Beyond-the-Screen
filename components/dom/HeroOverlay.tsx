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
      id="act-1-origin"
      aria-label="Act I — The Studio"
      className={`absolute inset-0 flex flex-col justify-between p-6 sm:p-12 lg:p-16 pt-24 sm:pt-28 pointer-events-none transition-opacity duration-200 ease-out ${
        isVisible ? 'visible' : 'invisible'
      }`}
      style={{ opacity }}
    >
      {/* Editorial Content — Positioned in the clean upper-left wall area above desk */}
      <div className="max-w-xl lg:max-w-2xl pointer-events-auto">
        {/* Understated Chapter Label */}
        <div className="flex items-center gap-2.5 mb-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono tracking-wider border border-[#BA5227]/30 bg-[#BA5227]/10 text-[#E59368]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#BA5227]" />
            ACT I — THE STUDIO
          </span>
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#B5A99B]">
            Architectural Workspace
          </span>
        </div>

        {/* Developer Name & Core Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-bold tracking-tight leading-[1.05] mb-2 text-[#FAF8F5]">
          {DEVELOPER_PROFILE.name}
        </h1>

        <p className="text-lg sm:text-2xl font-body font-normal tracking-tight mb-5 text-[#E59368]">
          {DEVELOPER_PROFILE.title}
        </p>

        {/* Concise Editorial Statement */}
        <p className="text-sm sm:text-base font-body leading-relaxed mb-8 max-w-lg text-[#D6CEC2]">
          {DEVELOPER_PROFILE.bioIntroduction}
        </p>

        {/* Primary Actions */}
        <div className="flex flex-wrap items-center gap-3.5 mb-10">
          <button
            onClick={onExploreWork}
            className="px-6 py-3 rounded-full text-xs font-mono font-medium tracking-wider transition-all duration-300 cursor-pointer bg-[#BA5227] text-[#FAF8F5] hover:bg-[#CF6234] hover:shadow-lg hover:shadow-[#BA5227]/20"
          >
            Explore Selected Works &rarr;
          </button>
          <button
            onClick={onContactClick}
            className="px-6 py-3 rounded-full text-xs font-mono font-medium tracking-wider transition-all duration-300 cursor-pointer border border-[#E8E2D8]/20 bg-[#1C1512]/50 text-[#FAF8F5] hover:bg-[#1C1512]/80 backdrop-blur-sm"
          >
            Get In Touch
          </button>
        </div>

        {/* Quiet Architectural Focus Badges */}
        <div className="flex flex-wrap items-center gap-5 text-xs font-mono text-[#A89D8F] pt-4 border-t border-[#E8E2D8]/10">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#BA5227]" />
            <span>Mobile &amp; Web Engineering</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B5A99B]" />
            <span>Clean Architecture</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#BA5227]" />
            <span>Cinematic Five-Act Narrative</span>
          </div>
        </div>
      </div>

      {/* Subtle Scroll Prompt */}
      <div className="pb-4 flex items-center gap-3 text-xs font-mono text-[#A89D8F] pointer-events-none select-none">
        <div className="w-4 h-7 rounded-full flex items-start justify-center p-1 border border-[#E8E2D8]/20 bg-[#1C1512]/40 backdrop-blur-sm">
          <div className="w-1 h-1.5 rounded-full bg-[#BA5227] animate-bounce" />
        </div>
        <span>Scroll to traverse portfolio film</span>
      </div>
    </section>
  );
}
