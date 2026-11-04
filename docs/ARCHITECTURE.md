# ARCHITECTURE SPECIFICATION
## FAROUK — BEYOND THE SCREEN

---

### 1. Architectural Philosophy

The architecture is built on the principle of **Decoupled Coexistence**:
The high-performance WebGL 3D world, the GSAP scroll orchestration engine, and the Next.js React DOM interface run as isolated layers that communicate through a lightweight, event-driven reactive state bridge.

```
+-------------------------------------------------------------------------+
|                              Next.js 16 App Router                      |
|                                                                         |
|  +---------------------------+       +-------------------------------+  |
|  |     Server Components     |       |       Client Root Shell       |  |
|  |    (Metadata, SEO, SSR)   |       |  (Providers, Lenis, Layout)   |  |
|  +-------------+-------------+       +---------------+---------------+  |
|                |                                     |                  |
+----------------|-------------------------------------|------------------+
                 v                                     v
+---------------------------------+   +-----------------------------------+
|       DOM UI Overlay Layer      |   |       Scroll Engine (GSAP)        |
|  - HUD / Navigation Bar         |   |  - Lenis Smooth Scroll            |
|  - Narrative Text & Project Info|   |  - ScrollTrigger Scrub Master     |
|  - Accessible Fallback Content  |   |  - Camera & Scene Timeline Scrub  |
+----------------+----------------+   +-----------------+-----------------+
                 ^                                      ^
                 |         Zustand / Event Bus          |
                 +------------------+-------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                       3D Runtime Layer (R3F Canvas)                     |
|                                                                         |
|  +-------------------------+  +---------------------------------------+  |
|  |   Camera & Lighting     |  |          Environment Director         |  |
|  |  - Spline Follower      |  |  - Scene 1: The Origin (Bedroom)      |  |
|  |  - Dynamic Rig / Fog    |  |  - Scene 2: The Journey (Threshold)   |  |
|  +-------------------------+  |  - Scene 3: The World (Tech Skyline)  |  |
|  +-------------------------+  |  - Scene 4: The Creations (Gallery)   |  |
|  |   Post-Processing Stack |  |  - Scene 5: Beyond (Contact Vista)    |  |
|  |  - Selective Bloom/Tone |  +---------------------------------------+  |
|  +-------------------------+                                            |
+-------------------------------------------------------------------------+
```

---

### 2. Next.js 16 & React 19 Integration Strategy

#### 2.1 Server Components vs. Client Boundaries
* Next.js 16 App Router defaults to Server Components.
* WebGL canvases, Three.js objects, and GSAP timelines require DOM and browser APIs (`window`, `navigator`, `WebGLRenderingContext`).
* **Rule**: All 3D and animation components reside exclusively within client boundaries (`'use client'`).
* **Dynamic Loading**: Heavy 3D modules are dynamically imported with `ssr: false` to ensure zero hydration mismatch and fast Time-to-First-Byte (TTFB):
  ```tsx
  // Client Boundary Isolation Pattern
  const SceneViewport = dynamic(
    () => import('@/components/canvas/SceneViewport').then((m) => m.SceneViewport),
    { ssr: false, loading: () => <ExperienceLoader /> }
  );
  ```

#### 2.2 Turbopack Asset Handling
* Next.js 16 uses Turbopack by default. Static assets (`.glb`, `.hdr`, `.ktx2`, `.webp`) are served from `/public/assets/...`.
* Shader files (`.vert`, `.frag`, `.glsl`) are imported as raw strings or encapsulated in custom shader material definitions to avoid custom loader friction.

---

### 3. Scroll Orchestration & Animation Lifecycle

#### 3.1 Lenis + GSAP ScrollTrigger Synchronization
* `lenis` handles smooth virtual scroll interpolation.
* GSAP's ticker is synchronized with Lenis using explicit listener attachment and teardown:
  ```ts
  // Recommended Synchronization Pattern
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);

  const tickerCallback = (time: number) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(0);

  // Dedicated Teardown (On Provider Unmount)
  const cleanupScroll = () => {
    gsap.ticker.remove(tickerCallback);
    lenis.off('scroll', ScrollTrigger.update);
    lenis.destroy();
  };
  ```

