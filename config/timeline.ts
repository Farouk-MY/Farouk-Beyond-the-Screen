import type { ActDefinition } from '@/types/portfolio';
import { CINEMATIC_CLIPS, getActiveCinematicAct } from './cinematicTimeline';

export const ACTS: ActDefinition[] = CINEMATIC_CLIPS.map((clip) => ({
  id: clip.id,
  actNumber: clip.actNumber,
  name: clip.name,
  subtitle: clip.subtitle,
  range: clip.scrollRange,
  description: clip.safeArea.description || '',
  accentColor:
    clip.id === 'origin' || clip.id === 'work' || clip.id === 'beyond'
      ? '#BA5227'
      : '#D97706',
}));

export function getActiveAct(progress: number): ActDefinition {
  const clip = getActiveCinematicAct(progress);
  return (
    ACTS.find((a) => a.id === clip.id) || ACTS[0]
  );
}

export function getEnvironmentVisibility(progress: number) {
  return {
    act1: progress <= 0.28,
    act2: progress <= 0.45,
    act3: progress >= 0.28 && progress <= 0.7,
    act4: progress >= 0.52 && progress <= 0.92,
    act5: progress >= 0.78,
  };
}
