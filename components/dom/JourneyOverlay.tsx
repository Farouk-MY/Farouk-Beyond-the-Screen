'use client';

import React from 'react';
import { DEVELOPER_PROFILE } from '@/config/portfolioData';

export function JourneyOverlay() {
  const { journeyNarrative } = DEVELOPER_PROFILE;

  return (
    <section
      id="act-2-journey"
      aria-label="Act II — The Threshold"
      className="relative min-h-[119vh] flex flex-col justify-center p-6 sm:p-12 lg:p-16 pointer-events-none"
    >
      {/* Left-aligned editorial narrative container keeping the central promenade & ocean vista visible */}
      <div className="max-w-xl lg:max-w-2xl mr-auto pointer-events-auto">
        {/* Act Badging */}
        <div className="flex items-center gap-2.5 mb-4 justify-start">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono border border-amber-500/30 bg-amber-500/10 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            ACT II — THE THRESHOLD
          </span>
          <span className="text-[11px] font-mono tracking-widest text-[#9E9488] uppercase">
            Architectural Promenade
          </span>
        </div>

        {/* Narrative Title */}
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F7F4EE] text-left mb-4 font-['Space_Grotesk',sans-serif]">
          Beyond the Studio Threshold
        </h2>

        <p className="text-sm sm:text-base text-[#B0A79A] leading-relaxed text-left mb-8 font-['Manrope',sans-serif]">
          Stepping from the quiet workspace onto the open stone terrace — transitioning from isolated explorations into scalable, interconnected web &amp; mobile architectures.
        </p>

        {/* Storytelling Timeline Milestones */}
        <div className="flex flex-col gap-3.5">
          {/* Milestone 1 */}
          <div className="p-4 sm:p-5 rounded-xl border border-white/10 bg-[#161412]/85 backdrop-blur-md transition-all hover:border-amber-500/40 group shadow-lg">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-mono font-bold tracking-wider text-[#FFB366]">
                {journeyNarrative.part1Title}
              </span>
              <span className="text-[10px] font-mono text-[#9E9488] uppercase tracking-wider">Foundations</span>
            </div>
            <p className="text-xs sm:text-sm text-[#BDB5A8] leading-relaxed group-hover:text-[#F0EAE1] transition-colors font-['Manrope',sans-serif]">
              {journeyNarrative.part1Body}
            </p>
          </div>

          {/* Milestone 2 */}
          <div className="p-4 sm:p-5 rounded-xl border border-white/10 bg-[#161412]/85 backdrop-blur-md transition-all hover:border-amber-500/40 group shadow-lg">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-mono font-bold tracking-wider text-[#FFD180]">
                {journeyNarrative.part2Title}
              </span>
              <span className="text-[10px] font-mono text-[#9E9488] uppercase tracking-wider">Architecture</span>
            </div>
            <p className="text-xs sm:text-sm text-[#BDB5A8] leading-relaxed group-hover:text-[#F0EAE1] transition-colors font-['Manrope',sans-serif]">
              {journeyNarrative.part2Body}
            </p>
          </div>

          {/* Milestone 3 */}
          <div className="p-4 sm:p-5 rounded-xl border border-white/10 bg-[#161412]/85 backdrop-blur-md transition-all hover:border-amber-500/40 group shadow-lg">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-mono font-bold tracking-wider text-[#FFA726]">
                {journeyNarrative.part3Title}
              </span>
              <span className="text-[10px] font-mono text-[#9E9488] uppercase tracking-wider">Production</span>
            </div>
            <p className="text-xs sm:text-sm text-[#BDB5A8] leading-relaxed group-hover:text-[#F0EAE1] transition-colors font-['Manrope',sans-serif]">
              {journeyNarrative.part3Body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

