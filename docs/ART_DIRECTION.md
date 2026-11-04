# ART DIRECTION SPECIFICATION
## FAROUK — BEYOND THE SCREEN

---

### 1. Creative North Star: *Cinematic Stylized Realism*

The aesthetic philosophy of **FAROUK — BEYOND THE SCREEN** is founded on **Cinematic Stylized Realism**. 

This direction intentionally avoids two extremes:
* **Avoids Hyper-Photorealism**: Real-time photorealism on the web frequently leads to uncanny valley artifacts, massive texture downloads, poor frame rates, and visual clutter.
* **Avoids Simplistic Low-Poly / Toy Aesthetics**: Generic faceted low-poly models convey casualness and fail to represent dedicated engineering craftsmanship.

Instead, Stylized Realism achieves visual elegance through:
1. **Art-Directed PBR Materials**: Simplified geometric silhouettes paired with rich, tactile material properties (roughness variation, metallic micro-sheens, subtle ambient occlusion).
2. **Atmospheric Lighting**: Dramatic chiaroscuro, cinematic rim lights, soft depth of field, and volumetric haze that separates foreground subject matter from vast dark backdrops.
3. **Intentional Color Restraint**: A cohesive, high-contrast palette where color represents meaning and state rather than decorative excess.

---

### 2. Color Palette & Lighting System

#### 2.1 Core Palette Tokens

| Role | Color Name | Hex Code | Purpose |
| :--- | :--- | :--- | :--- |
| **Foundation 1** | Midnight Obsidian | `#07080B` | Deepest canvas background, infinite space, shadow depths. |
| **Foundation 2** | Deep Graphite | `#11141A` | Room architecture, physical desk surfaces, monolith structures. |
| **Surface Mid** | Slate Neutral | `#1C222D` | Structural accents, secondary panels, bevels, architectural trims. |
| **Accent 1** | Electric Cyan | `#00F2FE` | Interactive focus points, code pulses, digital portals, active states. |
| **Accent 2** | Hyper Teal | `#00C9A7` | Secondary technical markers, telemetry data, subtle glow. |
| **Illumination** | Warm Amber | `#FF9F43` | Workstation tungsten lamp, cozy interior warmth, human focus. |
| **Typography Primary** | Soft Crisp White | `#F3F6FA` | Primary headlines, critical text, high-legibility readability. |
| **Typography Muted** | Muted Slate Silver | `#8E9CAE` | Body copy, technical metadata, labels, inactive indicators. |

#### 2.2 Lighting Rationale (Provisional Parameters)
* **The Origin (Bedroom)**: Key light is a warm amber desk lamp (initial target `3200K`, `#FF9F43`) combined with cool monitor backlight (initial target `6500K`, `#00F2FE`), creating intimate temperature contrast (chiaroscuro).
* **The Journey & The World**: Ambient lighting cools down into twilight blues (`#0D1527`), pierced by directional cyan rim lights and soft distance fog (`#07080B`).
* **The Creations**: Neutral spotlighting with colored rim reflections that make each project monolith feel like a curated artifact.
* **Beyond**: Low-angle golden-cyan sunrise at the horizon, casting long, dramatic silhouettes.

*(Note: Exact lux, kelvin, and light intensity multipliers are provisional artistic starting points, subject to calibration during browser testing).*

---

### 3. Visual Environment Breakdown

```
+-----------------------------------------------------------------------------------------+
| SCENE 1: THE ORIGIN               SCENE 2: THE JOURNEY             SCENE 3: THE WORLD   |
| - Intimate bedroom/studio         - Wall deconstruction            - Floating tech      |
| - Late-night workstation          - Dissolving boundaries            archipelago        |
| - Dual-monitor cyan glow          - Portal / dimensional slip      - Architectural      |
| - Rain-streaked window & lamp     - Abstract geometry drift          topography         |
+-----------------------------------------------------------------------------------------+
                                 \                                 /
                                  \                               /
+-----------------------------------------------------------------------------------------+
| SCENE 4: THE CREATIONS                                     SCENE 5: BEYOND              |
| - Floating holographic monoliths                           - High-altitude ridge vista  |
| - Interactive project pedestals                            - Digital dusk horizon       |
| - Micro-architectural models                               - Minimalist terminal beacon |
| - Dynamic camera focus & depth                             - Direct contact portal      |
+-----------------------------------------------------------------------------------------+
```

