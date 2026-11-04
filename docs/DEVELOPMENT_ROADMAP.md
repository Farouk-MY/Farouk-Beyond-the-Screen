# DEVELOPMENT ROADMAP & MILESTONES
## FAROUK — BEYOND THE SCREEN

---

### 1. Phased Delivery Strategy

The development process follows strict incremental milestones. Each phase must be verified against performance benchmarks and quality gates before advancing.

```
+---------------------------------------------------------------------------------+
| PHASE 0: Audit & Architecture (CURRENT)                                         |
| -> Dependency evaluation, risk analysis, specs, rules, roadmap                  |
+---------------------------------------------------------------------------------+
                                        |
                                        v
+---------------------------------------------------------------------------------+
| PHASE 1: Core Shell & 3D Engine Sandbox                                         |
| -> Install 3D stack, Lenis + GSAP sync, Next.js client canvas boundary          |
+---------------------------------------------------------------------------------+
                                        |
                                        v
+---------------------------------------------------------------------------------+
| PHASE 2: Camera Spline & Multi-Scene Scrub Prototype                            |
| -> Procedural primitive proxies, 0.0-1.0 master scrub timeline, spline camera   |
+---------------------------------------------------------------------------------+
                                        |
                                        v
+---------------------------------------------------------------------------------+
| PHASE 3: Scene 1 (The Origin) & Workstation Realism                             |
| -> Bedroom geometry, warm amber/cyan lighting, capsule proxy, DOM title card    |
+---------------------------------------------------------------------------------+
                                        |
                                        v
+---------------------------------------------------------------------------------+
| PHASE 4: Scene 2 (The Journey) & Scene 3 (The World)                            |
| -> Wall fragment dissolve, portal crossing, floating tech archipelago           |
+---------------------------------------------------------------------------------+
                                        |
                                        v
+---------------------------------------------------------------------------------+
| PHASE 5: Scene 4 (The Creations) Interactive Gallery                            |
| -> Project monoliths, depth-of-field focus, case study drawers, project store   |
+---------------------------------------------------------------------------------+
                                        |
                                        v
+---------------------------------------------------------------------------------+
| PHASE 6: Scene 5 (Beyond) & Contact Interface                                   |
| -> Summit overlook, horizon dawn, interactive terminal, contact form           |
+---------------------------------------------------------------------------------+
                                        |
                                        v
+---------------------------------------------------------------------------------+
| PHASE 7: Performance Profiling, Mobile Tiering, A11y & Polish                   |
| -> Measured compression, reduced-motion fallback, Lighthouse 90+, QA sign-off  |
+---------------------------------------------------------------------------------+
```

---

### 2. Detailed Phase Breakdown

#### Phase 0: Project Initialization & Technical Audit (Completed)
* **Goal**: Establish technical feasibility, document architecture, and prevent breaking conflicts.
* **Deliverables**:
  * Technical audit of Next.js 16, React 19, Tailwind v4, and proposed 3D dependencies.
  * Comprehensive project documentation (`docs/`).
  * Workspace rules defined in `AGENTS.md`.
  * Phased roadmap and risk mitigation strategy.
* **Exit Gate**: Formally approved by stakeholder.

---

#### Phase 1: Core Shell, Lenis + GSAP Scroll Engine & R3F Canvas Sandbox (Completed)
* **Goal**: Safely install compatible 3D libraries and build the foundational canvas shell with smooth scrolling.
* **Key Tasks**:
  * Installed `three` (0.187.0), `@types/three` (0.187.0), `@react-three/fiber` (9.8.2), `@react-three/drei` (10.7.9), `gsap` (3.15.0), `@gsap/react` (2.1.2), `lenis` (1.3.27) with exact version pinning.
  * Created root-level folder architecture: `components/canvas/`, `components/providers/`, `components/dom/`, `components/sandbox/`, `hooks/`, `types/`, `stores/`, `public/assets/`.
  * Implemented dynamic client boundary `<SceneViewport />` with `ssr: false` and `<CanvasLoader />` fallback.
  * Implemented `SmoothScrollProvider.tsx` with unified GSAP ticker synchronization and scoped teardown.
  * Built `/sandbox` engineering validation route with procedural icosahedron, lighting accents (`#00F2FE`, `#FF9F43`), and bidirectional ScrollTrigger scrub.
  * Verified in headless Chromium/Edge via CDP: zero console errors, zero WebGL errors, clean unmount on route transition.
  * Ran and passed `npm run lint`, `npx tsc --noEmit`, and `npm run build`.
* **Exit Gate**: Verified on `/sandbox` with zero console errors and 100% build pass. Ready for Phase 2 approval.

---

#### Phase 2: Camera Spline Engine & Storyboard Scrub Prototype (Completed)
* **Goal**: Validate the full 5-act scroll choreography using procedural primitive proxies.
* **Key Tasks & Deliverables Completed**:
  * Implemented dual 16-point `THREE.CatmullRomCurve3` centripetal splines for camera eye position and look-at focal target along $Z = 0 \to -114$.
  * Created `mapScrollToSplineU()` progress calibration function to align narrative viewing time with spatial act spans.
  * Built all 5 procedural 3D environments:
    - Act I: Bedroom workstation (desk, dual monitors, desk lamp, chair, bookshelves, window).
    - Act II: Dimensional threshold (cyan portal ring, floating fragments, corridor wireframes).
    - Act III: Technological archipelago (3 domain islands for Web, Mobile, Cloud; glowing conduits; constellation particle field).
    - Act IV: Exhibition hall (reflective ground, 3 tiered project pedestals with rotating geometric wireframes, museum light pylons).
    - Act V: Beyond (summit promontory cliff, hovering terminal monolith, digital dawn horizon arc, ascending particles).
  * Implemented `LightingRig.tsx` with dynamic 5-act color, intensity, and position interpolation.
  * Implemented `CameraPathDebug.tsx` with toggleable cyan/amber spline paths and control point sphere markers.
  * Calibrated master virtual scroll height to $700\text{vh}$ with real-time HUD telemetry, navigation pills, and progress bar.
  * Verified in headless browser via CDP: zero console errors, zero WebGL context errors, flawless bidirectional scrubbing ($0.0 \to 1.0 \to 0.0$), and captured 8 visual verification screenshots.
