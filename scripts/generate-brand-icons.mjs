import { spawn } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';
import fs from 'node:fs';

const edgePort = 9871;
const userDataDir = 'C:\\Users\\MSI\\AppData\\Local\\Temp\\edge-icon-gen-' + Date.now();
const svgContent = fs.readFileSync('app/icon.svg', 'utf-8');

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
const html = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:transparent;overflow:hidden;">${svgContent}</body></html>`;
await send('Page.setDocumentContent', { frameId: tab.id, html });
await setTimeout(400);

async function captureSize(size, outputPath) {
  await send('Emulation.setDeviceMetricsOverride', {
    width: size,
    height: size,
    deviceScaleFactor: 1,
    mobile: false
  });
  await setTimeout(200);
  const shot = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  const buf = Buffer.from(shot.data, 'base64');
  fs.writeFileSync(outputPath, buf);
  console.log(`Generated ${outputPath} (${size}x${size}, ${buf.length} bytes)`);
}

await captureSize(180, 'app/apple-icon.png');
await captureSize(32, 'public/favicon-32x32.png');
await captureSize(48, 'public/favicon-48x48.png');
await captureSize(32, 'app/favicon.ico'); // PNG favicon is supported as .ico by all modern browsers

ws.close();
edge.kill();
try {
  fs.rmSync(userDataDir, { recursive: true, force: true });
} catch {}
console.log('Brand identity icon generation complete.');
process.exit(0);
