import { spawn } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';
import fs from 'node:fs';
import path from 'node:path';

const edgePort = 9866;
const userDataDir = 'C:\\Users\\MSI\\AppData\\Local\\Temp\\edge-proj-img-' + Date.now();

const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
  '--headless=new',
  `--remote-debugging-port=${edgePort}`,
  `--user-data-dir=${userDataDir}`,
  '--no-first-run',
  '--no-default-browser-check',
  'about:blank',
]);

for (let i = 0; i < 30; i++) {
  await setTimeout(150);
  try {
    const res = await fetch(`http://127.0.0.1:${edgePort}/json/version`);
    if (res.ok) break;
  } catch {}
}

const newTabRes = await fetch(`http://127.0.0.1:${edgePort}/json/new?about:blank`, { method: 'PUT' });
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

await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', {
  width: 800,
  height: 500,
  deviceScaleFactor: 2, // 1600x1000 retina output
  mobile: false
});

const projects = ['mediconnect', 'smart-class', 'nexform', 'linguamate'];
for (const p of projects) {
  const pDir = path.resolve('public/projects', p);
  const files = fs.readdirSync(pDir).filter(f => f.endsWith('.svg'));
  for (const f of files) {
    const svgPath = path.join(pDir, f);
    const webpPath = svgPath.replace('.svg', '.webp');
    const svg = fs.readFileSync(svgPath, 'utf-8');
    const html = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#15100E;overflow:hidden;width:800px;height:500px;">${svg}</body></html>`;
    await send('Page.setDocumentContent', { frameId: tab.id, html });
    await setTimeout(250);
    const shot = await send('Page.captureScreenshot', { format: 'webp', quality: 90, fromSurface: true });
    const buf = Buffer.from(shot.data, 'base64');
    fs.writeFileSync(webpPath, buf);
    console.log(`Rendered ${p}/${f.replace('.svg', '.webp')} (${(buf.length / 1024).toFixed(1)} KB)`);
  }
}

ws.close();
edge.kill();
try {
  fs.rmSync(userDataDir, { recursive: true, force: true });
} catch {}
console.log('All project images rendered to high-density WebP successfully!');
process.exit(0);

