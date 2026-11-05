import type {
  CinematicClipConfig,
  CinematicTransitionConfig,
  WorkPresentationState,
  ProjectItem,
} from '@/types/portfolio';

export const MASTER_FPS = 24;
export const ACT_CLIP_DURATION = 10.0; // seconds
export const ACT_TOTAL_FRAMES = 240; // 0..239

// Base scroll runway: 600svh provides 500svh of travel.
// Dynamic timeline scales total scroll depth based on project count.
export const RUNWAY_HEIGHT_SVH = 650;

// Relative timeline weight units (determines runway allocation per section)
export const WEIGHT_STUDIO = 1.0;
export const WEIGHT_JOURNEY = 1.0;
export const WEIGHT_WORK_INTRO = 0.35; // Farouk walks into gallery
export const WEIGHT_PROJECT_STEP = 0.50; // Per project presentation stop
export const WEIGHT_WORK_OUTRO = 0.35; // Farouk walks from exhibition to lab
export const WEIGHT_ENGINEERING = 1.0;
export const WEIGHT_CONTACT = 1.0;

export interface TimelineBounds {
  totalWeight: number;
  sectionRanges: [number, number][]; // 5 sections [start, end]
  workWeight: number;
  workIntroFraction: number; // fraction of Work section for intro
  workProjectsFraction: number; // fraction of Work section for projects
  workOutroFraction: number; // fraction of Work section for outro
}

/**
 * Computes calibrated global scroll boundaries based on variable project count
 */
export function computeTimelineBounds(projectCount: number = 4): TimelineBounds {
  const count = Math.max(1, projectCount);
  const workWeight = WEIGHT_WORK_INTRO + count * WEIGHT_PROJECT_STEP + WEIGHT_WORK_OUTRO;
  const totalWeight =
    WEIGHT_STUDIO + WEIGHT_JOURNEY + workWeight + WEIGHT_ENGINEERING + WEIGHT_CONTACT;

  const weights = [WEIGHT_STUDIO, WEIGHT_JOURNEY, workWeight, WEIGHT_ENGINEERING, WEIGHT_CONTACT];
  const sectionRanges: [number, number][] = [];

  let accumulated = 0;
  for (let i = 0; i < weights.length; i++) {
    const start = accumulated / totalWeight;
    accumulated += weights[i];
    const end = accumulated / totalWeight;
    sectionRanges.push([start, end]);
  }
  // Ensure final boundary strictly clamps to 1.0
  sectionRanges[4][1] = 1.0;

  return {
    totalWeight,
    sectionRanges,
    workWeight,
    workIntroFraction: WEIGHT_WORK_INTRO / workWeight,
    workProjectsFraction: (count * WEIGHT_PROJECT_STEP) / workWeight,
    workOutroFraction: WEIGHT_WORK_OUTRO / workWeight,
  };
}

/**
 * Generates the 5 cinematic clip configurations dynamically calibrated to project count
 */
