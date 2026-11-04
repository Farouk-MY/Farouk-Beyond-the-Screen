'use client';

import React, { useRef } from 'react';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { CinematicVideoLayer } from './CinematicVideoLayer';
import { CinematicOverlay } from './CinematicOverlay';
import { StaticAccessiblePortfolio } from './StaticAccessiblePortfolio';

export function CinematicExperience() {
  const prefersReducedMotion = usePrefersReducedMotion();

  // Shared progress ref allows zero-overhead communication between GSAP ScrollTrigger and Video Seek RAF
  const scrollProgressRef = useRef<number>(0);
  const runwayRef = useRef<HTMLDivElement>(null);

  // Accessible fallback for prefers-reduced-motion
  if (prefersReducedMotion) {
    return <StaticAccessiblePortfolio />;
  }

  return (
    <SmoothScrollProvider>
      <div className="relative bg-[#0E0C0A] text-[#FAF8F5] min-h-screen selection:bg-[#BA5227]/30 selection:text-[#FAF8F5]">
        {/* Authoritative Single Scroll Runway (600svh = 500svh of travel for 100svh viewport = 100svh per Act) */}
        <div id="cinematic-runway" ref={runwayRef} className="relative h-[600svh] w-full">
          {/* Sticky Cinematic 100dvh Viewport Container */}
          <div className="sticky top-0 h-dvh w-full overflow-hidden">
            {/* Background 5-Act Video & Idle Layer */}
            <CinematicVideoLayer scrollProgressRef={scrollProgressRef} />

            {/* Editorial Cinematic Semantic DOM Overlay */}
            <CinematicOverlay
              scrollProgressRef={scrollProgressRef}
              runwayRef={runwayRef}
            />
          </div>
        </div>
      </div>
    </SmoothScrollProvider>
  );
}
