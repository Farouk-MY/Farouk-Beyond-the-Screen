import { execFileSync } from 'node:child_process';
import path from 'node:path';

const ffmpeg = path.resolve('bin/ffmpeg.exe');
const input = path.resolve('assets/source-videos/act-01.mp4');
const output = path.resolve('assets/processed-videos/act-01-idle-forward.mp4');

// We want a pure forward typing loop of ~3.2 seconds
// where the last 0.4s dissolves into the first 0.4s.
// Total resulting loop duration: 2.8s of pure forward typing that repeats infinitely with zero backward motion!
const filter = `
[0:v]trim=start=0.4:end=2.8,setpts=PTS-STARTPTS[body];
[0:v]trim=start=2.8:end=3.2,setpts=PTS-STARTPTS[tail];
[0:v]trim=start=0.0:end=0.4,setpts=PTS-STARTPTS[head];
[head]format=yuva420p,fade=t=in:st=0:d=0.4:alpha=1[faded_head];
[tail][faded_head]overlay=0:0[transition];
[body][transition]concat=n=2:v=1[v]
`.replace(/\n/g, '').trim();

try {
  execFileSync(ffmpeg, [
    '-y',
    '-i', input,
    '-filter_complex', filter,
    '-map', '[v]',
    '-c:v', 'libx264',
    '-crf', '18',
    '-pix_fmt', 'yuv420p',
    '-an',
    output
  ], { stdio: 'inherit' });
  console.log('Successfully created forward-only seamless typing loop!');
} catch (e) {
  console.error('Filter failed:', e.message);
}

