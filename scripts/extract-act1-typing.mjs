import { execFileSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const ffmpegPath = path.resolve('bin/ffmpeg.exe');
const act1Video = path.resolve('assets/source-videos/act-01.mp4');
const outDir = path.resolve('docs/video-analysis/act-01/typing-frames');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Extract frames from 0.0s to 4.8s at 12 fps (around 58 frames)
execFileSync(ffmpegPath, [
  '-y',
  '-ss', '0.0',
  '-t', '4.8',
  '-i', act1Video,
  '-vf', 'fps=12',
  '-q:v', '2',
  path.join(outDir, 'frame-%03d.jpg')
]);

console.log('Extracted typing frames at 12 fps.');

