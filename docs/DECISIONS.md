# ARCHITECTURE DECISION RECORDS (ADR)
## FAROUK — BEYOND THE SCREEN

---

### ADR-001: Next.js 16 App Router & Turbopack Strategy for WebGL

* **Status**: Accepted
* **Context**: The portfolio uses Next.js 16.4.4 with the App Router and Turbopack enabled by default. Three.js and WebGL libraries depend on DOM and browser window APIs that are nonexistent during server-side rendering (SSR).
* **Decision**: 
  1. The WebGL canvas layer is strictly isolated in client components marked with `'use client'`.
  2. Heavy 3D modules are dynamically imported using Next.js `dynamic(..., { ssr: false })` paired with an elegant loading fallback.
  3. Static assets (`.glb`, `.hdr`, `.ktx2`, `.webp`) will be served from the `/public/assets` directory to eliminate bundler parsing overhead in Turbopack.
* **Consequences**: Fast initial page load (TTFB), zero hydration mismatch errors, clean separation between SEO metadata (server-rendered) and the interactive 3D canvas (client-rendered).

---

### ADR-002: Three.js + React Three Fiber v9 + Drei v10 with React 19

* **Status**: Accepted
* **Context**: The project runs React 19.3.0. Historically, React Three Fiber (R3F) v8 required peer dependency overrides for React 19.
* **Decision**:
  1. Adopt `@react-three/fiber` v9.8.x and `@react-three/drei` v10.7.x, which feature official native support for React 19 (`>=19 <19.4`).
  2. Pair with `three` (0.187.x) and `@types/three` (0.187.x).
  3. Rely on React 19's native action/suspense improvements for seamless asset loading.
* **Consequences**: No `--legacy-peer-deps` or `--force` hacks needed during npm installs; full compatibility with modern React features.

---

### ADR-003: Scroll Orchestration: Scoped GSAP & Synchronized Lenis

* **Status**: Accepted
* **Context**: Native browser scroll varies across operating systems and input hardware. Cinematic 3D storytelling requires smooth, inertia-damped scroll tracking that synchronizes with the render loop, while avoiding animation conflicts and memory leaks.
* **Decision**:
  1. Use `lenis` (1.3.x) for smooth virtual scrolling.
  2. Drive GSAP ScrollTrigger by binding `lenis.on('scroll', ScrollTrigger.update)`.
  3. Hook Lenis's RAF into the GSAP ticker (`gsap.ticker.add(tickerCallback)`) with `lagSmoothing(0)`.
  4. Encapsulate all GSAP animations within `@gsap/react` `useGSAP()` scopes for automatic lifecycle cleanup and context reversion (`ctx.revert()`).
  5. Strictly avoid global destruction routines (e.g. `ScrollTrigger.getAll().forEach(t => t.kill())`).
  6. Upon unmount of the scroll provider, remove the ticker callback (`gsap.ticker.remove(tickerCallback)`), unregister the scroll listener (`lenis.off('scroll', ...)`), and destroy the Lenis instance (`lenis.destroy()`).
* **Consequences**: Fluid 60 FPS scroll scrubbing across all input devices without animation conflicts, memory leaks, or unintended destruction of external components.

---

### ADR-004: Single Shared WebGL Canvas vs. Multi-Canvas

* **Status**: Accepted
* **Context**: Multiple 3D environments could theoretically be mounted into separate `<Canvas>` elements pinned throughout the page.
* **Decision**:
  1. Standardize on a single, persistent full-viewport `<Canvas>` anchored behind the DOM UI.
  2. Manage environments as hierarchical sub-trees inside the single canvas, conditionally rendering or frustum-culling scenes as the camera moves along the master spline.
* **Consequences**: Avoids WebGL context exhaustion (browsers limit active contexts to 8-16), saves substantial GPU memory, and allows continuous camera movement between scenes without tearing.

---

### ADR-005: Decoupled 2D DOM UI vs. 3D In-Canvas Text

* **Status**: Accepted
* **Context**: Displaying text inside WebGL (e.g. Troika 3D text or TextGeometry) often produces blurry rendering on high-DPI displays, impairs screen reader accessibility, breaks copy/paste selection, and complicates internationalization.
* **Decision**:
  1. All project descriptions, titles, navigation links, and forms will be rendered as semantic HTML elements in the DOM layer.
  2. The 3D canvas is purely visual/environmental.
  3. 3D objects and DOM elements communicate through a lightweight Zustand store (`useAppStore`, `useProjectStore`).
* **Consequences**: Superior accessibility (A11y), crisp native typography, perfect SEO indexability, and clean separation of concerns.

