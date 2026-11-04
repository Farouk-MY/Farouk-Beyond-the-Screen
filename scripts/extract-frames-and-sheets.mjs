import { execFileSync } from 'node:child_process';
import path from 'node:path';

const ffmpegPath = path.resolve('bin/ffmpeg.exe');
const sourceVideosDir = path.resolve('assets/source-videos');
const acts = ['act-01', 'act-02', 'act-03', 'act-04', 'act-05'];

for (const act of acts) {
  const videoFile = path.join(sourceVideosDir, `${act}.mp4`);
  const actDir = path.resolve(`docs/video-analysis/${act}`);
  const sheetFile = path.resolve(`docs/video-analysis/contact-sheets/${act}-sheet.jpg`);

  console.log(`Processing ${act}...`);

  // 1. Extract frames at 2 fps (approx 20 frames per act, covers every 0.5 seconds)
  execFileSync(ffmpegPath, [
    '-y',
    '-i', videoFile,
    '-vf', 'fps=2',
    '-q:v', '2',
    path.join(actDir, 'frame-%04d.jpg')
  ]);

  // 2. Generate contact sheet (5 columns x 4 rows = 20 frames, scaled to 320x180 each -> 1600x720 sheet)
  execFileSync(ffmpegPath, [
    '-y',
    '-i', videoFile,
    '-vf', 'fps=2,scale=320:180,tile=5x4',
    '-q:v', '2',
    sheetFile
  ]);

  // Also extract boundary frames: first frame (0s) and last frame (10s)
  execFileSync(ffmpegPath, [
    '-y',
    '-ss', '0',
    '-i', videoFile,
    '-vframes', '1',
    '-q:v', '2',
    path.join(actDir, 'boundary-start.jpg')
  ]);

  execFileSync(ffmpegPath, [
    '-y',
    '-sseof', '-0.1',
    '-i', videoFile,
    '-vframes', '1',
    '-q:v', '2',
    path.join(actDir, 'boundary-end.jpg')
  ]);

  console.log(`Done ${act}: extracted frames + contact sheet + boundary frames.`);
}

console.log('All acts processed successfully!');