#### 3.2 Scoped Animation Management via `@gsap/react`
* **Zero Global Mutation**: Never execute global teardown instructions like `ScrollTrigger.getAll().forEach(t => t.kill())`, which destroy unrelated animation instances and third-party widgets.
* All component-level animations and ScrollTrigger instances must be enclosed within `useGSAP()` scopes, allowing GSAP to automatically revert only its owned timelines upon unmount:
  ```tsx
  useGSAP(() => {
    // Timelines created here are scoped and automatically reverted on unmount
    gsap.to(cameraSplineRef.current, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
      },
      progress: 1,
    });
  }, { scope: containerRef });
  ```

---

### 4. 3D Engine Architecture & Resource Management

#### 4.1 Single Canvas Paradigm
* A single full-viewport `<Canvas>` renders the entire experience. Multiple overlapping canvases cause severe WebGL context overhead and sync issues across devices.
* Environments are structured as decoupled sub-trees loaded lazily or rendered conditionally based on camera distance and active act:
  ```tsx
  <Canvas>
    <AdaptiveDpr />
    <PerformanceMonitor />
    <CameraController progress={scrollProgress} />
    <LightingRig currentScene={activeScene} />
    <Suspense fallback={null}>
      <SceneOrigin visible={activeScene === 1} />
      <SceneJourney visible={activeScene === 2} />
      <SceneWorld visible={activeScene === 3} />
      <SceneCreations visible={activeScene === 4} />
      <SceneBeyond visible={activeScene === 5} />
    </Suspense>
    <PostProcessingPipeline />
  </Canvas>
  ```

#### 4.2 Resource Management & Disposal Taxonomy
To eliminate GPU memory leaks and avoid duplicate disposal or ownership conflicts, Three.js resources are managed under three distinct categories:

1. **Declaratively Managed R3F Resources**:
   * Geometries and materials declared directly in JSX (e.g. `<mesh><boxGeometry /><meshStandardMaterial /></mesh>`) are **automatically disposed** by React Three Fiber when the hosting component unmounts.
   * Do not call manual `.dispose()` on declaratively mounted tags unless explicitly detached.

2. **Manually Instantiated Three.js Resources**:
   * Imperative objects created via `new THREE.BufferGeometry()`, `new THREE.ShaderMaterial()`, `new THREE.WebGLRenderTarget()`, or imperative loaders must be tracked in refs and **explicitly disposed** on unmount (`geometry.dispose()`, `material.dispose()`, `renderTarget.dispose()`).

3. **Shared & Cached Resources**:
   * Models, textures, or geometries managed by loaders with global caches (e.g. `useGLTF`, `useTexture` from `@react-three/drei`) are shared across multiple components.
   * **Rule**: Subcomponents must **never** dispose of shared cache entries. Asset disposal for shared resources is managed exclusively by the top-level asset manager or cache clear routines during major scene unmounts.

#### 4.3 Asset Compression & Progressive Streaming
* Models: Evaluated for **Draco** (mesh geometry compression) and **Meshopt** (fast decompression, GPU-friendly) to determine the best balance of download size vs. CPU decompression latency.
* Textures: Evaluated for **KTX2 / Basis Universal** (direct VRAM upload, reduced memory footprint) and optimized **WebP** based on target device tier.
* Progressive Streaming: The initial load budget (provisional target $\le 4.5\text{ MB}$) is dedicated solely to critical initial assets (Act I & II). Assets for subsequent acts are progressively streamed as the visitor approaches those milestones.

---

### 5. UI Overlay & Semantic Fallback Layer

#### 5.1 Decoupled HTML DOM
* All narrative copy, project headings, descriptions, and interactive contact buttons are rendered as semantic HTML elements in a fixed/absolute DOM layer sitting over or synced with the 3D viewport.
* Scroll sections provide standard document flow so native scrolling and keyboard navigation function intuitively.

