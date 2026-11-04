import { spawn } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';
import fs from 'node:fs';
import path from 'node:path';

const outDir = 'C:\\Users\\MSI\\.gemini\\antigravity\\brain\\3a927fdd-498e-46e9-a94c-a392df1f645e\\screenshots';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log('====================================================');
console.log('CINEMATIC VIDEO REBUILD — COMPLETE VERIFICATION');
console.log('====================================================');

// 1. Launch Next.js production server or check if running
let nextServer = null;
const appPort = 3000;
let isRunning = false;

try {
  const res = await fetch(`http://localhost:${appPort}/`);
  if (res.ok) isRunning = true;
} catch {}

if (!isRunning) {
  console.log(`Starting Next.js production server on port ${appPort}...`);
  nextServer = spawn('npx.cmd', ['next', 'start', '-p', `${appPort}`], {
    stdio: 'ignore',
    shell: true,
  });

  for (let i = 0; i < 40; i++) {
    await setTimeout(500);
    try {
      const res = await fetch(`http://localhost:${appPort}/`);
      if (res.ok) {
        console.log('Next.js server is up and responsive!');
        isRunning = true;
        break;
      }
    } catch {}
  }
} else {
  console.log(`Next.js server is already active on port ${appPort}!`);
}

// 2. Launch headless Edge with remote debugging
const edgePort = 9642;
const userDataDir = 'C:\\Users\\MSI\\AppData\\Local\\Temp\\edge-cinematic-verify-' + Date.now();
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
  await setTimeout(300);
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
const consoleErrors = [];

function send(method, params = {}) {
  const id = msgId++;
  return new Promise((resolve) => {
    pending.set(id, { resolve });
    ws.send(JSON.stringify({ id, method, params }));
  });
}

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.method === 'Runtime.consoleAPICalled') {
    if (msg.params.type === 'error') {
      consoleErrors.push(msg.params.args.map((a) => a.value || a.description).join(' '));
    }
  }
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id).resolve(msg.result);
    pending.delete(msg.id);
  }
};

await send('Runtime.enable');
await send('Page.enable');
await send('DOM.enable');

// Wait for initial DOM and video load
console.log('Waiting for initial page load and idle video readiness...');
await setTimeout(3500);

// Helper function to capture screenshot
async function capture(filename, width = 1920, height = 1080, deviceScaleFactor = 1) {
  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor,
    mobile: width < 600,
  });
  await setTimeout(300);

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const buf = Buffer.from(shot.data, 'base64');
  const filePath = path.join(outDir, filename);
  fs.writeFileSync(filePath, buf);
  console.log(`Saved screenshot: ${filename} (${(buf.length / 1024).toFixed(1)} KB)`);
}

// Helper function to set scroll progress via exposed test automation helper
async function setProgress(p) {
  await send('Runtime.evaluate', {
    expression: `
      if (window.__FAROUK_SET_SCROLL_PROGRESS) {
        window.__FAROUK_SET_SCROLL_PROGRESS(${p});
      }
    `,
  });
  // Wait for RAF seek and DOM telemetry update
  await setTimeout(600);
}

// 1. Initial Desktop View (S = 0.000) — Act I Idle Typing Loop
console.log('Testing Act I: The Studio (Initial Load, Idle Loop)...');
await setProgress(0.0);
await capture('cinematic-act1-idle-s000.png', 1920, 1080);

// 2. Act I mid-progression (S = 0.100) — Farouk standing and walking to door
console.log('Testing Act I: The Studio (Walking to Door S = 0.100)...');
await setProgress(0.10);
await capture('cinematic-act1-walking-s010.png', 1920, 1080);

// 3. Act II: The Threshold (S = 0.280) — Stone Terrace Promenade
console.log('Testing Act II: The Threshold (Stone Terrace S = 0.280)...');
await setProgress(0.28);
await capture('cinematic-act2-terrace-s028.png', 1920, 1080);

// 4. Act III: The Work (S = 0.480) — Exhibition Gallery & Selected Projects
console.log('Testing Act III: The Work (Project Exhibition S = 0.480)...');
await setProgress(0.48);
await capture('cinematic-act3-work-s048.png', 1920, 1080);

// 5. Act IV: The Craft (S = 0.680) — Systems Observatory & Holographic Console
console.log('Testing Act IV: The Craft (Engineering Lab S = 0.680)...');
await setProgress(0.68);
await capture('cinematic-act4-craft-s068.png', 1920, 1080);

// 6. Act V: The Horizon (S = 0.920) — Sunset Balcony & Contact Terminal
console.log('Testing Act V: The Horizon (Sunset Balcony S = 0.920)...');
await setProgress(0.92);
await capture('cinematic-act5-horizon-s092.png', 1920, 1080);

// 7. Backward scrubbing test: Return to S = 0.000
console.log('Testing Reverse Scrubbing back to S = 0.000...');
await setProgress(0.50);
await setTimeout(300);
await setProgress(0.20);
await setTimeout(300);
await setProgress(0.0);
await setTimeout(1500); // Wait for idle loop to resume
await capture('cinematic-reverse-return-idle.png', 1920, 1080);

// 8. Laptop Viewport (1440 x 900)
console.log('Testing Laptop Viewport (1440x900)...');
await setProgress(0.48);
await capture('cinematic-laptop-act3-1440x900.png', 1440, 900);

// 9. Mobile Viewport (390 x 844)
console.log('Testing Mobile Viewport (390x844)...');
await setProgress(0.0);
await capture('cinematic-mobile-act1-390x844.png', 390, 844, 2);
await setProgress(0.48);
await capture('cinematic-mobile-act3-390x844.png', 390, 844, 2);

console.log('====================================================');
console.log(`Console Errors: ${consoleErrors.length}`);
if (consoleErrors.length > 0) {
  console.log('ERRORS ENCOUNTERED:', consoleErrors);
} else {
  console.log('ZERO CONSOLE ERRORS DETECTED!');
}
console.log('====================================================');

edge.kill();
if (nextServer) {
  nextServer.kill();
}
process.exit(0);

