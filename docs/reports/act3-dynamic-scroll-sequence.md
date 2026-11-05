# Farouk — Beyond the Screen
## Act III Dynamic Scroll Sequence & Video Hold Architecture

### 1. Architectural Overview & Spatial Composition

In Act III (*Selected Work*), the core creative challenge is unifying continuous vertical scrolling with a finite 3D architectural exhibition, while preserving character spatial continuity in the underlying video footage.

Video analysis of `public/videos/act-03-scrub.mp4` reveals the character's movement trajectory:
- **$0.0\text{s} \to 3.5\text{s}$**: Farouk enters from the left doorway, walks into the gallery, and halts beside the architectural exhibition wall on the right.
- **$3.5\text{s} \to 8.8\text{s}$**: Farouk stands in a stable, contemplative posture at the exhibition pedestal on the right ($x \approx 0.65 - 0.74, y \approx 0.25 - 0.95$), looking across at the screens.
- **$8.8\text{s} \to 10.0\text{s}$**: Farouk turns right and exits toward the engineering systems laboratory.

By synchronizing the scroll progression so that the video scrubs to **$t = 3.75\text{s}$** upon gallery entry and **holds stably at $3.75\text{s}$** while the visitor scrolls through the 3D project carousel, Farouk remains present in the scene as an architectural inhabitant, while the interactive 3D screens occupy the center and left foreground.

```
+-------------------------------------------------------------------------+
| MASTER ACT III COMPOSITION (Viewport: 100vw x 100vh)                    |
|                                                                         |
|  [03 / SELECTED WORK]                          [01 / 04]                |
|                                                                         |
|         PREVIOUS               ACTIVE DOMINANT              FAROUK      |
|          SCREEN                    SCREEN                  (STABLE      |
|       (Angled Back,            (Center Frontal,             VIDEO       |
|        scale 0.74)              scale 1.0, 3D)              HOLD)       |
|       rotY: +18deg               rotY: 0deg                 t=3.75s     |
|       transZ: -105px             transZ: +35px              x ~0.70     |
|                                                                         |
|                  +----------------------------+                         |
|                  |   ARCHITECTURAL PEDESTAL   |                         |
|                  | Title, Tagline, Tech, CTAs |                         |
|                  +----------------------------+                         |
+-------------------------------------------------------------------------+
```

---

### 2. Master Dynamic Timeline Formulation

