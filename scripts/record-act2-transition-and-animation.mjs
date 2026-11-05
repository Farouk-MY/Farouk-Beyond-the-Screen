import { spawn } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';
import fs from 'node:fs';
import path from 'node:path';

const recDir = 'C:\\Users\\MSI\\.gemini\\antigravity\\brain\\3a927fdd-498e-46e9-a94c-a392df1f645e\\recordings';
const localRecDir = path.resolve('public/recordings');
const tempBaseDir = 'C:\\Users\\MSI\\AppData\\Local\\Temp\\recordings-act2-' + Date.now();

if (!fs.existsSync(recDir)) fs.mkdirSync(recDir, { recursive: true });
if (!fs.existsSync(localRecDir)) fs.mkdirSync(localRecDir, { recursive: true });
if (!fs.existsSync(tempBaseDir)) fs.mkdirSync(tempBaseDir, { recursive: true });

const ffmpegPath = path.resolve('bin/ffmpeg.exe');
const appPort = 3000;
const edgePort = 9896;
const userDataDir = 'C:\\Users\\MSI\\AppData\\Local\\Temp\\edge-rec-act2-' + Date.now();

console.log('Launching Edge for Act 2 video recording...');
const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
  '--headless=new',
  `--remote-debugging-port=${edgePort}`,
  `--user-data-dir=${userDataDir}`,
  '--no-first-run',
  '--no-default-browser-check',
  '--window-size=1280,720',
  'about:blank',
]);

for (let i = 0; i < 30; i++) {
  await setTimeout(200);
  try {
    const res = await fetch(`http://127.0.0.1:${edgePort}/json/version`);
    if (res.ok) break;
  } catch {}
}

const newTabRes = await fetch(`http://127.0.0.1:${edgePort}/json/new?http://localhost:${appPort}/`, { method: 'PUT' });
const tab = await newTabRes.json();
const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((r) => { ws.onopen = r; });

let msgId = 1;
const pending = new Map();
function send(method, params = {}) {
  const id = msgId++;
  return new Promise((resolve) => {
    pending.set(id, { resolve });
    ws.send(JSON.stringify({ id, method, params }));
  });
}

const frames = [];
ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.method === 'Page.screencastFrame') {
    const { data, sessionId } = msg.params;
    const now = performance.now();
    frames.push({
      data: Buffer.from(data, 'base64'),
      recvTime: now,
    });
    send('Page.screencastFrameAck', { sessionId }).catch(() => {});
  } else if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id).resolve(msg.result);
    pending.delete(msg.id);
  }
};

await send('Page.enable');
await send('Runtime.enable');

console.log('Waiting 2.5s for video playback to stabilize...');
await setTimeout(2500);

await send('Page.startScreencast', {
  format: 'jpeg',
  quality: 90,
  maxWidth: 1280,
  maxHeight: 720,
  everyNthFrame: 1,
});

const setScroll = async (p) => {
  await send('Runtime.evaluate', {
    expression: `if (window.__FAROUK_SET_SCROLL_PROGRESS) {
      window.__FAROUK_SET_SCROLL_PROGRESS(${p});
    } else {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo(0, maxScroll * ${p});
      window.dispatchEvent(new Event('scroll'));
    }`
  });
};

// 1. Start in late Act 1
console.log('Recording: 1. Late Act 1 approach (1.0 second)...');
await setScroll(0.120);
await setTimeout(1000);

// 2. Smoothly scroll through the threshold cut into Act 2
console.log('Recording: 2. Threshold cut & progressive milestone illumination (5.5 seconds)...');
const stepsForward = 70;
for (let i = 0; i <= stepsForward; i++) {
  const p = 0.120 + (i / stepsForward) * (0.290 - 0.120);
  await setScroll(p);
  await setTimeout(75);
}

// Hold at Stage 03 to show completed milestone
await setTimeout(1200);

// 3. Smoothly reverse scrub back to Act 1
console.log('Recording: 3. Bidirectional reverse scrub back to Studio (3.5 seconds)...');
const stepsBack = 45;
for (let i = stepsBack; i >= 0; i--) {
  const p = 0.120 + (i / stepsBack) * (0.290 - 0.120);
  await setScroll(p);
  await setTimeout(60);
}

await setTimeout(1000);

await send('Page.stopScreencast').catch(() => {});
ws.close();
edge.kill('SIGTERM');

console.log(`Captured ${frames.length} frames. Encoding MP4 video...`);
const segDir = path.join(tempBaseDir, 'frames');
fs.mkdirSync(segDir, { recursive: true });

const concatLines = [];
for (let i = 0; i < frames.length; i++) {
  const fPath = path.join(segDir, `f_${String(i).padStart(5, '0')}.jpg`);
  fs.writeFileSync(fPath, frames[i].data);
  let dur = 0.0416;
  if (i < frames.length - 1) {
    dur = (frames[i + 1].recvTime - frames[i].recvTime) / 1000;
    dur = Math.max(0.016, Math.min(0.2, dur));
  }
  concatLines.push(`file '${fPath.replace(/\\/g, '/')}'`);
  concatLines.push(`duration ${dur.toFixed(4)}`);
}
if (frames.length > 0) {
  const lastPath = path.join(segDir, `f_${String(frames.length - 1).padStart(5, '0')}.jpg`);
  concatLines.push(`file '${lastPath.replace(/\\/g, '/')}'`);
}

const concatTxt = path.join(segDir, 'concat.txt');
fs.writeFileSync(concatTxt, concatLines.join('\n'));

const outMp4Artifact = path.join(recDir, 'act1-to-act2-cut-and-journey-animation.mp4');
const outMp4Local = path.join(localRecDir, 'act1-to-act2-cut-and-journey-animation.mp4');

await new Promise((resolve, reject) => {
  const p = spawn(ffmpegPath, [
    '-y',
    '-f', 'concat',
    '-safe', '0',
    '-i', concatTxt,
    '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-preset', 'fast',
    '-crf', '22',
    outMp4Artifact
  ]);
  p.on('close', code => (code === 0 ? resolve() : reject(new Error(`ffmpeg exit ${code}`))));
});

fs.copyFileSync(outMp4Artifact, outMp4Local);

const stat = fs.statSync(outMp4Artifact);
console.log(`\nSuccessfully recorded and encoded:`);
console.log(`  Artifact: ${outMp4Artifact} (${(stat.size / (1024 * 1024)).toFixed(2)} MB)`);
console.log(`  Local: ${outMp4Local}`);