---

### ADR-006: 3D Asset Compression Evaluation Framework (Draco / Meshopt / KTX2 / WebP)

* **Status**: Accepted
* **Context**: Uncompressed 3D models and raw PNG/JPG textures can quickly inflate page size beyond 50-100 MB, causing mobile crashes and severe load stalls. However, blind application of Draco introduces CPU decompression overhead that can stall lower-end devices.
* **Decision**:
  1. Evaluate **Draco** vs. **Meshopt** for GLB models on an asset-by-asset basis, weighing download size against browser CPU decompression latency.
  2. Evaluate **KTX2 / Basis Universal** (direct GPU VRAM upload) vs. optimized **WebP** based on texture dimensions and target device tier.
  3. Enforce a provisional critical initial bundle budget of $\le 4.5\text{ MB}$ dedicated strictly to entry assets (Acts I & II), streaming remaining environments progressively.
* **Consequences**: Balanced download speed, minimal GPU VRAM usage, and zero decompression stutter during initial scene load.

---

### ADR-007: Accessible Degradation & `prefers-reduced-motion`

* **Status**: Accepted
* **Context**: Users with vestibular disorders or motion sensitivity can suffer nausea or disorientation from scroll-driven camera motion.
* **Decision**:
  1. Listen for the `prefers-reduced-motion` media query.
  2. When active, pause the continuous 3D camera travel and bypass ScrollTrigger scrubbing.
  3. Present the portfolio as a refined, static, accessible layout with standard document scrolling and subtle fade transitions.
* **Consequences**: Full WCAG 2.1 compliance, inclusive user experience, and robust reliability across all user hardware.

---

### ADR-008: Three.js Resource Management & Disposal Taxonomy

* **Status**: Accepted
* **Context**: In Three.js and WebGL, memory leaks and context losses frequently occur due to either unmanaged resources or premature disposal of shared assets across components.
* **Decision**:
  1. **Declarative R3F Elements**: Geometries and materials declared in JSX are automatically disposed by R3F on unmount.
  2. **Imperative Resources**: Manually instantiated Three.js objects (e.g. `new THREE.BufferGeometry()`, custom render targets, imperative textures) must be tracked and explicitly disposed on unmount.
  3. **Shared & Cached Assets**: Assets loaded via global caches (e.g. `useGLTF`, `useTexture` from Drei) must never be disposed by individual child components.
* **Consequences**: Eliminates GPU memory leaks, prevents duplicate disposal errors, and ensures stable long-session stability.

---

### ADR-009: Coordinated Scroll RAF: GSAP Ticker Driving Lenis

* **Status**: Accepted (Implemented in Phase 1)
* **Context**: Running independent `requestAnimationFrame` loops for smooth scrolling (`Lenis`) and scroll-driven animation (`GSAP ScrollTrigger`) leads to frame divergence, stuttering scrubs, and redundant ticker allocations.
* **Decision**:
  1. Initialize Lenis with `autoRaf: false`.
  2. Bind GSAP ticker to advance Lenis: `gsap.ticker.add((time) => lenis.raf(time * 1000))`.
  3. Set `gsap.ticker.lagSmoothing(0)` to prevent GSAP from dropping visual frames during heavy inertia scrolling, and restore `gsap.ticker.lagSmoothing(500, 33)` upon provider unmount.
  4. Forward `lenis.on('scroll', ScrollTrigger.update)` to keep ScrollTrigger calculations synchronized.
  5. *Clarification*: This coordinated RAF governs the DOM scroll and animation calculations only. React Three Fiber retains its own native high-performance WebGL render loop via `useFrame`.
* **Consequences**: Deterministic, single-loop synchronization across desktop trackpads and mousewheels with zero scroll lag, while preserving R3F's native rendering pipeline.

---

### ADR-010: Zero-Rerender State Telemetry via Mutable Refs

* **Status**: Accepted (Implemented in Phase 1)
* **Context**: Bridging GSAP ScrollTrigger's continuous progress values ($0.0 \to 1.0$) into React Three Fiber's render loop (`useFrame`) via React component state (`useState`) triggers 60–120 full React reconciliations per second, destroying CPU and frame rates.
* **Decision**:
  1. Bridge scroll progress using a React mutable ref (`scrollProgressRef = useRef<number>(0)`).
  2. ScrollTrigger writes to `scrollProgressRef.current = self.progress` inside its `onUpdate` callback.
  3. Three.js components read `scrollProgressRef.current` inside `useFrame((state, delta) => ...)`.
  4. DOM HUD indicators (progress bars, numeric values) are updated via direct DOM element mutations (`style.transform`, `textContent`).
