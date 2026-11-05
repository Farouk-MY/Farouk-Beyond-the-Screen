import {
  computeTimelineBounds,
  getCinematicClips,
  getWorkPresentationState,
  getProjectScrollProgress,
} from '../config/cinematicTimeline.ts';

console.log('--- DYNAMIC SCALING VERIFICATION (1, 2, 4, 5, 10 PROJECTS) ---');

for (const count of [1, 2, 4, 5, 10]) {
  const bounds = computeTimelineBounds(count);
  const clips = getCinematicClips(count);
  const act3 = clips[2];
  console.log(`\nCount = ${count}: totalWeight = ${bounds.totalWeight.toFixed(2)}, Act III Range = [${act3.scrollRange[0].toFixed(3)}, ${act3.scrollRange[1].toFixed(3)}], span = ${(act3.scrollRange[1] - act3.scrollRange[0]).toFixed(3)}`);
  
  for (let i = 0; i < count; i++) {
    const p = getProjectScrollProgress(i, count);
    const state = getWorkPresentationState(p, count);
    console.log(`  Step ${i}: scroll = ${p.toFixed(3)}, activeIdx = ${state.activeProjectIndex}, fracIdx = ${state.projectFractionalIndex.toFixed(2)}, phase = ${state.phase}`);
  }
}
