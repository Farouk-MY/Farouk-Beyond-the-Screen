import { spawn } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';
import fs from 'node:fs';
import path from 'node:path';

const outDir = 'C:\\Users\\MSI\\.gemini\\antigravity\\brain\\3a927fdd-498e-46e9-a94c-a392df1f645e\\screenshots';
const recDir = path.resolve('public/recordings');
const artifactRecDir = 'C:\\Users\\MSI\\.gemini\\antigravity\\brain\\3a927fdd-498e-46e9-a94c-a392df1f645e\\recordings';

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
if (!fs.existsSync(recDir)) fs.mkdirSync(recDir, { recursive: true });
if (!fs.existsSync(artifactRecDir)) fs.mkdirSync(artifactRecDir, { recursive: true });

const ffmpegPath = path.resolve('bin/ffmpeg.exe');
const appPort = 3000;
const edgePort = 9870;

console.log('====================================================');
console.log('MASTER CINEMATIC RECORDING & PERFORMANCE PROFILING');
console.log('====================================================');

// Launch headless Edge
const userDataDir = 'C:\\Users\\MSI\\AppData\\Local\\Temp\\edge-master-rec-' + Date.now();
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
let currentFfmpeg = null;

function send(method, params = {}) {
  const id = msgId++;
  return new Promise((resolve) => {
    pending.set(id, { resolve });
    ws.send(JSON.stringify({ id, method, params }));
  });
}

