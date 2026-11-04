'use client';

import React, { useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  CINEMATIC_CLIPS,
  getActiveCinematicAct,
  computeOverlayOpacity,
  getProjectAnchorScrollProgress,
  resolveActiveProjectForProgress,
} from '@/config/cinematicTimeline';
import { PROJECTS_DATA } from '@/config/portfolioData';
import { useSmoothScroll } from '@/components/providers/SmoothScrollProvider';
import { HeroOverlay } from '@/components/dom/HeroOverlay';
import { JourneyOverlay } from '@/components/dom/JourneyOverlay';
import { ProjectsOverlay } from '@/components/dom/ProjectsOverlay';
import { SkillsOverlay } from '@/components/dom/SkillsOverlay';
import { ContactOverlay } from '@/components/dom/ContactOverlay';
import { ThemeSelector } from '@/components/dom/ThemeSelector';

interface CinematicOverlayProps {
  scrollProgressRef: React.MutableRefObject<number>;
  runwayRef: React.RefObject<HTMLDivElement | null>;
}

export function CinematicOverlay({ scrollProgressRef, runwayRef }: CinematicOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const actNameRef = useRef<HTMLSpanElement>(null);
  const actNumberRef = useRef<HTMLSpanElement>(null);

  const [activeActId, setActiveActId] = useState<string>('origin');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(PROJECTS_DATA[0].id);

  // Overlay opacities for the 5 acts
  const [overlayOpacities, setOverlayOpacities] = useState<number[]>([1, 0, 0, 0, 0]);

  const { getLenis } = useSmoothScroll();

  // Jump to specific act using Lenis smooth scroll
  const handleJumpToAct = useCallback(
    (startProgress: number) => {
      const lenis = getLenis();
      const runway = runwayRef.current || document.getElementById('cinematic-runway');
      if (!runway) return;

      const totalTravel = runway.offsetHeight - window.innerHeight;
      const targetProgress = startProgress > 0 ? Math.min(1, startProgress + 0.005) : 0;
      const targetY = totalTravel * targetProgress;

      if (lenis) {
        lenis.scrollTo(targetY, { duration: 1.4 });
      } else {
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    },
    [getLenis, runwayRef]
  );

  // Synchronized project selection: smoothly scrolls to project anchor in Act III video
  const handleSelectProject = useCallback(
    (projectId: string) => {
      setSelectedProjectId(projectId);
      const project = PROJECTS_DATA.find((p) => p.id === projectId);
      if (!project || !project.visualAnchor) return;

      const targetProgress = getProjectAnchorScrollProgress(project.visualAnchor.timeSeconds);
      handleJumpToAct(targetProgress);
    },
    [handleJumpToAct]
  );

  // Always expose test automation helper globally
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    (window as unknown as { __FAROUK_SET_SCROLL_PROGRESS?: (p: number) => void }).__FAROUK_SET_SCROLL_PROGRESS = (p: number) => {
      const clamped = Math.max(0, Math.min(1, p));
      scrollProgressRef.current = clamped;
      const runway = runwayRef.current || document.getElementById('cinematic-runway');
      if (runway) {
        const targetY = (runway.offsetHeight - window.innerHeight) * clamped;
        const lenis = getLenis();
        if (lenis) {
          lenis.scrollTo(targetY, { immediate: true });
        }
        window.scrollTo(0, targetY);
        ScrollTrigger.update();
      }
    };
  }, [runwayRef, getLenis, scrollProgressRef]);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const runway = runwayRef.current || document.getElementById('cinematic-runway');
      if (!runway) return;

      // Master Authoritative ScrollTrigger bound to the 600svh runway
      ScrollTrigger.create({
        trigger: runway,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.1,
        onUpdate: (self) => {
          const progress = self.progress;

          // Direct sync with shared mutable ref for video seek RAF
          scrollProgressRef.current = progress;

          // Update header 1px progress bar
          if (progressBarRef.current) {
            progressBarRef.current.style.transform = `scaleX(${progress})`;
          }

          // Active Act metadata
          const activeClip = getActiveCinematicAct(progress);
          if (actNumberRef.current) {
            actNumberRef.current.textContent = activeClip.actNumber;
          }
          if (actNameRef.current) {
            actNameRef.current.textContent = activeClip.name;
          }

          setActiveActId((prev) => (prev !== activeClip.id ? activeClip.id : prev));

          // Compute overlay opacities based on safe-area windows
          const opacities = [
            computeOverlayOpacity(progress, 0),
            computeOverlayOpacity(progress, 1),
            computeOverlayOpacity(progress, 2),
            computeOverlayOpacity(progress, 3),
            computeOverlayOpacity(progress, 4),
          ];
          setOverlayOpacities(opacities);

          // In Act III, update selected project if manual scroll enters another visual scene
          if (progress >= 0.40 && progress <= 0.60) {
            setSelectedProjectId((currentId) =>
              resolveActiveProjectForProgress(progress, PROJECTS_DATA, currentId)
            );
          }
        },
      });
    },
    { scope: containerRef, dependencies: [runwayRef, getLenis] }
  );

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full text-[#FAF8F5] pointer-events-none z-10"
    >
      {/* --- REFINED EDITORIAL FILM HEADER --- */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 sm:px-12 sm:py-5 pointer-events-none backdrop-blur-md bg-[#0E0C0A]/60 border-b border-[#E8E2D8]/10 text-[#FAF8F5] transition-colors duration-300">
        {/* Project Wordmark & Current Chapter */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <button
            onClick={() => handleJumpToAct(0)}
            className="flex flex-col text-left cursor-pointer group"
          >
            <span className="text-xs sm:text-sm font-heading font-bold tracking-wider uppercase text-[#FAF8F5] group-hover:text-[#E59368] transition-colors">
              FAROUK MESSAI
            </span>
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#B5A99B]">
              Software Developer
            </span>
          </button>

          <span className="hidden sm:inline-block text-[#B5A99B]/40 text-xs">•</span>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
            <span ref={actNumberRef} className="font-semibold text-[#E59368]">
              ACT I
            </span>
            <span className="text-[#B5A99B]/40">/</span>
            <span ref={actNameRef} className="text-[#D6CEC2] tracking-wider uppercase text-[11px]">
              THE STUDIO
            </span>
          </div>
        </div>

        {/* Minimalist Act Chapter Navigation Pills */}
        <nav
          className="hidden md:flex items-center gap-1 p-1 rounded-full border border-[#E8E2D8]/15 bg-[#1C1512]/60 backdrop-blur-md pointer-events-auto shadow-sm"
          aria-label="Act Chapter Navigation"
        >
          {CINEMATIC_CLIPS.map((act) => {
            const isActive = activeActId === act.id;
            return (
              <button
                key={act.id}
                onClick={() => handleJumpToAct(act.scrollRange[0])}
                className={`px-3 py-1 rounded-full text-[11px] font-mono tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#BA5227] text-[#FAF8F5] font-semibold shadow-sm'
                    : 'text-[#B5A99B] hover:text-[#FAF8F5] hover:bg-white/5'
                }`}
                title={act.name}
              >
                {act.actNumber}
              </button>
            );
          })}
        </nav>

        {/* Right Atmospheric Theme Selector */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <ThemeSelector />
        </div>

        {/* Real-time 1px Thin Progress Indicator Line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#E8E2D8]/10">
          <div
            ref={progressBarRef}
            className="h-full w-full origin-left bg-[#BA5227] transition-transform duration-75"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>
      </header>

      {/* --- FIVE-ACT SYNCHRONIZED EDITORIAL OVERLAYS --- */}

      {/* ACT I: THE STUDIO (0.00 - 0.20) */}
      <HeroOverlay
        opacity={overlayOpacities[0]}
        onExploreWork={() => handleJumpToAct(0.40)}
        onContactClick={() => handleJumpToAct(0.80)}
      />

      {/* ACT II: THE THRESHOLD (0.20 - 0.40) */}
      <JourneyOverlay opacity={overlayOpacities[1]} />

      {/* ACT III: THE WORK (0.40 - 0.60) */}
      <ProjectsOverlay
        opacity={overlayOpacities[2]}
        selectedProjectId={selectedProjectId}
        onSelectProject={handleSelectProject}
      />

      {/* ACT IV: THE CRAFT (0.60 - 0.80) */}
      <SkillsOverlay opacity={overlayOpacities[3]} />

      {/* ACT V: THE HORIZON (0.80 - 1.00) */}
      <ContactOverlay opacity={overlayOpacities[4]} />
    </div>
  );
}
