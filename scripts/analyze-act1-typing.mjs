import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ffmpegPath = path.resolve('bin/ffmpeg.exe');
const tmpDir = path.resolve('tmp_typing_analysis');
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

// Extract all frames from 0s to 5.0s at 24fps
console.log('Extracting frames from 0.0s to 5.0s (120 frames)...');
await new Promise((resolve, reject) => {
  const p = spawn(ffmpegPath, [
    '-y',
    '-ss', '0.0',
    '-t', '5.0',
    '-i', 'public/videos/act-01.mp4',
    '-vf', 'scale=640:360',
    path.join(tmpDir, 'f_%04d.bmp')
  ]);
  p.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exit ${code}`))));
});

const files = fs.readdirSync(tmpDir).filter(f => f.endsWith('.bmp')).sort();
console.log(`Extracted ${files.length} frames.`);

// Function to read raw RGB bytes from BMP (header is 54 bytes for standard Windows BMP)
function getPixelBuffer(filePath) {
  const buf = fs.readFileSync(filePath);
  return buf.subarray(54); // raw BGR
}

// Compare two frames in character region (x: 40% to 90%, y: 30% to 95%)
function compareCharacterRegion(bufA, bufB, width = 640, height = 360) {
  let diffSum = 0;
  let pixelCount = 0;
  const xMin = Math.floor(width * 0.40);
  const xMax = Math.floor(width * 0.90);
  const yMin = Math.floor(height * 0.30);
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

// Measure frame-to-frame delta to identify motion spikes (like hands lifting, standing up)
console.log('\n--- Frame-to-frame delta across 0s to 5s ---');
const buffers = files.map(f => getPixelBuffer(path.join(tmpDir, f)));

for (let i = 0; i < files.length - 1; i += 6) { // every 0.25s
  const diff = compareCharacterRegion(buffers[i], buffers[i + 1]);
  const sec = (i / 24).toFixed(2);
  console.log(`t = ${sec}s (f_${i}): delta = ${diff.toFixed(2)}`);
}

// Now search for optimal loop boundaries between start (t = 0.2s..1.2s) and end (t = 2.5s..4.5s)
console.log('\n--- Finding best loop pairs (min character difference) ---');
const loopCandidates = [];

for (let startIdx = 5; startIdx <= 30; startIdx++) { // 0.2s to 1.25s
  for (let endIdx = 65; endIdx < buffers.length; endIdx++) { // 2.7s to 4.9s
    const durationSec = (endIdx - startIdx) / 24;
    if (durationSec < 2.5) continue; // minimum 2.5s

    const diff = compareCharacterRegion(buffers[startIdx], buffers[endIdx]);
    loopCandidates.push({
      startIdx,
      endIdx,
      startTime: (startIdx / 24).toFixed(3),
      endTime: (endIdx / 24).toFixed(3),
      durationSec: durationSec.toFixed(3),
      diff: diff,
    });
  }
}

loopCandidates.sort((a, b) => a.diff - b.diff);

console.log('\nTop 10 loop candidates:');
loopCandidates.slice(0, 10).forEach((c, idx) => {
  console.log(`#${idx + 1}: ${c.startTime}s -> ${c.endTime}s (duration: ${c.durationSec}s, diff: ${c.diff.toFixed(2)})`);
});

// Also check longer loops (>= 3.5s, >= 4.0s)
console.log('\nTop loop candidates >= 3.5s:');
loopCandidates.filter(c => parseFloat(c.durationSec) >= 3.5).slice(0, 5).forEach((c, idx) => {
  console.log(`#${idx + 1}: ${c.startTime}s -> ${c.endTime}s (duration: ${c.durationSec}s, diff: ${c.diff.toFixed(2)})`);
});

console.log('\nTop loop candidates >= 4.0s:');
loopCandidates.filter(c => parseFloat(c.durationSec) >= 4.0).slice(0, 5).forEach((c, idx) => {
  console.log(`#${idx + 1}: ${c.startTime}s -> ${c.endTime}s (duration: ${c.durationSec}s, diff: ${c.diff.toFixed(2)})`);
});

fs.rmSync(tmpDir, { recursive: true, force: true });

