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
const edgePort = 9899;
const userDataDir = 'C:\\Users\\MSI\\AppData\\Local\\Temp\\edge-rec-suite-' + Date.now();

console.log('====================================================');
console.log('FAROUK PORTFOLIO — ACCURATE CINEMATIC VIDEO RECORDER');
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

async function recordTabScenario(filename, totalDurationMs, scenarioFn) {
  console.log(`\n>>> Preparing Scenario: ${filename} (Target ~${(totalDurationMs / 1000).toFixed(1)}s)...`);
  const outputPath = path.join(recDir, filename);
  const segDir = path.join(tempBaseDir, `seg_${Date.now()}`);
  fs.mkdirSync(segDir, { recursive: true });

  // Open fresh dedicated tab
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

      // Ack frame immediately
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

  // Wait for initial render and idle loop start
  await setTimeout(3500);

  // Helper inside scenario
  const setScroll = async (p) => {
    await send('Runtime.evaluate', {
      expression: `if (window.__FAROUK_SET_SCROLL_PROGRESS) window.__FAROUK_SET_SCROLL_PROGRESS(${p});`,
    });
  };

  // Start dedicated screencast session
  await send('Page.startScreencast', {
    format: 'jpeg',
    quality: 85,
    maxWidth: 1280,
    maxHeight: 720,
    everyNthFrame: 1
  });

  const startTime = Date.now();
  try {
    await scenarioFn({ send, setScroll });
  } catch (err) {
    console.error(`Error in scenario ${filename}:`, err);
  }

  const elapsed = Date.now() - startTime;
  if (elapsed < totalDurationMs) {
    await setTimeout(totalDurationMs - elapsed);
  }

  await send('Page.stopScreencast');
  await setTimeout(400);

  ws.close();
  try {
    await fetch(`http://127.0.0.1:${edgePort}/json/close/${tab.id}`);
  } catch {}

  console.log(`Captured ${frames.length} frames for ${filename}. Assembling with FFmpeg...`);

  if (frames.length > 0) {
    const concatLines = [];
    for (let i = 0; i < frames.length; i++) {
      const framePath = path.join(segDir, `f_${String(i).padStart(5, '0')}.jpg`);
      fs.writeFileSync(framePath, frames[i].data);

      let dur = 0.0416; // default 1/24s
      if (i < frames.length - 1) {
        const deltaMs = frames[i + 1].recvTime - frames[i].recvTime;
        dur = Math.max(0.016, Math.min(0.25, deltaMs / 1000));
      }
      concatLines.push(`file '${framePath.replace(/\\/g, '/')}'`);
      concatLines.push(`duration ${dur.toFixed(4)}`);
    }

    const lastFramePath = path.join(segDir, `f_${String(frames.length - 1).padStart(5, '0')}.jpg`);
    concatLines.push(`file '${lastFramePath.replace(/\\/g, '/')}'`);

    const concatFile = path.join(segDir, 'frames.txt');
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
        else reject(new Error(`FFmpeg exited with code ${code}`));
      });
    });

    fs.rmSync(segDir, { recursive: true, force: true });
  }

  const stat = fs.statSync(outputPath);
  console.log(`Successfully generated ${filename}: ${(stat.size / (1024 * 1024)).toFixed(2)} MB`);
  fs.copyFileSync(outputPath, path.join(artifactRecDir, filename));
}

// ----------------------------------------------------
// SCENARIO 1: IDLE TO SCROLL HANDOFF
// ----------------------------------------------------
await recordTabScenario('idle-to-scroll-handoff.mp4', 7000, async ({ setScroll }) => {
  // 1.5s idle typing loop
  await setTimeout(1500);
  // Initiate forward scroll through Act I
  const steps = 30;
  for (let i = 1; i <= steps; i++) {
    const p = (i / steps) * 0.18;
    await setScroll(p);
    await setTimeout(90);
  }
  // Hold at Act I doorway threshold
  await setTimeout(1500);
});

// ----------------------------------------------------
// SCENARIO 2: SLOW SCROLL THROUGH ALL FIVE ACTS
// ----------------------------------------------------
await recordTabScenario('slow-scroll-five-acts.mp4', 24000, async ({ setScroll }) => {
  await setTimeout(1000);
  const steps = 80;
  for (let i = 1; i <= steps; i++) {
    const p = i / steps;
    await setScroll(p);
    await setTimeout(220);
  }
  await setTimeout(2000);
});

// ----------------------------------------------------
// SCENARIO 3: FAST SCROLL & REVERSE SCRUB TO IDLE
// ----------------------------------------------------
await recordTabScenario('fast-scroll-and-reverse.mp4', 16000, async ({ setScroll }) => {
  await setTimeout(1000);
  // Fast forward
  for (let i = 1; i <= 25; i++) {
    await setScroll(i / 25);
    await setTimeout(120);
  }
  await setTimeout(1000);
  // Fast reverse
  for (let i = 24; i >= 0; i--) {
    await setScroll(i / 25);
    await setTimeout(120);
  }
  // Settle at S=0 and allow idle loop to resume
  await setTimeout(3000);
});

// ----------------------------------------------------
// SCENARIO 4: ACT III PROJECT SWITCHING
// ----------------------------------------------------
await recordTabScenario('act3-project-switching.mp4', 15000, async ({ send, setScroll }) => {
  // Navigate to Act III
  await setScroll(0.42);
  await setTimeout(1500);

  // Click project tabs sequentially
  for (let idx = 0; idx < 4; idx++) {
    await send('Runtime.evaluate', {
      expression: `(() => {
        const tabs = Array.from(document.querySelectorAll('button[role="tab"]'));
        if (tabs[${idx}]) tabs[${idx}].click();
      })()`,
    });
    await setTimeout(2200);
  }

  // Open Project Modal
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Examine Architecture'));
      if (btn) btn.click();
    })()`,
  });
  await setTimeout(2500);

  // Close modal
  await send('Runtime.evaluate', {
    expression: `(() => {
      const closeBtn = document.querySelector('button[aria-label="Close project modal"]');
      if (closeBtn) closeBtn.click();
    })()`,
  });
  await setTimeout(1000);
});

// ----------------------------------------------------
// SCENARIO 5: COMPLETE MASTER CONTINUOUS EXPERIENCE
// ----------------------------------------------------
await recordTabScenario('complete-experience-continuous.mp4', 36000, async ({ send, setScroll }) => {
  // 3s idle typing
  await setTimeout(3000);
  // Smooth scroll through all acts
  const steps = 90;
  for (let i = 1; i <= steps; i++) {
    const p = i / steps;
    await setScroll(p);
    await setTimeout(180);
  }
  // At Contact Act: copy email test
  await send('Runtime.evaluate', {
    expression: `(() => {
      const copyBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Copy Address'));
      if (copyBtn) copyBtn.click();
    })()`,
  });
  await setTimeout(3500);

  // Reverse back to desk
  for (let i = steps - 1; i >= 0; i -= 2) {
    await setScroll(i / steps);
    await setTimeout(90);
  }
  // Settle at S=0
  await setTimeout(3500);
});

console.log('\nAll scenario recordings completed successfully!');
edge.kill();
try {
  fs.rmSync(tempBaseDir, { recursive: true, force: true });
} catch {}
process.exit(0);
