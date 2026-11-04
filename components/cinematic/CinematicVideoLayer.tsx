'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import {
  CINEMATIC_CLIPS,
  IDLE_LOOP_CONFIG,
  computeActOpacitiesAndTimes,
} from '@/config/cinematicTimeline';

interface CinematicVideoLayerProps {
  scrollProgressRef: React.MutableRefObject<number>;
}

export function CinematicVideoLayer({ scrollProgressRef }: CinematicVideoLayerProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  // Video element references
  const idleVideoRef = useRef<HTMLVideoElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Playback & seeking state trackers per act (indices 0..4)
  const isSeekingRef = useRef<boolean[]>([false, false, false, false, false]);
  const pendingFrameRef = useRef<(number | null)[]>([null, null, null, null, null]);
  const lastSoughtFrameRef = useRef<number[]>([-1, -1, -1, -1, -1]);
  const hasPresentedFrameRef = useRef<boolean[]>([false, false, false, false, false]);

  // Idle loop handoff state
  const [isIdleActive, setIsIdleActive] = useState<boolean>(true);
  const isIdleActiveRef = useRef<boolean>(true);
  const idleHandedOffRef = useRef<boolean>(false);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronize ref with state
  useEffect(() => {
    isIdleActiveRef.current = isIdleActive;
  }, [isIdleActive]);

  // Safe seek helper with frame coalescing and 24fps alignment
  const requestFrameSeek = useCallback((actIdx: number, targetTimeSeconds: number) => {
    const video = videoRefs.current[actIdx];
    if (!video || !video.duration) return;

    // Align strictly to 24 FPS source frames
    const targetFrame = Math.round(targetTimeSeconds * 24);
    const clampedFrame = Math.max(0, Math.min(239, targetFrame));

    // Redundant seek elimination
    if (lastSoughtFrameRef.current[actIdx] === clampedFrame) {
      return;
    }

    if (isSeekingRef.current[actIdx]) {
      // Coalesce: store newest target frame while current seek is in flight
      pendingFrameRef.current[actIdx] = clampedFrame;
      return;
    }

    // Initiate new seek
    isSeekingRef.current[actIdx] = true;
    lastSoughtFrameRef.current[actIdx] = clampedFrame;
    const targetSeconds = clampedFrame / 24;

    try {
      video.currentTime = targetSeconds;
    } catch {
      isSeekingRef.current[actIdx] = false;
    }
  }, []);

  // Set up seek event listeners and presented-frame confirmation for each video
  useEffect(() => {
    const cleanups: (() => void)[] = [];

    videoRefs.current.forEach((video, idx) => {
      if (!video) return;

      const handleSeeked = () => {
        isSeekingRef.current[idx] = false;
        hasPresentedFrameRef.current[idx] = true;

        // Drain pending coalesced frame if newer target arrived
        const pending = pendingFrameRef.current[idx];
        if (pending !== null) {
          pendingFrameRef.current[idx] = null;
          if (pending !== lastSoughtFrameRef.current[idx]) {
            isSeekingRef.current[idx] = true;
            lastSoughtFrameRef.current[idx] = pending;
            try {
              video.currentTime = pending / 24;
            } catch {
              isSeekingRef.current[idx] = false;
            }
          }
        }
      };

      video.addEventListener('seeked', handleSeeked);
      cleanups.push(() => video.removeEventListener('seeked', handleSeeked));

      // Instrument requestVideoFrameCallback if available for telemetry & zero-stale presentation
      if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
        let rvfcHandle: number;
        const videoWithRvfc = video as HTMLVideoElement & {
          requestVideoFrameCallback: (callback: (now: DOMHighResTimeStamp, metadata: unknown) => void) => number;
          cancelVideoFrameCallback: (handle: number) => void;
        };

        const onRvfc = () => {
          hasPresentedFrameRef.current[idx] = true;
          rvfcHandle = videoWithRvfc.requestVideoFrameCallback(onRvfc);
        };
        rvfcHandle = videoWithRvfc.requestVideoFrameCallback(onRvfc);
        cleanups.push(() => {
          if ('cancelVideoFrameCallback' in videoWithRvfc) {
            videoWithRvfc.cancelVideoFrameCallback(rvfcHandle);
          }
        });
      }
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, []);

  // Master scrubbing and frame-confirmed idle handoff RAF loop
  useEffect(() => {
    if (prefersReducedMotion) return;

    let rafId: number;

    const tick = () => {
      const scroll = Math.max(0, Math.min(1, scrollProgressRef.current));
      const isAtOrigin = scroll <= 0.002;

      // --- FRAME-CONFIRMED IDLE TO SCRUB HANDOFF ---
      if (isAtOrigin) {
        // Returning to origin: if stationary at top for 280ms, smoothly restore forward typing loop
        if (!idleTimeoutRef.current && !isIdleActiveRef.current) {
          idleTimeoutRef.current = setTimeout(() => {
            const idle = idleVideoRef.current;
            const act1 = videoRefs.current[0];
            if (idle && act1) {
              // Map Act 1 scrub position to matching idle loop frame
              const act1Time = act1.currentTime || 0;
              const mappedIdleTime = IDLE_LOOP_CONFIG.mapSourceTimeToIdleTime(act1Time);
              idle.currentTime = mappedIdleTime;

              const playPromise = idle.play();
              if (playPromise !== undefined) {
                playPromise.catch(() => {});
              }

              // Confirm presentation of target frame before setting isIdleActive to true
              const onFrameReady = () => {
                setIsIdleActive(true);
                idleHandedOffRef.current = false;
              };

              if ('requestVideoFrameCallback' in idle) {
                const idleRvfc = idle as HTMLVideoElement & {
                  requestVideoFrameCallback: (cb: () => void) => number;
                };
                idleRvfc.requestVideoFrameCallback(onFrameReady);
              } else {
                setTimeout(onFrameReady, 50);
              }
            } else {
              setIsIdleActive(true);
              idleHandedOffRef.current = false;
            }
          }, 280);
        }
      } else {
        // Scrolling active: cancel return timeout
        if (idleTimeoutRef.current) {
          clearTimeout(idleTimeoutRef.current);
          idleTimeoutRef.current = null;
        }

        // Exact frame handoff when initiating scroll from idle
        if (isIdleActiveRef.current && !idleHandedOffRef.current) {
          idleHandedOffRef.current = true;
          const idle = idleVideoRef.current;
          const act1 = videoRefs.current[0];

          if (idle && act1) {
            const idleTime = idle.currentTime || 0;
            const sourceTime = IDLE_LOOP_CONFIG.mapIdleTimeToSourceTime(idleTime);

            // Seek Act 1 to the exact frame where Farouk was typing
            requestFrameSeek(0, sourceTime);

            // Wait for Act 1 to confirm seek or decode frame before hiding idle
            let handedOff = false;
            const finalizeHandoff = () => {
              if (handedOff) return;
              handedOff = true;
              setIsIdleActive(false);
              idle.pause();
            };

            const onSeeked = () => {
              act1.removeEventListener('seeked', onSeeked);
              finalizeHandoff();
            };

            act1.addEventListener('seeked', onSeeked, { once: true });

            // Safety timeout to guarantee handoff never stalls if seeked fired immediately
            setTimeout(finalizeHandoff, 140);
          } else {
            setIsIdleActive(false);
          }
        }
      }

      // --- MASTER VIDEO TIMELINE EVALUATION ---
      const { opacities, visibleActs, localTimes } = computeActOpacitiesAndTimes(scroll);

      CINEMATIC_CLIPS.forEach((clip, idx) => {
        const video = videoRefs.current[idx];
        if (!video) return;

        const isVisible = visibleActs[idx];
        let targetOpacity = opacities[idx];

        // While idle is active at origin, Act 1 scrub video is hidden
        if (idx === 0 && isIdleActiveRef.current) {
          targetOpacity = 0;
        }

        if (isVisible) {
          // Apply frame seek to active / transitioning videos
          requestFrameSeek(idx, localTimes[idx]);

          video.style.opacity = targetOpacity.toFixed(3);
          video.style.visibility = targetOpacity > 0 ? 'visible' : 'hidden';

          // Ensure preloading for visible clips
          if (video.preload !== 'auto') {
            video.preload = 'auto';
          }
        } else {
          // Non-visible clips: hide and keep idle to conserve decoder resources
          video.style.opacity = '0';
          video.style.visibility = 'hidden';

          // Progressive preloading: preload adjacent clips only
          const activeAct = CINEMATIC_CLIPS.findIndex(
            (c) => scroll >= c.scrollRange[0] && scroll <= c.scrollRange[1]
          );
          const isAdjacent = Math.abs(idx - activeAct) <= 1;
          if (isAdjacent && video.preload !== 'auto') {
            video.preload = 'auto';
          }
        }
      });

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
    };
  }, [prefersReducedMotion, requestFrameSeek, scrollProgressRef]);

  // Accessibility: Reduced Motion View
  if (prefersReducedMotion) {
    return (
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0 bg-[#0E0C0A]">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${CINEMATIC_CLIPS[0].poster})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0C0A] via-transparent to-[#0E0C0A]/60" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0 bg-[#0E0C0A]"
      aria-hidden="true"
    >
      {/* 1. Act I Continuous Forward Typing Idle Loop */}
      <video
        ref={idleVideoRef}
        src={IDLE_LOOP_CONFIG.src}
        loop
        muted
        playsInline
        autoPlay
        poster={CINEMATIC_CLIPS[0].poster}
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-out ${
          isIdleActive ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        style={{
          objectPosition: '55% 50%',
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
        }}
      />

      {/* 2. Scroll-Scrubbed Master Timeline Video Layers (Acts I - V) */}
      {CINEMATIC_CLIPS.map((clip, idx) => (
        <video
          key={clip.id}
          ref={(el) => {
            videoRefs.current[idx] = el;
          }}
          src={clip.src}
          poster={clip.poster}
          muted
          playsInline
          preload={idx <= 1 ? 'auto' : 'metadata'}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-150 ease-out"
          style={{
            opacity: idx === 0 && !isIdleActive ? 1 : 0,
            visibility: idx === 0 && !isIdleActive ? 'visible' : 'hidden',
            objectPosition: clip.objectPosition.desktop,
            transform: 'translate3d(0, 0, 0)',
            backfaceVisibility: 'hidden',
            willChange: 'opacity',
          }}
        />
      ))}

      {/* 3. Mediterranean Editorial Vignette (Gentle warm limestone edge gradient) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
    </div>
  );
}