ws.onmessage = async (event) => {
  const msg = JSON.parse(event.data);
  if (msg.method === 'Page.screencastFrame') {
    const { data, sessionId } = msg.params;
    if (currentFfmpeg && currentFfmpeg.stdin.writable) {
      currentFfmpeg.stdin.write(Buffer.from(data, 'base64'));
    }
    // Acknowledge frame
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
await send('DOM.enable');

console.log('Browser initialized. Waiting 4s for assets and idle video...');
await setTimeout(4000);

// Helper to record screencast to an MP4
async function recordSegment(outputFilename, durationMs, actionFn) {
  const outputPath = path.join(recDir, outputFilename);
  console.log(`Starting recording: ${outputFilename} (${(durationMs / 1000).toFixed(1)}s)...`);

  const ffmpeg = spawn(ffmpegPath, [
    '-y',
    '-f', 'image2pipe',
    '-vcodec', 'mjpeg',
    '-framerate', '24',
    '-i', '-',
    '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '20',
    '-pix_fmt', 'yuv420p',
    '-an',
    outputPath
  ]);

  ffmpeg.stdin.on('error', () => {
    // Ignore EPIPE when ffmpeg terminates
  });

  currentFfmpeg = ffmpeg;

  await send('Page.startScreencast', {
    format: 'jpeg',
    quality: 85,
    maxWidth: 1280,
    maxHeight: 720,
    everyNthFrame: 1
  });

  const startTime = Date.now();
  if (actionFn) {
    await actionFn();
  }

  const elapsed = Date.now() - startTime;
  if (elapsed < durationMs) {
    await setTimeout(durationMs - elapsed);
  }

  await send('Page.stopScreencast');
  await setTimeout(500);

  ffmpeg.stdin.end();
  await new Promise((resolve) => ffmpeg.on('close', resolve));
  currentFfmpeg = null;

  const stat = fs.statSync(outputPath);
  console.log(`Finished ${outputFilename}: ${(stat.size / (1024 * 1024)).toFixed(2)} MB`);

  // Copy to artifact directory
  fs.copyFileSync(outputPath, path.join(artifactRecDir, outputFilename));
}

// Helper to capture high-res desktop screenshot
async function captureScreenshot(filename, width = 1920, height = 1080) {
  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await setTimeout(250);
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const buf = Buffer.from(shot.data, 'base64');
  fs.writeFileSync(path.join(outDir, filename), buf);
  console.log(`Captured: ${filename}`);
}

async function setScroll(p) {
  await send('Runtime.evaluate', {
    expression: `if (window.__FAROUK_SET_SCROLL_PROGRESS) window.__FAROUK_SET_SCROLL_PROGRESS(${p});`,
  });
  await setTimeout(300);
}

// ----------------------------------------------------
// 1. RECORDING A: 30 SECONDS OF IDLE TYPING PLAYBACK
// ----------------------------------------------------
console.log('\n--- 1. RECORDING: 30s IDLE TYPING PLAYBACK ---');
await setScroll(0.0);
await recordSegment('act1-idle-loop-30s.mp4', 30000, async () => {
  console.log('Recording 30s idle typing loop...');
});

// ----------------------------------------------------
// 2. RECORDING B: IDLE-TO-SCROLL HANDOFF
// ----------------------------------------------------
console.log('\n--- 2. RECORDING: IDLE TO SCROLL HANDOFF ---');
await setScroll(0.0);
await recordSegment('idle-to-scroll-handoff.mp4', 8000, async () => {
  // Wait 2s in idle
  await setTimeout(2000);
  // Start slow scroll
  for (let i = 1; i <= 30; i++) {
    const p = (i / 30) * 0.15;
    await setScroll(p);
    await setTimeout(100);
  }
});

// ----------------------------------------------------
// 3. RECORDING C: SLOW SCROLL THROUGH ALL FIVE ACTS
// ----------------------------------------------------
console.log('\n--- 3. RECORDING: SLOW SCROLL THROUGH FIVE ACTS ---');
await setScroll(0.0);
await recordSegment('slow-scroll-five-acts.mp4', 25000, async () => {
  const steps = 100;
  for (let i = 0; i <= steps; i++) {
    const p = i / steps;
    await setScroll(p);
    await setTimeout(200);
  }
});

// ----------------------------------------------------
// 4. RECORDING D: FAST SCROLL AND FULL REVERSE SCRUB
// ----------------------------------------------------
console.log('\n--- 4. RECORDING: FAST SCROLL & REVERSE SCRUB ---');
await setScroll(0.0);
await recordSegment('fast-scroll-and-reverse.mp4', 16000, async () => {
  // Fast forward
  for (let i = 0; i <= 20; i++) {
    await setScroll(i / 20);
    await setTimeout(200);
  }
  await setTimeout(1000);
  // Fast reverse
  for (let i = 20; i >= 0; i--) {
    await setScroll(i / 20);
    await setTimeout(200);
  }
  // Settle at S = 0 for idle resume
  await setTimeout(3000);
});

// ----------------------------------------------------
// 5. RECORDING E: ACT III PROJECT SWITCHING
// ----------------------------------------------------
console.log('\n--- 5. RECORDING: ACT III PROJECT SWITCHING ---');
await setScroll(0.48);
await recordSegment('act3-project-switching.mp4', 12000, async () => {
  const projectIndices = [0, 1, 2, 3];
  for (const idx of projectIndices) {
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const tabs = Array.from(document.querySelectorAll('button[role="tab"]'));
          if (tabs[${idx}]) tabs[${idx}].click();
        })()
      `,
    });
    await setTimeout(2500);
  }
});

// ----------------------------------------------------
// 6. RECORDING F: COMPLETE MASTER CONTINUOUS RUN
// ----------------------------------------------------
console.log('\n--- 6. RECORDING: COMPLETE MASTER CONTINUOUS RUN ---');
await setScroll(0.0);
await recordSegment('complete-experience-continuous.mp4', 40000, async () => {
  // 5s idle
  await setTimeout(5000);
  // Smooth scroll through all 5 acts
  const steps = 120;
  for (let i = 0; i <= steps; i++) {
    await setScroll(i / steps);
    await setTimeout(220);
  }
  // Pause at final contact scene for 4s
  await setTimeout(4000);
  // Reverse scroll back to origin
  for (let i = steps; i >= 0; i -= 2) {
    await setScroll(i / steps);
    await setTimeout(100);
  }
  // Settle at S=0 for idle typing
  await setTimeout(3000);
});

// ----------------------------------------------------
// 7. CAPTURE DETAILED SCREENSHOTS AT CRITICAL MOMENTS
// ----------------------------------------------------
console.log('\n--- 7. CAPTURING COMPREHENSIVE SCREENSHOTS ---');

const captureMoments = [
  // Act I
  { p: 0.00, file: 'act1-moment-00-idle-seated.png', desc: 'Act I S=0.00: Seated Typing Idle Loop' },
  { p: 0.05, file: 'act1-moment-05-active-coding.png', desc: 'Act I S=0.05: Active Typing on Keychron' },
  { p: 0.10, file: 'act1-moment-10-hands-resting.png', desc: 'Act I S=0.10: Hands Resting on Desk Mat' },
  { p: 0.15, file: 'act1-moment-15-standing-up.png', desc: 'Act I S=0.15: Standing Up from Ergonomic Chair' },
  { p: 0.18, file: 'act1-moment-18-walking-door.png', desc: 'Act I S=0.18: Walking to Patio Glass Door' },
  // Act II
  { p: 0.20, file: 'act2-moment-20-threshold-step.png', desc: 'Act II S=0.20: Stepping through Sliding Glass Door' },
  { p: 0.25, file: 'act2-moment-25-terrace-start.png', desc: 'Act II S=0.25: Starting Stone Terrace Walk' },
  { p: 0.30, file: 'act2-moment-30-promenade-ocean.png', desc: 'Act II S=0.30: Promenade Overlooking Coastal Cliffs' },
  { p: 0.35, file: 'act2-moment-35-approaching-pavilion.png', desc: 'Act II S=0.35: Approaching Modern Exhibition Pavilion' },
  // Act III
  { p: 0.40, file: 'act3-moment-40-gallery-entrance.png', desc: 'Act III S=0.40: Entering Digital Exhibition Gallery' },
  { p: 0.45, file: 'act3-moment-45-mobile-display.png', desc: 'Act III S=0.45: Interacting with Mobile Exhibition Display' },
  { p: 0.50, file: 'act3-moment-50-analytics-dashboard.png', desc: 'Act III S=0.50: Observing Analytics Dashboard' },
  { p: 0.55, file: 'act3-moment-55-nexform-3d-customizer.png', desc: 'Act III S=0.55: 3D Product Configurator Screen' },
  // Act IV
  { p: 0.60, file: 'act4-moment-60-lab-corridor.png', desc: 'Act IV S=0.60: Entering Innovation Lab' },
  { p: 0.65, file: 'act4-moment-65-approaching-pedestal.png', desc: 'Act IV S=0.65: Approaching Circular Console Table' },
  { p: 0.70, file: 'act4-moment-70-holographic-graph.png', desc: 'Act IV S=0.70: Holographic 3D System Graph Active' },
  { p: 0.75, file: 'act4-moment-75-turning-to-balcony.png', desc: 'Act IV S=0.75: Turning Toward Sunset Balcony' },
  // Act V
  { p: 0.80, file: 'act5-moment-80-stepping-balcony.png', desc: 'Act V S=0.80: Stepping onto Sunset Terrace Balcony' },
  { p: 0.85, file: 'act5-moment-85-walking-railing.png', desc: 'Act V S=0.85: Walking to Glass Railing' },
  { p: 0.90, file: 'act5-moment-90-resting-at-railing.png', desc: 'Act V S=0.90: Resting at Railing Over Golden Sea' },
  { p: 0.95, file: 'act5-moment-95-sunset-horizon-contact.png', desc: 'Act V S=0.95: Contemplating Golden Sunset Horizon' },
  { p: 1.00, file: 'act5-moment-100-contact-terminal.png', desc: 'Act V S=1.00: Final Contact Terminal & Form' },
];

for (const moment of captureMoments) {
  await setScroll(moment.p);
  await setTimeout(200);
  await captureScreenshot(moment.file, 1920, 1080);
}

// Capture individual project tabs in Act III
await setScroll(0.48);
const projectNames = ['nexform', 'mediconnect', 'smartclass', 'linguamate'];
for (let i = 0; i < 4; i++) {
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const tabs = Array.from(document.querySelectorAll('button[role="tab"]'));
        if (tabs[${i}]) tabs[${i}].click();
      })()
    `,
  });
  await setTimeout(300);
  await captureScreenshot(`act3-project-tab-${i + 1}-${projectNames[i]}.png`, 1920, 1080);
}

