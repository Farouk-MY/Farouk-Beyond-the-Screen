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
import { useTranslation } from '@/context/LocaleContext';
import { useAudio } from '@/context/AudioContext';
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

  const { t, isRtl, locale, toggleLocale } = useTranslation();
  const { soundEnabled, toggleSound, playClick, playWhoosh } = useAudio();

  const [currentProgress, setCurrentProgress] = useState<number>(0);
  const [activeSectionId, setActiveSectionId] = useState<string>('origin');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(PROJECTS_DATA[0].id);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Overlay opacities for the 5 scenes
  const [overlayOpacities, setOverlayOpacities] = useState<number[]>([1, 0, 0, 0, 0]);

  const { getLenis } = useSmoothScroll();

  // Dynamic navigation sections calculated from project count with localized labels
  const navSections = useMemo(() => {
    const raw = getNavSections(PROJECTS_DATA.length);
    const labelMap: Record<string, string> = {
      origin: t.navigation.studio,
      journey: t.navigation.journey,
      work: t.navigation.work,
      craft: t.navigation.engineering,
      beyond: t.navigation.contact,
    };
    return raw.map((sec) => ({
      ...sec,
      label: labelMap[sec.id] || sec.label,
    }));
  }, [t.navigation]);

  // Jump to specific scene using Lenis smooth scroll
  const handleJumpToSection = useCallback(
    (startProgress: number) => {
      playClick('light');
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
    [getLenis, runwayRef, playClick]
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

  // Track previous section for transition audio cues (refs survive GSAP closure)
  const prevSectionRef = useRef<string>('origin');
  const activeSectionRef = useRef<string>('origin');
  const selectedProjectRef = useRef<string>(PROJECTS_DATA[0].id);

  // Keep refs in sync with state via layout-timing effect so GSAP onUpdate reads fresh values
  React.useEffect(() => {
    activeSectionRef.current = activeSectionId;
  }, [activeSectionId]);
  React.useEffect(() => {
    selectedProjectRef.current = selectedProjectId;
  }, [selectedProjectId]);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const runway = runwayRef.current || document.getElementById('cinematic-runway');
      if (!runway) return;

      ScrollTrigger.create({
        trigger: runway,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          scrollProgressRef.current = progress;
          setCurrentProgress(progress);

          // Update header progress bar transform
          if (progressBarRef.current) {
            progressBarRef.current.style.transform = `scaleX(${progress})`;
          }

          // Evaluate overlay opacities for the 5 scenes
          const opacities = [0, 1, 2, 3, 4].map((actIdx) =>
            computeOverlayOpacity(progress, actIdx, PROJECTS_DATA.length)
          );
          setOverlayOpacities(opacities);

          // Determine current active section — use ref to read latest value and avoid stale closure
          let activeSec = navSections[0];
          for (let i = navSections.length - 1; i >= 0; i--) {
            if (progress >= navSections[i].progress - 0.02) {
              activeSec = navSections[i];
              break;
            }
          }
          if (activeSec && activeSec.id !== activeSectionRef.current) {
            setActiveSectionId(activeSec.id);
            if (activeSec.id !== prevSectionRef.current) {
              prevSectionRef.current = activeSec.id;
              playWhoosh();
            }
          }

          // Sync active project during Act III
          const workState = getWorkPresentationState(progress, PROJECTS_DATA.length);
          if (workState.isInWork) {
            const activeProj = PROJECTS_DATA[workState.activeProjectIndex];
            if (activeProj && activeProj.id !== selectedProjectRef.current) {
              setSelectedProjectId(activeProj.id);
            }
          }
        },
      });
    },
    { scope: containerRef, dependencies: [runwayRef, getLenis, navSections, playWhoosh] }
  );

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full text-[#FAF8F5] pointer-events-none z-10 ${
        isRtl ? 'rtl' : 'ltr'
      }`}
    >
      {/* --- 1. TOP-START FLOATING BRAND LOGO (Independent, Zero Background Box) --- */}
      <div className={`fixed top-4 sm:top-5 ${isRtl ? 'right-4 sm:right-8' : 'left-4 sm:left-8'} z-40 pointer-events-auto`}>
        <button
          onClick={() => handleJumpToSection(0)}
          className={`flex items-center gap-2.5 cursor-pointer group select-none ${isRtl ? 'flex-row-reverse text-right' : 'text-left'}`}
          aria-label={`${t.hero.name} — Home`}
        >
          {/* Custom FM Monogram Vector Medallion */}
          <div className="w-8 h-8 rounded-full bg-[#18110E]/80 backdrop-blur-md border border-[#D4AF37]/40 flex items-center justify-center p-1.5 shadow-lg group-hover:border-[#D4AF37] group-hover:scale-105 transition-all">
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
            <span className="text-xs sm:text-sm font-heading font-extrabold tracking-[0.18em] uppercase text-[#FAF8F5] group-hover:text-[#E59368] transition-colors leading-tight drop-shadow-md">
              {t.hero.name.toUpperCase()}
            </span>
            <span className="text-[8px] sm:text-[9px] font-mono tracking-[0.22em] uppercase text-[#D4AF37] drop-shadow-sm">
              {isRtl ? 'مطوّر برمجيات' : 'SOFTWARE DEVELOPER'}
            </span>
          </div>
        </button>
      </div>

      {/* --- 2. TOP-CENTER FLOATING NAVIGATION DOCK (With Language & Audio Controls) --- */}
      <nav
        className="fixed top-4 sm:top-5 left-1/2 -translate-x-1/2 z-40 hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#0D0A08]/85 backdrop-blur-2xl border border-[#D4AF37]/30 shadow-[0_16px_40px_rgba(0,0,0,0.6)] pointer-events-auto select-none"
        aria-label="Portfolio Navigation"
      >
        {/* Navigation Sections */}
        {navSections.map((sec) => {
          const isActive = activeSectionId === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => handleJumpToSection(sec.progress)}
              className={`relative px-3 sm:px-3.5 py-1 text-xs font-mono tracking-wider transition-all cursor-pointer rounded-full flex items-center gap-1.5 ${
                isActive
                  ? 'text-[#FAF8F5] font-semibold bg-[#BA5227] shadow-[0_2px_12px_rgba(186,82,39,0.45)]'
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

        {/* Vertical Divider */}
        <div className="w-[1px] h-3.5 bg-white/15 mx-1" />

        {/* Bilingual Language Switcher Button */}
        <button
          onClick={toggleLocale}
          aria-label={t.common.switchLanguage}
          className="px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wider text-[#D4AF37] hover:text-[#FAF8F5] hover:bg-white/[0.08] transition-all cursor-pointer font-semibold inline-flex items-center gap-1"
          title={t.common.switchLanguage}
        >
          <span>{locale === 'en' ? 'EN | العربية' : 'العربية | EN'}</span>
        </button>

        {/* Sound Toggle Button */}
        <button
          onClick={toggleSound}
          aria-label={t.common.toggleSound}
          className={`p-1.5 rounded-full text-xs transition-all cursor-pointer flex items-center justify-center ${
            soundEnabled
              ? 'text-[#E59368] bg-[#BA5227]/30 shadow-sm'
              : 'text-[#A89D8F] hover:text-[#FAF8F5] hover:bg-white/[0.06]'
          }`}
          title={soundEnabled ? t.common.soundOn : t.common.soundOff}
        >
          {soundEnabled ? (
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          )}
        </button>

        {/* Real-time Integrated Bronze Progress Hairline along bottom of dock */}
        <div className="absolute -bottom-[1px] inset-x-5 h-[1.5px] rounded-full overflow-hidden bg-white/10 pointer-events-none">
          <div
            ref={progressBarRef}
            className="h-full w-full origin-left bg-gradient-to-r from-[#BA5227] via-[#D4AF37] to-[#E59368] transition-transform duration-75"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>
      </nav>

      {/* --- 3. TOP-END STANDALONE ACTION CTA & MOBILE MENU TRIGGER --- */}
      <div className={`fixed top-4 sm:top-5 ${isRtl ? 'left-4 sm:left-8' : 'right-4 sm:right-8'} z-40 pointer-events-auto flex items-center gap-2 select-none`}>
        <button
          onClick={() => handleJumpToSection(navSections[4]?.progress || 0.85)}
          className="px-4 sm:px-5 py-2 rounded-full text-xs font-mono font-semibold border border-[#D4AF37]/40 bg-[#0D0A08]/80 hover:bg-[#BA5227] hover:border-white text-[#FAF8F5] backdrop-blur-2xl shadow-[0_8px_24px_rgba(0,0,0,0.5)] transition-all duration-300 cursor-pointer inline-flex items-center gap-1.5 group active:scale-95"
        >
          <span>{t.common.letsTalk}</span>
          <span className="text-xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
            {isRtl ? '↖' : '↗'}
          </span>
        </button>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => {
            playClick('light');
            setMobileMenuOpen((prev) => !prev);
          }}
          aria-label={mobileMenuOpen ? t.navigation.closeMenu : t.navigation.menu}
          className="md:hidden p-2 rounded-full border border-[#D4AF37]/30 bg-[#0D0A08]/80 text-[#FAF8F5] backdrop-blur-md shadow-lg cursor-pointer"
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

      {/* Floating Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className={`fixed inset-x-3 top-16 sm:top-20 z-40 p-4 rounded-2xl bg-[#140F0C]/95 backdrop-blur-2xl border border-[#D4AF37]/30 shadow-2xl flex flex-col gap-2 md:hidden pointer-events-auto animate-in slide-in-from-top-2 duration-200 ${isRtl ? 'text-right' : 'text-left'}`}>
          {/* Localized Navigation Links */}
          {navSections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => handleJumpToSection(sec.progress)}
              className={`w-full px-4 py-2.5 rounded-lg text-sm font-mono tracking-wider transition-colors cursor-pointer ${isRtl ? 'text-right' : 'text-left'} ${
                activeSectionId === sec.id
                  ? 'bg-[#BA5227] text-[#FAF8F5] font-semibold'
                  : 'text-[#D4C9BC] hover:bg-white/5 hover:text-[#FAF8F5]'
              }`}
            >
              {sec.label}
            </button>
          ))}

          {/* Mobile Quick Settings: Language & Audio */}
          <div className="pt-3 border-t border-[#E8E2D8]/10 mt-1 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                toggleLocale();
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border border-[#D4AF37]/35 bg-[#1C1512] text-[#D4AF37]"
            >
              {locale === 'en' ? 'العربية' : 'English (EN)'}
            </button>

            <button
              onClick={toggleSound}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border flex items-center gap-1.5 ${
                soundEnabled
                  ? 'border-[#BA5227] bg-[#BA5227]/25 text-[#FAF8F5]'
                  : 'border-[#E8E2D8]/20 bg-[#1C1512] text-[#A89D8F]'
              }`}
            >
              <span>{soundEnabled ? '🔊' : '🔇'}</span>
              <span>{soundEnabled ? t.common.soundOn : t.common.soundOff}</span>
            </button>

            <button
              onClick={() => handleJumpToSection(navSections[4]?.progress || 0.85)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold bg-[#BA5227] text-[#FAF8F5]"
            >
              {t.common.letsTalk} {isRtl ? '↖' : '↗'}
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

      {/* 3. SELECTED WORK (Section 03: Architectural Exhibition Console) */}
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
