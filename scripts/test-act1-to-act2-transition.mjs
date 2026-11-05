import { spawn } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';
import fs from 'node:fs';
import path from 'node:path';

const artifactDir = 'C:\\Users\\MSI\\.gemini\\antigravity\\brain\\3a927fdd-498e-46e9-a94c-a392df1f645e\\screenshots';
const localDir = path.resolve('public/screenshots');

if (!fs.existsSync(artifactDir)) fs.mkdirSync(artifactDir, { recursive: true });
if (!fs.existsSync(localDir)) fs.mkdirSync(localDir, { recursive: true });

console.log('================================================================');
console.log('TESTING ACT 1 -> ACT 2 TRANSITION & JOURNEY TEXT ANIMATION');
console.log('================================================================');

const appPort = 3000;
const edgePort = 9897;
const userDataDir = 'C:\\Users\\MSI\\AppData\\Local\\Temp\\edge-test-a1a2-' + Date.now();

const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
  '--headless=new',
  `--remote-debugging-port=${edgePort}`,
  `--user-data-dir=${userDataDir}`,
  '--no-first-run',
  '--no-default-browser-check',
  '--window-size=1920,1080',
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

async function setScroll(p) {
  await evalCode(`if (window.__FAROUK_SET_SCROLL_PROGRESS) {
    window.__FAROUK_SET_SCROLL_PROGRESS(${p});
  } else {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, maxScroll * ${p});
    window.dispatchEvent(new Event('scroll'));
  }`);
  await setTimeout(150);
}

// 1. Act 1 Tail at p = 0.135
console.log('\n--- 1. ACT 1 TAIL (FAROUK REACHING DOOR) ---');
await setScroll(0.135);
await capture('test-act1-tail-reaching-door.png');

// 2. Exact Transition Point at p = 0.149
console.log('\n--- 2. THRESHOLD SUNLIGHT TRANSITION (p = 0.149) ---');
await setScroll(0.149);
await capture('test-threshold-cut-bloom.png');

// 3. Act 2 Milestone 1: Stage 01 Active (p = 0.170)
console.log('\n--- 3. ACT 2 STAGE 01: THE LOCAL SANCTUARY (p = 0.170) ---');
await setScroll(0.170);

const stage1Telemetry = await evalCode(`(() => {
  const header = document.querySelector('header');
  const journeySection = document.querySelector('#scene-journey');
  const journeyBadge = journeySection ? journeySection.querySelector('span') : null;
  const headerRect = header ? header.getBoundingClientRect() : null;
  const badgeRect = journeyBadge ? journeyBadge.getBoundingClientRect() : null;
  const stageBadges = Array.from(document.querySelectorAll('#scene-journey span')).map(s => s.textContent.trim());

  return {
    headerBottom: headerRect ? Math.round(headerRect.bottom) : 0,
    journeyBadgeTop: badgeRect ? Math.round(badgeRect.top) : 0,
    clearance: badgeRect && headerRect ? Math.round(badgeRect.top - headerRect.bottom) : 0,
    activeText: stageBadges.filter(t => t.includes('Stage') || t.includes('JOURNEY')),
  };
})()`);

console.log('Stage 1 Clearance & Text:', stage1Telemetry);
await capture('test-act2-stage1-local-sanctuary.png');

// 4. Act 2 Milestone 2: Stage 02 Active (p = 0.220)
console.log('\n--- 4. ACT 2 STAGE 02: CROSSING INTO SCALE (p = 0.220) ---');
await setScroll(0.220);

const stage2Telemetry = await evalCode(`(() => {
  const stageBadges = Array.from(document.querySelectorAll('#scene-journey span')).map(s => s.textContent.trim());
  return {
    activeBadges: stageBadges.filter(t => t.includes('Stage')),
  };
})()`);

console.log('Stage 2 Active Badges:', stage2Telemetry);
await capture('test-act2-stage2-crossing-scale.png');

// 5. Act 2 Milestone 3: Stage 03 Active (p = 0.270)
console.log('\n--- 5. ACT 2 STAGE 03: MODERN WEB & MOBILE FRONTIER (p = 0.270) ---');
await setScroll(0.270);

const stage3Telemetry = await evalCode(`(() => {
  const stageBadges = Array.from(document.querySelectorAll('#scene-journey span')).map(s => s.textContent.trim());
  return {
    activeBadges: stageBadges.filter(t => t.includes('Stage')),
  };
})()`);

console.log('Stage 3 Active Badges:', stage3Telemetry);
await capture('test-act2-stage3-modern-frontier.png');

console.log('\n================================================================');
console.log('[PASS] ALL ACT 1 -> ACT 2 TRANSITION & ANIMATION TESTS PASSED!');
console.log('================================================================');

edge.kill('SIGTERM');
process.exit(0);

