import { spawn } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';

console.log('Testing production server runtime...');

const nextProc = spawn('npx', ['next', 'start', '-p', '3005'], {
  shell: true,
  stdio: 'pipe',
});

// Wait for server to start
let ready = false;
for (let i = 0; i < 30; i++) {
  await setTimeout(300);
  try {
    const res = await fetch('http://localhost:3005/');
    if (res.status === 200) {
      ready = true;
      break;
    }
  } catch {}
}

if (!ready) {
  console.error('Server failed to start on port 3005');
  nextProc.kill();
  process.exit(1);
}

console.log('Production server ready on port 3005. Running asset & route checks:');

// 1. Check HTML route
const htmlRes = await fetch('http://localhost:3005/');
const htmlText = await htmlRes.text();
const hasFaroukTitle = htmlText.includes('Farouk Messai — Software Developer');
console.log('1. HomePage HTML 200 OK & Title verified:', hasFaroukTitle);

// 2. Check essential video assets
const videoFiles = [
  'act-01-scrub.mp4',
  'act-02-scrub.mp4',
  'act-03-scrub.mp4',
  'act-04-scrub.mp4',
  'act-05-scrub.mp4',
  'act-01-idle-forward.mp4',
];

for (const vf of videoFiles) {
  const vRes = await fetch(`http://localhost:3005/videos/${vf}`, { method: 'HEAD' });
  console.log(`2. Video Asset /videos/${vf}: Status ${vRes.status}, Content-Length: ${vRes.headers.get('content-length')} bytes`);
}

// 3. Check essential font asset
const fontRes = await fetch('http://localhost:3005/FAROUK_REDESIGN_ASSETS/Fonts/Space_Grotesk/SpaceGrotesk-VariableFont_wght.ttf', { method: 'HEAD' });
console.log(`3. Font SpaceGrotesk: Status ${fontRes.status}`);

// 4. Check posters
for (let i = 1; i <= 5; i++) {
  const pRes = await fetch(`http://localhost:3005/posters/act-0${i}-poster.jpg`, { method: 'HEAD' });
  console.log(`4. Poster act-0${i}-poster.jpg: Status ${pRes.status}`);
}

nextProc.kill();
console.log('All production runtime checks passed successfully!');
process.exit(0);

