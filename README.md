# FAROUK — BEYOND THE SCREEN
> **Interactive Cinematic Experience & Digital Portfolio**  
> **Release:** `v1.0.0-rc1` | **Author:** Farouk Messai (Software Developer | Mobile & Web Development)  
> **Location:** Tunisia (Available for Remote Worldwide) | **Availability:** Open to PFE Internships & Junior Software Development Opportunities

---

## 1. Overview & Creative Identity

**FAROUK — BEYOND THE SCREEN** is an interactive, scroll-orchestrated cinematic web experience showcasing Farouk Messai's engineering capabilities across cross-platform mobile development (React Native, Flutter) and modern web platforms (Next.js, TypeScript, Python/FastAPI).

Departing from conventional flat developer resumes, the portfolio guides visitors through a continuous five-act Mediterranean architectural narrative:

```
[ Act I: Studio ] ──> [ Act II: Journey ] ──> [ Act III: Selected Work ] ──> [ Act IV: Engineering ] ──> [ Act V: Contact ]
```

### Visual & Architectural Language
- **Mediterranean Modernist Aesthetic:** Sun-drenched limestone, warm architectural surfaces, deep walnut wood, and tactile bronze detailing.
- **Continuous Cinematic Timeline:** 600svh scroll runway synchronized with frame-accurate video seeking (`requestVideoFrameCallback` + coalesced seek queue) alongside an idle typing loop in Act I.
- **Dynamic 3D Exhibition:** Interactive project vitrine wall in Act III that automatically cycles and scales with any number of showcase projects.
- **Decoupled Floating Navigation:** Standalone brand mark, standalone "Let's Talk" CTA, and a centered floating capsule dock with real-time hairline progress, language toggle, and sound controls.
- **Zero Neon / Anti-Gimmick:** Free of gratuitous cyber HUDs, neon lasers, or artificial metrics. Grounded strictly in authentic engineering craft and production-ready code.

---

## 2. Key Features

### 🌐 Complete Bilingual Support (English & Arabic RTL)
- **Routes:** `/en` (default) and `/ar` via Next.js 16 App Router. Root `/` redirects to `/en` via `proxy.ts`.
- **Full Right-to-Left (RTL) Layout:** Native `dir="rtl"`, mirrored timeline tracks, logical CSS positioning, and icon flips.
- **Professional Modern Standard Arabic:** Clean, idiomatic Arabic translations (الفصحى) across all navigation items, project specs, engineering domains, and interactive case study modals.
- **Local Typography:** Google's variable `Noto Sans Arabic` font packaged locally via `next/font/local` (SIL Open Font License 1.1), seamlessly combined with Space Grotesk, Manrope, and IBM Plex Mono.
- **State Preservation:** Instant language switching via the dock preserves the visitor's current scroll progress and active project.

### 🔊 Procedural Web Audio Sound Engine
- **Zero Asset Bandwidth (0 KB download):** Procedurally synthesized via the native Web Audio API using filtered oscillator networks, walnut mechanical tap simulation, harmonic pentatonic chimes, and soft pink-noise sweeps.
- **Strictly Opt-In:** Sound is **OFF by default** to honor visitor autonomy and mobile bandwidth. Requires explicit user activation via the dock toggle (`🔇 / 🔊`).
- **Tactile Feedback:** Subtle auditory cues on section changes, language toggles, case study opens, and email copy.
- **Accessibility Sync:** Automatically suppressed when `prefers-reduced-motion: reduce` is detected.

### 💼 Comprehensive Architectural Case Studies
Detailed breakdown of four flagship projects:
1. **MediConnect** — Cross-Platform Telemedicine & Clinical Coordination System (React Native, Expo SDK 54, TypeScript, FastAPI, WebRTC, PostgreSQL).
2. **SmartClass** — Educational Resource & Automated Classroom Intelligence Platform (Next.js 15, React 19, TypeScript, PostgreSQL, Prisma, Tailwind CSS).
3. **NexForm** — Enterprise Headless Form Engine & Dynamic Schema Runtime (TypeScript, React 19, Tailwind CSS, Zod, Radix UI).
4. **LinguaMate** — Cross-Platform Conversational Language Acquisition & Speech Recognition Engine (Flutter 3.x, Dart, Riverpod, Supabase, Whisper AI).

Each case study features:
- Core Problem Statement
- Solution & Implementation Strategy
- Developer Role & Responsibilities
- System Architecture Highlights
- Key Technical Decisions & Tradeoffs
- Clear status notices (Verified Production Prototype / Private Commercial Repository) without dead or broken external links.

### 📄 Localized Curriculum Vitae Integration
- Downloadable official CVs directly accessible from Hero, Contact, and Static Fallback overlays:
  - English: `/cv/farouk-messai-cv-en.pdf`
  - Arabic: `/cv/farouk-messai-cv-ar.pdf`

### ♿ Accessible Static Fallback
- Full support for `prefers-reduced-motion: reduce` and devices where video decoding or hardware acceleration is restricted.
- Renders a clean, semantic, multi-section editorial portfolio with complete tab navigation, modal inspection, and contact capabilities.

---