// ----------------------------------------------------
// 8. ACCURATE PERFORMANCE MEASUREMENTS
// ----------------------------------------------------
console.log('\n--- 8. GATHERING COMPREHENSIVE PERFORMANCE TELEMETRY ---');

const perfScript = `
  (async () => {
    // 1. Measure Browser RAF Framerate over 120 frames
    const rafDeltas = [];
    let lastTime = performance.now();
    await new Promise((resolve) => {
      let count = 0;
      function onFrame(now) {
        rafDeltas.push(now - lastTime);
        lastTime = now;
        count++;
        if (count < 120) {
          requestAnimationFrame(onFrame);
        } else {
          resolve();
        }
      }
      requestAnimationFrame(onFrame);
    });

    const avgDelta = rafDeltas.reduce((a, b) => a + b, 0) / rafDeltas.length;
    const browserFps = (1000 / avgDelta).toFixed(2);
    const minFps = (1000 / Math.max(...rafDeltas)).toFixed(2);
    const maxFps = (1000 / Math.min(...rafDeltas.slice(1))).toFixed(2);

    // 2. Video Playback Quality (Dropped Frames)
    const videos = Array.from(document.querySelectorAll('video'));
    const qualityMetrics = videos.map((v, i) => {
      if (typeof v.getVideoPlaybackQuality === 'function') {
        const q = v.getVideoPlaybackQuality();
        return {
          index: i,
          src: v.src.split('/').pop(),
          totalFrames: q.totalVideoFrames,
          droppedFrames: q.droppedVideoFrames,
          corruptedFrames: q.corruptedVideoFrames,
          droppedRatio: q.totalVideoFrames > 0 ? (q.droppedVideoFrames / q.totalVideoFrames).toFixed(4) : '0.0000',
        };
      }
      return { index: i, src: v.src.split('/').pop(), unsupported: true };
    });

    return {
      browserFps,
      minFps,
      maxFps,
      avgFrameDeltaMs: avgDelta.toFixed(2),
      qualityMetrics
    };
  })()
`;

const perfResult = await send('Runtime.evaluate', {
  expression: perfScript,
  returnByValue: true,
  awaitPromise: true,
});

console.log('Performance Telemetry Results:');
console.log(JSON.stringify(perfResult.result.value, null, 2));

fs.writeFileSync(
  path.resolve('docs/visual-review/performance-telemetry.json'),
  JSON.stringify(perfResult.result.value, null, 2)
);

edge.kill();
console.log('====================================================');
console.log('ALL RECORDINGS, CAPTURES & BENCHMARKS COMPLETED!');
console.log('====================================================');
process.exit(0);
