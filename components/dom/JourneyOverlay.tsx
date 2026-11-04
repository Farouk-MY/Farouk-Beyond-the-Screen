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
      id="act-2-journey"
      aria-label="Act II — The Threshold"
      className={`absolute inset-0 flex flex-col justify-center p-6 sm:p-14 lg:p-20 pointer-events-none transition-opacity duration-200 ease-out ${
        isVisible ? 'visible' : 'invisible'
      }`}
      style={{ opacity }}
    >
      {/* Left-aligned editorial container over the serene limestone facade */}
      <div className="max-w-xl lg:max-w-2xl mr-auto pointer-events-auto">
        {/* Chapter Badging */}
        <div className="flex items-center gap-2.5 mb-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono tracking-wider border border-[#D97706]/30 bg-[#D97706]/10 text-[#F59E0B]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
            ACT II — THE THRESHOLD
          </span>
          <span className="text-[11px] font-mono tracking-widest text-[#B5A99B] uppercase">
            Architectural Promenade
          </span>
        </div>

        {/* Narrative Title */}
        <h2 className="text-3xl sm:text-5xl font-heading font-bold tracking-tight text-[#FAF8F5] mb-4">
          Beyond the Studio Threshold
        </h2>

        <p className="text-sm sm:text-base text-[#D6CEC2] font-body leading-relaxed mb-6">
          Stepping from the quiet workspace onto the sunlit stone terrace — moving from isolated explorations into scalable, interconnected web &amp; mobile architectures.
        </p>

        {/* Story Milestones in Subtle Editorial Cards */}
        <div className="flex flex-col gap-3">
          {/* Milestone 1 */}
          <div className="p-4 sm:p-5 rounded-2xl border border-[#E8E2D8]/15 bg-[#1C1613]/70 backdrop-blur-md shadow-sm transition-all hover:border-[#D97706]/40 group">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-mono font-bold tracking-wider text-[#F59E0B]">
                {journeyNarrative.part1Title}
              </span>
              <span className="text-[10px] font-mono text-[#A89D8F] uppercase tracking-wider">
                Foundations
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#D6CEC2] font-body leading-relaxed group-hover:text-[#FAF8F5] transition-colors">
              {journeyNarrative.part1Body}
            </p>
          </div>

          {/* Milestone 2 */}
          <div className="p-4 sm:p-5 rounded-2xl border border-[#E8E2D8]/15 bg-[#1C1613]/70 backdrop-blur-md shadow-sm transition-all hover:border-[#D97706]/40 group">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-mono font-bold tracking-wider text-[#F59E0B]">
                {journeyNarrative.part2Title}
              </span>
              <span className="text-[10px] font-mono text-[#A89D8F] uppercase tracking-wider">
                Architecture
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#D6CEC2] font-body leading-relaxed group-hover:text-[#FAF8F5] transition-colors">
              {journeyNarrative.part2Body}
            </p>
          </div>

          {/* Milestone 3 */}
          <div className="p-4 sm:p-5 rounded-2xl border border-[#E8E2D8]/15 bg-[#1C1613]/70 backdrop-blur-md shadow-sm transition-all hover:border-[#D97706]/40 group">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-mono font-bold tracking-wider text-[#F59E0B]">
                {journeyNarrative.part3Title}
              </span>
              <span className="text-[10px] font-mono text-[#A89D8F] uppercase tracking-wider">
                Production
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#D6CEC2] font-body leading-relaxed group-hover:text-[#FAF8F5] transition-colors">
              {journeyNarrative.part3Body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