export function getCinematicClips(projectCount: number = 4): CinematicClipConfig[] {
  const bounds = computeTimelineBounds(projectCount);

  return [
    {
      id: 'origin',
      actNumber: '01',
      name: 'Studio',
      subtitle: 'Architectural Workspace & Origin',
      src: '/videos/act-01-scrub.mp4',
      poster: '/posters/act-01-poster.jpg',
      duration: ACT_CLIP_DURATION,
      sourceFps: MASTER_FPS,
      totalFrames: ACT_TOTAL_FRAMES,
      scrollRange: bounds.sectionRanges[0],
      safeArea: {
        x: 0.06,
        y: 0.10,
        w: 0.40,
        h: 0.50,
        maxWidthPx: 560,
        visibilityWindow: [0.0, 0.72],
        description: 'Clean upper-left wall area above monitors and desk',
      },
      objectPosition: {
        desktop: '50% 50%',
        mobile: '58% 50%',
      },
    },
    {
      id: 'journey',
      actNumber: '02',
      name: 'Journey',
      subtitle: 'Exterior Terrace & Natural Landscape',
      src: '/videos/act-02-scrub.mp4',
      poster: '/posters/act-02-poster.jpg',
      duration: ACT_CLIP_DURATION,
      sourceFps: MASTER_FPS,
      totalFrames: ACT_TOTAL_FRAMES,
      scrollRange: bounds.sectionRanges[1],
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
      actNumber: '03',
      name: 'Selected Work',
      subtitle: '3D Curved Exhibition & Project Showcase',
      src: '/videos/act-03-scrub.mp4',
      poster: '/posters/act-03-poster.jpg',
      duration: ACT_CLIP_DURATION,
      sourceFps: MASTER_FPS,
      totalFrames: ACT_TOTAL_FRAMES,
      scrollRange: bounds.sectionRanges[2],
      safeArea: {
        x: 0.05,
        y: 0.08,
        w: 0.90,
        h: 0.84,
        maxWidthPx: 1200,
        visibilityWindow: [0.04, 0.98],
        description: 'Full width 3D curved exhibition wall with clear view of character on right',
      },
      objectPosition: {
        desktop: '50% 50%',
        mobile: '65% 50%',
      },
    },
    {
      id: 'craft',
      actNumber: '04',
      name: 'Engineering',
      subtitle: 'Systems Lab & Engineering Domains',
      src: '/videos/act-04-scrub.mp4',
      poster: '/posters/act-04-poster.jpg',
      duration: ACT_CLIP_DURATION,
      sourceFps: MASTER_FPS,
      totalFrames: ACT_TOTAL_FRAMES,
      scrollRange: bounds.sectionRanges[3],
      safeArea: {
        x: 0.06,
        y: 0.14,
        w: 0.44,
        h: 0.70,
        maxWidthPx: 600,
        visibilityWindow: [0.15, 0.85],
        description: 'Travertine wall opposite holographic pedestal',
      },
      objectPosition: {
        desktop: '50% 50%',
        mobile: '60% 50%',
      },
    },
    {
      id: 'beyond',
      actNumber: '05',
      name: 'Contact',
      subtitle: 'Sunset Balcony & Contact Terminal',
      src: '/videos/act-05-scrub.mp4',
      poster: '/posters/act-05-poster.jpg',
      duration: ACT_CLIP_DURATION,
      sourceFps: MASTER_FPS,
      totalFrames: ACT_TOTAL_FRAMES,
      scrollRange: bounds.sectionRanges[4],
      safeArea: {
        x: 0.08,
        y: 0.14,
        w: 0.44,
        h: 0.72,
        maxWidthPx: 580,
        visibilityWindow: [0.15, 1.00],
        description: 'Serene sunset sky & sea horizon; Farouk at railing on right',
      },
      objectPosition: {
        desktop: '50% 50%',
        mobile: '70% 50%',
      },
    },
  ];
}

// Default export for initial client hydration (4 projects)
export const CINEMATIC_CLIPS = getCinematicClips(4);

/**
 * Returns dynamic transition boundaries between the 5 scenes
 */
export function getCinematicTransitions(projectCount: number = 4): CinematicTransitionConfig[] {
  const bounds = computeTimelineBounds(projectCount);
  return [
    {
      boundaryProgress: bounds.sectionRanges[0][1],
      overlapSpan: 0.008,
      strategy: 'architectural-cut',
      description: 'Studio door handle -> Journey terrace opening',
    },
    {
      boundaryProgress: bounds.sectionRanges[1][1],
      overlapSpan: 0.020,
      strategy: 'architectural-cut',
      description: 'Terrace threshold -> Exhibition gallery interior',
    },
    {
      boundaryProgress: bounds.sectionRanges[2][1],
      overlapSpan: 0.024,
      strategy: 'corridor-dissolve',
      description: 'Exhibition exit -> Systems lab entrance',
    },
    {
      boundaryProgress: bounds.sectionRanges[3][1],
      overlapSpan: 0.024,
      strategy: 'balcony-dissolve',
      description: 'Lab window walk -> Open sunset balcony',
    },
  ];
}

export const CINEMATIC_TRANSITIONS = getCinematicTransitions(4);

// Act I Idle Typing Loop Configuration
export const IDLE_LOOP_CONFIG = {
  src: '/videos/act-01-idle-forward.mp4',
  duration: 3.000,
  sourceFps: 24,
  totalFrames: 72,
  mapIdleTimeToSourceTime: (tIdle: number): number => {
    return ((tIdle % 3.000) + 3.000) % 3.000;
  },
  mapSourceTimeToIdleTime: (tSource: number): number => {
    return ((tSource % 3.000) + 3.000) % 3.000;
  },
};

/**
 * Navigation section definitions with dynamically derived anchor scroll progress
 */
export function getNavSections(projectCount: number = 4): { id: string; label: string; progress: number }[] {
  const bounds = computeTimelineBounds(projectCount);
  return [
    { id: 'origin', label: 'Studio', progress: 0.0 },
    { id: 'journey', label: 'Journey', progress: bounds.sectionRanges[1][0] },
    { id: 'work', label: 'Work', progress: bounds.sectionRanges[2][0] },
    { id: 'craft', label: 'Engineering', progress: bounds.sectionRanges[3][0] },
    { id: 'beyond', label: 'Contact', progress: bounds.sectionRanges[4][0] },
  ];
}

