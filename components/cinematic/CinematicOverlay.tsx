'use client';

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ACTS, getActiveAct } from '@/config/timeline';
import { useSmoothScroll } from '@/components/providers/SmoothScrollProvider';
import { HeroOverlay } from '@/components/dom/HeroOverlay';
import { JourneyOverlay } from '@/components/dom/JourneyOverlay';
import { ProjectsOverlay } from '@/components/dom/ProjectsOverlay';
import { SkillsOverlay } from '@/components/dom/SkillsOverlay';
import { ContactOverlay } from '@/components/dom/ContactOverlay';
import { ThemeSelector } from '@/components/dom/ThemeSelector';

interface CinematicOverlayProps {
  scrollProgressRef: React.MutableRefObject<number>;
}

export function CinematicOverlay({ scrollProgressRef }: CinematicOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const percentTextRef = useRef<HTMLSpanElement>(null);
  const actBadgeRef = useRef<HTMLSpanElement>(null);
  const actNameRef = useRef<HTMLHeadingElement>(null);

  const [activeActId, setActiveActId] = useState<string>('origin');
  const { getLenis } = useSmoothScroll();

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      // Master Authoritative Scroll Timeline for the 5 Cinematic Acts
      gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.1,
          onUpdate: (self) => {
            const progress = self.progress;

            // Direct sync with shared mutable ref for 60/144 FPS video seek updates
            scrollProgressRef.current = progress;

            // Update DOM telemetry elements via direct ref mutation (zero React re-render)
            if (progressBarRef.current) {
              progressBarRef.current.style.transform = `scaleX(${progress})`;
            }

            if (percentTextRef.current) {
              const formattedProgress = progress.toFixed(3);
              percentTextRef.current.textContent = `S = ${formattedProgress}`;
            }

            const active = getActiveAct(progress);

            if (actBadgeRef.current) {
              actBadgeRef.current.textContent = active.actNumber;
              actBadgeRef.current.style.color = active.accentColor;
            }

            if (actNameRef.current) {
              actNameRef.current.textContent = active.name;
            }

            // Sync active act ID for navigation pills
            setActiveActId((prev) => (prev !== active.id ? active.id : prev));
          },
        },
      });

      // Expose test automation helper
      if (typeof window !== 'undefined') {
        (window as unknown as { __FAROUK_SET_SCROLL_PROGRESS?: (p: number) => void }).__FAROUK_SET_SCROLL_PROGRESS = (p: number) => {
          scrollProgressRef.current = p;
          const totalHeight = (containerRef.current?.scrollHeight || document.body.scrollHeight) - window.innerHeight;
          const targetY = totalHeight * p;
          const lenis = getLenis();
          if (lenis) {
            lenis.scrollTo(targetY, { immediate: true });
          } else {
            window.scrollTo(0, targetY);
          }
          ScrollTrigger.update();
        };
      }
    },
    { scope: containerRef }
  );

  // Jump to specific act using Lenis smooth scroll
  const handleJumpToAct = (startProgress: number) => {
    const lenis = getLenis();
    if (!lenis || !containerRef.current) return;

    const totalHeight = containerRef.current.scrollHeight - window.innerHeight;
    const targetProgress = startProgress > 0 ? Math.min(1, startProgress + 0.01) : 0;
    const targetY = totalHeight * targetProgress;
    lenis.scrollTo(targetY, { duration: 1.5 });
  };

  return (
    <div ref={containerRef} className="relative z-10 w-full text-[#F3F6FA] pointer-events-none">
      {/* --- TOP FIXED HUD --- */}
      <header
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between p-4 sm:p-6 pointer-events-none backdrop-blur-md bg-[#07080B]/80 border-b border-white/10 text-[#F3F6FA] transition-colors duration-500"
      >
        {/* Project Branding & Current Act Badging */}
        <div className="flex flex-col pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF9F43] shadow-[0_0_8px_#FF9F43]" />
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-white">
              FAROUK MESSAI
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span
              ref={actBadgeRef}
              className="text-[11px] font-mono font-bold text-[#FF9F43]"
            >
              ACT I
            </span>
            <span className="opacity-40 text-[10px] text-white/50">•</span>
            <span
              ref={actNameRef}
              className="text-[11px] font-mono tracking-wider uppercase font-medium text-white/90"
            >
              THE STUDIO
            </span>
          </div>
        </div>

        {/* Five-Act Interactive Navigation Pills */}
        <nav
          className="hidden md:flex items-center gap-1.5 p-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md pointer-events-auto shadow-sm"
          aria-label="Act Navigation"
        >
          {ACTS.map((act) => {
            const isActive = activeActId === act.id;
            return (
              <button
                key={act.id}
                onClick={() => handleJumpToAct(act.range[0])}
                className={`px-3 py-1 rounded-full text-[10px] font-mono font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#FF9F43] text-[#07080B] font-bold shadow-sm'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {act.actNumber}
              </button>
            );
          })}
        </nav>

        {/* Right Controls: Atmospheric Theme Selector & HUD Metrics */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Atmospheric Theme Selector */}
          <ThemeSelector />

          {/* Cinematic Mode Indicator */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono border border-white/10 bg-white/5 text-[#A0AEC0]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>CINEMATIC 24FPS</span>
          </div>

          {/* Normalized Progress Readout */}
          <div className="flex items-center px-2.5 py-1 rounded-full text-[11px] font-mono border border-white/10 bg-white/5 backdrop-blur-md">
            <span
              ref={percentTextRef}
              className="font-bold min-w-[56px] text-right font-mono text-xs text-[#FF9F43]"
            >
              S = 0.000
            </span>
          </div>
        </div>

        {/* Real-time Top Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10">
          <div
            ref={progressBarRef}
            className="h-full w-full origin-left transition-transform duration-75 bg-[#FF9F43]"
            style={{
              transform: 'scaleX(0)',
            }}
          />
        </div>
      </header>

      {/* --- FIVE-ACT SEMANTIC DOM CONTENT SECTIONS --- */}

      {/* ACT I: THE STUDIO (0.00 - 0.20 -> 125vh) */}
      <HeroOverlay
        onExploreWork={() => handleJumpToAct(0.42)}
        onContactClick={() => handleJumpToAct(0.85)}
      />

      {/* ACT II: THE THRESHOLD (0.20 - 0.40 -> 125vh) */}
      <JourneyOverlay />

      {/* ACT III: THE WORK (0.40 - 0.60 -> 175vh) */}
      <ProjectsOverlay />

      {/* ACT IV: THE CRAFT (0.60 - 0.80 -> 175vh) */}
      <SkillsOverlay />

      {/* ACT V: THE HORIZON (0.80 - 1.00 -> 125vh) */}
      <ContactOverlay />
    </div>
  );
}
