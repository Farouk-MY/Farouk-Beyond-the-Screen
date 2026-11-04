import { spawn } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';
import path from 'node:path';
import http from 'node:http';
import fs from 'node:fs';

// Start a tiny static file server
const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  let filePath;
  if (urlPath === '/normal.mp4') {
    filePath = path.resolve('public/videos/act-01.mp4');
  } else if (urlPath === '/all-i.mp4') {
    filePath = path.resolve('assets/processed-videos/act-01-all-i.mp4');
  } else {
    res.writeHead(404);
    res.end();
    return;
  }

  const stat = fs.statSync(filePath);
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${stat.size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': end - start + 1,
      'Content-Type': 'video/mp4',
    });
    fs.createReadStream(filePath, { start, end }).pipe(res);
  } else {
    res.writeHead(200, {
      'Content-Length': stat.size,
      'Content-Type': 'video/mp4',
    });
    fs.createReadStream(filePath).pipe(res);
  }
});

server.listen(0);
const serverPort = server.address().port;

async function runBenchmark() {
  const port = 9522;
  const userDataDir = 'C:\\Users\\MSI\\AppData\\Local\\Temp\\edge-seek-bench-' + Date.now();
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
  await new Promise((resolve) => { ws.onopen = resolve; });

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

  const benchScript = `
    (async () => {
      async function testVideo(url) {
        const v = document.createElement('video');
        v.src = url;
        v.preload = 'auto';
        v.muted = true;
        document.body.appendChild(v);

        await new Promise(r => v.addEventListener('canplaythrough', r, { once: true }));

        const seekTimesForward = [];
        const seekTimesBackward = [];

        // Test 10 forward seeks
        for (let i = 1; i <= 10; i++) {
          const target = i * 0.8;
          const t0 = performance.now();
          v.currentTime = target;
          await new Promise(r => v.addEventListener('seeked', r, { once: true }));
          seekTimesForward.push(performance.now() - t0);
        }

        // Test 10 backward seeks
        for (let i = 9; i >= 0; i--) {
          const target = i * 0.8;
          const t0 = performance.now();
          v.currentTime = target;
          await new Promise(r => v.addEventListener('seeked', r, { once: true }));
          seekTimesBackward.push(performance.now() - t0);
        }

        v.remove();
        const avg = arr => (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2);
        return {
          avgForwardMs: avg(seekTimesForward),
          avgBackwardMs: avg(seekTimesBackward),
          maxForwardMs: Math.max(...seekTimesForward).toFixed(2),
          maxBackwardMs: Math.max(...seekTimesBackward).toFixed(2)
        };
      }

      const resNormal = await testVideo('http://localhost:' + ${serverPort} + '/normal.mp4');
      const resAllI = await testVideo('http://localhost:' + ${serverPort} + '/all-i.mp4');

      return { normal: resNormal, allI: resAllI };
    })()
  `;

  const evalRes = await send('Runtime.evaluate', {
    expression: benchScript,
    returnByValue: true,
    awaitPromise: true,
  });

  console.log('BENCHMARK RESULTS:');
  console.log(JSON.stringify(evalRes.result.value, null, 2));

  edge.kill();
  server.close();
}

runBenchmark().catch(console.error);
