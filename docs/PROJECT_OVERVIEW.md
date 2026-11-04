# FAROUK — BEYOND THE SCREEN
## Project Overview & Master Vision

---

### 1. Executive Summary

**FAROUK — BEYOND THE SCREEN** is an interactive 3D portfolio and digital experience engineered for **Farouk Messai — Software Developer | Mobile & Web Development**. 

The website transcends traditional flat portfolio paradigms by presenting Farouk's projects, mobile and web development capabilities, and technical journey through a narrative, scroll-orchestrated 3D journey. Visitors do not merely scroll a webpage; they travel through an atmospheric virtual world reflecting the developer's creative and technical evolution.

All professional skills, achievements, and technical domains mentioned in this documentation are provisional working targets, to be strictly confirmed and evidenced by actual completed projects in the portfolio showcase.

---

### 2. Creative Vision & Tone

* **Creative Direction**: *Cinematic Stylized Realism*
* **Mood & Atmosphere**: Nocturnal, focused, technologically elevated, introspective yet expansive.
* **Palette Essence**: Midnight obsidian (`#07080B`) and deep graphite foundations, illuminated by precise electric cyan accents (`#00F2FE`), ambient amber workstation warmth (`#FF9F43`), and clean architectural typography.
* **Inspiration Philosophy**:
  * Seamless narrative progression (reminiscent of Santamaria / Atlas scroll narratives).
  * Living environment and character interaction (inspired by Bruno Simon and Code of Sagar).
  * **Originality Mandate**: Strictly original art direction, bespoke 3D assets, custom shaders, and tailored choreography. No derivative clones or copyrighted asset repurposing.

---

### 3. The 5-Act Narrative Arc

| Act | Scene | Environment | Theme & Purpose |
| :--- | :--- | :--- | :--- |
| **I** | **The Origin** | Nocturnal bedroom & developer workstation | Introduces Farouk in his focused sanctuary; sets the cinematic baseline, lighting, and intimacy of late-night coding. |
| **II** | **The Journey** | Dimensional threshold & architectural transition | The boundaries of the physical room dissolve; a visual metaphor for expanding from local experiments into published software. |
| **III** | **The World** | Atmospheric technological archipelago | An atmospheric environment presenting provisional technical skill domains (Mobile & Web Development, Architecture, Creative Tech), subject to verification by portfolio evidence. |
| **IV** | **The Creations** | Holographic exhibition & project monoliths | Interactive project showcase where visitors explore real-world mobile and web applications, code highlights, and live demonstrations. |
| **V** | **Beyond** | Horizon vista & terminal portal | A cinematic summit overlooking a digital dawn; presents verified contact channels, resume access, and collaboration links. |

---

### 4. Technical Foundations

* **Framework**: Next.js 16 (App Router) + React 19 + TypeScript (Strict)
* **Styling**: Tailwind CSS v4
* **3D Runtime**: Three.js (r187+) + React Three Fiber (v9) + Drei (v10)
* **Animation & Smooth Scroll**: GSAP 3 + ScrollTrigger + `@gsap/react` + Lenis (1.3+)
* **Asset Pipeline**: glTF 2.0 / GLB evaluated with Draco / Meshopt mesh compression and KTX2 / WebP texture optimization based on empirical profiling.

---

### 5. Architectural Pillars

1. **Strict Separation of Concerns**: Complete isolation between Server Components, 2D DOM Overlays, 3D Scene Managers, and Scroll Orchestration.
2. **Device-Profiled Performance**: Steady 60 FPS engineering goal on tested desktop hardware; adaptive rendering tiering (Tier 1 Desktop, Tier 2 Integrated GPU, Tier 3 Mobile/Reduced-Motion) verified by device profiling rather than assumed.
3. **Accessibility First (A11y)**: Complete graceful degradation for `prefers-reduced-motion` and screen readers. The portfolio content remains 100% accessible even if WebGL is disabled or unsupported.
4. **Resilient Memory Management**: Clear distinction between declaratively auto-disposed R3F elements, manually managed Three.js resources, and protected shared cache instances to prevent WebGL context loss.

---

### 6. Scope Boundaries & Current Milestone

* **Current Status**: **Phase 0 — Project Initialization & Technical Audit**.
* **Forbidden in Phase 0**: Premature package installation, scene construction, or destructive modifications to default Next.js templates.
* **Goal of Phase 0**: Establish rigorous technical documentation, audit React 19 / Next.js 16 compatibility, specify folder structures, identify risks, and obtain architectural approval before implementation.
