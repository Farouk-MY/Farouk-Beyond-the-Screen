# STORYBOARD & SCROLL CHOREOGRAPHY
## FAROUK — BEYOND THE SCREEN

---

> [!NOTE]
> **Provisional Parameters & Architectural Status**:
> All camera positions, focal targets, FOV values, normalized scroll ranges ($S \in [0.00, 1.00]$), and scene durations described herein are initial artistic parameters designed to guide layout. These values will be interactively calibrated during browser implementation and responsive testing. Code snippets in this document are architectural illustrations of the synchronization model, not production drop-in code.

---

### 1. Global Scroll Timeline Architecture

The entire user journey is mapped across a normalized master scroll progression:
$$\text{Progress } S \in [0.00, 1.00]$$

Total virtual scroll height is calibrated to approximately `600vh` to `800vh` via pinned orchestration, providing comfortable pacing without user fatigue. Every animation track is **strictly bidirectional and reversible** when scrubbing backward.

```
0.00 -------- 0.18 -------- 0.35 ------------- 0.60 ------------- 0.85 -------- 1.00
[  ACT I:    ] [  ACT II:   ] [    ACT III:    ] [    ACT IV:    ] [  ACT V:    ]
[ THE ORIGIN ] [THE JOURNEY ] [   THE WORLD    ] [ THE CREATIONS ] [  BEYOND    ]
Workstation    Wall Dissolve    Tech Domains     Project Gallery    Horizon
& Bedroom      & Threshold      Archipelago      Monoliths & Focus  & Contact
```

---

### 2. Scene-by-Scene Cinematic Choreography

#### Act I: The Origin ($S = 0.00 \to 0.18$)
* **Environment**: Dark bedroom, warm desk lamp, dual screens glowing cyan.
* **Camera Timeline (Provisional)**:
  * $S = 0.00$: Close-up on the workstation monitor displaying live code. Position: `[0.2, 1.1, 0.8]`, Target: `[0.0, 1.0, 0.0]`, FOV: `38°`.
  * $S = 0.06$: Camera dollies back and slightly upward, revealing the developer character seated at the desk typing with rhythmic hand keyframes.
  * $S = 0.14$: Wide establishing shot of the entire bedroom. Rain streaking against the window.
* **Character Action**: Seated typing $\to$ pauses, looks slightly toward the window as if contemplating an idea.
* **DOM UI Overlay**:
  * Title reveal: *"FAROUK MESSAI"* (large display typeface).
  * Subtitle: *"Software Developer | Mobile & Web Development"*.
  * Ambient scroll prompt: *"Scroll to explore $\downarrow$"*.
* **Scrub Behavior**: Smooth reverse zoom back to the monitor when scrolled up.

---

#### Act II: The Journey ($S = 0.18 \to 0.35$)
* **Environment**: Room walls fragment; space transforms into an abstract cyan architectural corridor.
* **Camera Timeline (Provisional)**:
  * $S = 0.18$: Camera dollies toward the window. Depth-of-field blurs the desk.
  * $S = 0.24$: The bedroom rear wall and ceiling split into floating geometric tiles that drift outward in zero gravity. The window frame dissolves into a glowing cyan aperture.
  * $S = 0.30$: Camera passes cleanly through the portal. Ambient sound/particle density ramps up.
* **Character Action**: Character stands up from the desk, steps forward toward the threshold, dissolves smoothly into a kinetic particle stream that leads the camera.
* **DOM UI Overlay**:
  * Text block fade-in / slide-up: *"From local concepts to published products. Exploring mobile and web development."*
* **Scrub Behavior**: Walls reassemble cleanly in reverse, character returns to seat.

---

#### Act III: The World ($S = 0.35 \to 0.60$)
* **Environment**: Panoramic floating tech archipelago in deep nocturnal space with volumetric cyan/graphite fog.
* **Camera Timeline (Provisional)**:
  * $S = 0.35$: Sweeping panorama shot over the floating islands. Position: `[5.0, 8.0, 15.0]`, Target: `[0.0, 2.0, 0.0]`.
  * $S = 0.42$: Camera swoops low over **Node 1: Web & Frontend Engineering** (interactive web interfaces, modern frameworks).
  * $S = 0.50$: Camera arcs smoothly past **Node 2: Mobile Application Development** (cross-platform and native ecosystems).
  * $S = 0.56$: Camera glides beside **Node 3: Backend & API Integration** (cloud services, scalable data flow).
* **Interactive Elements**: As the camera nears each island, subtle interactive mouse parallax activates.
* **DOM UI Overlay**:
  * Pinned telemetry card with tabs dynamically highlighting provisional technical domains (subject to confirmation by actual portfolio project evidence):
    * *Web Development*: Modern frontend architecture, responsive design, performance optimization.
    * *Mobile Development*: Mobile app architecture, native bridging, fluid UI/UX.
    * *Backend & Tools*: API design, database structures, build automation.
* **Scrub Behavior**: Camera follows spline path backward with zero jump cuts.

---

#### Act IV: The Creations ($S = 0.60 \to 0.85$)
* **Environment**: The interactive project exhibition hall — monumental floating dark pedestals rising from a mirrored reflective dark floor.
* **Camera Timeline (Provisional)**:
  * $S = 0.60$: Camera decelerates and aligns horizontally with the exhibition pedestals.
  * $S = 0.66$: **Project 1 Focus** — Camera docks at Pedestal 1. 3D representation of project emerges with soft amber/cyan rim light.
  * $S = 0.74$: **Project 2 Focus** — Camera slides horizontally along rail to Pedestal 2.
  * $S = 0.82$: **Project 3 Focus** — Camera moves to Pedestal 3.
