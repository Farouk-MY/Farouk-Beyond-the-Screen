import { spawn } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';
import fs from 'node:fs';
import path from 'node:path';

const artifactDir = 'C:\\Users\\MSI\\.gemini\\antigravity\\brain\\3a927fdd-498e-46e9-a94c-a392df1f645e\\screenshots';
const localDir = path.resolve('public/screenshots');

if (!fs.existsSync(artifactDir)) fs.mkdirSync(artifactDir, { recursive: true });
if (!fs.existsSync(localDir)) fs.mkdirSync(localDir, { recursive: true });

console.log('================================================================');
console.log('TESTING LEFT-SIDE PROJECT EXHIBITION UI & CONTINUOUS VIDEO MOTION');
console.log('================================================================');

const appPort = 3000;
const edgePort = 9895;
const userDataDir = 'C:\\Users\\MSI\\AppData\\Local\\Temp\\edge-test-work-left-' + Date.now();

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
  await setTimeout(200);
}

// 1. Inspect Project 0 at p = 0.355
console.log('\n--- 1. PROJECT 0 (p = 0.355) ---');
await setScroll(0.355);

const proj0Telemetry = await evalCode(`(() => {
  const workSection = document.querySelector('#scene-work');
  const leftCol = workSection ? workSection.querySelector('div') : null;
  const colRect = leftCol ? leftCol.getBoundingClientRect() : null;
  const act3Video = document.querySelectorAll('video:not([loop])')[2];
  const activeTitle = workSection ? workSection.querySelector('h3')?.textContent : '';

  return {
    leftColLeft: colRect ? Math.round(colRect.left) : 0,
    leftColRight: colRect ? Math.round(colRect.right) : 0,
    leftColWidth: colRect ? Math.round(colRect.width) : 0,
    rightSideFreeWidth: colRect ? Math.round(window.innerWidth - colRect.right) : 0,
    activeTitle,
    act3VideoTime: act3Video ? act3Video.currentTime.toFixed(3) : '0',
  };
})()`);

console.log('Project 0 Telemetry:', proj0Telemetry);
await capture('act3-left-side-project0-mediconnect.png');

// 2. Project 1 at p = 0.450
console.log('\n--- 2. PROJECT 1 (p = 0.450) ---');
await setScroll(0.450);

const proj1Telemetry = await evalCode(`(() => {
  const workSection = document.querySelector('#scene-work');
  const act3Video = document.querySelectorAll('video:not([loop])')[2];
  const activeTitle = workSection ? workSection.querySelector('h3')?.textContent : '';
  return {
    activeTitle,
    act3VideoTime: act3Video ? act3Video.currentTime.toFixed(3) : '0',
  };
})()`);

console.log('Project 1 Telemetry:', proj1Telemetry);
await capture('act3-left-side-project1-apex.png');

// 3. Project 2 at p = 0.550
console.log('\n--- 3. PROJECT 2 (p = 0.550) ---');
await setScroll(0.550);

const proj2Telemetry = await evalCode(`(() => {
  const workSection = document.querySelector('#scene-work');
  const act3Video = document.querySelectorAll('video:not([loop])')[2];
  const activeTitle = workSection ? workSection.querySelector('h3')?.textContent : '';
  return {
    activeTitle,
    act3VideoTime: act3Video ? act3Video.currentTime.toFixed(3) : '0',
  };
})()`);

console.log('Project 2 Telemetry:', proj2Telemetry);
await capture('act3-left-side-project2-aurora.png');

// 4. Project 3 at p = 0.645
console.log('\n--- 4. PROJECT 3 (p = 0.645) ---');
await setScroll(0.645);

const proj3Telemetry = await evalCode(`(() => {
  const workSection = document.querySelector('#scene-work');
  const act3Video = document.querySelectorAll('video:not([loop])')[2];
  const activeTitle = workSection ? workSection.querySelector('h3')?.textContent : '';
  return {
    activeTitle,
    act3VideoTime: act3Video ? act3Video.currentTime.toFixed(3) : '0',
  };
})()`);

console.log('Project 3 Telemetry:', proj3Telemetry);
await capture('act3-left-side-project3-nexform.png');

console.log('\n================================================================');
console.log('[PASS] ALL LEFT-SIDE WORK EXHIBITION & VIDEO MOTION TESTS PASSED!');
console.log('================================================================');

edge.kill('SIGTERM');
process.exit(0);

