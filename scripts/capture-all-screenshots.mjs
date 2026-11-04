import { spawn } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';
import fs from 'node:fs';
import path from 'node:path';

const artifactDir = 'C:\\Users\\MSI\\.gemini\\antigravity\\brain\\3a927fdd-498e-46e9-a94c-a392df1f645e\\screenshots';
const localDir = path.resolve('public/screenshots');

if (!fs.existsSync(artifactDir)) fs.mkdirSync(artifactDir, { recursive: true });
if (!fs.existsSync(localDir)) fs.mkdirSync(localDir, { recursive: true });

console.log('====================================================');
console.log('FAROUK PORTFOLIO — COMPREHENSIVE VISUAL CAPTURE');
console.log('====================================================');

const appPort = 3000;
const edgePort = 9876;
const userDataDir = 'C:\\Users\\MSI\\AppData\\Local\\Temp\\edge-cap-' + Date.now();

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

console.log('Browser initialized. Waiting 4s for assets and initial render...');
await setTimeout(4000);

async function capture(filename) {
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const buf = Buffer.from(shot.data, 'base64');
  fs.writeFileSync(path.join(artifactDir, filename), buf);
  fs.writeFileSync(path.join(localDir, filename), buf);
  console.log(`Saved screenshot: ${filename} (${(buf.length / 1024).toFixed(1)} KB)`);
}

async function setScroll(p) {
  await send('Runtime.evaluate', {
    expression: `if (window.__FAROUK_SET_SCROLL_PROGRESS) window.__FAROUK_SET_SCROLL_PROGRESS(${p});`,
  });
  // Allow video seek and layout to present
  await setTimeout(600);
}

const desktopMoments = [
  // Act I: The Origin
  { p: 0.00, file: 'act1-moment-00-idle-seated.png' },
  { p: 0.05, file: 'act1-moment-05-active-coding.png' },
  { p: 0.10, file: 'act1-moment-10-hands-resting.png' },
  { p: 0.15, file: 'act1-moment-15-standing-up.png' },
  { p: 0.18, file: 'act1-moment-18-walking-door.png' },
  { p: 0.20, file: 'transition-act1-act2.png' },

  // Act II: The Journey
  { p: 0.20, file: 'act2-moment-20-threshold-step.png' },
  { p: 0.25, file: 'act2-moment-25-terrace-start.png' },
  { p: 0.30, file: 'act2-moment-30-promenade-ocean.png' },
  { p: 0.35, file: 'act2-moment-35-approaching-pavilion.png' },
  { p: 0.40, file: 'transition-act2-act3.png' },

  // Act III: The Work
  { p: 0.40, file: 'act3-moment-40-gallery-entrance.png' },
  { p: 0.45, file: 'act3-moment-45-mobile-display.png' },
  { p: 0.50, file: 'act3-moment-50-analytics-dashboard.png' },
  { p: 0.55, file: 'act3-moment-55-nexform-3d-customizer.png' },
  { p: 0.60, file: 'transition-act3-act4.png' },

  // Act IV: The Philosophy & Systems
  { p: 0.60, file: 'act4-moment-60-lab-corridor.png' },
  { p: 0.65, file: 'act4-moment-65-approaching-pedestal.png' },
  { p: 0.70, file: 'act4-moment-70-holographic-graph.png' },
  { p: 0.75, file: 'act4-moment-75-turning-to-balcony.png' },
  { p: 0.80, file: 'transition-act4-act5.png' },

  // Act V: Beyond the Horizon
  { p: 0.80, file: 'act5-moment-80-stepping-balcony.png' },
  { p: 0.85, file: 'act5-moment-85-walking-railing.png' },
  { p: 0.90, file: 'act5-moment-90-resting-at-railing.png' },
  { p: 0.95, file: 'act5-moment-95-sunset-horizon-contact.png' },
  { p: 1.00, file: 'act5-moment-100-contact-terminal.png' },
];

console.log('\n--- 1. CAPTURING 1920x1080 DESKTOP MOMENTS ---');
for (const moment of desktopMoments) {
  await setScroll(moment.p);
  await capture(moment.file);
}

// Act III Modal open test
console.log('\n--- 2. CAPTURING ACT III MODAL ---');
await setScroll(0.45);
await send('Runtime.evaluate', {
  expression: `(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Examine Architecture'));
    if (btn) btn.click();
  })()`,
});
await setTimeout(800);
await capture('act3-project-modal-opened.png');
// Close modal
await send('Runtime.evaluate', {
  expression: `(() => {
    const closeBtn = document.querySelector('button[aria-label="Close project modal"]');
    if (closeBtn) closeBtn.click();
  })()`,
});
await setTimeout(400);

// Responsive captures
console.log('\n--- 3. CAPTURING RESPONSIVE VIEWPORTS ---');
const responsiveConfigs = [
  { file: 'responsive-mobile-iphone14-390x844.png', w: 390, h: 844, p: 0.05, mobile: true },
  { file: 'responsive-mobile-iphone16promax-430x932.png', w: 430, h: 932, p: 0.45, mobile: true },
  { file: 'responsive-tablet-ipad-768x1024.png', w: 768, h: 1024, p: 0.70, mobile: false },
  { file: 'responsive-desktop-compact-1440x900.png', w: 1440, h: 900, p: 1.00, mobile: false },
];

for (const cfg of responsiveConfigs) {
  await send('Emulation.setDeviceMetricsOverride', {
    width: cfg.w,
    height: cfg.h,
    deviceScaleFactor: 1,
    mobile: cfg.mobile,
  });
  await setTimeout(300);
  await setScroll(cfg.p);
  await capture(cfg.file);
}

// Reset device metrics to desktop
await send('Emulation.clearDeviceMetricsOverride');

// Reduced motion test
console.log('\n--- 4. CAPTURING PREFERS-REDUCED-MOTION VIEW ---');
await send('Emulation.setEmulatedMedia', {
  features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
});
await setTimeout(800);
await capture('reduced-motion-static-view.png');

console.log('\nAll comprehensive screenshots captured successfully!');
try {
  ws.close();
  edge.kill();
} catch {}
process.exit(0);