* **Consequences**: 0 React component re-renders during active scrolling; smooth 60 FPS Three.js transforms and instant DOM progress feedback.

---

### ADR-011: Centripetal Catmull-Rom Dual Splines for Position & Target

* **Status**: Accepted (Implemented in Phase 2)
* **Context**: Navigating a continuous 3D world across five acts requires both the camera eye position and the camera focal target point to move smoothly along 3D trajectories without abrupt camera cuts, gimbal flips, loops, or overshoot cusps.
* **Decision**:
  1. Define two distinct 16-point 3D control point arrays: `positionPoints` and `targetPoints` along the negative Z axis ($Z = 0 \to -114$).
  2. Instantiate two independent `THREE.CatmullRomCurve3` curves configured with `curveType: 'centripetal'`. Centripetal parameterization prevents unwanted self-intersections, cusps, and loop artifacts that frequently occur with standard chordal or uniform Catmull-Rom curves when control points are unequally spaced.
  3. Pre-allocate scratch vectors (`positionScratch`, `targetScratch`) to eliminate all garbage collection allocations in `useFrame`.
  4. Smooth camera motion with frame-rate independent `lerp` damping (`delta * 18`) and subtle pointer parallax.
* **Consequences**: Cinematic, organic camera motion that remains continuous, strictly reversible, and free of orientation anomalies.

---

### ADR-012: Piecewise Progress Calibration (`mapScrollToSplineU`) for Storyboard Choreography

* **Status**: Accepted (Implemented in Phase 2)
* **Context**: In Three.js, `CatmullRomCurve3.getPointAt(u)` maps parameter $u \in [0, 1]$ to equidistant arc-length along the curve. Because the physical distances of the five acts differ dramatically (Act I is ~4 units long, whereas Act III spans ~42 units), passing raw scroll progress $S$ directly into `getPointAt(S)` causes the camera to rush through compact indoor acts in 3-4% of scroll, leaving the narrative out of sync with the 3D framing.
* **Decision**:
  1. Implement a monotonic piecewise transfer function `mapScrollToSplineU(progress)` in `config/cameraPath.ts`.
  2. Map narrative scroll milestones ($S \in [0.00, 0.18, 0.35, 0.60, 0.85, 1.00]$) to calibrated spline arc-length positions ($u \in [0.000, 0.055, 0.200, 0.550, 0.820, 1.000]$).
  3. Interpolate linearly within each act segment, guaranteeing monotonicity and continuous velocity.
* **Consequences**: Perfect synchronization between narrative DOM text sections and camera 3D framing; comfortable viewing duration for compact scenes without changing 3D spatial geometry.

---

### ADR-013: Overlapping Visibility Bands for Continuous Scene Culling

* **Status**: Accepted (Implemented in Phase 2)
* **Context**: Rendering all five environments simultaneously places unnecessary strain on GPU fill rate and draw calls, but unmounting environments too abruptly causes visual popping during camera transitions.
* **Decision**:
  1. Implement `getEnvironmentVisibility(progress)` with overlapping visibility bands:
     - Act I (Origin): $S \le 0.28$
     - Act II (Journey): $0.12 \le S \le 0.45$
     - Act III (World): $0.28 \le S \le 0.70$
     - Act IV (Creations): $0.52 \le S \le 0.92$
     - Act V (Beyond): $S \ge 0.78$
  2. In `ExperienceWorld.tsx`, update visibility state only when crossing band thresholds to avoid re-rendering R3F sub-trees during steady-state scroll.
* **Consequences**: Distant geometries are culled, reducing active draw calls while ensuring completely seamless visual transitions with zero pop-in.

---

### ADR-014: Stacking Context Hierarchy for Full-Viewport Three.js Viewports

* **Status**: Accepted (Implemented in Phase 2)
* **Context**: Placing full-screen WebGL canvases behind scrollable DOM overlay content with negative z-index (`-z-10`) causes the canvas to be painted behind the opaque backgrounds of parent or `body` elements due to CSS Stacking Context rules (CSS 2.1 Appendix E), rendering the canvas invisible.
* **Decision**:
  1. Mount the WebGL viewport with `className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-[#07080B]"` (`z-index: 0`).
  2. Set parent scroll wrapper containers to transparent backgrounds (`bg-transparent`).
  3. Elevate interactive DOM overlays and HUD elements with `relative z-10` and `pointer-events-auto` for interactive elements.
* **Consequences**: WebGL 3D canvas is crisply rendered at native resolution while interactive DOM elements, buttons, and text remain fully selectable and functional on top.


