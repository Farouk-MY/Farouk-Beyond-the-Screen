'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface CinematicVideoLayerProps {
  scrollProgressRef: React.MutableRefObject<number>;
}

interface ActVideoConfig {
  id: string;
  name: string;
  src: string;
  poster: string;
  range: [number, number]; // [startProgress, endProgress]
  duration: number; // seconds
}

const ACT_VIDEOS: ActVideoConfig[] = [
  {
    id: 'act-01',
    name: 'The Studio',
    src: '/videos/act-01-scrub.mp4',
    poster: '/posters/act-01-poster.jpg',
    range: [0.0, 0.2],
    duration: 10.026667,
  },
  {
    id: 'act-02',
    name: 'The Threshold',
    src: '/videos/act-02-scrub.mp4',
    poster: '/posters/act-02-poster.jpg',
    range: [0.2, 0.4],
    duration: 10.026667,
  },
  {
    id: 'act-03',
    name: 'The Work',
    src: '/videos/act-03-scrub.mp4',
    poster: '/posters/act-03-poster.jpg',
    range: [0.4, 0.6],
    duration: 10.026667,
  },
  {
    id: 'act-04',
    name: 'The Craft',
    src: '/videos/act-04-scrub.mp4',
    poster: '/posters/act-04-poster.jpg',
    range: [0.6, 0.8],
    duration: 10.026667,
  },
  {
    id: 'act-05',
    name: 'The Horizon',
    src: '/videos/act-05-scrub.mp4',
    poster: '/posters/act-05-poster.jpg',
    range: [0.8, 1.0],
    duration: 10.026667,
  },
];

export function CinematicVideoLayer({ scrollProgressRef }: CinematicVideoLayerProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  // Video element references
  const idleVideoRef = useRef<HTMLVideoElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Idle state
  const [isIdleActive, setIsIdleActive] = useState<boolean>(true);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollProgressRef = useRef<number>(0);

  // Initialize and drive frame-by-frame scrubbing
  useEffect(() => {
    if (prefersReducedMotion) return;

    let rafId: number;
    const OVERLAP = 0.035; // 3.5% scroll overlap window for crossfade

    const updateFrames = () => {
      const scroll = Math.max(0, Math.min(1, scrollProgressRef.current));
      const isStationaryAtOrigin = scroll <= 0.003;

      // Handle idle loop handoff
      if (isStationaryAtOrigin) {
        if (!idleTimeoutRef.current && !isIdleActive) {
          idleTimeoutRef.current = setTimeout(() => {
            setIsIdleActive(true);
            if (idleVideoRef.current && idleVideoRef.current.paused) {
              idleVideoRef.current.play().catch(() => {});
            }
          }, 1200);
        }
      } else {
        if (idleTimeoutRef.current) {
          clearTimeout(idleTimeoutRef.current);
          idleTimeoutRef.current = null;
        }
        if (isIdleActive) {
          setIsIdleActive(false);
        }
      }

      // Update each act's video currentTime and opacity
      ACT_VIDEOS.forEach((config, idx) => {
        const video = videoRefs.current[idx];
        if (!video) return;

        const [start, end] = config.range;
        const visibleStart = Math.max(0, start - OVERLAP);
        const visibleEnd = Math.min(1, end + OVERLAP);

        const isVisible = scroll >= visibleStart && scroll <= visibleEnd;

        if (isVisible) {
          // Calculate opacity with smooth crossfading in overlap zones
          let opacity = 1.0;
          if (scroll < start) {
            // Fading in
            opacity = (scroll - visibleStart) / OVERLAP;
          } else if (scroll > end) {
            // Fading out
            opacity = (visibleEnd - scroll) / OVERLAP;
          }
          opacity = Math.max(0, Math.min(1, opacity));

          // If idle is active and this is act 1, fade out act 1 scrub video
          if (idx === 0 && isIdleActive) {
            opacity = 0;
          }

          video.style.opacity = opacity.toFixed(3);
          video.style.visibility = opacity > 0 ? 'visible' : 'hidden';

          // Calculate target timestamp
          const localProgress = Math.max(0, Math.min(1, (scroll - start) / (end - start)));
          const targetTime = localProgress * config.duration;

          // Only seek if difference exceeds half a frame (~0.02s) to prevent unnecessary seek calls
          if (Math.abs(video.currentTime - targetTime) > 0.02) {
            video.currentTime = targetTime;
          }
        } else {
          video.style.opacity = '0';
          video.style.visibility = 'hidden';
        }
      });

      lastScrollProgressRef.current = scroll;
      rafId = requestAnimationFrame(updateFrames);
    };

    rafId = requestAnimationFrame(updateFrames);

    return () => {
      cancelAnimationFrame(rafId);
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
    };
  }, [prefersReducedMotion, isIdleActive, scrollProgressRef]);

  // Reduced motion fallback view
  if (prefersReducedMotion) {
    return (
      <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0 bg-[#07080B]">
        <div
          className="w-full h-full bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `url(${ACT_VIDEOS[0].poster})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080B] via-transparent to-[#07080B]/60" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0 bg-[#07080B]"
      aria-hidden="true"
    >
      {/* 1. Act I Continuous Typing Idle Loop (Forward-only, zero reverse motion) */}
      <video
        ref={idleVideoRef}
        src="/videos/act-01-idle-forward.mp4"
        loop
        muted
        playsInline
        autoPlay
        poster="/posters/act-01-poster.jpg"
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-out ${
          isIdleActive ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        style={{
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
        }}
      />

      {/* 2. Scroll-Scrubbed Main Timeline Video Layers for Acts I - V */}
      {ACT_VIDEOS.map((act, idx) => (
        <video
          key={act.id}
          ref={(el) => {
            videoRefs.current[idx] = el;
          }}
          src={act.src}
          poster={act.poster}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: idx === 0 && !isIdleActive ? 1 : 0,
            visibility: idx === 0 && !isIdleActive ? 'visible' : 'hidden',
            transform: 'translate3d(0, 0, 0)',
            backfaceVisibility: 'hidden',
            willChange: 'opacity',
          }}
        />
      ))}

      {/* 3. Subtle Cinematic Vignette & Ambient Vignette (Keeps DOM text ultra-crisp while preserving cinematic grade) */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-black/25 pointer-events-none" />
    </div>
  );
}
