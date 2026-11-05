import { spawn } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';
import fs from 'node:fs';
import path from 'node:path';

const PORT = 3499;
const SCREENSHOT_DIR = path.resolve('docs/screenshots');
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

const edgePort = 9888;
const userDataDir = 'C:\\Users\\MSI\\AppData\\Local\\Temp\\edge-curated-' + Date.now();

console.log('[Curated] Starting Next.js server on port ' + PORT);
const server = spawn('npx', ['next', 'start', '-p', String(PORT)], {
  stdio: 'ignore',
  shell: true,
});

try {
  let serverReady = false;
  for (let i = 0; i < 40; i++) {
    await setTimeout(250);
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/en`);
      if (res.ok) {
        serverReady = true;
        break;
      }
    } catch {}
  }
  if (!serverReady) throw new Error('Next.js server failed to respond on port ' + PORT);
  console.log('[Curated] Server ready on http://127.0.0.1:' + PORT);

  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new',
    `--remote-debugging-port=${edgePort}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank',
  ]);

  try {
    let edgeReady = false;
    for (let i = 0; i < 40; i++) {
      await setTimeout(200);
      try {
        const res = await fetch(`http://127.0.0.1:${edgePort}/json/version`);
        if (res.ok) {
          edgeReady = true;
          break;
        }
      } catch {}
    }
    if (!edgeReady) throw new Error('Edge failed to start on port ' + edgePort);

    const newTabRes = await fetch(`http://127.0.0.1:${edgePort}/json/new`, { method: 'PUT' });
    const tab = await newTabRes.json();
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    await new Promise((r) => { ws.onopen = r; });

    let msgId = 1;
    const pending = new Map();
    function send(method, params = {}) {
      const id = msgId++;
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };

    await send('Runtime.enable');
    await send('Page.enable');

    async function capture(filename, width, height, url, scrollP = null) {
      console.log(`[Curated] Capturing ${filename} (${width}x${height})...`);
      await send('Emulation.setDeviceMetricsOverride', {
        width,
        height,
        deviceScaleFactor: 1,
        mobile: width < 600,
      });

      await send('Page.navigate', { url });
      await setTimeout(2000);

      if (scrollP !== null) {
        await send('Runtime.evaluate', {
          expression: `window.__FAROUK_SET_SCROLL_PROGRESS && window.__FAROUK_SET_SCROLL_PROGRESS(${scrollP});`,
        });
        await setTimeout(1200);
      }

      const { data } = await send('Page.captureScreenshot', { format: 'webp', quality: 90 });
      const filePath = path.join(SCREENSHOT_DIR, filename);
      fs.writeFileSync(filePath, Buffer.from(data, 'base64'));
      const stat = fs.statSync(filePath);
      console.log(`[Curated] Saved: ${filename} (${(stat.size / 1024).toFixed(1)} KB)`);
    }

    // 1. English Desktop (1920x1080)
    await capture('en-studio.webp', 1920, 1080, `http://127.0.0.1:${PORT}/en`, 0.0);
    await capture('en-journey.webp', 1920, 1080, `http://127.0.0.1:${PORT}/en`, 0.28);
    await capture('en-selected-work.webp', 1920, 1080, `http://127.0.0.1:${PORT}/en`, 0.44);
    await capture('en-contact.webp', 1920, 1080, `http://127.0.0.1:${PORT}/en`, 0.95);

    // 2. Arabic Desktop (1920x1080)
    await capture('ar-studio.webp', 1920, 1080, `http://127.0.0.1:${PORT}/ar`, 0.0);

    // 3. Arabic Mobile (390x844)
    await capture('ar-mobile.webp', 390, 844, `http://127.0.0.1:${PORT}/ar`, 0.0);

    ws.close();
    console.log('[Curated] All 6 curated WebP screenshots captured successfully!');
  } finally {
    edge.kill('SIGTERM');
  }
} finally {
  server.kill('SIGTERM');
  try {
    const { execSync } = await import('node:child_process');
    const netstat = execSync(`netstat -ano | findstr :${PORT}`, { encoding: 'utf8' }).trim();
    for (const line of netstat.split('\n')) {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && !isNaN(Number(pid))) {
        try { execSync(`taskkill /F /PID ${pid}`); } catch {}
      }
    }
  } catch {}
}

