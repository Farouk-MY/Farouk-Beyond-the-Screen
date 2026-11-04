import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const ffmpegPath = path.resolve('bin/ffmpeg.exe');
const sourceVideo = path.resolve('public/videos/act-01.mp4');
const outputVideo = path.resolve('public/videos/act-01-idle-forward.mp4');

console.log('Building seamless natural forward typing loop from Act 1 footage...');

// Optimal typing window: 0.208s to 3.708s (duration = 3.500s)
// Crossfade duration: 0.25s (6 frames) at loop boundary
// Base video: 0.208s to 3.708s
// Filter: split into main stream and tail stream, crossfade tail onto head
const startTime = 0.208;
const rawDuration = 3.500;
const xfadeDuration = 0.250;
const loopDuration = rawDuration - xfadeDuration; // 3.250s

console.log(`Source slice: ${startTime}s -> ${startTime + rawDuration}s (${rawDuration}s)`);
console.log(`Crossfade window: ${xfadeDuration}s at loop boundary`);
console.log(`Resulting seamless loop duration: ${loopDuration}s`);

// We use FFmpeg xfade filter:
// Stream 0: from startTime to startTime + rawDuration - xfadeDuration
// Stream 1: the tail of the clip (startTime + rawDuration - xfadeDuration to startTime + rawDuration)
// Or standard loop crossfade:
// Clip length T. Take first xfadeDuration [0, xfade] and last [T - xfade, T].
const filterComplex = `
[0:v]trim=start=${startTime}:end=${startTime + rawDuration},setpts=PTS-STARTPTS,split[main][tail_src];
[main]trim=start=0:end=${loopDuration},setpts=PTS-STARTPTS[base];
[tail_src]trim=start=${loopDuration}:end=${rawDuration},setpts=PTS-STARTPTS[tail];
[tail]format=yuva420p,fade=t=out:st=0:d=${xfadeDuration}:alpha=1[tail_faded];
[base]format=yuva420p[base_fmt];
[base_fmt][tail_faded]overlay=0:0[outv]
`;

const tempOut = path.resolve('public/videos/act-01-idle-new.mp4');

await new Promise((resolve, reject) => {
  const p = spawn(ffmpegPath, [
    '-y',
    '-i', sourceVideo,
    '-filter_complex', filterComplex,
    '-map', '[outv]',
    '-c:v', 'libx264',
    '-preset', 'slow',
    '-crf', '18',
    '-pix_fmt', 'yuv420p',
    tempOut
  ]);

  p.stderr.on('data', () => {});

  p.on('close', code => (code === 0 ? resolve() : reject(new Error(`ffmpeg exit ${code}`))));
});

console.log('New idle video generated successfully.');
const stat = fs.statSync(tempOut);
console.log(`Size: ${(stat.size / 1024).toFixed(1)} KB`);

// Replace active act-01-idle-forward.mp4
fs.copyFileSync(tempOut, outputVideo);
fs.unlinkSync(tempOut);
console.log(`Updated ${outputVideo}`);