#### 5.2 Accessibility & `prefers-reduced-motion`
* A global media query listener detects `prefers-reduced-motion: reduce`.
* When enabled:
  * 3D camera animations and heavy scene transformations are bypassed.
  * The user is served a polished, static interactive layout with elegant 2D transitions.
  * The 3D canvas either renders an ambient static hero or is replaced entirely with lightweight graphic stills to prevent vestibular discomfort.

---

### 6. Target Directory Architecture (Root-Level)

The project maintains the established root-level application layout without introducing a `src/` wrapper:

```
portfolio/
├── .next/                         # Next.js build output
├── docs/                          # Architectural and project documentation
│   ├── PROJECT_OVERVIEW.md
│   ├── ARCHITECTURE.md
│   ├── ART_DIRECTION.md
│   ├── STORYBOARD.md
│   ├── ASSET_INVENTORY.md
│   ├── DEVELOPMENT_ROADMAP.md
│   └── DECISIONS.md
├── public/                        # Static public assets
│   ├── assets/
│   │   ├── models/                # Optimized GLB models (.glb)
│   │   ├── textures/              # Environment maps & KTX2/WebP textures
│   │   └── fonts/                 # Web fonts
│   ├── favicon.ico
│   └── icons/
├── app/                           # Next.js 16 App Router (Root-level)
│   ├── globals.css                # Tailwind CSS v4 styling & theme tokens
│   ├── layout.tsx                 # Root layout & font definition
│   ├── page.tsx                   # Primary cinematic scroll experience
│   └── not-found.tsx
├── components/                    # Modular component layers
│   ├── canvas/                    # WebGL & R3F components ('use client')
│   │   ├── SceneViewport.tsx      # Master R3F Canvas container
│   │   ├── CameraRig.tsx          # Spline camera controller & lerp
│   │   ├── LightingRig.tsx        # Dynamic lights, shadows & fog
│   │   ├── PostProcess.tsx        # Selective bloom, vignette, grade
│   │   └── environments/          # 5 Core 3D Environments
│   │       ├── 1-Origin/          # Bedroom & workstation scene
│   │       ├── 2-Journey/         # Surreal transition threshold
│   │       ├── 3-World/           # Tech archipelago & skyline
│   │       ├── 4-Creations/       # Interactive project gallery
│   │       └── 5-Beyond/          # Final cinematic summit & horizon
│   ├── character/                 # 3D Character & animation system
│   │   ├── CharacterModel.tsx     # GLTF mesh & armature
│   │   └── useCharacterController.ts
│   ├── dom/                       # 2D DOM Overlays & UI
│   │   ├── Navigation.tsx         # Header, progress bar, audio toggle
│   │   ├── StorySection.tsx       # Semantic text blocks pinned in scroll
│   │   ├── ProjectCard.tsx        # Interactive project details drawer
│   │   ├── ContactForm.tsx        # Beyond scene contact interface
│   │   └── Loader.tsx             # Initial experience progress loader
│   └── common/                    # Shared UI primitives (Buttons, badges)
├── config/                        # Static portfolio data & constants
│   ├── projects.ts                # Project showcase data & links
│   ├── skills.ts                  # Skill categories (Mobile, Web, etc.)
│   ├── site.ts                    # Metadata, bio, social links
│   └── timeline.ts                # Scroll progress milestones & triggers
├── hooks/                         # Custom React & 3D hooks
│   ├── useLenisScroll.ts          # Lenis smooth scroll bridge
│   ├── useScrollProgress.ts       # Normalized scroll progress hook
│   ├── useDeviceTier.ts           # GPU tier & performance classification
│   └── usePrefersReducedMotion.ts
├── stores/                        # Lightweight reactive state (Zustand)
│   ├── useAppStore.ts             # Loading state, active act, sound state
│   └── useProjectStore.ts         # Active selected project in gallery
├── styles/                        # Custom CSS variables, shaders
├── types/                         # Shared TypeScript interfaces
│   ├── 3d.d.ts
│   ├── project.ts
│   └── scroll.ts
├── AGENTS.md                      # Persistent workspace rules & agent guidelines
├── next.config.ts                 # Next.js configuration
├── package.json                   # Dependency manifest
├── tsconfig.json                  # Strict TypeScript configuration
└── README.md
```

