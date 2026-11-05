import { spawn } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';
import fs from 'node:fs';
import path from 'node:path';

const cvDir = path.resolve('public/cv');
if (!fs.existsSync(cvDir)) fs.mkdirSync(cvDir, { recursive: true });

const edgePort = 9899;
const userDataDir = 'C:\\Users\\MSI\\AppData\\Local\\Temp\\edge-cv-' + Date.now();

const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
  '--headless=new',
  `--remote-debugging-port=${edgePort}`,
  `--user-data-dir=${userDataDir}`,
  '--no-first-run',
  '--no-default-browser-check',
  'about:blank',
]);

for (let i = 0; i < 30; i++) {
  await setTimeout(200);
  try {
    const res = await fetch(`http://127.0.0.1:${edgePort}/json/version`);
    if (res.ok) break;
  } catch {}
}

const newTabRes = await fetch(`http://127.0.0.1:${edgePort}/json/new`, { method: 'PUT' });
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

const enHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
  @page { size: A4; margin: 20mm; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1C1917; line-height: 1.5; font-size: 13px; }
  .header { border-bottom: 2px solid #BA5227; padding-bottom: 12px; margin-bottom: 16px; }
  h1 { font-size: 26px; font-weight: 800; margin: 0 0 4px 0; color: #1C1917; letter-spacing: -0.5px; }
  .title { font-size: 14px; font-weight: 700; color: #BA5227; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
  .contact-bar { display: flex; flex-wrap: wrap; gap: 14px; font-size: 11px; color: #57534E; font-family: monospace; }
  .section { margin-bottom: 18px; }
  h2 { font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #1C1917; border-bottom: 1px solid #E7E5E4; padding-bottom: 4px; margin: 0 0 10px 0; }
  .availability-badge { display: inline-block; background: #FDF4F0; border: 1px solid #F5C7B5; color: #9C411B; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; margin-bottom: 12px; }
  .item { margin-bottom: 12px; }
  .item-header { display: flex; justify-content: space-between; font-weight: 700; font-size: 13px; color: #1C1917; }
  .item-sub { font-size: 11px; color: #BA5227; font-weight: 600; margin-bottom: 4px; }
  .item-desc { font-size: 12px; color: #44403C; }
  .tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 5px; }
  .tag { background: #F5F5F4; border: 1px solid #E7E5E4; padding: 2px 8px; border-radius: 3px; font-size: 10px; font-family: monospace; color: #292524; }
  .footer-note { font-size: 10px; color: #78716C; text-align: center; border-top: 1px solid #E7E5E4; padding-top: 10px; margin-top: 25px; }
</style>
</head>
<body>
  <div class="header">
    <h1>Farouk Messai</h1>
    <div class="title">Software Developer | Mobile &amp; Web Development</div>
    <div class="availability-badge">Open to PFE Internships &amp; Junior Software Development Opportunities</div>
    <div class="contact-bar">
      <span>Location: Tunisia (Available for Remote Worldwide)</span>
      <span>Email: faroukmessai221@gmail.com</span>
      <span>GitHub: github.com/Farouk-MY</span>
      <span>LinkedIn: linkedin.com/in/faroukmessai</span>
    </div>
  </div>

  <div class="section">
    <h2>Professional Profile</h2>
    <div class="item-desc">
      Software developer focused on building robust web ecosystems and cross-platform mobile applications.
      Committed to clean code, component-driven architecture, reactive state management, and thoughtful user experiences.
      Passionate about modern TypeScript engineering, Flutter mobile development, and real-time backend integrations.
    </div>
  </div>

  <div class="section">
    <h2>Core Engineering Competencies</h2>
    <div class="tags">
      <span class="tag">Flutter</span>
      <span class="tag">Dart</span>
      <span class="tag">React Native (Expo)</span>
      <span class="tag">Next.js (App Router)</span>
      <span class="tag">React 19</span>
      <span class="tag">TypeScript</span>
      <span class="tag">FastAPI (Python)</span>
      <span class="tag">Node.js / Express</span>
      <span class="tag">PostgreSQL / pgvector</span>
      <span class="tag">Supabase</span>
      <span class="tag">Three.js / WebGL</span>
      <span class="tag">Riverpod / Zustand</span>
      <span class="tag">WebRTC</span>
      <span class="tag">Git / CI/CD</span>
    </div>
  </div>

  <div class="section">
    <h2>Featured Software Projects</h2>

    <div class="item">
      <div class="item-header">
        <span>MediConnect</span>
        <span style="font-weight:400; font-size:11px; color:#78716C;">Mobile &amp; Cloud Architecture</span>
      </div>
      <div class="item-sub">Cross-Platform Telemedicine &amp; Clinical Coordination System</div>
      <div class="item-desc">
        Comprehensive healthcare coordination application facilitating practitioner scheduling, encrypted patient QR identification, and direct peer-to-peer WebRTC video consultations with FastAPI and Supabase PostgreSQL.
      </div>
      <div class="tags">
        <span class="tag">React Native</span>
        <span class="tag">Expo</span>
        <span class="tag">FastAPI</span>
        <span class="tag">WebRTC</span>
        <span class="tag">Supabase</span>
      </div>
    </div>

    <div class="item">
      <div class="item-header">
        <span>Smart Class</span>
        <span style="font-weight:400; font-size:11px; color:#78716C;">Cross-Platform &amp; AI Cloud</span>
      </div>
      <div class="item-sub">Intelligent Collaborative Virtual Learning &amp; Real-time Lecture Ecosystem</div>
      <div class="item-desc">
        Virtual classroom ecosystem combining multi-surface Flutter client applications with local AI course generation, intelligent lecture video navigation, and vector search with PostgreSQL pgvector.
      </div>
      <div class="tags">
        <span class="tag">Flutter</span>
        <span class="tag">Riverpod</span>
        <span class="tag">Node.js</span>
        <span class="tag">pgvector</span>
        <span class="tag">PostgreSQL 17</span>
      </div>
    </div>

    <div class="item">
      <div class="item-header">
        <span>NEXFORM</span>
        <span style="font-weight:400; font-size:11px; color:#78716C;">3D Web Platform</span>
      </div>
      <div class="item-sub">Interactive 3D Setup Studio &amp; Product Customization Platform</div>
      <div class="item-desc">
        In-browser 3D furniture customization application with PBR materials, Draco mesh decompression, parametric room sizing, and responsive Next.js App Router integration.
      </div>
      <div class="tags">
        <span class="tag">Next.js</span>
        <span class="tag">Three.js</span>
        <span class="tag">React Three Fiber</span>
        <span class="tag">TypeScript</span>
        <span class="tag">Zustand</span>
      </div>
    </div>

    <div class="item">
      <div class="item-header">
        <span>LinguaMate</span>
        <span style="font-weight:400; font-size:11px; color:#78716C;">Cross-Platform Mobile</span>
      </div>
      <div class="item-sub">Multilingual AI Companion &amp; Interactive Language Learning App</div>
      <div class="item-desc">
        Mobile companion app combining real-time speech dialogue, interactive pronunciation scoring, offline SQLite caching, and spaced-repetition vocabulary retention algorithms.
      </div>
      <div class="tags">
        <span class="tag">Flutter</span>
        <span class="tag">Dart</span>
        <span class="tag">Speech Recognition</span>
        <span class="tag">Supabase</span>
        <span class="tag">Clean Architecture</span>
      </div>
    </div>
  </div>

  <div class="footer-note">
    Farouk Messai — Digital Portfolio: https://farouk-beyond-the-screen.vercel.app/en
  </div>
</body>
</html>`;

const arHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<style>
  @page { size: A4; margin: 20mm; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #1C1917; line-height: 1.6; font-size: 13px; text-align: right; }
  .header { border-bottom: 2px solid #BA5227; padding-bottom: 12px; margin-bottom: 16px; }
  h1 { font-size: 26px; font-weight: 800; margin: 0 0 4px 0; color: #1C1917; }
  .title { font-size: 14px; font-weight: 700; color: #BA5227; margin-bottom: 8px; }
  .contact-bar { display: flex; flex-wrap: wrap; gap: 14px; font-size: 11px; color: #57534E; }
  .section { margin-bottom: 18px; }
  h2 { font-size: 14px; font-weight: 800; color: #1C1917; border-bottom: 1px solid #E7E5E4; padding-bottom: 4px; margin: 0 0 10px 0; }
  .availability-badge { display: inline-block; background: #FDF4F0; border: 1px solid #F5C7B5; color: #9C411B; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; margin-bottom: 12px; }
  .item { margin-bottom: 12px; }
  .item-header { display: flex; justify-content: space-between; font-weight: 700; font-size: 13px; color: #1C1917; }
  .item-sub { font-size: 11px; color: #BA5227; font-weight: 600; margin-bottom: 4px; }
  .item-desc { font-size: 12px; color: #44403C; }
  .tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 5px; }
  .tag { background: #F5F5F4; border: 1px solid #E7E5E4; padding: 2px 8px; border-radius: 3px; font-size: 10px; font-family: monospace; color: #292524; }
  .footer-note { font-size: 10px; color: #78716C; text-align: center; border-top: 1px solid #E7E5E4; padding-top: 10px; margin-top: 25px; }
</style>
</head>
<body>
  <div class="header">
    <h1>فاروق مسعي</h1>
    <div class="title">مطوّر برمجيات | تطوير تطبيقات الويب والجوال</div>
    <div class="availability-badge">متاح لمشاريع التخرج وفرص تطوير البرمجيات المبتدئة</div>
    <div class="contact-bar">
      <span>الموقع: تونس (متاح للعمل عن بعد عالمياً)</span>
      <span>البريد: faroukmessai221@gmail.com</span>
      <span>GitHub: github.com/Farouk-MY</span>
      <span>LinkedIn: linkedin.com/in/faroukmessai</span>
    </div>
  </div>

  <div class="section">
    <h2>الملف المهني</h2>
    <div class="item-desc">
      مطوّر برمجيات متمرس في بناء وتطوير الأنظمة السحابية وتطبيقات الجوال متعددة المنصات. ملتزم بمبادئ الكود النظيف، وهندسة البرمجيات القائمة على المكونات المعيارية، وتصميم تجارب استخدام متقنة تركز على سرعة الاستجابة والموثوقية العالية.
    </div>
  </div>

  <div class="section">
    <h2>المهارات التقنية والمعمارية الأساسية</h2>
    <div class="tags">
      <span class="tag">Flutter</span>
      <span class="tag">Dart</span>
      <span class="tag">React Native (Expo)</span>
      <span class="tag">Next.js (App Router)</span>
      <span class="tag">React 19</span>
      <span class="tag">TypeScript</span>
      <span class="tag">FastAPI (Python)</span>
      <span class="tag">Node.js / Express</span>
      <span class="tag">PostgreSQL / pgvector</span>
      <span class="tag">Supabase</span>
      <span class="tag">Three.js / WebGL</span>
      <span class="tag">Riverpod / Zustand</span>
      <span class="tag">WebRTC</span>
      <span class="tag">Git / CI/CD</span>
    </div>
  </div>

  <div class="section">
    <h2>المشاريع البرمجية المميزة</h2>

    <div class="item">
      <div class="item-header">
        <span>ميدي كونيكت (MediConnect)</span>
        <span style="font-weight:400; font-size:11px; color:#78716C;">نظام سحابي وتطبيق جوال</span>
      </div>
      <div class="item-sub">منظومة تطبيب عن بُعد وتنسيق عيادي متعددة المنصات</div>
      <div class="item-desc">
        تطبيق شامل للرعاية الصحية يتيح حجز المواعيد مع الأطباء، واستشارات فيديو مشفرة بتقنية WebRTC، وتوليد رمز QR المريض، مع خادم FastAPI بايثون وقاعدة بيانات Supabase PostgreSQL.
      </div>
      <div class="tags">
        <span class="tag">React Native</span>
        <span class="tag">Expo</span>
        <span class="tag">FastAPI</span>
        <span class="tag">WebRTC</span>
        <span class="tag">Supabase</span>
      </div>
    </div>

    <div class="item">
      <div class="item-header">
        <span>سمارت كلاس (Smart Class)</span>
        <span style="font-weight:400; font-size:11px; color:#78716C;">منصة سحابية متعددة المنصات</span>
      </div>
      <div class="item-sub">بيئة تعليم افتراضي متطورة ومحاضرات تفاعلية ذكية</div>
      <div class="item-desc">
        بيئة تعليم افتراضي تجمع واجهات Flutter متجاوبة وأدوات ذكاء اصطناعي لإعداد المقررات، مع تصفح ذكي لمحتوى الفيديو والبحث الدلالي عبر قواعد بيانات المتجهات pgvector.
      </div>
      <div class="tags">
        <span class="tag">Flutter</span>
        <span class="tag">Riverpod</span>
        <span class="tag">Node.js</span>
        <span class="tag">pgvector</span>
        <span class="tag">PostgreSQL 17</span>
      </div>
    </div>

    <div class="item">
      <div class="item-header">
        <span>نيكس فورم (NEXFORM)</span>
        <span style="font-weight:400; font-size:11px; color:#78716C;">منصة ويب ثلاثية الأبعاد</span>
      </div>
      <div class="item-sub">محرر ومخصّص أثاث ثلاثي الأبعاد عالي الدقة وتجربة ويب تفاعلية</div>
      <div class="item-desc">
        تطبيق ويب تفاعلي لتخصيص الأثاث والتصاميم ثلاثية الأبعاد في المتصفح مع محاكاة خامات PBR وضغط Draco وفحص توافق مكونات الحواسيب الشخصية.
      </div>
      <div class="tags">
        <span class="tag">Next.js</span>
        <span class="tag">Three.js</span>
        <span class="tag">React Three Fiber</span>
        <span class="tag">TypeScript</span>
        <span class="tag">Zustand</span>
      </div>
    </div>

    <div class="item">
      <div class="item-header">
        <span>لينغوا ميت (LinguaMate)</span>
        <span style="font-weight:400; font-size:11px; color:#78716C;">تطبيق جوال ونظم ذكاء اصطناعي</span>
      </div>
      <div class="item-sub">رفيق محادثة لغوي بالذكاء الاصطناعي ومحرك تفاعلي لاكتساب اللغات</div>
      <div class="item-desc">
        تطبيق جوال يجمع بين المحادثة الصوتية الفورية، والتقييم التفاعلي لدقة النطق، والتخزين المؤقت المحلي عبر SQLite، وخوارزميات التكرار المتباعد.
      </div>
      <div class="tags">
        <span class="tag">Flutter</span>
        <span class="tag">Dart</span>
        <span class="tag">Speech Recognition</span>
        <span class="tag">Supabase</span>
        <span class="tag">Clean Architecture</span>
      </div>
    </div>
  </div>

  <div class="footer-note">
    فاروق مسعي — ملف الأعمال الرقمي: https://farouk-beyond-the-screen.vercel.app/ar
  </div>
</body>
</html>`;

async function printHtmlToPdf(html, outputPath) {
  await send('Page.setDocumentContent', {
    frameId: (await send('Page.getFrameTree')).frameTree.frame.id,
    html,
  });
  await setTimeout(500);

  const pdfRes = await send('Page.printToPDF', {
    printBackground: true,
    paperWidth: 8.27, // A4
    paperHeight: 11.69,
    marginTop: 0.6,
    marginBottom: 0.6,
    marginLeft: 0.6,
    marginRight: 0.6,
  });

  const pdfBuf = Buffer.from(pdfRes.data, 'base64');
  fs.writeFileSync(outputPath, pdfBuf);
  console.log(`Generated PDF: ${outputPath} (${(pdfBuf.length / 1024).toFixed(1)} KB)`);
}

console.log('Generating English CV PDF...');
await printHtmlToPdf(enHtml, path.join(cvDir, 'farouk-messai-cv-en.pdf'));

console.log('Generating Arabic CV PDF...');
await printHtmlToPdf(arHtml, path.join(cvDir, 'farouk-messai-cv-ar.pdf'));

await send('Browser.close');
edge.kill();
console.log('CV generation completed successfully!');
process.exit(0);

