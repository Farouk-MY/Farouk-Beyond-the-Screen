import { spawn } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';
import path from 'node:path';
import fs from 'node:fs';

const ffmpegPath = path.resolve('bin/ffmpeg.exe');
console.log('Testing screencast recording mechanism with FFmpeg...');

// Test that ffmpeg can accept images from stdin
const ffmpeg = spawn(ffmpegPath, [
  '-y',
  '-f', 'image2pipe',
  '-vcodec', 'mjpeg',
  '-framerate', '24',
  '-i', '-',
  '-c:v', 'libx264',
  '-pix_fmt', 'yuv420p',
  '-an',
  'public/recordings/test-pipe.mp4'
]);

ffmpeg.on('close', (code) => {
  console.log('FFmpeg test pipe exited with code:', code);
});

// Write a single dummy JPEG or check
const poster = fs.readFileSync('public/posters/act-01-poster.jpg');
for (let i = 0; i < 24; i++) {
  ffmpeg.stdin.write(poster);
}
ffmpeg.stdin.end();

await setTimeout(1000);
if (fs.existsSync('public/recordings/test-pipe.mp4')) {
  const stat = fs.statSync('public/recordings/test-pipe.mp4');
  console.log(`Test pipe successful! File size: ${stat.size} bytes`);
  fs.unlinkSync('public/recordings/test-pipe.mp4');
}

