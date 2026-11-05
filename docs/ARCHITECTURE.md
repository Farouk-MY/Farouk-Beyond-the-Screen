# ARCHITECTURE SPECIFICATION
## FAROUK — BEYOND THE SCREEN
> **Document Version:** `2.0.0` | **Target Release:** `v1.0.0-rc1`  
> **Status:** Production Release Candidate

---

### 1. System Architecture Diagram

```
+-----------------------------------------------------------------------------------------+
|                                  Next.js 16 App Router                                  |
|                                                                                         |
|   +-----------------------+     +-----------------------------+     +---------------+   |
|   |       proxy.ts        |     |   app/[lang]/layout.tsx     |     |  app/page.tsx |   |
|   |  (/ -> /en redirect)  |     |   (Font Loading, Metadata)  |     |  (Redirect)   |   |
|   +-----------------------+     +--------------+--------------+     +---------------+   |
|                                                |                                        |
+------------------------------------------------|----------------------------------------+
                                                 v
+-----------------------------------------------------------------------------------------+
|                                    Client Root Shell                                    |
|                                                                                         |
|   +--------------------+     +---------------------+     +--------------------------+   |
|   |   LocaleProvider   |     |    AudioProvider    |     |   SmoothScrollProvider   |   |
|   | (i18n & RTL State) |     | (Web Audio Engine)  |     |   (Lenis + GSAP Sync)    |   |
|   +---------+----------+     +----------+----------+     +------------+-------------+   |
|             |                           |                             |                 |
+-------------|---------------------------|-----------------------------|-----------------+
              v                           v                             v
+-----------------------------------------------------------------------------------------+
|                               Cinematic Page Experience                                 |
|                                                                                         |
|   +---------------------------------------+   +-------------------------------------+   |
|   |      CinematicVideoLayer (Canvas)     |   |       CinematicOverlay (DOM)        |   |
|   |  - 5-Act Frame-Accurate Scrubbing     |   |  - Decoupled Floating Header        |   |
|   |  - requestVideoFrameCallback          |   |  - 5 Synchronized Act Overlays      |   |
|   |  - Idle Typing Loop in Act I          |   |  - Architectural Case Study Modals  |   |
|   |  - Video Seek Coalescing Queue        |   |  - Language Switcher & Audio Toggle |   |
|   +-------------------+-------------------+   +------------------+------------------+   |
|                       |                                          |                      |
|                       +--------------------+---------------------+                      |
|                                            |                                            |
|                                            v                                            |
|                       +------------------------------------------+                      |
|                       |  Authoritative Timeline Definition       |                      |
|                       |  (config/cinematicTimeline.ts)           |                      |
|                       |  - 600svh Runway Scroll Progress         |                      |
|                       |  - Dynamic N-Project Distribution        |                      |
|                       +------------------------------------------+                      |
+-----------------------------------------------------------------------------------------+
```

---

### 2. Next.js 16 & React 19 Core Conventions

#### 2.1 Proxy Convention
Next.js 16 deprecates `middleware.ts` in favor of `proxy.ts`. Root URL routing is handled via `export function proxy(request)` in `proxy.ts`, returning clean `NextResponse.redirect(new URL('/en', request.url))`.

#### 2.2 Localized App Router Architecture
- `app/[lang]/page.tsx` serves both locales statically via `generateStaticParams()` returning `[{ lang: 'en' }, { lang: 'ar' }]`.
- Static page generation produces `11/11` fully prerendered static pages at build time.
- Localized SEO metadata (titles, descriptions, OpenGraph tags, alternate language links) is generated dynamically via `generateMetadata({ params })`.

#### 2.3 Strict Client-Side Boundary
All interactive layers requiring browser APIs (`window`, `HTMLVideoElement`, `AudioContext`, `ScrollTrigger`) are encapsulated in `'use client'` components.

---

### 3. Video Scrubbing & Playback Synchronization

#### 3.1 Seek Coalescing Queue
Video frame scrubbing across high-resolution H.264 video clips cannot sustain 60 seek requests per second without frame dropping. `CinematicVideoLayer.tsx` implements a seek coalescing pattern:
1. When scroll position updates, target time is set to `pendingSeekRef.current`.
2. If the video is currently seeking (`seekingRef.current === true`), the new request overwrites the pending time.
3. Once the `seeked` event or `requestVideoFrameCallback` fires, the latest pending time is processed.
4. This ensures instantaneous responsiveness without buffering lag.

#### 3.2 Idle Typing Loop in Act I
When scroll progress is at rest (`progress <= 0.001`), the canvas plays an idle typing loop (`loop-active-typing.mp4` / `act-01-scrub.mp4` idle segment). As soon as the visitor scrolls, playback smoothly transitions to frame-accurate scrub mode.

#### 3.3 Dynamic Exhibition Scaling
In Act III, the scroll range is partitioned dynamically based on project count $N$:
$$\text{Project Progress Interval} = \frac{\text{Act III Range}}{N}$$
Visitors can seamlessly scrub through an arbitrary number of projects without video glitches.

---

### 4. Bilingual RTL Architecture

- **Context Integration:** `LocaleContext` manages `locale` (`'en' | 'ar'`), `isRtl` (`boolean`), and the current translation dictionary (`t`).
- **DOM Attribute Sync:** Automatically sets `<html lang="..." dir="...">` and toggles `.rtl-layout`.
- **CSS Logical Properties:** Layouts rely on `start` and `end` conventions (e.g., `text-start`, `ms-auto`, `pe-4`) to mirror naturally in Arabic.
- **Directional Element Flipping:** Decorative elements with forward directionality (arrows, timeline connectors) use `.rtl-flip` (`transform: scaleX(-1)` in RTL).
- **Typography:** Local Google variable font `Noto Sans Arabic` is applied to all Arabic text nodes.

---

### 5. Procedural Web Audio Engine

`lib/audio/SoundEngine.ts` implements a zero-asset audio engine using the native Web Audio API:
- **Mechanical Clicks:** Dual-stage walnut tactile clicks synthesized using damped square/triangle waves and bandpass-filtered noise bursts.
- **Harmonic Chimes:** Soft pentatonic chords synthesized with sine oscillators and exponential gain decays.
- **Atmospheric Whoosh:** Pink noise sweep modulated with a resonant lowpass filter envelope.
- **Rate-Limiting:** All procedural triggers are throttled to prevent overlapping audio clutter during rapid scrolling.
- **Persistence:** Enabled state and volume persist in `localStorage` under `farouk_sound_enabled_v1`.
- **Default State:** Strictly **OFF** by default; requires explicit user toggle.

---

### 6. Accessibility & Reduced Motion

When `prefers-reduced-motion: reduce` is detected:
1. Video canvas scrubbing and auto-play loops are suspended.
2. The interactive 3D runway is replaced with `StaticAccessiblePortfolio.tsx`.
3. Audio engine is silenced.
4. Content is rendered in semantic HTML with clear focus outlines, keyboard navigation, and full screen-reader support.