## 3. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 16.4.4](https://nextjs.org/) (App Router, Turbopack, Partial Prerendering) |
| **Runtime** | [React 19.3.0](https://react.dev/) + TypeScript 5.x (Strict Mode) |
| **Animation & Scroll** | [GSAP 3.15](https://gsap.com/) + [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) + [@gsap/react](https://gsap.com/docs/v3/Plugins/useGSAP/) |
| **Smooth Scroll** | [@studio-freight/lenis](https://lenis.darkroom.engineering/) (v1.3.27) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) with CSS variables & logical properties |
| **Typography** | Space Grotesk, Manrope, IBM Plex Mono, Noto Sans Arabic (Local Variable Font) |
| **Audio** | Native Web Audio API (100% Procedural Synthesis) |
| **State Management** | React Context (`LocaleContext`, `AudioContext`) + Zustand 5 |
| **Testing & Tooling** | ESLint 9, Headless Edge / Chrome CDP automation, GitHub Actions CI |

---

## 4. Architecture & File Structure

```
portfolio/
├── .github/
│   └── workflows/
│       └── ci.yml                   # Automated typecheck, lint, and build verification
├── app/
│   ├── [lang]/
│   │   └── page.tsx                 # Dynamic bilingual localized root ([lang] = en | ar)
│   ├── globals.css                  # Tailwind v4 theme, fonts, and RTL utilities
│   ├── layout.tsx                   # Root HTML shell with font definitions & providers
│   └── page.tsx                     # Server redirect to /en
├── components/
│   ├── canvas/
│   │   ├── CinematicCanvas.tsx      # Video layer container with dynamic client import
│   │   └── CinematicVideoLayer.tsx  # Frame-accurate seek queue + idle typing loop
│   ├── cinematic/
│   │   ├── CinematicOverlay.tsx     # Master decoupled navigation dock & scene manager
│   │   └── StaticAccessiblePortfolio.tsx # Reduced-motion accessible static view
│   ├── dom/
│   │   ├── ContactOverlay.tsx       # Direct dispatch console, Tunisia location, CV
│   │   ├── HeroOverlay.tsx          # Act I intro, developer identity, CV download
│   │   ├── JourneyOverlay.tsx       # Act II threshold timeline
│   │   ├── ProjectDetailModal.tsx   # Architectural case study drawer
│   │   ├── ProjectGalleryModal.tsx  # Project screenshot & diagram viewer
│   │   ├── ProjectsOverlay.tsx      # Act III 3D curved exhibition showcase
│   │   └── SkillsOverlay.tsx        # Act IV engineering domains
│   └── providers/
│       └── SmoothScrollProvider.tsx # Lenis ticker sync & scoped teardown
├── config/
│   ├── cinematicTimeline.ts         # Authoritative 600svh runway & dynamic bounds
│   ├── portfolioData.ts             # Developer profile, verified projects, tech stack
│   └── translations/
│       ├── types.ts                 # Typed translation schema
│       ├── en.ts                    # English dictionary
│       └── ar.ts                    # Modern Standard Arabic dictionary
├── context/
│   ├── AudioContext.tsx             # Sound state, volume, preference persistence
│   └── LocaleContext.tsx            # Locale provider, RTL synchronization
├── docs/                            # Comprehensive engineering and design documentation
│   ├── ARCHITECTURE.md
│   ├── ASSET_INVENTORY.md
│   ├── DEVELOPMENT_ROADMAP.md
│   ├── PROJECT_OVERVIEW.md
│   ├── STORYBOARD.md
│   └── USER_ASSET_REQUEST.md
├── lib/
│   └── audio/
│       └── SoundEngine.ts           # Procedural Web Audio API sound generator
├── proxy.ts                         # Next.js 16 proxy routing convention
├── public/
│   ├── cv/                          # Generated official curriculum vitae (EN & AR)
│   ├── posters/                     # High-res video poster fallbacks
│   └── videos/                      # 5 master cinematic scrub clips + idle loop
└── scripts/
    ├── generate-cv-documents.mjs    # Edge CDP print-to-PDF CV builder
    └── test-bilingual-release.mjs   # Headless visual verification suite
```

---

## 5. Local Development & Verification

### Prerequisites
- Node.js 20.x or higher
- npm 10.x or higher

### Installation
```bash
git clone https://github.com/Farouk-MY/Farouk-Beyond-the-Screen.git
cd Farouk-Beyond-the-Screen
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the site (automatically redirects to `/en`).

### Quality Assurance & Validation
Run the full verification suite before committing:
```bash
# 1. Strict TypeScript check
npx tsc --noEmit

# 2. Next.js 16 ESLint validation
npm run lint

# 3. Production Turbopack build
npm run build
```

---

## 6. Deployment

The project is configured for deployment on [Vercel](https://vercel.com):
- Framework Preset: **Next.js**
- Node.js Version: **20.x**
- Build Command: `next build`
- Output Directory: `.next`

All static routes (`/en`, `/ar`, `/robots.txt`, `/sitemap.xml`) are pre-rendered at build time for optimal CDN edge caching and fast First Contentful Paint (FCP).

---

## 7. License & Credits

- **Codebase:** MIT License © 2026 Farouk Messai.
- **Cinematic Footage & Concepts:** Bespoke production assets for Farouk Messai.
- **Typography:**
  - *Noto Sans Arabic* — SIL Open Font License 1.1 (Google Fonts).
  - *Space Grotesk*, *Manrope*, *IBM Plex Mono* — SIL Open Font License.
- **Audio:** 100% Procedural synthesis created for this project (CC0 / Public Domain equivalent).
