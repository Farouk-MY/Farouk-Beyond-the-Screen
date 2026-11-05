import { spawn } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';
import fs from 'node:fs';
import path from 'node:path';

const PORT = 3456;
const ARTIFACT_DIR = path.resolve('C:\\Users\\MSI\\AppData\\Local\\Temp\\farouk-test-screenshots');
fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

const edgePort = 9877;
const userDataDir = 'C:\\Users\\MSI\\AppData\\Local\\Temp\\edge-test-' + Date.now();

console.log('[Test] Starting Next.js server on port ' + PORT);
const server = spawn('npx', ['next', 'start', '-p', String(PORT)], {
  stdio: 'ignore',
  shell: true,
});

try {
  // Wait for Next.js server
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
  console.log('[Test] Server ready on http://127.0.0.1:' + PORT);

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

    async function capture(name, width, height, url, scrollP = null, clickSelector = null) {
      console.log(`[Test] Capturing ${name} (${width}x${height})...`);
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

      if (clickSelector) {
        await send('Runtime.evaluate', {
          expression: `
            (() => {
              const el = document.querySelector('${clickSelector}');
              if (el) el.click();
            })();
          `,
        });
        await setTimeout(800);
      }

      const { data } = await send('Page.captureScreenshot', { format: 'png' });
      const filePath = path.join(ARTIFACT_DIR, `${name}.png`);
      fs.writeFileSync(filePath, Buffer.from(data, 'base64'));
      console.log(`[Test] Saved: ${filePath}`);
    }

    // 1. English Desktop (1920x1080)
    await capture('01-en-desktop-studio', 1920, 1080, `http://127.0.0.1:${PORT}/en`, 0.0);
    await capture('02-en-desktop-journey', 1920, 1080, `http://127.0.0.1:${PORT}/en`, 0.28);
    await capture('03-en-desktop-work', 1920, 1080, `http://127.0.0.1:${PORT}/en`, 0.44);
    await capture('04-en-desktop-contact', 1920, 1080, `http://127.0.0.1:${PORT}/en`, 0.95);

    // 2. Arabic Desktop (1920x1080)
    await capture('05-ar-desktop-studio', 1920, 1080, `http://127.0.0.1:${PORT}/ar`, 0.0);
    await capture('06-ar-desktop-journey', 1920, 1080, `http://127.0.0.1:${PORT}/ar`, 0.28);
    await capture('07-ar-desktop-work', 1920, 1080, `http://127.0.0.1:${PORT}/ar`, 0.44);
    await capture('08-ar-desktop-contact', 1920, 1080, `http://127.0.0.1:${PORT}/ar`, 0.95);

    // 3. English & Arabic Mobile (390x844)
    await capture('09-en-mobile-studio', 390, 844, `http://127.0.0.1:${PORT}/en`, 0.0);
    await capture('10-ar-mobile-studio', 390, 844, `http://127.0.0.1:${PORT}/ar`, 0.0);

    ws.close();
    console.log('[Test] All 10 screenshots captured successfully!');
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
