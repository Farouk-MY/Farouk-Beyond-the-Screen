import { execFileSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const ffmpeg = path.resolve('bin/ffmpeg.exe');

// We have crops:
// act-01: no crop needed (1280x720)
// act-02: 74px crop (crop=1280:572:0:74,scale=1280:720)
// act-03: 55px crop (crop=1280:610:0:55,scale=1280:720)
// act-04: no crop needed (1280x720)
// act-05: no crop needed (1280x720)

const configs = [
  { act: 'act-01', input: 'assets/source-videos/act-01.mp4', vf: null },
  { act: 'act-02', input: 'assets/source-videos/act-02.mp4', vf: 'crop=1280:572:0:74,scale=1280:720' },
  { act: 'act-03', input: 'assets/source-videos/act-03.mp4', vf: 'crop=1280:610:0:55,scale=1280:720' },
  { act: 'act-04', input: 'assets/source-videos/act-04.mp4', vf: null },
  { act: 'act-05', input: 'assets/source-videos/act-05.mp4', vf: null },
];

for (const cfg of configs) {
  const output = path.resolve(`public/videos/${cfg.act}-scrub.mp4`);
  const tempOutput = path.resolve(`public/videos/${cfg.act}-scrub-temp.mp4`);

  console.log(`Re-encoding ${cfg.act}-scrub.mp4 with All-Intra + faststart...`);

  const args = [
    '-y',
    '-i', cfg.input,
  ];

  if (cfg.vf) {
    args.push('-vf', cfg.vf);
  }

  args.push(
    '-c:v', 'libx264',
    '-preset', 'slow',
    '-crf', '19',
    '-g', '1',
    '-keyint_min', '1',
    '-sc_threshold', '0',
    '-r', '24',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    '-an',
    tempOutput
  );

  execFileSync(ffmpeg, args);

  // Atomically replace the old file so Next.js never serves a partial file
  fs.copyFileSync(tempOutput, output);
  fs.unlinkSync(tempOutput);

  const stat = fs.statSync(output);
  console.log(`Finished ${cfg.act}-scrub.mp4: ${(stat.size / (1024 * 1024)).toFixed(2)} MB`);
}

console.log('All scrub videos successfully re-encoded with faststart!');

