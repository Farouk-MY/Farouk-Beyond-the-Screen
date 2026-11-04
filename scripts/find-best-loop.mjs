import fs from 'node:fs';
import path from 'node:path';

// Let's compare raw pixel data or read JPEG using a canvas or simple byte comparison
// Since we have Edge headless, Edge can load two images onto an OffscreenCanvas or Canvas, get ImageData, and calculate the exact RMSE!
import { spawn } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';

async function findBestLoop() {
  const port = 9520;
  const userDataDir = 'C:\\Users\\MSI\\AppData\\Local\\Temp\\edge-loop-finder-' + Date.now();
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank',
  ]);

  for (let i = 0; i < 20; i++) {
    await setTimeout(200);
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) break;
    } catch {}
  }

  const newTabRes = await fetch(`http://127.0.0.1:${port}/json/new`, { method: 'PUT' });
  const tab = await newTabRes.json();
  const ws = new WebSocket(tab.webSocketDebuggerUrl);

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

  const framesDir = path.resolve('docs/video-analysis/act-01/typing-frames');
  const files = fs.readdirSync(framesDir).filter(f => f.endsWith('.jpg')).sort();

  // Evaluate comparison in Edge
  const evalResult = await send('Runtime.evaluate', {
    expression: `
      (async () => {
        const files = ${JSON.stringify(files)};
        // We'll test pairs
        return { frameCount: files.length };
      })()
    `,
    returnByValue: true,
    awaitPromise: true,
  });

  console.log('Edge loop finder initialized:', evalResult);
  edge.kill();
}

findBestLoop().catch(console.error);

