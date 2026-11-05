import { execFileSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const ffmpeg = path.resolve('bin/ffmpeg.exe');
const timestamps = ['8.0', '8.5', '9.0', '9.1', '9.2', '9.5', '9.8', '10.0'];

for (const t of timestamps) {
  try {
    const scrubOut = `test_scrub_${t}.jpg`;
    execFileSync(ffmpeg, ['-y', '-ss', t, '-i', 'public/videos/act-03-scrub.mp4', '-vframes', '1', '-q:v', '2', scrubOut]);
    const statScrub = fs.statSync(scrubOut);
    console.log(`scrub t=${t}: size=${statScrub.size}`);
  } catch (e) {
    console.error(`scrub t=${t} failed:`, e.message);
  }

  try {
    const srcOut = `test_src_${t}.jpg`;
    execFileSync(ffmpeg, ['-y', '-ss', t, '-i', 'assets/source-videos/act-03.mp4', '-vframes', '1', '-q:v', '2', srcOut]);
    const statSrc = fs.statSync(srcOut);
    console.log(`source t=${t}: size=${statSrc.size}`);
  } catch (e) {
    console.error(`source t=${t} failed:`, e.message);
  }
}

