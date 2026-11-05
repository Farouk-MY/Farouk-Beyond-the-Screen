import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ffmpegPath = path.resolve('bin/ffmpeg.exe');
const inputVideo = path.resolve('public/videos/new Act1.mp4');
const tmpDir = path.resolve('tmp_new_act1_frames');

if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

console.log('Extracting frames from 0s to 6.5s (156 frames)...');
await new Promise((resolve, reject) => {
  const p = spawn(ffmpegPath, [
    '-y',
    '-ss', '0.0',
    '-t', '6.5',
    '-i', inputVideo,
    '-vf', 'scale=640:360',
    path.join(tmpDir, 'frame_%04d.bmp')
  ]);
  p.on('close', code => (code === 0 ? resolve() : reject(new Error(`ffmpeg exit ${code}`))));
});

const files = fs.readdirSync(tmpDir).filter(f => f.endsWith('.bmp')).sort();
console.log(`Extracted ${files.length} frames.`);

function getPixelBuffer(filePath) {
  const buf = fs.readFileSync(filePath);
  return buf.subarray(54);
}

const buffers = files.map(f => getPixelBuffer(path.join(tmpDir, f)));

function compareRegion(bufA, bufB, width = 640, height = 360) {
  let diffSum = 0;
  let pixelCount = 0;
  const xMin = Math.floor(width * 0.35);
  const xMax = Math.floor(width * 0.90);
  const yMin = Math.floor(height * 0.25);
  const yMax = Math.floor(height * 0.95);

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

const candidates = [];
for (let s = 0; s <= 48; s++) { // start 0.0s to 2.0s
  for (let e = s + 48; e < buffers.length; e++) { // up to 6.5s
    const durationSec = (e - s) / 24;
    const diff = compareRegion(buffers[s], buffers[e]);
    candidates.push({
      startFrame: s,
      endFrame: e,
      startTime: (s / 24).toFixed(3),
      endTime: (e / 24).toFixed(3),
      durationSec: durationSec.toFixed(3),
      diff: diff,
    });
  }
}

candidates.sort((a, b) => a.diff - b.diff);

console.log('\n--- Top Loop Candidates (Duration >= 3.0s) ---');
candidates.filter(c => parseFloat(c.durationSec) >= 3.0).slice(0, 10).forEach((c, idx) => {
  console.log(`#${idx + 1}: ${c.startTime}s (f_${c.startFrame}) -> ${c.endTime}s (f_${c.endFrame}) [duration: ${c.durationSec}s, diff: ${c.diff.toFixed(2)}]`);
});

console.log('\n--- Top Loop Candidates (Duration >= 3.5s) ---');
candidates.filter(c => parseFloat(c.durationSec) >= 3.5).slice(0, 10).forEach((c, idx) => {
  console.log(`#${idx + 1}: ${c.startTime}s (f_${c.startFrame}) -> ${c.endTime}s (f_${c.endFrame}) [duration: ${c.durationSec}s, diff: ${c.diff.toFixed(2)}]`);
});

console.log('\n--- Top Loop Candidates (Duration >= 4.0s) ---');
candidates.filter(c => parseFloat(c.durationSec) >= 4.0).slice(0, 10).forEach((c, idx) => {
  console.log(`#${idx + 1}: ${c.startTime}s (f_${c.startFrame}) -> ${c.endTime}s (f_${c.endFrame}) [duration: ${c.durationSec}s, diff: ${c.diff.toFixed(2)}]`);
});

console.log('\n--- Top Loop Candidates (Duration >= 4.5s) ---');
candidates.filter(c => parseFloat(c.durationSec) >= 4.5).slice(0, 10).forEach((c, idx) => {
  console.log(`#${idx + 1}: ${c.startTime}s (f_${c.startFrame}) -> ${c.endTime}s (f_${c.endFrame}) [duration: ${c.durationSec}s, diff: ${c.diff.toFixed(2)}]`);
});

fs.rmSync(tmpDir, { recursive: true, force: true });