Rather than hardcoding static scroll intervals, the portfolio uses a continuous dynamic weighting engine implemented in [config/cinematicTimeline.ts](file:///c:/Users/MSI/Desktop/DEV/portfolio/config/cinematicTimeline.ts).

#### A. Relative Section Weights
```ts
export const WEIGHT_STUDIO = 1.0;         // Act I
export const WEIGHT_JOURNEY = 1.0;        // Act II
export const WEIGHT_WORK_INTRO = 0.35;    // Farouk enters gallery (0.0s -> 3.75s)
export const WEIGHT_PROJECT_STEP = 0.50;  // Per project presentation step
export const WEIGHT_WORK_OUTRO = 0.35;    // Farouk exits gallery (3.75s -> 10.0s)
export const WEIGHT_ENGINEERING = 1.0;    // Act IV
export const WEIGHT_CONTACT = 1.0;        // Act V
```

#### B. Total Scroll Weight & Section Ranges
For any project count $N \ge 1$:
$$W_{\text{work}} = 0.35 + (0.50 \times N) + 0.35 = 0.70 + 0.50 N$$
$$W_{\text{total}} = 1.0 + 1.0 + W_{\text{work}} + 1.0 + 1.0 = 4.70 + 0.50 N$$

For $N = 4$ (current production baseline):
- $W_{\text{work}} = 2.70$
- $W_{\text{total}} = 6.70$
- Selected Work occupies $\frac{2.70}{6.70} \approx 40.30\%$ of the entire portfolio scroll runway.

| Act / Phase | Scroll Range | Normalized Span | Video Action |
| :--- | :--- | :--- | :--- |
| **Act I (Studio)** | $0.000 \to 0.149$ | $0.149$ | Scrub $0.0\text{s} \to 10.0\text{s}$ (or idle handoff) |
| **Act II (Journey)** | $0.149 \to 0.299$ | $0.149$ | Scrub $0.0\text{s} \to 10.0\text{s}$ |
| **Act III Intro** | $0.299 \to 0.351$ | $0.052$ | Scrub $0.0\text{s} \to 3.75\text{s}$ (Farouk enters) |
| **Act III Proj 0 (MediConnect)** | centered at $0.351$ | $0.100$ | **HELD at 3.75s** |
| **Act III Proj 1 (Smart Class)** | centered at $0.450$ | $0.100$ | **HELD at 3.75s** |
| **Act III Proj 2 (NEXFORM)** | centered at $0.550$ | $0.100$ | **HELD at 3.75s** |
| **Act III Proj 3 (LinguaMate)** | centered at $0.649$ | $0.100$ | **HELD at 3.75s** |
| **Act III Outro** | $0.649 \to 0.701$ | $0.052$ | Scrub $3.75\text{s} \to 10.0\text{s}$ (Farouk exits) |
| **Act IV (Engineering)** | $0.701 \to 0.851$ | $0.149$ | Scrub $0.0\text{s} \to 10.0\text{s}$ |
| **Act V (Contact)** | $0.851 \to 1.000$ | $0.149$ | Scrub $0.0\text{s} \to 10.0\text{s}$ |

---

### 3. Continuous 3D Interpolation & Projection Math

Inside [components/dom/ProjectsOverlay.tsx](file:///c:/Users/MSI/Desktop/DEV/portfolio/components/dom/ProjectsOverlay.tsx), the continuous `globalProgress` is mapped into a fractional index:

$$\text{workLocalProgress} = \frac{p - \text{workStart}}{\text{workEnd} - \text{workStart}}$$
$$\text{normalizedProg} = \frac{\text{workLocalProgress} - \text{introFraction}}{\text{projectsFraction}}$$
$$\text{fractionalIndex} = \text{normalizedProg} \times (N - 1)$$

For each screen $i \in \{0, \dots, N-1\}$, the delta is $\Delta_i = i - \text{fractionalIndex}$.

The shallow curved 3D exhibition wall applies the following continuous CSS transforms:
- **Perspective**: `perspective: 1200px` on container stage.
- **Transform Style**: `transform-style: preserve-3d`.
- **Horizontal Arc Displacement**:
  $$\text{translateX} = \Delta_i \times 62\%$$
- **Depth Concavity**:
  $$\text{translateZ} = -|\Delta_i| \times 140\text{px} + (|\Delta_i| < 0.45 \text{ ? } 35\text{px} : 0)$$
- **Angular Convergence**:
  $$\text{rotateY} = -\Delta_i \times 18^\circ$$
- **Scale Factor**:
  $$\text{scale} = \max(0.70, 1.0 - |\Delta_i| \times 0.26)$$
- **Atmospheric Attenuation**:
  $$\text{opacity} = \max(0, 1.0 - |\Delta_i| \times 0.55)$$

Only screens satisfying $|\Delta_i| \le 1.6$ are kept in the active render tree (`renderedIndices`), guaranteeing that at most 3 screens exist in DOM simultaneously.

---

### 4. Empirical Video Hold Telemetry

During automated CDP execution (`scripts/test-finite-3d-exhibition.mjs`), video playback times were polled across the entire project presentation runway:

```
Act III video times during exhibition presentation: [
  { scroll: 0.351, time: 3.75 },
  { scroll: 0.450, time: 3.75 },
  { scroll: 0.550, time: 3.75 },
  { scroll: 0.649, time: 3.75 }
]
Act III video hold at 3.75s verified: true
```

The background video maintains frame stability at $t = 3.75\text{s}$ throughout the entire project switching sequence with zero drift ($\Delta t = 0.000\text{s}$), completely eliminating motion judder while the user interacts with the 3D screens.