---

### 7. Module Dependency Rules

1. **`components/canvas/` must NEVER directly import DOM interaction state**: Canvas components react to values passed via props or lightweight Zustand store selectors.
2. **`components/dom/` must NEVER import Three.js directly**: DOM components receive telemetry (e.g. current active scene) from store state; they do not manipulate the WebGL scene graph directly.
3. **No Direct DOM Mutations outside GSAP Scope**: All animations on DOM elements must be contained within `useGSAP()` hooks.
4. **Disposal Taxonomy Compliance**: Honor the distinction between R3F declarative disposal, manual object disposal, and protected shared cache instances.

---

### 8. Phase 1 Implementation Notes: Validated Core Shell Pipeline

* **Coordinated Scroll RAF Loop**: Lenis is instantiated with `autoRaf: false` and driven directly by `gsap.ticker.add((time) => lenis.raf(time * 1000))` with `gsap.ticker.lagSmoothing(0)`. This unified RAF coordinates Lenis virtual scrolling with GSAP ScrollTrigger updates, without replacing or interfering with React Three Fiber's native WebGL render loop (`useFrame`).
* **Zero-Rerender Scroll Bridge**: A shared mutable ref (`scrollProgressRef = useRef<number>(0)`) bridges ScrollTrigger's `onUpdate` directly into Three.js `useFrame` loop, eliminating per-frame React reconciliations.
* **React 19 Media Query Compliance**: `usePrefersReducedMotion` implements `useSyncExternalStore` for external media query subscription, avoiding cascading renders flagged by `react-hooks/set-state-in-effect`.
* **Safe Dynamic Boundary**: The WebGL `<Canvas>` is isolated inside `components/canvas/SceneViewport.tsx` and dynamically imported with `{ ssr: false }` from `components/canvas/CanvasWrapper.tsx`, ensuring zero server-side WebGL evaluation.

---

### 9. Phase 2 Implementation Notes: Cinematic Camera Spline & Five-Act World Engine

* **Centripetal Catmull-Rom Dual Splines**: The continuous camera journey is governed by two 16-point 3D curves (`cameraPositionSpline` and `cameraTargetSpline`) defined in `config/cameraPath.ts`. Both use `THREE.CatmullRomCurve3` with `centripetal` parameterization to prevent self-intersections, loops, and overshoot cusps.
* **Story-Calibrated Progress Mapping (`mapScrollToSplineU`)**: A piecewise monotonic transfer function translates master scroll progress $S \in [0, 1]$ into curve arc-length parameter $u \in [0, 1]$, calibrating narrative viewing time with spatial act spans (e.g. Act I bedroom $S: 0.00 \to 0.18$ maps to $u: 0.000 \to 0.055$).
* **Overlapping Frustum Culling (`getEnvironmentVisibility`)**: Rather than rendering all five environments simultaneously, visibility bands cull distant acts outside the camera frustum while providing generous overlap transitions (e.g., Act II remains active from $S = 0.12$ to $0.45$).
* **Dynamic Five-Act Lighting Rig**: `LightingRig.tsx` smoothly interpolates light color, position, and intensity across the five acts (warm amber desk glow $\to$ cyan threshold beams $\to$ deep space ambient $\to$ gallery pedestal museum spotlights $\to$ digital dawn horizon glow).
* **Zero-Allocation Render Loops**: Scratch vectors (`THREE.Vector3`, `THREE.Vector2`) are pre-allocated outside the hot loop in `CameraRig`, `LightingRig`, and `ExperienceWorld`, avoiding garbage collection pauses during active scrolling.
* **Stacking Context Architecture**: The canvas viewport container is mounted with `fixed inset-0 z-0 pointer-events-none` over a transparent parent container, ensuring the 3D canvas is fully visible while DOM HUD and story overlays sit on top at `relative z-10`.