/**
 * Calculates the exact global scroll progress where a project step is centered in 3D
 */
export function getProjectScrollProgress(projectIndex: number, projectCount: number = 4): number {
  const bounds = computeTimelineBounds(projectCount);
  const [workStart, workEnd] = bounds.sectionRanges[2];
  const workSpan = workEnd - workStart;

  const count = Math.max(1, projectCount);
  const clampedIdx = Math.max(0, Math.min(count - 1, projectIndex));

  // Position within the projects portion of Work
  let localStepFraction = 0.5;
  if (count > 1) {
    localStepFraction = clampedIdx / (count - 1);
  }

  const localWorkProgress =
    bounds.workIntroFraction + localStepFraction * bounds.workProjectsFraction;

  return workStart + localWorkProgress * workSpan;
}

/**
 * Evaluates the precise 3D presentation state for Selected Work from global scroll progress
 */
export function getWorkPresentationState(
  globalProgress: number,
  projectCount: number = 4
): WorkPresentationState {
  const bounds = computeTimelineBounds(projectCount);
  const [workStart, workEnd] = bounds.sectionRanges[2];
  const count = Math.max(1, projectCount);

  let workLocalProgress = 0;
  if (globalProgress <= workStart) {
    workLocalProgress = 0;
  } else if (globalProgress >= workEnd) {
    workLocalProgress = 1;
  } else {
    workLocalProgress = (globalProgress - workStart) / (workEnd - workStart);
  }

  const introEnd = bounds.workIntroFraction;
  const outroStart = 1.0 - bounds.workOutroFraction;

  // 1. Inactive before or after Work
  if (globalProgress < workStart - 0.02 || globalProgress > workEnd + 0.02) {
    return {
      isInWork: false,
      workLocalProgress,
      phase: 'inactive',
      projectFractionalIndex: 0,
      activeProjectIndex: 0,
      introProgress: 0,
      outroProgress: 0,
      carouselOpacity: 0,
      carouselScale: 0.85,
    };
  }

  // 2. Intro phase: entering gallery, carousel emerges
  if (workLocalProgress < introEnd) {
    const introProgress = Math.max(0, Math.min(1, workLocalProgress / introEnd));
    const carouselOpacity = Math.max(0, Math.min(1, (introProgress - 0.15) / 0.85));
    const carouselScale = 0.85 + introProgress * 0.15;

    return {
      isInWork: true,
      workLocalProgress,
      phase: 'intro',
      projectFractionalIndex: 0,
      activeProjectIndex: 0,
      introProgress,
      outroProgress: 0,
      carouselOpacity,
      carouselScale,
    };
  }

  // 3. Outro phase: exiting gallery, carousel gracefully recedes
  if (workLocalProgress > outroStart) {
    const outroProgress = Math.max(0, Math.min(1, (workLocalProgress - outroStart) / bounds.workOutroFraction));
    const carouselOpacity = Math.max(0, Math.min(1, 1.0 - outroProgress * 1.4));
    const carouselScale = 1.0 - outroProgress * 0.12;

    return {
      isInWork: true,
      workLocalProgress,
      phase: 'outro',
      projectFractionalIndex: count - 1,
      activeProjectIndex: count - 1,
      introProgress: 1,
      outroProgress,
      carouselOpacity,
      carouselScale,
    };
  }

  // 4. Projects presentation phase: finite 3D carousel active
  const projectsLocalSpan = outroStart - introEnd;
  const normalizedProg = Math.max(0, Math.min(1, (workLocalProgress - introEnd) / projectsLocalSpan));

  let projectFractionalIndex = 0;
  if (count > 1) {
    projectFractionalIndex = normalizedProg * (count - 1);
  }
  const activeProjectIndex = Math.max(0, Math.min(count - 1, Math.round(projectFractionalIndex)));

  return {
    isInWork: true,
    workLocalProgress,
    phase: 'projects',
    projectFractionalIndex,
    activeProjectIndex,
    introProgress: 1,
    outroProgress: 0,
    carouselOpacity: 1.0,
    carouselScale: 1.0,
  };
}

/**
 * Computes video opacity and playback window for each act with seamless progressive transitions.
 * Integrates Act III stable video hold at 3.75s during the 3D project carousel!
 */
