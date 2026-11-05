import { spawn } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';
import fs from 'node:fs';

const edgePort = 9896;
const userDataDir = 'C:\\Users\\MSI\\AppData\\Local\\Temp\\edge-test-seek-' + Date.now();

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

const newTabRes = await fetch(`http://127.0.0.1:${edgePort}/json/new?http://localhost:3000/videos/act-03-scrub.mp4`, { method: 'PUT' });
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
await setTimeout(1000);

async function evalCode(expression) {
  const res = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  return res.result ? res.result.value : null;
}

async function capture(filename) {
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const buf = Buffer.from(shot.data, 'base64');
  fs.writeFileSync(filename, buf);
  console.log(`Saved screenshot: ${filename}`);
}

const times = [8.5, 9.0, 9.2, 9.5, 9.7, 9.8, 9.9, 9.95, 10.0];

for (const t of times) {
  const res = await evalCode(`new Promise((resolve) => {
    const v = document.querySelector('video');
    if (!v) return resolve('no video');
    v.currentTime = ${t};
    v.onseeked = () => resolve({ ct: v.currentTime, readyState: v.readyState, error: v.error });
  })`);
  console.log(`Seek to ${t}:`, res);
  await setTimeout(100);
  await capture(`seek_edge_${t}.png`);
}

edge.kill('SIGTERM');
process.exit(0);
