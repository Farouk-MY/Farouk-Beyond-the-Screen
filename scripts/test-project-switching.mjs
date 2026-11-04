import { spawn } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';
import fs from 'node:fs';
import path from 'node:path';

const outDir = 'C:\\Users\\MSI\\.gemini\\antigravity\\brain\\3a927fdd-498e-46e9-a94c-a392df1f645e\\screenshots';
const portfolioFile = path.resolve('config/portfolioData.ts');
const originalContent = fs.readFileSync(portfolioFile, 'utf-8');

console.log('====================================================');
console.log('ACT III FUNCTIONAL TEST — DYNAMIC PROJECT INJECTION');
console.log('====================================================');

// Connect to running Next.js app (port 3000)
const appPort = 3000;
const edgePort = 9753;
const userDataDir = 'C:\\Users\\MSI\\AppData\\Local\\Temp\\edge-project-test-' + Date.now();
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
await setTimeout(3000);

async function capture(filename) {
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const buf = Buffer.from(shot.data, 'base64');
  fs.writeFileSync(path.join(outDir, filename), buf);
  console.log(`Saved screenshot: ${filename} (${(buf.length / 1024).toFixed(1)} KB)`);
}

async function setScroll(p) {
  await send('Runtime.evaluate', {
    expression: `if (window.__FAROUK_SET_SCROLL_PROGRESS) window.__FAROUK_SET_SCROLL_PROGRESS(${p});`,
  });
  await setTimeout(600);
}

// 1. Scroll to Act III
console.log('Navigating to Act III: The Work (S = 0.48)...');
await setScroll(0.48);

// 2. Click through existing projects: NEXFORM, MediConnect, Smart Class, LinguaMate
console.log('Testing project tab clicking for original 4 projects...');
const projects = ['nexform', 'mediconnect', 'smartclass', 'linguamate'];

for (const projId of projects) {
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const buttons = Array.from(document.querySelectorAll('button[role="tab"]'));
        const target = buttons.find(b => b.textContent.toLowerCase().includes('${projId}'));
        if (target) target.click();
      })()
    `,
  });
  await setTimeout(400);
  await capture(`cinematic-act3-tab-${projId}.png`);
}

// 3. Inject Temporary Project #5 into portfolioData.ts
console.log('Injecting temporary project #5 (CloudSync Pro)...');
const tempProjectSnippet = `
  {
    id: 'cloudsync',
    name: 'CloudSync Pro',
    tagline: 'Enterprise Distributed State & Real-Time Sync Engine',
    category: 'backend',
    categoryLabel: 'Distributed Cloud System',
    description:
      'A low-latency distributed database synchronization protocol designed for multi-region edge caches, conflict-free replicated data types (CRDTs), and bidirectional offline-first syncing.',
    technologies: ['FastAPI', 'Python', 'Redis', 'PostgreSQL', 'Docker', 'WebSockets', 'TypeScript'],
    keyFeatures: [
      'CRDT-based conflict-free multi-master data replication across edge regions',
      'Bidirectional offline delta reconciliation engine',
      'Sub-15ms WebSocket publish/subscribe sync latency under high write throughput',
    ],
    architectureOverview:
      'Engineered with FastAPI asynchronous workers and Redis pub/sub backplane, persisted in PostgreSQL with automated partition management.',
    status: 'Architecture Prototype',
    links: {
      github: null,
      live: null,
    },
    metrics: [
      { label: 'Sync Latency', value: '< 15ms' },
      { label: 'Data Model', value: 'CRDT Graph' },
      { label: 'Transport', value: 'WebSockets' },
    ],
  },
`;

const updatedContent = originalContent.replace(
  'export const PROJECTS_DATA: ProjectItem[] = [',
  `export const PROJECTS_DATA: ProjectItem[] = [${tempProjectSnippet}`
);

fs.writeFileSync(portfolioFile, updatedContent, 'utf-8');
console.log('portfolioData.ts updated with CloudSync Pro. Waiting for Turbopack HMR / page refresh...');
await setTimeout(1500);

// Reload tab to pick up new data cleanly
await send('Page.reload');
await setTimeout(3000);
await setScroll(0.48);

// Verify CloudSync Pro tab is present and click it
console.log('Verifying CloudSync Pro appears in showcase tabs...');
const clickResult = await send('Runtime.evaluate', {
  expression: `
    (() => {
      const buttons = Array.from(document.querySelectorAll('button[role="tab"]'));
      const target = buttons.find(b => b.textContent.includes('CloudSync Pro'));
      if (target) {
        target.click();
        return { found: true, tabText: target.textContent };
      }
      return { found: false, count: buttons.length };
    })()
  `,
  returnByValue: true,
});

console.log('CloudSync Tab Click Result:', clickResult.result.value);
await setTimeout(500);
await capture('cinematic-act3-5projects-cloudsync.png');

// 4. Restore original portfolioData.ts
console.log('Restoring portfolioData.ts to original 4 projects...');
fs.writeFileSync(portfolioFile, originalContent, 'utf-8');
await setTimeout(1000);
await send('Page.reload');
await setTimeout(3000);
await setScroll(0.48);

await capture('cinematic-act3-restored-4projects.png');
console.log('Original state restored successfully!');

edge.kill();
process.exit(0);

