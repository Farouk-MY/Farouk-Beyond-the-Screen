import type {
  CinematicClipConfig,
  CinematicTransitionConfig,
  ProjectItem,
} from '@/types/portfolio';

export const MASTER_FPS = 24;
export const ACT_CLIP_DURATION = 10.0; // seconds
export const ACT_TOTAL_FRAMES = 240; // 0..239

// Total scroll runway: 600svh provides 500svh of actual travel inside a 100svh sticky viewport.
// Each of the 5 Acts corresponds to exactly 100svh of travel (20% of scroll span).
export const RUNWAY_HEIGHT_SVH = 600;

export const CINEMATIC_CLIPS: CinematicClipConfig[] = [
  {
    id: 'origin',
    actNumber: 'ACT I',
    name: 'THE STUDIO',
    subtitle: 'Architectural Workspace & Origin',
    src: '/videos/act-01-scrub.mp4',
    poster: '/posters/act-01-poster.jpg',
    duration: ACT_CLIP_DURATION,
    sourceFps: MASTER_FPS,
    totalFrames: ACT_TOTAL_FRAMES,
    scrollRange: [0.0, 0.20],
    safeArea: {
      x: 0.06,
      y: 0.10,
      w: 0.40,
      h: 0.50,
      maxWidthPx: 560,
      visibilityWindow: [0.0, 0.70], // Fades gracefully as Farouk stands up and walks to door
      description: 'Clean upper-left wall area above monitors and desk',
    },
    objectPosition: {
      desktop: '50% 50%',
      mobile: '58% 50%', // Keeps Farouk seated and workstation framed in portrait
    },
  },
  {
    id: 'journey',
    actNumber: 'ACT II',
    name: 'THE THRESHOLD',
    subtitle: 'Exterior Terrace & Natural Landscape',
    src: '/videos/act-02-scrub.mp4',
    poster: '/posters/act-02-poster.jpg',
    duration: ACT_CLIP_DURATION,
    sourceFps: MASTER_FPS,
    totalFrames: ACT_TOTAL_FRAMES,
    scrollRange: [0.20, 0.40],
    safeArea: {
      x: 0.08,
      y: 0.16,
      w: 0.42,
      h: 0.65,
      maxWidthPx: 580,
      visibilityWindow: [0.05, 0.95],
      description: 'Sunlit limestone facade on the left with olive tree shadows',
    },
    objectPosition: {
      desktop: '50% 50%',
      mobile: '50% 50%',
    },
  },
  {
    id: 'work',
    actNumber: 'ACT III',
    name: 'THE WORK',
    subtitle: 'Digital Project Exhibition',
    src: '/videos/act-03-scrub.mp4',
    poster: '/posters/act-03-poster.jpg',
    duration: ACT_CLIP_DURATION,
    sourceFps: MASTER_FPS,
    totalFrames: ACT_TOTAL_FRAMES,
    scrollRange: [0.40, 0.60],
    safeArea: {
      x: 0.06,
      y: 0.12,
      w: 0.38,
      h: 0.78,
      maxWidthPx: 560,
      visibilityWindow: [0.10, 0.98], // Reveals once Farouk settles at the exhibition display wall
      description: 'Left architectural corridor; leaves center display and Farouk visible on right',
    },
    objectPosition: {
      desktop: '50% 50%',
      mobile: '65% 50%', // Ensures physical exhibition wall & character stay framed
    },
  },
  {
    id: 'craft',
    actNumber: 'ACT IV',
    name: 'THE CRAFT',
    subtitle: 'Systems Lab & Engineering Domains',
    src: '/videos/act-04-scrub.mp4',
    poster: '/posters/act-04-poster.jpg',
    duration: ACT_CLIP_DURATION,
    sourceFps: MASTER_FPS,
    totalFrames: ACT_TOTAL_FRAMES,
    scrollRange: [0.60, 0.80],
    safeArea: {
      x: 0.06,
      y: 0.14,
      w: 0.42,
      h: 0.70,
      maxWidthPx: 600,
      // Left side is NOT safe for full 10s: Farouk enters from left, walks to center, then exits back left.
      // Overlay is art-directed to appear while he is at the center pedestal.
      visibilityWindow: [0.22, 0.74],
      description: 'Travertine wall opposite holographic pedestal; fades before character crosses to exit',
    },
    objectPosition: {
      desktop: '50% 50%',
      mobile: '60% 50%',
    },
  },
  {
    id: 'beyond',
    actNumber: 'ACT V',
    name: 'THE HORIZON',
    subtitle: 'Sunset Balcony & Contact Terminal',
    src: '/videos/act-05-scrub.mp4',
    poster: '/posters/act-05-poster.jpg',
    duration: ACT_CLIP_DURATION,
    sourceFps: MASTER_FPS,
    totalFrames: ACT_TOTAL_FRAMES,
    scrollRange: [0.80, 1.00],
    safeArea: {
      x: 0.08,
      y: 0.14,
      w: 0.44,
      h: 0.72,
      maxWidthPx: 580,
      visibilityWindow: [0.15, 1.00], // Fades in as Farouk moves to railing on right
      description: 'Serene sunset sky & sea horizon on the left; Farouk stands at railing on right',
    },
    objectPosition: {
      desktop: '50% 50%',
      mobile: '70% 50%', // Frames Farouk at the railing overlooking the sea
    },
  },
];

