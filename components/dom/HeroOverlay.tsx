'use client';

import React from 'react';
import { DEVELOPER_PROFILE } from '@/config/portfolioData';

interface HeroOverlayProps {
  onExploreWork: () => void;
  onContactClick: () => void;
}

export function HeroOverlay({ onExploreWork, onContactClick }: HeroOverlayProps) {
  return (
    <section
      id="act-1-origin"
      aria-label="Act I — The Studio"
      className="relative min-h-[128vh] flex flex-col justify-between p-6 sm:p-12 lg:p-16 pt-32 sm:pt-40 pointer-events-none transition-colors duration-500"
    >
      {/* Editorial Narrative Column — Rule-of-thirds left-aligned with frosted glass backplate for optimal readability */}
      <div className="max-w-xl lg:max-w-2xl pointer-events-auto p-6 sm:p-8 rounded-3xl backdrop-blur-md bg-[#111317]/65 border border-white/10 shadow-2xl transition-all duration-300">
        {/* Curated Editorial Metadata Pill */}
        <div className="flex flex-wrap items-center gap-2.5 mb-5">
          <span
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-wider transition-colors duration-300"
            style={{
              background: 'var(--theme-pill)',
              color: 'var(--theme-accent)',
              border: '1px solid var(--theme-border)',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: 'var(--theme-accent)' }}
            />
            ACT I — THE STUDIO
          </span>
          <span
            className="text-xs font-mono tracking-widest uppercase transition-colors duration-300"
            style={{ color: 'var(--theme-fg-muted)' }}
          >
            Architectural Workspace
          </span>
        </div>

        {/* Developer Name & Core Title */}
        <h1 className="text-3xl sm:text-6xl lg:text-7xl font-heading font-bold tracking-tight leading-[1.05] mb-2 text-[#F7F4EE]">
          {DEVELOPER_PROFILE.name}
        </h1>

        <p className="text-base sm:text-2xl font-body font-normal tracking-tight mb-4 text-[#FF9F43]">
          {DEVELOPER_PROFILE.title}
        </p>

        {/* Refined Editorial Statement */}
        <p className="text-sm sm:text-lg font-body leading-relaxed mb-6 max-w-xl text-[#CBD5E1]">
          {DEVELOPER_PROFILE.bioIntroduction}
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-3.5">
          <button
            onClick={onExploreWork}
            className="px-6 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-sm bg-[#FF9F43] text-[#07080B] hover:bg-[#FFB76B] hover:scale-[1.02]"
          >
            Explore Projects &rarr;
          </button>
          <button
            onClick={onContactClick}
            className="px-6 py-3 rounded-full text-xs font-mono font-medium tracking-wider transition-all duration-300 cursor-pointer border border-white/20 bg-white/5 text-[#F7F4EE] hover:bg-white/10"
          >
            Get In Touch
          </button>
        </div>

        {/* Editorial Architecture Telemetry Badges */}
        <div
          className="mt-10 pt-6 flex flex-wrap items-center gap-6 text-xs font-mono transition-colors duration-300"
          style={{
            borderTop: '1px solid var(--theme-border-subtle)',
            color: 'var(--theme-fg-muted)',
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: 'var(--theme-accent)' }}
            />
            <span>Next.js & Three.js Canvas</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: 'var(--theme-fg-muted)' }}
            />
            <span>Mobile & Web Engineering</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: 'var(--theme-accent)' }}
            />
            <span>Real-Time Trajectory</span>
          </div>
        </div>
      </div>

      {/* Animated Minimalist Scroll Indicator Prompt */}
      <div
        className="pt-16 pb-8 flex items-center gap-4 text-xs font-mono pointer-events-none select-none transition-colors duration-300"
        style={{ color: 'var(--theme-fg-muted)' }}
      >
        <div
          className="w-5 h-9 rounded-full flex items-start justify-center p-1 transition-colors duration-300"
          style={{
            border: '1px solid var(--theme-border)',
            background: 'var(--theme-pill)',
          }}
        >
          <div
            className="w-1 h-2 rounded-full animate-bounce"
            style={{ background: 'var(--theme-accent)' }}
          />
        </div>
        <div className="flex flex-col">
          <span
            className="font-medium tracking-wide transition-colors duration-300"
            style={{ color: 'var(--theme-fg)' }}
          >
            Scroll to Traverse
          </span>
          <span className="text-[11px] opacity-75">
            Camera & character begin 5-act journey
          </span>
        </div>
      </div>
    </section>
  );
}
