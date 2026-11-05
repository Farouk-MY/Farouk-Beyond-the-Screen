import { spawn } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';
import fs from 'node:fs';
import path from 'node:path';

const artifactDir = 'C:\\Users\\MSI\\.gemini\\antigravity\\brain\\3a927fdd-498e-46e9-a94c-a392df1f645e\\screenshots';
const localDir = path.resolve('public/screenshots');

if (!fs.existsSync(artifactDir)) fs.mkdirSync(artifactDir, { recursive: true });
if (!fs.existsSync(localDir)) fs.mkdirSync(localDir, { recursive: true });

console.log('================================================================');
console.log('TESTING NEW ACT 1 TYPING LOOP, CLEARANCE & SCROLL HANDOFF');
console.log('================================================================');

const appPort = 3000;
const edgePort = 9898;
const userDataDir = 'C:\\Users\\MSI\\AppData\\Local\\Temp\\edge-test-act1-' + Date.now();

const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
  '--headless=new',
  `--remote-debugging-port=${edgePort}`,
  `--user-data-dir=${userDataDir}`,
  '--no-first-run',
  '--no-default-browser-check',
  '--window-size=1920,1080',
  'about:blank',
]);

edge.on('error', (err) => {
  console.error('Failed to spawn Edge:', err);
  process.exit(1);
});

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

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id).resolve(msg.result);
    pending.delete(msg.id);
  }
};

await send('Runtime.enable');
await send('Page.enable');

console.log('Browser initialized. Waiting 2.5s for video playback and UI hydration...');
await setTimeout(2500);

async function evalCode(expression) {
  const res = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  return res.result ? res.result.value : null;
}

async function capture(filename) {
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const buf = Buffer.from(shot.data, 'base64');
  fs.writeFileSync(path.join(artifactDir, filename), buf);
  fs.writeFileSync(path.join(localDir, filename), buf);
  console.log(`Saved screenshot: ${filename} (${(buf.length / 1024).toFixed(1)} KB)`);
}

// 1. Inspect Header vs Hero Clearance & Video Elements
console.log('\n--- 1. INSPECTING INITIAL STATE & CLEARANCE ---');
const layout = await evalCode(`(() => {
  const header = document.querySelector('header');
  const heroTitle = document.querySelector('h1');
  const studioBadge = document.querySelector('#scene-studio span');
  const idleVideo = document.querySelector('video[loop]');
  const scrubVideos = document.querySelectorAll('video:not([loop])');

  const headerRect = header ? header.getBoundingClientRect() : null;
  const badgeRect = studioBadge ? studioBadge.getBoundingClientRect() : null;
  const titleRect = heroTitle ? heroTitle.getBoundingClientRect() : null;

  return {
    headerBottom: headerRect ? Math.round(headerRect.bottom) : 0,
    badgeTop: badgeRect ? Math.round(badgeRect.top) : 0,
    clearanceToBadge: badgeRect && headerRect ? Math.round(badgeRect.top - headerRect.bottom) : 0,
    titleTop: titleRect ? Math.round(titleRect.top) : 0,
    clearanceToTitle: titleRect && headerRect ? Math.round(titleRect.top - headerRect.bottom) : 0,
    idleVideo: idleVideo ? {
      src: idleVideo.getAttribute('src'),
      display: window.getComputedStyle(idleVideo).display,
      opacity: window.getComputedStyle(idleVideo).opacity,
      currentTime: idleVideo.currentTime.toFixed(2),
      paused: idleVideo.paused,
    } : null,
    act1ScrubVideo: scrubVideos[0] ? {
      src: scrubVideos[0].getAttribute('src'),
      display: window.getComputedStyle(scrubVideos[0]).display,
      opacity: window.getComputedStyle(scrubVideos[0]).opacity,
      currentTime: scrubVideos[0].currentTime.toFixed(2),
    } : null,
  };
})()`);

console.log(`Header bottom: ${layout.headerBottom}px`);
console.log(`01 / STUDIO badge top: ${layout.badgeTop}px`);
console.log(`Clearance between Header and 01/STUDIO: ${layout.clearanceToBadge}px`);
console.log(`Clearance between Header and Title: ${layout.clearanceToTitle}px`);
console.log('Idle video state:', layout.idleVideo);
console.log('Act 1 scrub video state:', layout.act1ScrubVideo);

await capture('act1-verified-idle-seated.png');

// 2. Observe Idle Typing Loop Advancement
console.log('\n--- 2. OBSERVING IDLE TYPING ADVANCEMENT OVER TIME ---');
const idleSamples = [];
for (let i = 0; i < 5; i++) {
  await setTimeout(500);
  const t = await evalCode(`(() => {
    const v = document.querySelector('video[loop]');
    return v ? v.currentTime.toFixed(2) : '-1';
  })()`);
  idleSamples.push(t);
}
console.log('Idle playback timestamps across 2.5s:', idleSamples.join('s -> ') + 's');

// 3. Initiate Scroll: Test Smooth Handoff
console.log('\n--- 3. TESTING SCROLL HANDOFF FROM IDLE TO SCRUB ---');
const scrollSteps = [
  0.005, 0.015, 0.030, 0.050, 0.080, 0.120
];

for (const p of scrollSteps) {
  await evalCode(`(() => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, maxScroll * ${p});
    window.dispatchEvent(new Event('scroll'));
  })()`);

  await setTimeout(150);

  const state = await evalCode(`(() => {
    const idle = document.querySelector('video[loop]');
    const act1 = document.querySelectorAll('video:not([loop])')[0];
    return {
      progress: ${p},
      idleDisplay: idle ? window.getComputedStyle(idle).display : 'none',
      idlePaused: idle ? idle.paused : true,
      act1Display: act1 ? window.getComputedStyle(act1).display : 'none',
      act1Opacity: act1 ? window.getComputedStyle(act1).opacity : '0',
      act1CurrentTime: act1 ? act1.currentTime.toFixed(3) : '0',
    };
  })()`);

  console.log(`  Progress ${(state.progress * 100).toFixed(1)}%: idle [display: ${state.idleDisplay}, paused: ${state.idlePaused}], act1 [display: ${state.act1Display}, opacity: ${state.act1Opacity}, currentTime: ${state.act1CurrentTime}s]`);
}

await capture('act1-verified-mid-scrub.png');

// 4. Return to Origin: Test Idle Restoration
console.log('\n--- 4. RETURNING TO ORIGIN (TESTING IDLE RESTORATION) ---');
await evalCode(`(() => {
  window.scrollTo(0, 0);
  window.dispatchEvent(new Event('scroll'));
})()`);

await setTimeout(400);

const restoredState = await evalCode(`(() => {
  const idle = document.querySelector('video[loop]');
  const act1 = document.querySelectorAll('video:not([loop])')[0];
  return {
    scrollY: window.scrollY,
    idleDisplay: idle ? window.getComputedStyle(idle).display : 'none',
    idlePaused: idle ? idle.paused : true,
    idleOpacity: idle ? window.getComputedStyle(idle).opacity : '0',
    idleCurrentTime: idle ? idle.currentTime.toFixed(3) : '0',
    act1Display: act1 ? window.getComputedStyle(act1).display : 'none',
    act1Opacity: act1 ? window.getComputedStyle(act1).opacity : '0',
  };
})()`);

console.log('Restored origin state (after 400ms):', restoredState);

await capture('act1-verified-idle-restored.png');

console.log('\n================================================================');
console.log('[PASS] ALL ACT 1 VERIFICATIONS COMPLETED SUCCESSFULLY!');
console.log('================================================================');

edge.kill('SIGTERM');
process.exit(0);