// Per-boundary transition configurations
export const CINEMATIC_TRANSITIONS: CinematicTransitionConfig[] = [
  {
    boundaryProgress: 0.20,
    overlapSpan: 0.024, // +/- 0.012 scroll progress (~0.24s video duration)
    strategy: 'short-crossfade',
    description: 'Act 1 reaching door handle -> Act 2 opening door onto terrace',
  },
  {
    boundaryProgress: 0.40,
    overlapSpan: 0.020, // +/- 0.010 scroll progress (~0.20s video duration)
    strategy: 'architectural-cut',
    description: 'Act 2 terrace promenade threshold -> Act 3 gallery interior cut',
  },
  {
    boundaryProgress: 0.60,
    overlapSpan: 0.024,
    strategy: 'corridor-dissolve',
    description: 'Act 3 gallery exit -> Act 4 systems lab entrance',
  },
  {
    boundaryProgress: 0.80,
    overlapSpan: 0.024,
    strategy: 'balcony-dissolve',
    description: 'Act 4 window walk -> Act 5 open sunset balcony',
  },
];

// Act I Idle Typing Loop Configuration
export const IDLE_LOOP_CONFIG = {
  src: '/videos/act-01-idle-forward.mp4',
  duration: 2.833333,
  sourceFps: 24,
  totalFrames: 68,
  // Mapping from idle time to Act 1 source time (from scripts/test-forward-loop.mjs)
  mapIdleTimeToSourceTime: (tIdle: number): number => {
    const wrapped = ((tIdle % 2.833333) + 2.833333) % 2.833333;
    // For t <= 2.4s, src = 0.4 + t. For 2.4 < t <= 2.833s, it crossfades back into 0.0..0.4
    if (wrapped <= 2.4) {
      return 0.4 + wrapped;
    }
    // During 0.4s crossfade window, linearly interpolate between end and beginning
    const frac = (wrapped - 2.4) / 0.433333;
    return 2.8 + frac * 0.4; // between 2.8s and 3.2s
  },
};

/**
 * Returns the active Act definition for a given scroll progress [0..1]
 */
export function getActiveCinematicAct(progress: number): CinematicClipConfig {
  const clamped = Math.max(0, Math.min(1, progress));
  for (let i = CINEMATIC_CLIPS.length - 1; i >= 0; i--) {
    if (clamped >= CINEMATIC_CLIPS[i].scrollRange[0]) {
      return CINEMATIC_CLIPS[i];
    }
  }
  return CINEMATIC_CLIPS[0];
}

/**
 * Calculates local progress [0..1] within an act's scroll range
 */
export function getActLocalProgress(progress: number, actIndex: number): number {
  const clip = CINEMATIC_CLIPS[actIndex];
  if (!clip) return 0;
  const [start, end] = clip.scrollRange;
  return Math.max(0, Math.min(1, (progress - start) / (end - start)));
}

/**
 * Calculates local video media time [0..10.0s] for an act
 */
export function getActLocalTime(progress: number, actIndex: number): number {
  const localProg = getActLocalProgress(progress, actIndex);
  return localProg * CINEMATIC_CLIPS[actIndex].duration;
}

/**
 * Computes video opacity and playback window for each act with seamless progressive transitions.
 * Both outgoing and incoming clips advance smoothly during transition overlaps.
 */
