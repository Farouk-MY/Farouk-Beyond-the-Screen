import type { ActDefinition } from '@/types/portfolio';

export const ACTS: ActDefinition[] = [
  {
    id: 'origin',
    actNumber: 'ACT I',
    name: 'THE STUDIO',
    subtitle: 'Architectural Workspace & Origin',
    range: [0.0, 0.20],
    description: 'Design and engineering focus. Natural materials, walnut wood, and physical intention.',
    accentColor: '#BA5227',
  },
  {
    id: 'journey',
    actNumber: 'ACT II',
    name: 'THE THRESHOLD',
    subtitle: 'Exterior Terrace & Natural Landscape',
    range: [0.20, 0.40],
    description: 'Stepping outside into the open architectural terrace, panoramic natural landscape, and stone promenade.',
    accentColor: '#D97706',
  },
  {
    id: 'world',
    actNumber: 'ACT III',
    name: 'THE WORK',
    subtitle: 'Architectural Project Exhibition',
    range: [0.40, 0.60],
    description: 'Monumental gallery installations showcasing production software systems, mobile platforms, and interactive 3D commerce.',
    accentColor: '#BA5227',
  },
  {
    id: 'creations',
    actNumber: 'ACT IV',
    name: 'THE CRAFT',
    subtitle: 'Engineering Mastery & Systems Lab',
    range: [0.60, 0.80],
    description: 'An interactive domain detailing core engineering proficiencies across Web, Mobile, Cloud Architecture, and AI Systems.',
    accentColor: '#D97706',
  },
  {
    id: 'beyond',
    actNumber: 'ACT V',
    name: 'THE HORIZON',
    subtitle: 'Sunset Balcony & Contact Terminal',
    range: [0.80, 1.00],
    description: 'Panoramic coastal sunset overlook, active contact terminal, and closing horizon composition.',
    accentColor: '#BA5227',
  },
];

export function getActiveAct(progress: number): ActDefinition {
  const clamped = Math.max(0, Math.min(1, progress));
  for (let i = ACTS.length - 1; i >= 0; i--) {
    if (clamped >= ACTS[i].range[0]) {
      return ACTS[i];
    }
  }
  return ACTS[0];
}

export function getEnvironmentVisibility(progress: number) {
  // Graceful visibility bands preventing pop-in while culling distant geometries
  return {
    act1: progress <= 0.28,
    act2: progress <= 0.45,
    act3: progress >= 0.28 && progress <= 0.7,
    act4: progress >= 0.52 && progress <= 0.92,
    act5: progress >= 0.78,
  };
}

