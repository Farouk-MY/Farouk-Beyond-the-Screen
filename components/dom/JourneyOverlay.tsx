'use client';

import React from 'react';
import { DEVELOPER_PROFILE, PROJECTS_DATA } from '@/config/portfolioData';
import { computeTimelineBounds } from '@/config/cinematicTimeline';

interface JourneyOverlayProps {
  opacity: number;
  progress?: number;
}

export function JourneyOverlay({ opacity, progress }: JourneyOverlayProps) {
  const { journeyNarrative } = DEVELOPER_PROFILE;
  const isVisible = opacity > 0.01;

  // Resolve local progress within Act 2 (Journey)
  const bounds = computeTimelineBounds(PROJECTS_DATA.length);
  const [start, end] = bounds.sectionRanges[1];
  const p = typeof progress === 'number' ? progress : start;
  const localProgress = Math.max(0, Math.min(1, (p - start) / (end - start)));

  // 3 distinct narrative milestones synchronized with Farouk's walk across the terrace
  // 0: Initial threshold crossing (0.00 - 0.35)
  // 1: Walking along stone terrace (0.35 - 0.68)
  // 2: Approaching exhibition hall entrance (0.68 - 1.00)
  const activeStage = localProgress < 0.35 ? 0 : localProgress < 0.68 ? 1 : 2;

  // Dynamic progress track fill percentage (5% to 100%)
  const trackFillPercent = Math.max(8, Math.min(100, Math.round(localProgress * 100)));

  const milestones = [
    {
      step: '01',
      title: journeyNarrative.part1Title,
      body: journeyNarrative.part1Body,
      color: '#D4AF37', // Mediterranean Gold
      label: 'Origin Foundation',
    },
    {
      step: '02',
      title: journeyNarrative.part2Title,
      body: journeyNarrative.part2Body,
      color: '#BA5227', // Terracotta
      label: 'Systems Expansion',
    },
    {
      step: '03',
      title: journeyNarrative.part3Title,
      body: journeyNarrative.part3Body,
      color: '#E59368', // Warm Amber
      label: 'Production Craft',
    },
  ];

  return (
    <section
      id="scene-journey"
      aria-label="Journey: Architectural Promenade"
      className={`absolute inset-0 flex flex-col justify-start p-6 sm:p-12 lg:p-16 pt-28 sm:pt-32 lg:pt-36 pointer-events-none transition-opacity duration-200 ease-out ${
        isVisible ? 'visible' : 'invisible'
      }`}
      style={{ opacity }}
    >
      {/* Editorial Narrative — Positioned over negative space of the left limestone facade */}
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl mr-auto pointer-events-auto">
        {/* Section Pill — Generously cleared below the top navigation bar */}
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono tracking-wider border border-[#D4AF37]/40 bg-[#15100E]/80 backdrop-blur-md text-[#D4AF37] shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            02 / JOURNEY
          </span>
          <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[#D4C9BC] uppercase">
            Architectural Promenade
          </span>
        </div>

        {/* Narrative Title & Atmospheric Statement */}
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight leading-[1.1] text-[#FAF8F5] mb-2 sm:mb-3 drop-shadow-sm">
          Beyond the Threshold
        </h2>

        <p className="text-xs sm:text-sm text-[#D6CEC2] font-body leading-relaxed mb-6 sm:mb-7 max-w-md lg:max-w-lg drop-shadow-sm">
          Stepping from the quiet workspace onto the sunlit stone terrace — moving from isolated explorations into scalable, interconnected web &amp; mobile architectures.
        </p>

        {/* Scroll-Progressive Animated Timeline Track */}
        <div className="relative pl-6 sm:pl-7 space-y-4">
          {/* Background vertical architectural guideline */}
          <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-[#E8E2D8]/15 rounded-full pointer-events-none" />

          {/* Animated filled progress line driven by vertical scroll */}
          <div
            className="absolute left-[7px] top-2 w-0.5 bg-gradient-to-b from-[#D4AF37] via-[#BA5227] to-[#E59368] rounded-full pointer-events-none transition-all duration-200 ease-out shadow-[0_0_8px_rgba(186,82,39,0.5)]"
            style={{ height: `${trackFillPercent}%` }}
          />

          {/* Interactive Narrative Milestones */}
          {milestones.map((milestone, idx) => {
            const isActive = activeStage === idx;
            const isCompleted = activeStage > idx;

            return (
              <div
                key={milestone.step}
                className={`relative transition-all duration-300 ease-out ${
                  isActive
                    ? 'p-4 sm:p-4.5 rounded-xl border border-[#BA5227]/40 bg-[#15100E]/85 backdrop-blur-md shadow-xl shadow-black/35 -translate-y-0.5'
                    : 'p-2.5 sm:p-3 rounded-lg border border-transparent bg-transparent opacity-60 hover:opacity-90'
                }`}
              >
                {/* Node indicator marker on the vertical track */}
                <div
                  className={`absolute left-[-23px] top-4.5 flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? 'w-4 h-4 -left-[25px] rounded-full bg-[#BA5227] border-2 border-[#FAF8F5] shadow-[0_0_12px_rgba(186,82,39,0.8)] scale-110'
                      : isCompleted
                      ? 'w-3 h-3 -left-[23px] rounded-full bg-[#D4AF37] border-2 border-[#15100E]'
                      : 'w-2.5 h-2.5 -left-[22px] rounded-full bg-[#15100E] border-2 border-[#E8E2D8]/30'
                  }`}
                >
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  )}
                </div>

                {/* Card Header & Milestone Title */}
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3
                    className={`text-xs sm:text-[13px] font-mono font-bold tracking-wider uppercase transition-colors duration-200 ${
                      isActive ? 'text-[#FAF8F5]' : isCompleted ? 'text-[#D4AF37]' : 'text-[#D4C9BC]'
                    }`}
                  >
                    {milestone.title}
                  </h3>

                  {isActive ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase bg-[#BA5227]/25 text-[#E59368] border border-[#BA5227]/40 shadow-sm animate-pulse">
                      <span className="w-1 h-1 rounded-full bg-[#BA5227]" />
                      Stage {milestone.step}
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono text-[#D4C9BC]/60 uppercase tracking-widest">
                      {milestone.label}
                    </span>
                  )}
                </div>

                {/* Milestone Narrative Text */}
                <p
                  className={`text-xs sm:text-[13px] font-body leading-relaxed transition-colors duration-200 ${
                    isActive ? 'text-[#E8E2D8]' : 'text-[#A89D8F]'
                  }`}
                >
                  {milestone.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
