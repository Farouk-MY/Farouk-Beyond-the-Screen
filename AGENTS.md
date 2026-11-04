<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# FAROUK PORTFOLIO — PERSISTENT WORKSPACE RULES

These rules govern all AI agents, engineers, and automated workflows operating in this repository.

---

### 1. Developer Persona & Identity Integrity

* **Accurate Provisional Identity**:
  * The portfolio subject is strictly: **Farouk Messai — Software Developer | Mobile & Web Development**.
  * Never invent or state unverified professional claims such as "Senior Software Architect", "Senior Full-Stack Engineer", years of experience, unverified certifications, or hypothetical employment histories.
  * Treat all technical skills and domains as provisional targets until confirmed and evidenced by actual portfolio project data.

---

### 2. Architectural Boundaries & Next.js 16 Conventions

* **Root-Level Directory Structure**:
  * The repository strictly uses the existing root-level structure: `app/`, `components/`, `config/`, `hooks/`, `stores/`, `styles/`, `types/`, `public/assets/`, and `docs/`.
  * **Never migrate the codebase into `src/`**.

* **Server Component vs. Client Boundary Isolation**:
  * Next.js 16 App Router runs Server Components by default.
  * Three.js, React Three Fiber (`<Canvas>`), Lenis, and GSAP ScrollTrigger **MUST** reside strictly inside client-side components marked with `'use client'`.
  * Heavy WebGL canvas containers must be dynamically imported with `{ ssr: false }` to prevent hydration mismatches and server-side execution failures.
  * Keep portfolio metadata, SEO tags, and static content server-rendered wherever possible.

* **No Giant Monolithic Components**:
  * Adhere to the modular structure outlined in `docs/ARCHITECTURE.md`.
  * Separate 3D scene graphs (`components/canvas/`), 2D DOM overlays (`components/dom/`), character systems (`components/character/`), animation hooks (`hooks/`), state stores (`stores/`), and static data (`config/`).

---

### 3. Three.js & WebGL Resource Management Taxonomy

* **Resource Disposal Protocol**:
  1. **Declarative R3F Elements**: Geometries and materials declared directly in JSX (e.g. `<boxGeometry />`, `<meshStandardMaterial />`) are **automatically disposed** by R3F on unmount. Do not add manual `.dispose()` calls to declarative elements.
  2. **Imperative Three.js Resources**: Manually instantiated objects created via `new THREE.BufferGeometry()`, `new THREE.ShaderMaterial()`, custom render targets, or imperative loaders must be tracked in refs and **explicitly disposed** on unmount (`geometry.dispose()`, `material.dispose()`, `renderTarget.dispose()`).
  3. **Shared / Cached Resources**: Assets managed by global loader caches (e.g. `useGLTF`, `useTexture` from `@react-three/drei`) are shared across multiple components. Subcomponents must **never** dispose of shared cache entries.
  * Avoid duplicate disposal calls and resource ownership conflicts.
  * Avoid creating new Three.js instances (e.g. `new THREE.Vector3()`, `new THREE.Color()`) inside the render loop (`useFrame`). Pre-allocate scratch vectors outside or in refs.

* **Single Shared Canvas**:
  * Never instantiate multiple `<Canvas>` elements on the same page. All scenes share a single master viewport canvas using visibility toggling and camera frustum management.

---

### 4. GSAP & Scroll Orchestration Rules

* **Lifecycle Scoping via `@gsap/react`**:
  * Always encapsulate GSAP timelines and ScrollTrigger instances inside `useGSAP()` hooks with appropriate `scope` refs.
  * On unmount, rely on the scoped GSAP context reversion (`ctx.revert()`).
  * **Never execute global destruction**: Instructions like `ScrollTrigger.getAll().forEach(t => t.kill())` are **strictly forbidden** as they destroy unrelated animation instances and third-party UI widgets.