* **Exit Gate**: Fully verified on `/sandbox` with 100% build pass. Ready for Phase 3 review.

---

#### Phase 2.5: Visual Quality Reset & Asset Sourcing Protocol (Completed)
* **Goal**: Establish a premium real-time 3D cinematic visual standard, replacing blocky primitive proxies with high-fidelity, physically based assets while preserving the validated camera and scroll architecture.
* **Key Tasks & Deliverables Completed**:
  * Conducted comprehensive audit of all primitive objects across Acts I–V.
  * Evaluated external asset libraries (Poly Haven, Sketchfab, Fab, Blendkit) with strict commercial-use license verification (CC0, CC-BY 4.0).
  * Formulated the complete 14-item Act I asset shortlist with geometry, PBR material specs, polycount budgets, and direct source links.
  * Defined the standardized Blender-to-GLB production pipeline (scale calibration, geometry cleanup, Principled BSDF PBR mapping, channel-packed ORM textures, glTF 2.0 export).
  * Outlined the visual modernization roadmap for Acts II through V.
  * Updated `docs/ASSET_INVENTORY.md` with verified candidate models and licensing records.
* **Exit Gate**: Asset shortlist and Blender pipeline approved. Ready to acquire, process, and integrate Act I assets in Phase 3.

---

#### Phase 3: Act I — The Origin (Workstation & Bedroom) (NEXT AUTHORIZATION GATE)
* **Goal**: Implement the primary aesthetic benchmark for the portfolio.
* **Key Tasks**:
  * Construct bedroom layout with modern desk, dual monitors, desk lamp, chair, and rain window.
  * Implement warm amber key light (`#FF9F43`) and electric cyan monitor glow (`#00F2FE`).
  * Introduce seated developer character procedural proxy (stylized capsule/cylinder) with subtle breathing/typing idle motion.
  * Overlay semantic DOM title card (*Farouk Messai*, *Software Developer | Mobile & Web Development*).
  * Add ambient dust particles and window rain normal map.
* **Exit Gate**: Scene 1 delivers high visual impact, crisp typography, and responsive framing across standard screen sizes.

---

#### Phase 4: Act II (The Journey) & Act III (The World)
* **Goal**: Build the seamless transition and the expansive technical skills environment.
* **Key Tasks**:
  * Create wall dissolution animation in GSAP scrubbing between $S = 0.18$ and $0.35$.
  * Construct Scene 3 floating archipelago monoliths representing provisional tech domains (Web, Mobile, Backend).
  * Implement dynamic fog and background lighting transitions from intimate amber to deep space cyan.
  * Overlay skills telemetry panel with interactive category tabs.
  * Implement frustum culling to disable Scene 1 rendering once past Scene 2.
* **Exit Gate**: Seamless, cinematic transition from indoor workstation to vast outer landscape with stable 60 FPS.

---

#### Phase 5: Act IV — The Creations (Interactive Gallery)
* **Goal**: Showcase Farouk's mobile and web engineering projects in an interactive 3D gallery.
* **Key Tasks**:
  * Build exhibition pedestals ascending from the dark floor between $S = 0.60$ and $0.85$.
  * Implement camera docking mechanism: clicking or focusing on a project locks camera inspection mode.
  * Create `ProjectCard.tsx` DOM drawer with live links, verified tech stack badges, and architectural summaries.
  * Integrate Zustand `useProjectStore` for cross-layer state communication.
* **Exit Gate**: User can smoothly browse projects, enter close-up inspection, and open project details without breaking scroll flow.

---

#### Phase 6: Act V — Beyond & Contact Interface
* **Goal**: Deliver the cinematic conclusion and functional contact hub.
* **Key Tasks**:
  * Build summit overlook environment with standing character silhouette facing the dawn horizon.
  * Construct terminal monolith holding interactive contact elements.
  * Build semantic DOM contact form with validation, copy-to-clipboard email pill, and social links.
  * Test email submission flow and feedback toast states.
* **Exit Gate**: Functional, polished contact experience with high visual emotional resonance.

---

#### Phase 7: Optimization, Responsive Tiers, Accessibility & QA
* **Goal**: Harden performance, guarantee accessibility, and ensure production readiness.
* **Key Tasks**:
  * Profile and evaluate Draco vs. Meshopt mesh compression and KTX2 vs. WebP texture encoding.
  * Implement GPU tier detection (`useDeviceTier.ts`) to throttle shadow maps and post-processing on lower-end devices.
  * Implement comprehensive `prefers-reduced-motion` accessible fallback (clean static layout).
  * Profile draw calls, memory allocation, and verify zero memory leaks across scroll cycles on physical hardware.
  * Cross-browser testing (Chrome, Firefox, Safari, Edge, Mobile Safari).
  * Run Lighthouse audit (target $> 90$ Performance, 100 Accessibility, 100 Best Practices, 100 SEO).
* **Exit Gate**: Production-grade stability, fast load times, and sign-off on all criteria.