* **Interactive Behavior**:
  * Scroll pause / pinning can be inspected. Clicking a project pedestal opens a non-destructive detailed 2D DOM case study drawer without reloading the 3D scene.
* **DOM UI Overlay**:
  * Project metadata card: Title, technical stack pills, implementation highlights, "View Live" & "Source Code" links.
* **Scrub Behavior**: Pedestals sink and raise smoothly according to scroll progression.

---

#### Act V: Beyond ($S = 0.85 \to 1.00$)
* **Environment**: An open observation promontory under a digital dawn sky.
* **Camera Timeline (Provisional)**:
  * $S = 0.85$: Camera ascends over a rise, emerging onto the high overlook.
  * $S = 0.92$: The character is seen standing in third-person silhouette at the edge of the overlook, facing the rising horizon light.
  * $S = 0.98 \to 1.00$: Camera locks into a serene framing. An elegant floating terminal pedestal illuminates in the center-right.
* **DOM UI Overlay**:
  * Final Headline: *"Let's build together."*
  * Contact interface: Direct copy-to-clipboard email pill, contact form drawer, GitHub / LinkedIn links, resume download.
* **Ambient Loop**: Subtle wind motes, slow camera idle breathing, horizon light pulse.

---

### 3. ScrollTrigger & Scrub Technical Configuration (Illustration)

```ts
// Architectural Illustration of Master Timeline Hookup
export function setupScrollOrchestration({
  containerRef,
  cameraSpline,
  sceneDirector,
}: ScrollParams) {
  // Scoped within a useGSAP() context in the parent component
  const masterTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.2, // Smooth damping scrub (prevents mechanical stutter)
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        sceneDirector.updateProgress(self.progress);
      },
    },
  });

  // Track 1: Camera Spline Progression (0.0 to 1.0)
  masterTimeline.to(cameraSpline, {
    progress: 1.0,
    ease: 'none',
  }, 0);

  // Track 2: Fog & Environment transition curves
  masterTimeline.to(sceneDirector.fog, { density: 0.04, ease: 'power2.inOut' }, 0.18);
  masterTimeline.to(sceneDirector.fog, { density: 0.015, ease: 'power2.inOut' }, 0.35);

  return masterTimeline;
}
```

---

### 4. Cleanup & Unmount Protocol

* **Scoped Cleanup via `useGSAP()`**: Component animations and triggers must be encapsulated within `useGSAP()` hooks. When the component unmounts, the GSAP context is reverted automatically (`ctx.revert()`), destroying only owned animations without mutating unrelated components.
* **Never Use Global Destruction**: Instructions like `ScrollTrigger.getAll().forEach(t => t.kill())` are **strictly forbidden** as they destroy unrelated animation instances and third-party UI widgets.
* **Lenis Provider Teardown**: When the top-level scroll provider unmounts:
  1. Remove ticker callback: `gsap.ticker.remove(tickerCallback)`
  2. Remove scroll listener: `lenis.off('scroll', ScrollTrigger.update)`
  3. Destroy virtual scroll instance: `lenis.destroy()`

---

### 5. Phase 2 Calibrated Spatial Trajectory & Verified Scrub Behavior

The 3D environment prototype operates along the negative Z-axis from $Z = 0$ down to $Z = -114$, calibrated to normalized scroll progress $S \in [0, 1]$ across a virtual scroll height of $700\text{vh}$:

| Act | Progress $S$ | Spline Parameter $u$ | Camera Pos $(X, Y, Z)$ | Target Look-At $(X, Y, Z)$ | Visual Landmark |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Act I: The Origin** | $0.00 \to 0.18$ | $0.000 \to 0.055$ | $(0.25, 0.08, -0.40) \to (0.00, 1.10, -4.20)$ | $(0.00, 0.02, -1.40) \to (0.00, 0.75, -4.50)$ | Dual monitors, keyboard, warm amber lamp, window aperture |
| **Act II: The Journey** | $0.18 \to 0.35$ | $0.055 \to 0.200$ | $(0.00, 1.10, -4.20) \to (0.40, 2.20, -22.00)$ | $(0.00, 1.25, -10.00) \to (1.50, 2.00, -38.00)$ | Cyan portal ring, deconstructed floating shards, corridor frames |
| **Act III: The World** | $0.35 \to 0.60$ | $0.200 \to 0.550$ | $(0.40, 2.20, -22.00) \to (-0.80, 2.50, -59.20)$ | $(1.50, 2.00, -38.00) \to (0.00, 0.60, -75.00)$ | Web, Mobile, and Cloud domain platforms, glowing conduits, particle field |
| **Act IV: The Creations**| $0.60 \to 0.85$ | $0.550 \to 0.820$ | $(-0.80, 2.50, -59.20) \to (0.00, 2.40, -96.00)$ | $(0.00, 0.60, -75.00) \to (0.80, 3.40, -112.00)$| Three tiered project pedestals, reflective ground, museum light pylons |
| **Act V: Beyond** | $0.85 \to 1.00$ | $0.820 \to 1.000$ | $(0.00, 2.40, -96.00) \to (-1.00, 4.50, -109.00)$| $(0.80, 3.40, -112.00) \to (1.20, 3.80, -114.00)$| Summit promontory cliff, hovering terminal monolith, digital dawn arc |

#### Verified Bidirectional Scrubbing Characteristics:
- Forward scrolling ($0.0 \to 1.0$) smoothly navigates each environment in sequence.
- Backward scrolling ($1.0 \to 0.0$) restores previous scene visibility bands, camera rotations, and light levels with zero hitching, disorientation, or NaN matrix errors.
- Navigation pill clicks trigger smooth Lenis camera flights that land directly in the target act framing.