export function computeActOpacitiesAndTimes(
  progress: number,
  projectCount: number = 4
): {
  opacities: number[];
  visibleActs: boolean[];
  localTimes: number[];
} {
  const clips = getCinematicClips(projectCount);
  const transitions = getCinematicTransitions(projectCount);
  const bounds = computeTimelineBounds(projectCount);

  const opacities = [0, 0, 0, 0, 0];
  const visibleActs = [false, false, false, false, false];
  const localTimes = [0, 0, 0, 0, 0];

  const p = Math.max(0, Math.min(1, progress));

  clips.forEach((clip, idx) => {
    const [start, end] = clip.scrollRange;

    // Transition overlap boundaries
    const prevTransition = idx > 0 ? transitions[idx - 1] : null;
    const nextTransition = idx < clips.length - 1 ? transitions[idx] : null;

    const leadIn = prevTransition ? prevTransition.overlapSpan / 2 : 0;
    const leadOut = nextTransition ? nextTransition.overlapSpan / 2 : 0;

    const visibleStart = Math.max(0, start - leadIn);
    const visibleEnd = Math.min(1, end + leadOut);

    const isVisible = p >= visibleStart && p <= visibleEnd;
    visibleActs[idx] = isVisible;

    // Calculate local time
    const localProgress = Math.max(0, Math.min(1, (p - start) / (end - start)));

    if (idx === 2) {
      // Act III: Selected Work video integration
      // 0.0s -> 3.2s during intro (Farouk enters gallery and approaches display)
      // 3.2s -> 9.2s during project presentation (Farouk interacts with wall display across all projects)
      // 9.2s -> 9.65s during outro (Farouk completes interaction safely before EOF buffer)
      const introEnd = bounds.workIntroFraction;
      const outroStart = 1.0 - bounds.workOutroFraction;

      if (localProgress < introEnd) {
        const introRatio = localProgress / introEnd;
        localTimes[2] = introRatio * 3.2;
      } else if (localProgress > outroStart) {
        const outroRatio = (localProgress - outroStart) / bounds.workOutroFraction;
        localTimes[2] = 9.2 + outroRatio * (9.65 - 9.2);
      } else {
        // Continuous interactive playback: background video smoothly advances as projects change
        const projectsSpan = outroStart - introEnd;
        const normalizedProg = Math.max(0, Math.min(1, (localProgress - introEnd) / projectsSpan));
        localTimes[2] = 3.2 + normalizedProg * (9.2 - 3.2);
      }
    } else {
      localTimes[idx] = localProgress * Math.min(clip.duration - 0.25, 9.65);
    }

    if (isVisible) {
      let opacity = 1.0;
      if (prevTransition && p < start) {
        opacity = (p - visibleStart) / (start - visibleStart);
      } else if (nextTransition && p > end) {
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
export function computeOverlayOpacity(
  progress: number,
  actIndex: number,
  projectCount: number = 4
): number {
  const clips = getCinematicClips(projectCount);
  const clip = clips[actIndex];
  if (!clip) return 0;

  const [start, end] = clip.scrollRange;
  if (progress < start || progress > end) return 0;

  const localProgress = (progress - start) / (end - start);
  const [visStart, visEnd] = clip.safeArea.visibilityWindow;

  const FADE_SPAN = 0.08;

  if (localProgress < visStart - FADE_SPAN || localProgress > visEnd + FADE_SPAN) {
    return 0;
  }

  if (localProgress < visStart) {
    return Math.max(0, (localProgress - (visStart - FADE_SPAN)) / FADE_SPAN);
  }

  if (localProgress > visEnd) {
    return Math.max(0, (visEnd + FADE_SPAN - localProgress) / FADE_SPAN);
  }

  return 1.0;
}

/**
 * Resolves active project index from global scroll progress
 */
export function resolveActiveProjectForProgress(
  progress: number,
  projects: ProjectItem[]
): number {
  const count = projects.length;
  if (count === 0) return 0;
  const state = getWorkPresentationState(progress, count);
  return state.activeProjectIndex;
}

/**
 * Maps an Act III local time to global scroll progress (backward compatibility)
 */
export function getProjectAnchorScrollProgress(
  timeSeconds: number,
  projectCount: number = 4
): number {
  const clips = getCinematicClips(projectCount);
  const act3 = clips[2];
  const localProg = Math.max(0, Math.min(1, timeSeconds / act3.duration));
  const [start, end] = act3.scrollRange;
  return start + localProg * (end - start);
}

/**
 * Resolves the active cinematic act clip configuration for any scroll progress
 */
export function getActiveCinematicAct(
  progress: number,
  projectCount: number = 4
): CinematicClipConfig {
  const clips = getCinematicClips(projectCount);
  const clamped = Math.max(0, Math.min(1, progress));
  for (let i = clips.length - 1; i >= 0; i--) {
    if (clamped >= clips[i].scrollRange[0]) {
      return clips[i];
    }
  }
  return clips[0];
}