#### Scene 1: The Origin (Bedroom & Workstation)
* **Tone**: Sanctuary, deep focus, nocturnal craftsmanship.
* **Objects**: Modern clean desk, dual-monitor setup with subtle code terminal animations, mechanical keyboard with soft backlighting, ergonomic chair, developer character seated in flow state, bookshelf with engineering and design books, window looking out into a drizzling midnight cityscape.
* **Details**: Coffee mug with faint steam particle effect, subtle LED indicators, ambient dust motes catching the desk lamp beam.

#### Scene 2: The Journey (The Threshold)
* **Tone**: Liberation, metamorphosis, transition from local development to published systems.
* **Visual Mechanics**: As the user scrolls, the rear wall of the bedroom seamlessly unlatches into floating architectural fragments. The camera glides through the window frame, which dissolves into an electric cyan spatial corridor.
* **Details**: Abstract geometric grids and line trails guide the viewer forward.

#### Scene 3: The World (The Technological Landscape)
* **Tone**: Breadth, interconnectivity, technical exploration.
* **Visual Mechanics**: A vast low-gravity archipelago consisting of monolithic floating platforms, each representing a provisional domain of Farouk's mobile and web engineering workflow (subject to confirmation by portfolio evidence):
  1. *Web & Frontend Engineering*: Kinetic geometric sculptures that react to mouse hover.
  2. *Mobile App Development*: Clean structural monolithic interfaces with responsive state transitions.
  3. *Backend & Cloud Systems*: Synchronized data pulses moving along glowing conduit lines.
* **Atmosphere**: Deep volumetric fog concealing the abyss below, with distant digital constellations.

#### Scene 4: The Creations (The Interactive Gallery)
* **Tone**: Precision, refinement, gallery exhibition.
* **Visual Mechanics**: Distinct monumental pedestals ascend from the mist. Each pedestal holds an interactive 3D manifestation of a key project (e.g. interactive 3D models, floating translucent viewports, live architecture schemas).
* **Interaction**: Hovering slows the camera drift; clicking docks the camera in a close-up inspection mode with smooth depth-of-field blurring the background.

#### Scene 5: Beyond (The Summit & Contact)
* **Tone**: Expansive, forward-looking, open to collaboration.
* **Visual Mechanics**: The camera arrives at an open observation overlook. The character stands at the edge, gazing toward an endless illuminated horizon. A sleek, minimal terminal monolith anchors the scene, presenting verified contact links, email trigger, and social connections.
* **Atmosphere**: Clean, wind-swept sky particles, serene ambient illumination.

---

### 4. Typography & Interface Language

* **Primary Display**: Clean, contemporary sans-serif with geometric precision (`Geist Sans`).
* **Technical & Telemetry**: High-precision monospace (`Geist Mono`) for coordinate readouts, scene indicators, system telemetry, and tags.
* **Composition Guidelines**:
  * Clean negative space: The 3D world is the hero. UI elements remain anchored to viewport edges (status bar, coordinates, discreet navigation pills).
  * No gratuitous glassmorphism: UI cards use solid dark graphite surfaces (`#11141ACC`) with subtle `1px` borders (`#2D374844`) rather than blurry generic glass.
  * Contrast ratio compliance: Text adheres to WCAG AA contrast against dark backdrops.

---

### 5. Camera & Cinematography Directives (Provisional Parameters)

* **Field of View (FOV)**: 
  * Default Cinematic: Provisional target `45°` to `50°` (avoids wide-angle barrel distortion while maintaining depth).
  * Macro / Desk Focus: Provisional target `35°` for intimate telephoto feel.
* **Camera Curves**: Smooth Catmull-Rom splines for scroll-driven tracking. No instantaneous cuts; all transitions are continuous camera dollies and pans with damped inertia.
* **Framing Principle**: Rule of thirds applied to 3D composition. When narrative text appears on the left half of the screen, the focal 3D subject shifts gracefully to the right half.

> [!NOTE]
> All camera positions, FOVs, coordinate vectors, and scrub percentages listed in the creative documentation are provisional baseline values. They will be interactively tuned and calibrated in the browser during implementation phases.
