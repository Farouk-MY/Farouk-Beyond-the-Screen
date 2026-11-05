import { spawn } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';
import fs from 'node:fs';

const edgePort = 9897;
const userDataDir = 'C:\\Users\\MSI\\AppData\\Local\\Temp\\edge-test-errors-' + Date.now();

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

const consoleLogs = [];
ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.method === 'Runtime.consoleAPICalled') {
    consoleLogs.push({ type: msg.params.type, args: msg.params.args.map((a) => a.value) });
  }
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id).resolve(msg.result);
    pending.delete(msg.id);
  }
};

await send('Runtime.enable');
await send('Page.enable');
await send('Console.enable');

console.log('Waiting 3s for page load...');
await setTimeout(3000);

async function evalCode(expression) {
  const res = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  return res.result ? res.result.value : null;
}

// Attach error listeners to all video elements
await evalCode(`
  window.__videoErrors = [];
  document.querySelectorAll('video').forEach((v, idx) => {
    v.addEventListener('error', (e) => {
      window.__videoErrors.push({ idx, src: v.src, error: v.error ? v.error.message || v.error.code : 'unknown' });
    });
    v.addEventListener('stalled', () => {
      window.__videoErrors.push({ idx, src: v.src, event: 'stalled', ct: v.currentTime });
    });
    v.addEventListener('waiting', () => {
      window.__videoErrors.push({ idx, src: v.src, event: 'waiting', ct: v.currentTime });
    });
  });
`);

console.log('Simulating smooth scroll through Act 3 (p=0.30 to p=0.72)...');
for (let p = 0.30; p <= 0.72; p += 0.01) {
  await evalCode(`if (window.__FAROUK_SET_SCROLL_PROGRESS) {
    window.__FAROUK_SET_SCROLL_PROGRESS(${p});
  } else {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, maxScroll * ${p});
    window.dispatchEvent(new Event('scroll'));
  }`);
  await setTimeout(40);
}

await setTimeout(1000);

const videoErrors = await evalCode(`window.__videoErrors`);
console.log('Video errors / events:', videoErrors);

const act3Status = await evalCode(`(() => {
  const v = document.querySelectorAll('video:not([loop])')[2];
  return {
    src: v ? v.src : null,
    ct: v ? v.currentTime : null,
    duration: v ? v.duration : null,
    readyState: v ? v.readyState : null,
    networkState: v ? v.networkState : null,
    error: v && v.error ? v.error.code : null,
    paused: v ? v.paused : null,
    seeking: v ? v.seeking : null,
    opacity: v ? v.style.opacity : null,
    display: v ? v.style.display : null,
    visibility: v ? v.style.visibility : null
  };
})()`);
console.log('Act 3 Video element status:', act3Status);

const shot = await send('Page.captureScreenshot', { format: 'png' });
const buf = Buffer.from(shot.data, 'base64');
fs.writeFileSync('test_act3_scrolled_edge.png', buf);
console.log('Saved test_act3_scrolled_edge.png');

edge.kill('SIGTERM');
process.exit(0);
