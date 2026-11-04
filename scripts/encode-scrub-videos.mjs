import { execFileSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const ffmpegPath = path.resolve('bin/ffmpeg.exe');
const acts = ['act-01', 'act-02', 'act-03', 'act-04', 'act-05'];

for (const act of acts) {
  const inputFile = path.resolve(`assets/source-videos/${act}.mp4`);
  const outputFile = path.resolve(`public/videos/${act}-scrub.mp4`);

  console.log(`Encoding all-I scrub video for ${act}...`);
  execFileSync(ffmpegPath, [
    '-y',
    '-i', inputFile,
    '-c:v', 'libx264',
    '-g', '1',
    '-crf', '20',
    '-pix_fmt', 'yuv420p',
    '-an',
    outputFile
  ]);

  const stat = fs.statSync(outputFile);
  console.log(`Done ${act}: ${(stat.size / (1024 * 1024)).toFixed(2)} MB`);
}

console.log('All scrub videos successfully encoded!');

