# FAROUK — BEYOND THE SCREEN
## Project Overview & Master Vision
> **Document Version:** `2.0.0` | **Target Release:** `v1.0.0-rc1`  
> **Subject:** Farouk Messai — Software Developer | Mobile & Web Development  
> **Status:** Production Release Candidate

---

### 1. Executive Summary

**FAROUK — BEYOND THE SCREEN** is an interactive, scroll-orchestrated digital portfolio engineered for **Farouk Messai — Software Developer | Mobile & Web Development**.

The experience moves beyond standard portfolio lists by immersing the visitor in a continuous five-act Mediterranean architectural narrative. As visitors scroll, an authoritative 600svh runway orchestrates frame-accurate video seeking (`requestVideoFrameCallback`), transitions through sun-drenched architectural spaces, presents an interactive 3D-style curved project exhibition, and reveals detailed architectural case studies.

The application delivers:
- **Full Bilingual Support:** Native English (`/en`) and Modern Standard Arabic (`/ar`) with comprehensive Right-to-Left (RTL) directional adaptations.
- **Procedural Sound Engine:** 100% code-synthesized Web Audio API soundscapes (0 KB download), opt-in by default.
- **Architectural Depth:** Production-ready case studies highlighting real-world architectural patterns, mobile stacks, and engineering decisions.
- **Universal Accessibility:** Seamless static fallback for visitors with `prefers-reduced-motion: reduce`.

---

### 2. Creative Vision & Tone

* **Creative Direction:** Mediterranean Modernist Architecture & Cinematic Storytelling.
* **Palette Essence:**
  - Sunlit limestone (`#FAF8F5`, `#E8E2D8`)
  - Deep walnut wood (`#1C1512`, `#120E0C`)
  - Earthy terracotta accents (`#BA5227`, `#D96A38`)
  - Warm bronze & gold detailing (`#D4AF37`, `#8C7355`)
* **Philosophy:**
  - Honest engineering identity grounded in verified mobile and web projects.
  - Zero cyber neon gimmicks, artificial counters, or distracting effects.
  - Quiet confidence, editorial elegance, and flawless interaction responsiveness.

---

### 3. The 5-Act Cinematic Narrative

| Act | Scene | Visual Setting | Purpose & Interactions |
| :--- | :--- | :--- | :--- |
| **I** | **The Studio** | Sunlit Mediterranean architectural workstation | Introduces Farouk Messai; seamless idle typing loop handoff to scroll scrub; quick links to work and CV download. |
| **II** | **The Journey** | Architectural corridor & stone threshold | Visual metaphor for moving from isolated experiments into production systems; vertical milestone timeline. |
| **III** | **Selected Work** | 3D curved exhibition wall | Dynamic project showcase vitrine; loops smoothly across any number of projects; deep architectural case studies. |
| **IV** | **Engineering** | Architectural systems lab | Core capabilities: Cross-Platform Mobile, Modern Web Ecosystems, Clean Architecture, and Developer Tooling. |
| **V** | **Beyond / Contact** | Sunset coastal terrace | Direct communication console, verified Tunisia location, availability status, direct email dispatch, and CV download. |

---

### 4. Technical Foundations

* **Framework:** Next.js 16.4.4 (App Router, Turbopack, Partial Prerendering, Proxy convention)
* **Runtime:** React 19.3.0 + TypeScript 5.x (Strict)
* **Styling:** Tailwind CSS v4 with logical properties (`ms-`, `me-`, `ps-`, `pe-`) and CSS custom properties
* **Animation & Scroll:** GSAP 3.15 + ScrollTrigger + `@gsap/react` + Lenis 1.3
* **Audio:** Native Web Audio API procedural synthesis (0 KB network overhead)
* **Typography:** Space Grotesk, Manrope, IBM Plex Mono, Noto Sans Arabic (Local Variable Font)

---

### 5. Architectural Pillars

1. **Strict Client-Server Isolation:** Static SEO metadata and prerendered HTML shells run server-side; video canvases, audio contexts, and GSAP timelines run inside scoped client boundaries (`'use client'`).
2. **Deterministic Timeline Synchronization:** Single authoritative timeline definition in `config/cinematicTimeline.ts` orchestrating video frame seek coalescing and overlay opacities.
3. **Bilingual RTL Integrity:** Dedicated `/en` and `/ar` routes with directional HTML attributes, mirrored timeline tracks, and localized typography.
4. **Resilient Memory Management:** Web Audio context cleanup, Lenis ticker removal, and scoped GSAP context reversion (`ctx.revert()`).
5. **Accessibility by Default:** Complete `prefers-reduced-motion` static experience mirroring every project, case study, and contact method.