export function computeActOpacitiesAndTimes(progress: number): {
  opacities: number[];
  visibleActs: boolean[];
  localTimes: number[];
} {
  const opacities = [0, 0, 0, 0, 0];
  const visibleActs = [false, false, false, false, false];
  const localTimes = [0, 0, 0, 0, 0];

  const p = Math.max(0, Math.min(1, progress));

  CINEMATIC_CLIPS.forEach((clip, idx) => {
    const [start, end] = clip.scrollRange;

    // Transition overlap boundaries
    const prevTransition = idx > 0 ? CINEMATIC_TRANSITIONS[idx - 1] : null;
    const nextTransition = idx < CINEMATIC_CLIPS.length - 1 ? CINEMATIC_TRANSITIONS[idx] : null;

    const leadIn = prevTransition ? prevTransition.overlapSpan / 2 : 0;
    const leadOut = nextTransition ? nextTransition.overlapSpan / 2 : 0;

    const visibleStart = Math.max(0, start - leadIn);
    const visibleEnd = Math.min(1, end + leadOut);

    const isVisible = p >= visibleStart && p <= visibleEnd;
    visibleActs[idx] = isVisible;

    // Calculate local time: maps from start to end
    const localProgress = Math.max(0, Math.min(1, (p - start) / (end - start)));
    localTimes[idx] = localProgress * clip.duration;

    if (isVisible) {
      let opacity = 1.0;
      if (prevTransition && p < start) {
        // Fading in from previous act
        opacity = (p - visibleStart) / (start - visibleStart);
      } else if (nextTransition && p > end) {
        // Fading out into next act
        opacity = (visibleEnd - p) / (visibleEnd - end);
      }
      opacities[idx] = Math.max(0, Math.min(1, opacity));
    } else {
      opacities[idx] = 0;
    }
  });

  return { opacities, visibleActs, localTimes };
}

/**
 * Calculates overlay opacity for an act based on its calibrated safe-area visibility window
 */
export function computeOverlayOpacity(progress: number, actIndex: number): number {
  const clip = CINEMATIC_CLIPS[actIndex];
  if (!clip) return 0;

  const [start, end] = clip.scrollRange;
  if (progress < start || progress > end) return 0;

  const localProgress = (progress - start) / (end - start);
  const [visStart, visEnd] = clip.safeArea.visibilityWindow;

  const FADE_SPAN = 0.08; // 8% local progress fade duration

  if (localProgress < visStart - FADE_SPAN || localProgress > visEnd + FADE_SPAN) {
    return 0;
  }

  if (localProgress < visStart) {
    return Math.max(0, (localProgress - (visStart - FADE_SPAN)) / FADE_SPAN);
  }

  if (localProgress > visEnd) {
    return Math.max(0, ((visEnd + FADE_SPAN) - localProgress) / FADE_SPAN);
  }

  return 1.0;
}

/**
 * Maps an Act III local time (e.g. 3.5s, 6.0s, 8.5s) to global scroll progress
 */
export function getProjectAnchorScrollProgress(timeSeconds: number): number {
  const act3 = CINEMATIC_CLIPS[2]; // Act III: scrollRange [0.40, 0.60]
  const localProg = Math.max(0, Math.min(1, timeSeconds / act3.duration));
  const [start, end] = act3.scrollRange;
  return start + localProg * (end - start);
}

/**
 * Resolves active project from scroll progress without state feedback loops.
 * Maps visual scenes in Act III video to projects.
 */
export function resolveActiveProjectForProgress(
  progress: number,
  projects: ProjectItem[],
  currentSelectedId: string
): string {
  const act3 = CINEMATIC_CLIPS[2];
  const [start, end] = act3.scrollRange;

  if (progress < start || progress > end) {
    return currentSelectedId;
  }

  const localTime = ((progress - start) / (end - start)) * act3.duration;

  // Scene 1: Smartphone / Mobile Display (approx 2.5s - 4.9s)
  // Scene 2: Web Dashboard / Analytics Display (approx 4.9s - 7.3s)
  // Scene 3: 3D Controller Configurator (approx 7.3s - 10.0s)
  let targetScene: string;
  if (localTime < 4.9) {
    targetScene = 'mobile-display';
  } else if (localTime < 7.3) {
    targetScene = 'dashboard-display';
  } else {
    targetScene = '3d-configurator';
  }

  // Find if current selected project already matches this scene
  const currentProject = projects.find((p) => p.id === currentSelectedId);
  if (currentProject?.visualAnchor?.sceneKey === targetScene) {
    return currentSelectedId;
  }

  // Otherwise, select the first project matching this scene
  const matchingProject = projects.find((p) => p.visualAnchor?.sceneKey === targetScene);
  return matchingProject ? matchingProject.id : currentSelectedId;
}
