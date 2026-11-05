import { spawn } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';
import fs from 'node:fs';
import path from 'node:path';

const recDir = path.resolve('public/recordings');
const artifactRecDir = 'C:\\Users\\MSI\\.gemini\\antigravity\\brain\\3a927fdd-498e-46e9-a94c-a392df1f645e\\recordings';
const tempBaseDir = path.resolve('tmp_rec_segments');

if (!fs.existsSync(recDir)) fs.mkdirSync(recDir, { recursive: true });
if (!fs.existsSync(artifactRecDir)) fs.mkdirSync(artifactRecDir, { recursive: true });
if (!fs.existsSync(tempBaseDir)) fs.mkdirSync(tempBaseDir, { recursive: true });

const ffmpegPath = path.resolve('bin/ffmpeg.exe');
const appPort = 3000;
const edgePort = 9898;
const userDataDir = 'C:\\Users\\MSI\\AppData\\Local\\Temp\\edge-rec-act3-' + Date.now();

console.log('====================================================');
console.log('RECORDING ACT III 3D CURVED EXHIBITION & MODALS');
console.log('====================================================');

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

async function recordScenario(filename, totalDurationMs, scenarioFn) {
  console.log(`\n>>> Preparing Scenario: ${filename} (Target ~${(totalDurationMs / 1000).toFixed(1)}s)...`);
  const outputPath = path.join(recDir, filename);
  const segDir = path.join(tempBaseDir, `seg_${Date.now()}`);
  fs.mkdirSync(segDir, { recursive: true });

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

  const frames = [];
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Page.screencastFrame') {
      const { data, sessionId } = msg.params;
      const now = performance.now();
      frames.push({
        data: Buffer.from(data, 'base64'),
        recvTime: now,
      });
      send('Page.screencastFrameAck', { sessionId }).catch(() => {});
    } else if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id).resolve(msg.result);
      pending.delete(msg.id);
    }
  };

  await send('Page.enable');
  await send('Runtime.enable');

  await setTimeout(3500);

  await send('Page.startScreencast', {
    format: 'jpeg',
    quality: 90,
    maxWidth: 1280,
    maxHeight: 720,
    everyNthFrame: 1,
  });

  const setScroll = async (p) => {
    await send('Runtime.evaluate', {
      expression: `if (window.__FAROUK_SET_SCROLL_PROGRESS) window.__FAROUK_SET_SCROLL_PROGRESS(${p});`,
    });
  };

  try {
    await scenarioFn({ send, setScroll });
  } finally {
    await send('Page.stopScreencast').catch(() => {});
    ws.close();
  }

  console.log(`Captured ${frames.length} frames.`);
  if (frames.length === 0) return;

  const concatLines = [];
  for (let i = 0; i < frames.length; i++) {
    const fPath = path.join(segDir, `frame_${String(i).padStart(5, '0')}.jpg`);
    fs.writeFileSync(fPath, frames[i].data);
    let frameDuration = 0.0416;
    if (i < frames.length - 1) {
      frameDuration = (frames[i + 1].recvTime - frames[i].recvTime) / 1000;
      frameDuration = Math.max(0.016, Math.min(0.3, frameDuration));
    }
    concatLines.push(`file '${fPath.replace(/\\/g, '/')}'`);
    concatLines.push(`duration ${frameDuration.toFixed(4)}`);
  }
  if (frames.length > 0) {
    const lastFPath = path.join(segDir, `frame_${String(frames.length - 1).padStart(5, '0')}.jpg`);
    concatLines.push(`file '${lastFPath.replace(/\\/g, '/')}'`);
  }

  const concatFile = path.join(segDir, 'concat.txt');
  fs.writeFileSync(concatFile, concatLines.join('\n'));

  await new Promise((resolve, reject) => {
    const ffmpeg = spawn(ffmpegPath, [
      '-y',
      '-f', 'concat',
      '-safe', '0',
      '-i', concatFile,
      '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
      '-c:v', 'libx264',
      '-preset', 'fast',
      '-crf', '20',
      '-pix_fmt', 'yuv420p',
      outputPath
    ]);
    ffmpeg.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`FFmpeg exit ${code}`));
    });
  });

  fs.rmSync(segDir, { recursive: true, force: true });
  const stat = fs.statSync(outputPath);
  console.log(`Generated ${filename}: ${(stat.size / (1024 * 1024)).toFixed(2)} MB`);
  fs.copyFileSync(outputPath, path.join(artifactRecDir, filename));
}

// Record Act III 3D Curved Exhibition & Modals
await recordScenario('act3-project-switching.mp4', 20000, async ({ send, setScroll }) => {
  await setScroll(0.351); // Project 0
  await setTimeout(1800);

  await setScroll(0.450); // Project 1
  await setTimeout(1800);

  await setScroll(0.550); // Project 2
  await setTimeout(1800);

  await setScroll(0.649); // Project 3
  await setTimeout(1800);

  await setScroll(0.351); // Back to Project 0
  await setTimeout(1200);

  // Open Gallery Lightbox Modal
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('#scene-work button'));
      const target = btns.find(b => b.textContent && b.textContent.includes('Gallery'));
      if (target) target.click();
    })()`,
  });
  await setTimeout(2000);

  // Next slide
  await send('Runtime.evaluate', {
    expression: `(() => {
      const nextBtn = document.querySelector('button[aria-label="Next slide"]');
      if (nextBtn) nextBtn.click();
    })()`,
  });
  await setTimeout(1500);

  // Escape to close
  await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await setTimeout(1000);

  // Open Architecture Spec Modal
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('#scene-work button'));
      const target = btns.find(b => b.textContent && b.textContent.includes('Architecture'));
      if (target) target.click();
    })()`,
  });
  await setTimeout(1800);

  // Escape to close
  await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await setTimeout(1000);

  // Outro scroll
  await setScroll(0.701);
  await setTimeout(1000);
});

// Also re-record complete experience
await recordScenario('complete-experience-continuous.mp4', 30000, async ({ setScroll }) => {
  await setTimeout(2500);
  const steps = 80;
  for (let i = 1; i <= steps; i++) {
    const p = i / steps;
    await setScroll(p);
    await setTimeout(180);
  }
  await setTimeout(2000);
});

edge.kill();
console.log('Recordings completed successfully!');
process.exit(0);

