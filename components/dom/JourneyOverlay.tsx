'use client';

import React from 'react';
import { DEVELOPER_PROFILE } from '@/config/portfolioData';

interface JourneyOverlayProps {
  opacity: number;
}

export function JourneyOverlay({ opacity }: JourneyOverlayProps) {
  const { journeyNarrative } = DEVELOPER_PROFILE;
  const isVisible = opacity > 0.01;

  return (
    <section
      id="scene-journey"
      aria-label="Journey: Architectural Promenade"
      className={`absolute inset-0 flex flex-col justify-center p-4 sm:p-10 lg:p-16 pt-20 pointer-events-none transition-opacity duration-200 ease-out ${
        isVisible ? 'visible' : 'invisible'
      }`}
      style={{ opacity }}
    >
      {/* Refined editorial narrative positioned over left limestone facade, keeping scenery dominant */}
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl mr-auto pointer-events-auto">
        {/* Section Label */}
        <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono tracking-wider border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            JOURNEY
          </span>
          <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[#D4C9BC] uppercase">
            Architectural Promenade
          </span>
        </div>

        {/* Narrative Title */}
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-heading font-bold tracking-tight text-[#FAF8F5] mb-2 sm:mb-3">
          Beyond the Threshold
        </h2>

        <p className="text-xs sm:text-sm text-[#D6CEC2] font-body leading-relaxed mb-6 max-w-md">
          Stepping from the quiet workspace onto the sunlit stone terrace — moving from isolated explorations into scalable, interconnected web &amp; mobile architectures.
        </p>

        {/* Refined Minimalist Narrative Progression (Replaced heavy stacked cards with elegant typographic timeline) */}
        <div className="space-y-4 pl-4 border-l border-[#D4AF37]/30">
          {/* Milestone 1 */}
          <div className="relative group">
            <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#15100E] border-2 border-[#D4AF37]" />
            <h3 className="text-xs font-mono font-bold tracking-wider text-[#D4AF37] uppercase mb-0.5">
              {journeyNarrative.part1Title}
            </h3>
            <p className="text-xs sm:text-[13px] text-[#D6CEC2] font-body leading-relaxed max-w-md">
              {journeyNarrative.part1Body}
            </p>
          </div>

          {/* Milestone 2 */}
          <div className="relative group">
            <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#15100E] border-2 border-[#BA5227]" />
            <h3 className="text-xs font-mono font-bold tracking-wider text-[#BA5227] uppercase mb-0.5">
              {journeyNarrative.part2Title}
            </h3>
            <p className="text-xs sm:text-[13px] text-[#D6CEC2] font-body leading-relaxed max-w-md">
              {journeyNarrative.part2Body}
            </p>
          </div>

          {/* Milestone 3 */}
          <div className="relative group">
            <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#15100E] border-2 border-[#FAF8F5]" />
            <h3 className="text-xs font-mono font-bold tracking-wider text-[#FAF8F5] uppercase mb-0.5">
              {journeyNarrative.part3Title}
            </h3>
            <p className="text-xs sm:text-[13px] text-[#D6CEC2] font-body leading-relaxed max-w-md">
              {journeyNarrative.part3Body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
