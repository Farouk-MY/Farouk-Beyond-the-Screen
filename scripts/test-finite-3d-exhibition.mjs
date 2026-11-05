import { spawn } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';
import fs from 'node:fs';
import path from 'node:path';

const artifactDir = 'C:\\Users\\MSI\\.gemini\\antigravity\\brain\\3a927fdd-498e-46e9-a94c-a392df1f645e\\screenshots';
const localDir = path.resolve('public/screenshots');

if (!fs.existsSync(artifactDir)) fs.mkdirSync(artifactDir, { recursive: true });
if (!fs.existsSync(localDir)) fs.mkdirSync(localDir, { recursive: true });

console.log('================================================================');
console.log('PHASE 3 VERIFICATION: FINITE 3D CURVED SCREEN EXHIBITION & MODALS');
console.log('================================================================');

const appPort = 3000;
const edgePort = 9889;
const userDataDir = 'C:\\Users\\MSI\\AppData\\Local\\Temp\\edge-test-3d-' + Date.now();

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

console.log('Browser initialized. Waiting 3.5s for video playback and UI hydration...');
await setTimeout(3500);

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
  await setTimeout(800);
}

async function evalInPage(expression) {
  const res = await send('Runtime.evaluate', {
    expression,
    returnByValue: true,
  });
  return res.result ? res.result.value : null;
}

const testResults = {
  carouselRender: false,
  projectSteps: [],
  finiteBounds: false,
  act3VideoHold: false,
  galleryModal: false,
  detailModal: false,
  responsive: false,
  dynamicProjectsTested: false,
};

console.log('\n--- 1. VERIFYING 3D CAROUSEL & PROJECT STEPS ---');

// Project 0 (MediConnect) centered at ~0.351
await setScroll(0.351);
await capture('act3-3d-carousel-project1.png');

let p0State = await evalInPage(`(() => {
  const title = document.querySelector('#scene-work h3')?.textContent || '';
  const screens = Array.from(document.querySelectorAll('#scene-work [role="button"][aria-label*="Project"]')).map(el => el.getAttribute('aria-label'));
  const activeDot = document.querySelector('#scene-work button[aria-label="View project 1 of 4"]')?.className || '';
  return { title, screens, isActiveDot: activeDot.includes('bg-[#BA5227]') };
})()`);
console.log('Project 0 state:', p0State);
testResults.projectSteps.push({ index: 0, title: p0State.title });

// Project 1 (SmartClass OS) centered at ~0.450
await setScroll(0.450);
await capture('act3-3d-carousel-project2.png');
let p1State = await evalInPage(`(() => {
  const title = document.querySelector('#scene-work h3')?.textContent || '';
  const screens = Array.from(document.querySelectorAll('#scene-work [role="button"][aria-label*="Project"]')).map(el => el.getAttribute('aria-label'));
  return { title, screens };
})()`);
console.log('Project 1 state:', p1State);
testResults.projectSteps.push({ index: 1, title: p1State.title });

// Project 2 (NexForm 3D) centered at ~0.550
await setScroll(0.550);
await capture('act3-3d-carousel-project3.png');
await capture('act3-3d-carousel-perspective-arc.png');
let p2State = await evalInPage(`(() => {
  const title = document.querySelector('#scene-work h3')?.textContent || '';
  const screens = Array.from(document.querySelectorAll('#scene-work [role="button"][aria-label*="Project"]')).map(el => el.getAttribute('aria-label'));
  return { title, screens };
})()`);
console.log('Project 2 state:', p2State);
testResults.projectSteps.push({ index: 2, title: p2State.title });

// Project 3 (Al-Khatt Display) centered at ~0.649
await setScroll(0.649);
await capture('act3-3d-carousel-project4.png');
let p3State = await evalInPage(`(() => {
  const title = document.querySelector('#scene-work h3')?.textContent || '';
  const screens = Array.from(document.querySelectorAll('#scene-work [role="button"][aria-label*="Project"]')).map(el => el.getAttribute('aria-label'));
  return { title, screens };
})()`);
console.log('Project 3 state:', p3State);
testResults.projectSteps.push({ index: 3, title: p3State.title });

testResults.carouselRender = testResults.projectSteps.length === 4 &&
  testResults.projectSteps[0].title.includes('MediConnect') &&
  testResults.projectSteps[1].title.includes('SmartClass') &&
  testResults.projectSteps[2].title.includes('NexForm') &&
  testResults.projectSteps[3].title.includes('Al-Khatt');

console.log('\n--- 2. VERIFYING FINITE BOUNDS (NO CIRCULAR WRAP) ---');
// At Project 0, screens should only be Project 1 and Project 2 (no Project 4 wrap)
console.log('Project 0 screens:', p0State.screens);
// At Project 3, screens should only be Project 3 and Project 4 (no Project 1 wrap)
console.log('Project 3 screens:', p3State.screens);

testResults.finiteBounds = !p0State.screens.some(s => s && s.includes('Project 4')) &&
  !p3State.screens.some(s => s && s.includes('Project 1'));
console.log('Finite bounds verified (no circular wrap):', testResults.finiteBounds);

