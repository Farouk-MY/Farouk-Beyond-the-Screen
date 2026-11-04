'use client';

import React, { useRef } from 'react';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import { CinematicVideoLayer } from './CinematicVideoLayer';
import { CinematicOverlay } from './CinematicOverlay';

export function CinematicExperience() {
  // Shared progress ref allows zero-overhead communication between GSAP ScrollTrigger and Video Seek RAF
  const scrollProgressRef = useRef<number>(0);

  return (
    <SmoothScrollProvider>
      <div className="relative min-h-screen transition-colors duration-500 selection:bg-[var(--theme-accent)]/20 selection:text-[var(--theme-accent)] bg-[#07080B]">
        {/* Dynamic 5-Act Cinematic Video Background with Idle Typing Loop */}
        <CinematicVideoLayer scrollProgressRef={scrollProgressRef} />

        {/* Five-Act Narrative Semantic DOM Overlay & Telemetry */}
        <CinematicOverlay scrollProgressRef={scrollProgressRef} />
      </div>
    </SmoothScrollProvider>
  );
}

