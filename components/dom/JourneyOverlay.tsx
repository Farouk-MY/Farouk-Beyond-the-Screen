'use client';

import React from 'react';
import { PROJECTS_DATA } from '@/config/portfolioData';
import { computeTimelineBounds } from '@/config/cinematicTimeline';
import { useTranslation } from '@/context/LocaleContext';

interface JourneyOverlayProps {
  opacity: number;
  progress?: number;
}

export function JourneyOverlay({ opacity, progress }: JourneyOverlayProps) {
  const { t, isRtl } = useTranslation();
  const isVisible = opacity > 0.01;

  // Resolve local progress within Act 2 (Journey)
  const bounds = computeTimelineBounds(PROJECTS_DATA.length);
  const [start, end] = bounds.sectionRanges[1];
  const p = typeof progress === 'number' ? progress : start;
  const localProgress = Math.max(0, Math.min(1, (p - start) / (end - start)));

  // 3 distinct narrative milestones synchronized with Farouk's walk across the terrace
  const activeStage = localProgress < 0.35 ? 0 : localProgress < 0.68 ? 1 : 2;

  // Dynamic progress track fill percentage (8% to 100%)
  const trackFillPercent = Math.max(8, Math.min(100, Math.round(localProgress * 100)));

  const milestones = [
    {
      ...t.journey.milestone1,
      color: '#D4AF37',
    },
    {
      ...t.journey.milestone2,
      color: '#BA5227',
    },
    {
      ...t.journey.milestone3,
      color: '#E59368',
    },
  ];

  return (
    <section
      id="scene-journey"
      aria-label="Journey: Architectural Promenade"
      className={`absolute inset-0 flex flex-col justify-start p-4 sm:p-8 lg:p-12 pt-18 sm:pt-20 lg:pt-22 pb-4 sm:pb-5 pointer-events-none transition-opacity duration-200 ease-out select-none ${
        isVisible ? 'visible' : 'invisible'
      }`}
      style={{ opacity }}
    >
      {/* Editorial Narrative — Positioned over negative space */}
      <div className={`w-full max-w-md sm:max-w-lg lg:max-w-xl ${isRtl ? 'ml-auto text-right' : 'mr-auto text-left'} pointer-events-auto`}>
        {/* Section Pill */}
        <div className={`flex items-center gap-2 mb-2 sm:mb-2.5 ${isRtl ? 'flex-row-reverse justify-end' : ''}`}>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono tracking-wider border border-[#D4AF37]/40 bg-[#15100E]/80 backdrop-blur-md text-[#D4AF37] shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            {t.journey.eyebrow}
          </span>
          <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[#D4C9BC] uppercase">
            {t.journey.subEyebrow}
          </span>
        </div>

        {/* Narrative Title & Atmospheric Statement */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold tracking-tight leading-tight text-[#FAF8F5] mb-1.5 sm:mb-2 drop-shadow-sm">
          {t.journey.title}
        </h2>

        <p className="text-xs sm:text-[13px] text-[#D6CEC2] font-body leading-relaxed mb-4 sm:mb-5 max-w-md lg:max-w-lg drop-shadow-sm">
          {t.journey.subtitle}
        </p>

        {/* Scroll-Progressive Animated Timeline Track */}
        <div className={`relative ${isRtl ? 'pr-5 sm:pr-6' : 'pl-5 sm:pl-6'} space-y-3 sm:space-y-3.5`}>
          {/* Background vertical architectural guideline */}
          <div
            className={`absolute ${isRtl ? 'right-[7px]' : 'left-[7px]'} top-2 bottom-2 w-0.5 bg-[#E8E2D8]/15 rounded-full pointer-events-none`}
          />

          {/* Animated filled progress line driven by vertical scroll */}
          <div
            className={`absolute ${isRtl ? 'right-[7px]' : 'left-[7px]'} top-2 w-0.5 bg-gradient-to-b from-[#D4AF37] via-[#BA5227] to-[#E59368] rounded-full pointer-events-none transition-all duration-200 ease-out shadow-[0_0_8px_rgba(186,82,39,0.5)]`}
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
                  className={`absolute ${isRtl ? 'right-[-23px]' : 'left-[-23px]'} top-4.5 flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? `w-4 h-4 ${isRtl ? '-right-[25px]' : '-left-[25px]'} rounded-full bg-[#BA5227] border-2 border-[#FAF8F5] shadow-[0_0_12px_rgba(186,82,39,0.8)] scale-110`
                      : isCompleted
                      ? `w-3 h-3 ${isRtl ? '-right-[23px]' : '-left-[23px]'} rounded-full bg-[#D4AF37] border-2 border-[#15100E]`
                      : `w-2.5 h-2.5 ${isRtl ? '-right-[22px]' : '-left-[22px]'} rounded-full bg-[#15100E] border-2 border-[#E8E2D8]/30`
                  }`}
                >
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#FAF8F5] animate-ping" />}
                </div>

                {/* Milestone Header */}
                <div className={`flex items-center gap-2 mb-1.5 ${isRtl ? 'flex-row-reverse justify-end' : ''}`}>
                  <span
                    className="text-[10px] sm:text-[11px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-md"
                    style={{
                      backgroundColor: `${milestone.color}20`,
                      color: milestone.color,
                      border: `1px solid ${milestone.color}40`,
                    }}
                  >
                    {milestone.step}
                  </span>
                  <span className="text-[11px] font-mono tracking-wider text-[#A89D8F] uppercase font-medium">
                    {milestone.label}
                  </span>
                </div>

                {/* Milestone Title & Body */}
                <h3 className={`text-sm sm:text-base font-heading font-bold text-[#FAF8F5] mb-1 leading-snug ${isRtl ? 'text-right' : 'text-left'}`}>
                  {milestone.title}
                </h3>
                <p className={`text-xs text-[#D6CEC2] font-body leading-relaxed max-w-md ${isRtl ? 'text-right' : 'text-left'}`}>
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
