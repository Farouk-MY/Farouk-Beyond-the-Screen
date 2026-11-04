import { spawn } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';

const appPort = 3000;
const edgePort = 9888;
const userDataDir = 'C:\\Users\\MSI\\AppData\\Local\\Temp\\edge-test-scr-' + Date.now();

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

let frameCount = 0;
ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.method === 'Page.screencastFrame') {
    frameCount++;
    const { sessionId } = msg.params;
    ws.send(JSON.stringify({
      id: msgId++,
      method: 'Page.screencastFrameAck',
      params: { sessionId }
    }));
  }
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id).resolve(msg.result);
    pending.delete(msg.id);
  }
};

await send('Runtime.enable');
await send('Page.enable');
await setTimeout(3000);

await send('Page.startScreencast', {
  format: 'jpeg',
  quality: 80,
  maxWidth: 1280,
  maxHeight: 720,
  everyNthFrame: 1
});

console.log('Screencast started. Testing 3 seconds of forward scrolling...');
for (let i = 1; i <= 20; i++) {
  const p = (i / 20) * 0.3;
  await send('Runtime.evaluate', {
    expression: `if (window.__FAROUK_SET_SCROLL_PROGRESS) window.__FAROUK_SET_SCROLL_PROGRESS(${p});`,
  });
  await setTimeout(100);
}

await setTimeout(500);
console.log(`Total screencast frames captured: ${frameCount}`);
await send('Page.stopScreencast');
ws.close();
edge.kill();
process.exit(0);
