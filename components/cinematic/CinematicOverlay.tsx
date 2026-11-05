'use client';

import React, { useRef, useState, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  computeOverlayOpacity,
  getNavSections,
  getProjectScrollProgress,
  getWorkPresentationState,
} from '@/config/cinematicTimeline';
import { PROJECTS_DATA } from '@/config/portfolioData';
import { useSmoothScroll } from '@/components/providers/SmoothScrollProvider';
import { HeroOverlay } from '@/components/dom/HeroOverlay';
import { JourneyOverlay } from '@/components/dom/JourneyOverlay';
import { ProjectsOverlay } from '@/components/dom/ProjectsOverlay';
import { SkillsOverlay } from '@/components/dom/SkillsOverlay';
import { ContactOverlay } from '@/components/dom/ContactOverlay';

interface CinematicOverlayProps {
  scrollProgressRef: React.MutableRefObject<number>;
  runwayRef: React.RefObject<HTMLDivElement | null>;
}

export function CinematicOverlay({ scrollProgressRef, runwayRef }: CinematicOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [currentProgress, setCurrentProgress] = useState<number>(0);
  const [activeSectionId, setActiveSectionId] = useState<string>('origin');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(PROJECTS_DATA[0].id);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Overlay opacities for the 5 scenes
  const [overlayOpacities, setOverlayOpacities] = useState<number[]>([1, 0, 0, 0, 0]);

  const { getLenis } = useSmoothScroll();

  // Dynamic navigation sections calculated from project count
  const navSections = useMemo(() => {
    return getNavSections(PROJECTS_DATA.length);
  }, []);

  // Jump to specific scene using Lenis smooth scroll
  const handleJumpToSection = useCallback(
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
      setMobileMenuOpen(false);
    },
    [getLenis, runwayRef]
  );

  // Synchronized project selection: smoothly scrolls to project anchor in 3D carousel
  const handleSelectProject = useCallback(
    (projectId: string) => {
      setSelectedProjectId(projectId);
      const idx = PROJECTS_DATA.findIndex((p) => p.id === projectId);
      if (idx !== -1) {
        const targetProgress = getProjectScrollProgress(idx, PROJECTS_DATA.length);
        handleJumpToSection(targetProgress);
      }
    },
    [handleJumpToSection]
  );

  // Expose test automation helper globally for testing suite
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    (window as unknown as { __FAROUK_SET_SCROLL_PROGRESS?: (p: number) => void }).__FAROUK_SET_SCROLL_PROGRESS = (p: number) => {
      const clamped = Math.max(0, Math.min(1, p));
      scrollProgressRef.current = clamped;
      setCurrentProgress(clamped);
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

      // Master Authoritative ScrollTrigger bound to the runway
      ScrollTrigger.create({
        trigger: runway,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.1,
        onUpdate: (self) => {
          const progress = self.progress;

          // Direct sync with shared mutable ref for video seek RAF
          scrollProgressRef.current = progress;
          setCurrentProgress(progress);

          // Update header 1px progress bar
          if (progressBarRef.current) {
            progressBarRef.current.style.transform = `scaleX(${progress})`;
          }

          // Active section determination
          let currentSec = navSections[0].id;
          for (let i = navSections.length - 1; i >= 0; i--) {
            if (progress >= navSections[i].progress - 0.03) {
              currentSec = navSections[i].id;
              break;
            }
          }
          setActiveSectionId((prev) => (prev !== currentSec ? currentSec : prev));

          // Compute overlay opacities based on calibrated safe-area windows
          const opacities = [
            computeOverlayOpacity(progress, 0, PROJECTS_DATA.length),
            computeOverlayOpacity(progress, 1, PROJECTS_DATA.length),
            computeOverlayOpacity(progress, 2, PROJECTS_DATA.length),
            computeOverlayOpacity(progress, 3, PROJECTS_DATA.length),
            computeOverlayOpacity(progress, 4, PROJECTS_DATA.length),
          ];
          setOverlayOpacities(opacities);

          // Synchronize active project index from 3D presentation state
          const workState = getWorkPresentationState(progress, PROJECTS_DATA.length);
          if (workState.isInWork) {
            const activeProj = PROJECTS_DATA[workState.activeProjectIndex];
            if (activeProj) {
              setSelectedProjectId(activeProj.id);
            }
          }
        },
      });
    },
    { scope: containerRef, dependencies: [runwayRef, getLenis, navSections] }
  );

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full text-[#FAF8F5] pointer-events-none z-10"
    >
      {/* --- CREATIVE FLOATING ARCHITECTURAL HEADER --- */}
      <header className="fixed top-3 sm:top-5 left-3 sm:left-6 right-3 sm:right-6 z-40 flex items-center justify-between px-3 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#0D0A08]/75 backdrop-blur-2xl border border-[#D4AF37]/25 shadow-[0_16px_40px_rgba(0,0,0,0.55)] transition-all duration-300 pointer-events-auto">
        {/* Left: Custom FM Monogram & Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleJumpToSection(0)}
            className="flex items-center gap-2.5 cursor-pointer group text-left"
            aria-label="Farouk Messai — Home"
          >
            {/* Custom FM Monogram Vector Icon */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#1E1612] to-[#0A0706] border border-[#D4AF37]/40 flex items-center justify-center p-1.5 shadow-sm group-hover:border-[#D4AF37] transition-all">
              <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
                <rect x="12" y="12" width="7" height="40" rx="1.5" fill="#FAF8F5" />
                <path d="M12 13.5C12 12.6716 12.6716 12 13.5 12H50.5C51.3284 12 52 12.6716 52 13.5V18.5C52 19.3284 51.3284 20 50.5 20H13.5C12.6716 20 12 19.3284 12 18.5V13.5Z" fill="#FAF8F5" />
                <rect x="12" y="28" width="18" height="6" rx="1.2" fill="#BA5227" />
                <path d="M30 19L36.5 36.5C36.8 37.3 37.9 37.3 38.2 36.5L44.5 19H50.5L40.2 46C39.5 47.8 36.9 47.8 36.2 46L27 21.5L30 19Z" fill="#FAF8F5" />
                <rect x="45" y="19" width="7" height="33" rx="1.5" fill="#FAF8F5" />
                <circle cx="37.5" cy="28" r="2.2" fill="#D4AF37" />
              </svg>
            </div>

            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-heading font-extrabold tracking-[0.18em] uppercase text-[#FAF8F5] group-hover:text-[#E59368] transition-colors leading-tight">
                FAROUK
              </span>
              <span className="text-[8px] sm:text-[9px] font-mono tracking-[0.22em] uppercase text-[#D4AF37]">
                SOFTWARE DEVELOPER
              </span>
            </div>
          </button>
        </div>

        {/* Center: Creative Floating Editorial Navigation Dock */}
        <nav
          className="hidden md:flex items-center gap-1 px-1.5 py-1 rounded-full bg-black/40 border border-[#E8E2D8]/10 backdrop-blur-sm"
          aria-label="Portfolio Navigation"
        >
          {navSections.map((sec) => {
            const isActive = activeSectionId === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => handleJumpToSection(sec.progress)}
                className={`relative px-3 sm:px-3.5 py-1 text-xs font-mono tracking-wider transition-all cursor-pointer rounded-full flex items-center gap-1.5 ${
                  isActive
                    ? 'text-[#FAF8F5] font-semibold bg-[#BA5227] shadow-[0_2px_12px_rgba(186,82,39,0.35)]'
                    : 'text-[#D4C9BC] hover:text-[#FAF8F5] hover:bg-white/[0.06]'
                }`}
              >
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
                <span>{sec.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Refined Creative Action CTA & Mobile Trigger */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => handleJumpToSection(navSections[4]?.progress || 0.85)}
            className="px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-mono font-semibold border border-[#D4AF37]/40 bg-[#1A1310] text-[#FAF8F5] hover:border-[#FAF8F5] hover:bg-[#BA5227] hover:text-[#FAF8F5] transition-all duration-300 shadow-sm cursor-pointer inline-flex items-center gap-1.5 group active:scale-95"
          >
            <span>Let&apos;s Talk</span>
            <span className="text-xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-1.5 rounded-full border border-[#E8E2D8]/15 bg-[#15100E]/80 text-[#FAF8F5] cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Real-time Integrated Bronze Progress Hairline */}
        <div className="absolute -bottom-[1px] inset-x-8 h-[1.5px] rounded-full overflow-hidden bg-[#E8E2D8]/10 pointer-events-none">
          <div
            ref={progressBarRef}
            className="h-full w-full origin-left bg-gradient-to-r from-[#BA5227] via-[#D4AF37] to-[#E59368] transition-transform duration-75"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>
      </header>

      {/* Floating Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-3 top-16 sm:top-20 z-40 p-4 rounded-2xl bg-[#140F0C]/95 backdrop-blur-2xl border border-[#D4AF37]/30 shadow-2xl flex flex-col gap-2 md:hidden pointer-events-auto animate-in slide-in-from-top-2 duration-200">
          {navSections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => handleJumpToSection(sec.progress)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-mono tracking-wider transition-colors cursor-pointer ${
                activeSectionId === sec.id
                  ? 'bg-[#BA5227] text-[#FAF8F5] font-semibold'
                  : 'text-[#D4C9BC] hover:bg-white/5 hover:text-[#FAF8F5]'
              }`}
            >
              {sec.label}
            </button>
          ))}
          <div className="pt-2 border-t border-[#E8E2D8]/10 mt-1 flex items-center justify-between">
            <span className="text-[10px] font-mono text-[#A89D8F]">
              Farouk Messai Portfolio
            </span>
            <button
              onClick={() => handleJumpToSection(navSections[4]?.progress || 0.85)}
              className="px-3.5 py-1.5 rounded-md text-xs font-mono font-semibold bg-[#BA5227] text-[#FAF8F5]"
            >
              Contact ↗
            </button>
          </div>
        </div>
      )}

      {/* --- SYNCHRONIZED EDITORIAL OVERLAYS --- */}

      {/* 1. STUDIO (Section 01) */}
      <HeroOverlay
        opacity={overlayOpacities[0]}
        onExploreWork={() => handleJumpToSection(navSections[2]?.progress || 0.35)}
        onContactClick={() => handleJumpToSection(navSections[4]?.progress || 0.85)}
      />

      {/* 2. JOURNEY (Section 02) */}
      <JourneyOverlay opacity={overlayOpacities[1]} progress={currentProgress} />

      {/* 3. SELECTED WORK (Section 03: Finite 3D Curved Screen Carousel) */}
      <ProjectsOverlay
        opacity={overlayOpacities[2]}
        selectedProjectId={selectedProjectId}
        onSelectProject={handleSelectProject}
        globalProgress={currentProgress}
      />

      {/* 4. ENGINEERING (Section 04) */}
      <SkillsOverlay opacity={overlayOpacities[3]} />

      {/* 5. CONTACT (Section 05) */}
      <ContactOverlay
        opacity={overlayOpacities[4]}
        onBackToTop={() => handleJumpToSection(0)}
      />
    </div>
  );
}