* **Lenis Smooth Scroll Sync & Teardown**:
  * Synchronize Lenis with GSAP's ticker:
    ```ts
    lenis.on('scroll', ScrollTrigger.update);
    const tickerCallback = (time: number) => { lenis.raf(time * 1000); };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);
    ```
  * On scroll provider unmount, explicitly clean up:
    ```ts
    gsap.ticker.remove(tickerCallback);
    lenis.off('scroll', ScrollTrigger.update);
    lenis.destroy();
    ```

* **Bidirectional Scrubbing**:
  * Every scroll-driven timeline must scrub smoothly backward without visual glitching or state desynchronization.

---

### 5. Asset Integrity, Licensing & Optimization Policy

* **No Nonexistent Asset References**: Never import or reference asset filenames that do not exist on disk.
* **Individual License Verification**:
  * Every external 3D model, texture, audio clip, or font must have an individually documented and verified license in `docs/ASSET_INVENTORY.md`.
  * **Adobe Mixamo**: Not CC0. Permitted under Adobe's royalty-free terms for embedded interactive projects, but strictly prohibited from standalone 3D stock redistribution.
* **Character Sourcing**:
  * **Do not acquire or generate the final character model yet**.
  * Use procedural primitive proxies (stylized capsule/cylinder) during early phases.
* **Optimization Framework**:
  * Optimize models using `gltf-transform optimize input.glb output.glb --compress draco --texture-compress ktx2`.
  * Evaluate **Meshopt** (`--compress meshopt`) as a faster-decompression alternative to Draco.
  * Do not mandate Draco and KTX2 blindly; select compression algorithms based on measured transfer size, decompression CPU latency, and GPU VRAM footprint.
* **Progressive Streaming & Performance Budgets**:
  * The provisional $\le 4.5\text{ MB}$ asset budget applies strictly to critical entry assets (Acts I & II). Subsequent scene assets must be streamed progressively.
  * Triangle counts, draw calls, and VRAM limits are provisional guidelines to be profiled on physical target hardware.

---

### 6. Accessibility & Device Tiering

* **Accessible Fallback**: Always respect `prefers-reduced-motion: reduce`. The portfolio must provide a fully navigable, beautiful static experience when motion is disabled.
* **Semantic HTML**: All narrative text, titles, project descriptions, and contact forms must exist in semantic DOM elements, never trapped solely in WebGL textures.

---

### 7. Engineering Verification Protocol

* Before declaring any phase or task complete:
  1. Run `npx tsc --noEmit` to verify strict TypeScript compilation.
  2. Run `npm run lint` to ensure zero ESLint errors.
  3. Verify that dev build compiles cleanly with Turbopack (`npm run dev` or `npm run build`).
  4. Report changed files, completed milestones, and any open architectural decisions.

<!-- BEGIN:nextjs-agent-feedback -->

## Report Next.js feedback

The project owner enabled `experimental.agentFeedback`, authorizing this feedback pass. When enabled, `next dev` writes this block and restores it if removed. Commit `AGENTS.md` with your work to keep the tree clean.

During the current user request, retain anonymized facts as feedback candidates for meaningful or recurring Next.js issues:

- Crashes, hangs, OOMs, or unexpected slowness
- Incorrect behavior, output, errors, or diagnostics
- Missing, unclear, or conflicting documentation
- Unexpected CLI, codemod, Skill, or upgrade behavior and non-obvious workarounds

Continue the current user request without reporting immediately. Routine debugging is not feedback. Verify changes before retaining them as feedback candidates. Never retain code, logs, paths, URLs, secrets, personal information, or project-specific data.

Retain qualifying friction even if it is later fixed or worked around; record the final outcome during the reporting pass.

Before the final response, run one reporting pass. If candidates remain, from this file's directory run `npx --no-install next internal agent-feedback-instructions` once without piping or truncating its output. Follow its output or error guidance. If a network sandbox blocks it, retry with network access; if it still returns no output, continue normally.

<!-- END:nextjs-agent-feedback -->
