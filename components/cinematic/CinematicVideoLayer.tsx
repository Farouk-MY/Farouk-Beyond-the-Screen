'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useLoading } from '@/hooks/useLoadingProgress';
import {
  getCinematicClips,
  IDLE_LOOP_CONFIG,
  computeActOpacitiesAndTimes,
} from '@/config/cinematicTimeline';
import { PROJECTS_DATA } from '@/config/portfolioData';

interface CinematicVideoLayerProps {
  scrollProgressRef: React.MutableRefObject<number>;
}

export function CinematicVideoLayer({ scrollProgressRef }: CinematicVideoLayerProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { reportReady } = useLoading();

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
  const handoffTimeRef = useRef<number>(0);
  const thresholdBloomRef = useRef<HTMLDivElement | null>(null);

  const cinematicClips = getCinematicClips(PROJECTS_DATA.length);

  // Synchronize ref with state
  useEffect(() => {
    isIdleActiveRef.current = isIdleActive;
  }, [isIdleActive]);

  // Track readiness of critical initial video assets for NarrativeLoader
  useEffect(() => {
    if (prefersReducedMotion) {
      reportReady('idleVideo');
      reportReady('scrubVideo');
      return;
    }

    const idle = idleVideoRef.current;
    const act1 = videoRefs.current[0];

    const handleIdleReady = () => {
      reportReady('idleVideo');
    };

    const handleAct1Ready = () => {
      reportReady('scrubVideo');
    };

    if (idle) {
      if (idle.readyState >= 2) {
        handleIdleReady();
      } else {
        idle.addEventListener('canplay', handleIdleReady, { once: true });
        idle.addEventListener('loadeddata', handleIdleReady, { once: true });
        idle.addEventListener('error', handleIdleReady, { once: true });
      }
    }

    if (act1) {
      if (act1.readyState >= 1) {
        handleAct1Ready();
      } else {
        act1.addEventListener('canplay', handleAct1Ready, { once: true });
        act1.addEventListener('loadeddata', handleAct1Ready, { once: true });
        act1.addEventListener('loadedmetadata', handleAct1Ready, { once: true });
        act1.addEventListener('error', handleAct1Ready, { once: true });
      }
    }

    return () => {
      if (idle) {
        idle.removeEventListener('canplay', handleIdleReady);
        idle.removeEventListener('loadeddata', handleIdleReady);
        idle.removeEventListener('error', handleIdleReady);
      }
      if (act1) {
        act1.removeEventListener('canplay', handleAct1Ready);
        act1.removeEventListener('loadeddata', handleAct1Ready);
        act1.removeEventListener('loadedmetadata', handleAct1Ready);
        act1.removeEventListener('error', handleAct1Ready);
      }
    };
  }, [prefersReducedMotion, reportReady]);

  // Safe seek helper with frame coalescing and 24fps alignment
  const requestFrameSeek = useCallback((actIdx: number, targetTimeSeconds: number) => {
    const video = videoRefs.current[actIdx];
    if (!video || !video.duration) return;

    // Align strictly to 24 FPS source frames with safe EOF buffer margin (max frame 232)
    const targetFrame = Math.round(targetTimeSeconds * 24);
    const maxSafeFrame = video.duration ? Math.min(232, Math.floor((video.duration - 0.25) * 24)) : 232;
    const clampedFrame = Math.max(0, Math.min(maxSafeFrame, targetFrame));

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

      // Seek watchdog timer prevents seek lock if browser drops seeked event
      let seekTimeout: ReturnType<typeof setTimeout> | null = null;

      const handleSeeking = () => {
        if (seekTimeout) clearTimeout(seekTimeout);
        seekTimeout = setTimeout(() => {
          isSeekingRef.current[idx] = false;
        }, 120);
      };

      const handleSeeked = () => {
        if (seekTimeout) clearTimeout(seekTimeout);
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

      const handleError = () => {
        if (seekTimeout) clearTimeout(seekTimeout);
        isSeekingRef.current[idx] = false;
        try {
          video.load();
        } catch {}
      };

      video.addEventListener('seeking', handleSeeking);
      video.addEventListener('seeked', handleSeeked);
      video.addEventListener('error', handleError);
      cleanups.push(() => {
        if (seekTimeout) clearTimeout(seekTimeout);
        video.removeEventListener('seeking', handleSeeking);
        video.removeEventListener('seeked', handleSeeked);
        video.removeEventListener('error', handleError);
      });

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
    const clips = getCinematicClips(PROJECTS_DATA.length);

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
              const act1Time = act1.currentTime || 0;
              const mappedIdleTime = IDLE_LOOP_CONFIG.mapSourceTimeToIdleTime(act1Time);
              idle.currentTime = mappedIdleTime;

              const playPromise = idle.play();
              if (playPromise !== undefined) {
                playPromise.catch(() => {});
              }

              const onFrameReady = () => {
                setIsIdleActive(true);
                idleHandedOffRef.current = false;
                handoffTimeRef.current = 0;
                idle.style.display = 'block';
                idle.style.opacity = '1';
                idle.style.visibility = 'visible';
                act1.style.display = 'none';
                act1.style.opacity = '0';
                act1.style.visibility = 'hidden';
              };

              if ('requestVideoFrameCallback' in idle) {
                const idleRvfc = idle as HTMLVideoElement & {
                  requestVideoFrameCallback: (cb: () => void) => number;
                };
                idleRvfc.requestVideoFrameCallback(onFrameReady);
              } else {
                setTimeout(onFrameReady, 40);
              }
            } else {
              setIsIdleActive(true);
              idleHandedOffRef.current = false;
              handoffTimeRef.current = 0;
            }
          }, 240);
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
            handoffTimeRef.current = sourceTime;

            // Direct sync & immediate display swap: zero flicker, zero lag
            try {
              act1.currentTime = sourceTime;
            } catch {}

            idle.pause();
            idle.style.display = 'none';
            idle.style.opacity = '0';
            idle.style.visibility = 'hidden';

            act1.style.display = 'block';
            act1.style.opacity = '1';
            act1.style.visibility = 'visible';

            setIsIdleActive(false);
          } else {
            setIsIdleActive(false);
          }
        }
      }

      // --- MASTER VIDEO TIMELINE EVALUATION WITH STABLE EXHIBITION HOLD ---
      const { opacities, visibleActs, localTimes } = computeActOpacitiesAndTimes(
        scroll,
        PROJECTS_DATA.length
      );

      clips.forEach((clip, idx) => {
        const video = videoRefs.current[idx];
        if (!video) return;

        // While idle is active at origin, Act 1 scrub video is strictly hidden and never rendered
        if (idx === 0 && isIdleActiveRef.current) {
          video.style.opacity = '0';
          video.style.visibility = 'hidden';
          video.style.display = 'none';
          if (idleVideoRef.current) {
            idleVideoRef.current.style.display = 'block';
            idleVideoRef.current.style.opacity = '1';
            idleVideoRef.current.style.visibility = 'visible';
          }
          return;
        } else if (idx === 0) {
          video.style.display = 'block';
          if (idleVideoRef.current) {
            idleVideoRef.current.style.display = 'none';
            idleVideoRef.current.style.opacity = '0';
            idleVideoRef.current.style.visibility = 'hidden';
          }
        }

        const isVisible = visibleActs[idx];
        const targetOpacity = opacities[idx];

        if (isVisible) {
          let seekTime = localTimes[idx];

          if (idx === 0) {
            const [start, end] = clip.scrollRange;
            const localProgress = Math.max(0, Math.min(1, (scroll - start) / (end - start)));

            if (handoffTimeRef.current > 0) {
              // Monotonically advance forward from handoffTime at scroll start to 10.0s at Act 1 end
              seekTime = handoffTimeRef.current + (clip.duration - handoffTimeRef.current) * localProgress;

              // When user has completed the Act 1 scroll progression, clear handoff offset
              if (localProgress >= 0.92) {
                handoffTimeRef.current = 0;
              }
            } else {
              seekTime = localTimes[0];
            }
          }

          requestFrameSeek(idx, seekTime);

          video.style.opacity = targetOpacity.toFixed(3);
          video.style.visibility = targetOpacity > 0 ? 'visible' : 'hidden';

          if (video.preload !== 'auto') {
            video.preload = 'auto';
          }
        } else {
          video.style.opacity = '0';
          video.style.visibility = 'hidden';

          // Proactively buffer adjacent scenes (active act ± 1) so video seeking is instant upon crossing thresholds
          let activeAct = 0;
          for (let cIdx = clips.length - 1; cIdx >= 0; cIdx--) {
            if (scroll >= clips[cIdx].scrollRange[0] - 0.01) {
              activeAct = cIdx;
              break;
            }
          }
          const isAdjacent = Math.abs(idx - activeAct) <= 1;
          if (isAdjacent && video.preload !== 'auto') {
            video.preload = 'auto';
          }
        }
      });

      // --- THRESHOLD SUNLIGHT BLOOM EFFECT ---
      // Replicates natural lens aperture adaptation when opening the glass door from studio to terrace
      if (thresholdBloomRef.current) {
        const threshold = clips[0]?.scrollRange[1] ?? 0.149;
        const dist = Math.abs(scroll - threshold);
        const bloomWindow = 0.007;
        const bloom = dist < bloomWindow ? (1 - dist / bloomWindow) * 0.22 : 0;
        thresholdBloomRef.current.style.opacity = bloom > 0.005 ? bloom.toFixed(3) : '0';
        thresholdBloomRef.current.style.display = bloom > 0.005 ? 'block' : 'none';
      }

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

  // Fallback static view for reduced-motion users
  if (prefersReducedMotion) {
    return (
      <div className="absolute inset-0 w-full h-full bg-[#0E0C0A] pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cinematicClips[0].poster}
          alt="Farouk Messai — Studio Workspace"
          className="w-full h-full object-cover opacity-80"
          style={{ objectPosition: cinematicClips[0].objectPosition.desktop }}
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
      {/* 1. Act I Continuous Forward Typing Idle Loop (Strictly mutually exclusive with scrub video) */}
      <video
        ref={idleVideoRef}
        src={IDLE_LOOP_CONFIG.src}
        loop
        muted
        playsInline
        autoPlay
        poster={cinematicClips[0].poster}
        preload="auto"
        onCanPlay={() => reportReady('idleVideo')}
        onLoadedData={() => reportReady('idleVideo')}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          display: isIdleActive ? 'block' : 'none',
          opacity: isIdleActive ? 1 : 0,
          visibility: isIdleActive ? 'visible' : 'hidden',
          objectPosition: cinematicClips[0].objectPosition.desktop,
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
        }}
      />

      {/* 2. Scroll-Scrubbed Master Timeline Video Layers (Acts I - V) */}
      {cinematicClips.map((clip, idx) => (
        <video
          key={clip.id}
          ref={(el) => {
            videoRefs.current[idx] = el;
          }}
          src={clip.src}
          poster={clip.poster}
          muted
          playsInline
          // Acts I & II preload automatically for instant initial scrub & adjacent handoff.
          // Subsequent Acts (III, IV, V) start with 'metadata' to avoid downloading ~25MB on initial load,
          // dynamically upgrading to 'auto' as the user approaches them.
          preload={idx <= 1 ? 'auto' : 'metadata'}
          onCanPlay={idx === 0 ? () => reportReady('scrubVideo') : undefined}
          onLoadedData={idx === 0 ? () => reportReady('scrubVideo') : undefined}
          onLoadedMetadata={idx === 0 ? () => reportReady('scrubVideo') : undefined}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            display: idx === 0 && isIdleActive ? 'none' : 'block',
            opacity: idx === 0 && !isIdleActive ? 1 : 0,
            visibility: idx === 0 && !isIdleActive ? 'visible' : 'hidden',
            objectPosition: clip.objectPosition.desktop,
            transform: 'translate3d(0, 0, 0)',
            backfaceVisibility: 'hidden',
            willChange: 'opacity',
          }}
        />
      ))}

      {/* 3. Mediterranean Sunlight Threshold Bloom (Flashes softly when opening the terrace door) */}
      <div
        ref={thresholdBloomRef}
        className="absolute inset-0 bg-gradient-to-tr from-[#FAF8F5]/35 via-[#F7D4A2]/25 to-[#FAF8F5]/35 pointer-events-none mix-blend-screen transition-opacity duration-75"
        style={{ opacity: 0, display: 'none' }}
      />

      {/* 4. Subtle Atmospheric Vignette — Preserves camera clarity, light, and contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0E0C0A]/40 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0E0C0A]/40 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
