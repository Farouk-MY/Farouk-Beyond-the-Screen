import { spawn } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';
import fs from 'node:fs';
import path from 'node:path';

const artifactDir = 'C:\\Users\\MSI\\.gemini\\antigravity\\brain\\3a927fdd-498e-46e9-a94c-a392df1f645e\\screenshots';
const localDir = path.resolve('public/screenshots');
const portfolioFile = path.resolve('config/portfolioData.ts');
const originalContent = fs.readFileSync(portfolioFile, 'utf-8');

if (!fs.existsSync(artifactDir)) fs.mkdirSync(artifactDir, { recursive: true });
if (!fs.existsSync(localDir)) fs.mkdirSync(localDir, { recursive: true });

console.log('--- CAPTURING DYNAMIC 5TH PROJECT IN 3D CAROUSEL ---');

const fifthProjectCode = `  {
    id: 'al-khatt',
    name: 'Al-Khatt Arabic Typography',
    tagline: 'Algorithmic Modern Calligraphy & Parametric Letterform Engine',
    category: 'web',
    categoryLabel: 'Creative Engineering',
    description:
      'A WebGL and OpenType parametric typography engine for dynamic Arabic calligraphy, balancing classical geometric proportions with interactive vector morphing.',
    technologies: ['TypeScript', 'WebGL', 'Three.js', 'Next.js 16', 'GLSL Shaders', 'OpenType.js'],
    keyFeatures: [
      'Parametric baseline and kashida curve evaluation in real-time GLSL shaders',
      'Dynamic ligatures and harmonic glyph spacing derived from traditional calligraphic rules',
      'Interactive 3D letterform extrusion with custom lighting and material refraction',
      'Export capabilities for vector SVG and production-ready font files',
    ],
    architectureOverview:
      'Built with Next.js App Router and WebGL vertex shaders for GPU-accelerated glyph deformation, driven by OpenType contour extraction.',
    status: 'Experimental System',
    links: { github: null, live: null },
    screenDisplay: { type: 'tablet', label: 'Calligraphy Design Surface' },
    coverImage: {
      src: '/projects/nexform-3d/cover.webp',
      alt: 'Al-Khatt Parametric Typography Preview',
      isPlaceholder: true,
    },
    galleryImages: [
      {
        src: '/projects/nexform-3d/cover.webp',
        alt: 'Al-Khatt Calligraphy Engine',
        caption: 'Parametric Arabic calligraphy and vector letterform surface',
        isPlaceholder: true,
      },
    ],
    featured: true,
  },
];`;

try {
  // Replace the closing array bracket with 5th project + bracket
  const updatedContent = originalContent.replace(/\];\s*$/, `${fifthProjectCode}\n`);
  fs.writeFileSync(portfolioFile, updatedContent, 'utf-8');
  console.log('Appended 5th project to config/portfolioData.ts. Waiting 3s for Next.js Fast Refresh...');
  await setTimeout(3000);

  const edgePort = 9891;
  const userDataDir = 'C:\\Users\\MSI\\AppData\\Local\\Temp\\edge-test-5th-' + Date.now();
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

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id).resolve(msg.result);
      pending.delete(msg.id);
    }
  };

  await send('Runtime.enable');
  await send('Page.enable');
  await setTimeout(3500);

  // For 5 projects, Step 4 (last project) is at scroll = 0.674
  await send('Runtime.evaluate', {
    expression: `if (window.__FAROUK_SET_SCROLL_PROGRESS) window.__FAROUK_SET_SCROLL_PROGRESS(0.674);`,
  });
  await setTimeout(1000);

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const buf = Buffer.from(shot.data, 'base64');
  fs.writeFileSync(path.join(artifactDir, 'act3-dynamic-5th-project.png'), buf);
  fs.writeFileSync(path.join(localDir, 'act3-dynamic-5th-project.png'), buf);
  console.log(`Saved screenshot: act3-dynamic-5th-project.png (${(buf.length / 1024).toFixed(1)} KB)`);

  const p5State = await send('Runtime.evaluate', {
    expression: `(() => {
      const title = document.querySelector('#scene-work h3')?.textContent || '';
      const stepIndicator = document.querySelector('#scene-work')?.textContent?.match(/\\d+\\s*\\/\\s*\\d+/)?.[0] || '';
      return { title, stepIndicator };
    })()`,
    returnByValue: true,
  });
  console.log('5th project active state in DOM:', p5State.result.value);

  ws.close();
  edge.kill();
} finally {
  fs.writeFileSync(portfolioFile, originalContent, 'utf-8');
  console.log('Restored config/portfolioData.ts to original content cleanly.');
}