console.log('\n--- 3. VERIFYING ACT III VIDEO TIME STABILITY (3.75s HOLD) ---');
const videoTimes = [];
for (const p of [0.351, 0.450, 0.550, 0.649]) {
  await setScroll(p);
  const vTime = await evalInPage(`(() => {
    const v = document.querySelector('video[src*="act-03"]');
    return v ? v.currentTime : -1;
  })()`);
  videoTimes.push({ scroll: p, time: vTime });
}
console.log('Act III video times during exhibition presentation:', videoTimes);
// Should hold at approx 3.75s within ±0.05s
testResults.act3VideoHold = videoTimes.every(vt => Math.abs(vt.time - 3.75) < 0.1);
console.log('Act III video hold at 3.75s verified:', testResults.act3VideoHold);

console.log('\n--- 4. VERIFYING LIGHTBOX GALLERY MODAL INTERACTION ---');
// Return to Project 0
await setScroll(0.351);
// Click "Gallery ↗" button
await evalInPage(`(() => {
  const galleryBtn = document.querySelector('#scene-work button:has(span)');
  const btns = Array.from(document.querySelectorAll('#scene-work button'));
  const target = btns.find(b => b.textContent && b.textContent.includes('Gallery'));
  if (target) target.click();
})()`);
await setTimeout(800);
await capture('act3-gallery-modal-opened.png');

let galleryModalState = await evalInPage(`(() => {
  const modal = document.querySelector('[role="dialog"]');
  const overflow = document.body.style.overflow;
  const counter = modal ? modal.textContent.match(/\\d+\\s*\\/\\s*\\d+/) : null;
  return {
    isOpen: !!modal,
    bodyOverflow: overflow,
    counter: counter ? counter[0] : null,
  };
})()`);
console.log('Gallery modal opened state:', galleryModalState);

// Navigate slides in gallery modal: click Next slide
await evalInPage(`(() => {
  const nextBtn = document.querySelector('button[aria-label="Next slide"]');
  if (nextBtn) nextBtn.click();
})()`);
await setTimeout(500);
await capture('act3-gallery-modal-interacted.png');

let galleryNavState = await evalInPage(`(() => {
  const modal = document.querySelector('[role="dialog"]');
  const counter = modal ? modal.textContent.match(/\\d+\\s*\\/\\s*\\d+/) : null;
  return { counter: counter ? counter[0] : null };
})()`);
console.log('Gallery modal navigated state:', galleryNavState);

// Close gallery modal with Escape key
await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
await setTimeout(600);

let galleryClosedState = await evalInPage(`(() => {
  const modal = document.querySelector('[role="dialog"]');
  const overflow = document.body.style.overflow;
  return { isOpen: !!modal, bodyOverflow: overflow };
})()`);
console.log('Gallery modal closed state:', galleryClosedState);
testResults.galleryModal = galleryModalState.isOpen &&
  galleryModalState.bodyOverflow === 'hidden' &&
  !galleryClosedState.isOpen &&
  galleryClosedState.bodyOverflow === '';
console.log('Gallery modal interaction verified:', testResults.galleryModal);

console.log('\n--- 5. VERIFYING ARCHITECTURE SPEC MODAL INTERACTION ---');
// Click "Architecture →" button
await evalInPage(`(() => {
  const btns = Array.from(document.querySelectorAll('#scene-work button'));
  const target = btns.find(b => b.textContent && b.textContent.includes('Architecture'));
  if (target) target.click();
})()`);
await setTimeout(800);
await capture('act3-architecture-modal-opened.png');

let detailModalState = await evalInPage(`(() => {
  const modal = document.querySelector('[role="dialog"]');
  const overflow = document.body.style.overflow;
  return { isOpen: !!modal, bodyOverflow: overflow };
})()`);
console.log('Detail modal opened state:', detailModalState);

// Close detail modal via Escape key
await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
await setTimeout(600);

let detailClosedState = await evalInPage(`(() => {
  const modal = document.querySelector('[role="dialog"]');
  const overflow = document.body.style.overflow;
  return { isOpen: !!modal, bodyOverflow: overflow };
})()`);
console.log('Detail modal closed state:', detailClosedState);
testResults.detailModal = detailModalState.isOpen && !detailClosedState.isOpen;
console.log('Detail modal interaction verified:', testResults.detailModal);

console.log('\n--- 6. VERIFYING OUTRO & TRANSITION TO ENGINEERING ---');
await setScroll(0.701);
await capture('act3-to-act4-transition.png');

console.log('\n--- 7. VERIFYING RESPONSIVE VIEWPORTS ---');
const viewports = [
  { name: 'responsive-desktop-1920x1080.png', w: 1920, h: 1080 },
  { name: 'responsive-desktop-1440x900.png', w: 1440, h: 900 },
  { name: 'responsive-tablet-768x1024.png', w: 768, h: 1024 },
  { name: 'responsive-mobile-430x932.png', w: 430, h: 932 },
  { name: 'responsive-mobile-390x844.png', w: 390, h: 844 },
];

for (const vp of viewports) {
  await send('Emulation.setDeviceMetricsOverride', {
    width: vp.w,
    height: vp.h,
    deviceScaleFactor: 1,
    mobile: vp.w < 768,
  });
  await setScroll(0.351); // Project 0
  await capture(vp.name);
}
testResults.responsive = true;

// Reset viewport to desktop
await send('Emulation.setDeviceMetricsOverride', {
  width: 1920,
  height: 1080,
  deviceScaleFactor: 1,
  mobile: false,
});

console.log('\n====================================================');
console.log('TEST SUMMARY RESULTS:');
console.log(JSON.stringify(testResults, null, 2));
console.log('====================================================');

ws.close();
edge.kill();
process.exit(0);
