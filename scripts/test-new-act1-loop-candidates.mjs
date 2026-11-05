import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ffmpegPath = path.resolve('bin/ffmpeg.exe');
const inputVideo = path.resolve('public/videos/new Act1.mp4');

// Extract all frames from 0 to 120 (5.0s) as BMP
const tmpDir = path.resolve('tmp_frames_cand');
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

await new Promise((resolve, reject) => {
  const p = spawn(ffmpegPath, [
    '-y',
    '-ss', '0.0',
    '-t', '5.0',
    '-i', inputVideo,
    '-vf', 'scale=640:360',
    path.join(tmpDir, 'f_%04d.bmp')
  ]);
  p.on('close', code => (code === 0 ? resolve() : reject(new Error(`exit ${code}`))));
});

const files = fs.readdirSync(tmpDir).filter(f => f.endsWith('.bmp')).sort();

function getPixelBuffer(filePath) {
  const buf = fs.readFileSync(filePath);
  return buf.subarray(54);
}

const buffers = files.map(f => getPixelBuffer(path.join(tmpDir, f)));

function compareHandsAndTorso(bufA, bufB, width = 640, height = 360) {
  // Focus on hands & keyboard: x in 45%..75%, y in 55%..85%
  let diffSum = 0;
  let pixelCount = 0;
  const xMin = Math.floor(width * 0.45);
  const xMax = Math.floor(width * 0.75);
  const yMin = Math.floor(height * 0.55);
  const yMax = Math.floor(height * 0.85);

  for (let y = yMin; y < yMax; y++) {
    for (let x = xMin; x < xMax; x++) {
      const idx = (y * width + x) * 3;
      const bDiff = Math.abs(bufA[idx] - bufB[idx]);
      const gDiff = Math.abs(bufA[idx + 1] - bufB[idx + 1]);
      const rDiff = Math.abs(bufA[idx + 2] - bufB[idx + 2]);
      diffSum += (rDiff + gDiff + bDiff) / 3;
      pixelCount++;
    }
  }
  return diffSum / pixelCount;
}

function compareHeadAndPosture(bufA, bufB, width = 640, height = 360) {
  // Focus on head & shoulders: x in 50%..70%, y in 30%..55%
  let diffSum = 0;
  let pixelCount = 0;
  const xMin = Math.floor(width * 0.50);
  const xMax = Math.floor(width * 0.70);
  const yMin = Math.floor(height * 0.30);
  const yMax = Math.floor(height * 0.55);

  for (let y = yMin; y < yMax; y++) {
    for (let x = xMin; x < xMax; x++) {
      const idx = (y * width + x) * 3;
      const bDiff = Math.abs(bufA[idx] - bufB[idx]);
      const gDiff = Math.abs(bufA[idx + 1] - bufB[idx + 1]);
      const rDiff = Math.abs(bufA[idx + 2] - bufB[idx + 2]);
      diffSum += (rDiff + gDiff + bDiff) / 3;
      pixelCount++;
    }
  }
  return diffSum / pixelCount;
}

console.log('--- EVALUATING LOOP SEAMS WITH DETAILED HAND & HEAD METRICS ---');

const pairs = [];
for (let s = 0; s <= 24; s++) { // start frame 0..1.0s
  for (let e = s + 48; e < buffers.length; e++) { // duration 2.0s..5.0s
    const handsDiff = compareHandsAndTorso(buffers[s], buffers[e]);
    const headDiff = compareHeadAndPosture(buffers[s], buffers[e]);
    const totalDiff = handsDiff * 0.6 + headDiff * 0.4;
    const duration = ((e - s) / 24).toFixed(3);

    pairs.push({
      startFrame: s,
      endFrame: e,
      startTime: (s / 24).toFixed(3),
      endTime: (e / 24).toFixed(3),
      duration,
      handsDiff,
      headDiff,
      totalDiff,
    });
  }
}

pairs.sort((a, b) => a.totalDiff - b.totalDiff);

console.log('\nTop 10 overall loops:');
pairs.slice(0, 10).forEach((p, idx) => {
  console.log(`#${idx + 1}: ${p.startTime}s (f_${p.startFrame}) -> ${p.endTime}s (f_${p.endFrame}) [duration: ${p.duration}s | total: ${p.totalDiff.toFixed(2)}, hands: ${p.handsDiff.toFixed(2)}, head: ${p.headDiff.toFixed(2)}]`);
});

console.log('\nTop loops with duration >= 3.0s:');
pairs.filter(p => parseFloat(p.duration) >= 3.0).slice(0, 5).forEach((p, idx) => {
  console.log(`#${idx + 1}: ${p.startTime}s (f_${p.startFrame}) -> ${p.endTime}s (f_${p.endFrame}) [duration: ${p.duration}s | total: ${p.totalDiff.toFixed(2)}, hands: ${p.handsDiff.toFixed(2)}, head: ${p.headDiff.toFixed(2)}]`);
});

fs.rmSync(tmpDir, { recursive: true, force: true });

