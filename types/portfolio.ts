export type SkillCategory = 'all' | 'web' | 'mobile' | 'backend' | 'tools';

export interface SkillItem {
  id: string;
  name: string;
  category: 'web' | 'mobile' | 'backend' | 'tools';
  role: string;
  featured?: boolean;
}

export interface ProjectVisualAnchor {
  sceneKey: 'mobile-display' | 'dashboard-display' | '3d-configurator' | string;
  timeSeconds: number; // local time in Selected Work video (0 - 10s)
  label: string;
}

export interface ProjectMedia {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  isPlaceholder?: boolean;
}

export interface ProjectItem {
  id: string;
  name: string;
  tagline: string;
  category: string;
  categoryLabel: string;
  description: string;
  technologies: string[];
  keyFeatures: string[];
  architectureOverview: string;
  status: 'Production Prototype' | 'Architecture Prototype' | 'Completed Application';
  links: {
    github: string | null;
    live: string | null;
  };
  metrics?: { label: string; value: string }[];
  visualAnchor?: ProjectVisualAnchor;
  coverImage?: ProjectMedia;
  galleryImages?: ProjectMedia[];
  featured?: boolean;
}

export interface DeveloperProfile {
  name: string;
  title: string;
  tagline: string;
  bioIntroduction: string;
  journeyNarrative: {
    part1Title: string;
    part1Body: string;
    part2Title: string;
    part2Body: string;
    part3Title: string;
    part3Body: string;
  };
  contact: {
    email: string;
    github: string;
    linkedin: string;
    location: string;
    availability: string;
  };
}

export interface ActDefinition {
  id: string;
  actNumber: string;
  name: string;
  subtitle: string;
  range: [number, number]; // [startProgress, endProgress]
  description: string;
  accentColor: string;
}

export type ActId = 'origin' | 'journey' | 'work' | 'craft' | 'beyond';

export interface ActSafeArea {
  x: number; // normalized 0..1
  y: number; // normalized 0..1
  w: number; // normalized 0..1
  h: number; // normalized 0..1
  maxWidthPx?: number;
  textColor?: string;
  backgroundTreatment?: 'glass' | 'subtle-contrast' | 'none';
  visibilityWindow: [number, number]; // [startLocalProgress, endLocalProgress]
  description?: string;
}

export interface CinematicTransitionConfig {
  boundaryProgress: number; // global scroll progress of the boundary (0.2, 0.4, 0.6, 0.8)
  overlapSpan: number; // scroll progress span where both videos are transitioning
  strategy: 'short-crossfade' | 'architectural-cut' | 'corridor-dissolve' | 'balcony-dissolve';
  description: string;
}

export interface CinematicClipConfig {
  id: ActId;
  actNumber: string;
  name: string;
  subtitle: string;
  src: string;
  poster: string;
  duration: number; // 10.0 seconds
  sourceFps: number; // 24
  totalFrames: number; // 240
  scrollRange: [number, number]; // [start, end]
  safeArea: ActSafeArea;
  objectPosition: {
    desktop: string; // e.g. "50% 50%"
    mobile: string; // e.g. "65% 50%" to keep focal point visible in portrait
  };
}

export type WorkPresentationPhase = 'intro' | 'projects' | 'outro' | 'inactive';

export interface WorkPresentationState {
  isInWork: boolean;
  workLocalProgress: number; // 0..1 inside Work
  phase: WorkPresentationPhase;
  projectFractionalIndex: number; // continuous 0..N-1
  activeProjectIndex: number; // integer 0..N-1
  introProgress: number; // 0..1 during intro
  outroProgress: number; // 0..1 during outro
  carouselOpacity: number; // 0..1
  carouselScale: number; // e.g. 0.85 -> 1.0 -> 0.9
}
