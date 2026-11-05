import { spawn } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';
import fs from 'node:fs';

const edgePort = 9898;
const userDataDir = 'C:\\Users\\MSI\\AppData\\Local\\Temp\\edge-test-scrub-fast-' + Date.now();

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

const newTabRes = await fetch(`http://127.0.0.1:${edgePort}/json/new?http://localhost:3000/`, { method: 'PUT' });
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
await setTimeout(2500);

async function evalCode(expression) {
  const res = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  return res.result ? res.result.value : null;
}

// Rapid scroll back and forth around Project 4 (p = 0.60 to 0.68)
console.log('Simulating aggressive scrubbing around Project 4...');
for (let cycle = 0; cycle < 5; cycle++) {
  for (let p = 0.60; p <= 0.68; p += 0.02) {
    await evalCode(`if (window.__FAROUK_SET_SCROLL_PROGRESS) window.__FAROUK_SET_SCROLL_PROGRESS(${p});`);
    await setTimeout(16);
  }
  for (let p = 0.68; p >= 0.60; p -= 0.02) {
    await evalCode(`if (window.__FAROUK_SET_SCROLL_PROGRESS) window.__FAROUK_SET_SCROLL_PROGRESS(${p});`);
    await setTimeout(16);
  }
}

// Settle exactly at Project 4 (p = 0.6493)
await evalCode(`if (window.__FAROUK_SET_SCROLL_PROGRESS) window.__FAROUK_SET_SCROLL_PROGRESS(0.6493);`);
await setTimeout(500);

const shot = await send('Page.captureScreenshot', { format: 'png' });
const buf = Buffer.from(shot.data, 'base64');
fs.writeFileSync('test_rapid_scrub_p4.png', buf);
console.log('Saved test_rapid_scrub_p4.png');

edge.kill('SIGTERM');
process.exit(0);

