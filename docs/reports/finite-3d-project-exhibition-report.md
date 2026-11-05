# Farouk — Beyond the Screen
## Phase 3 Engineering Report: Finite 3D Project Exhibition & Cinematic Refinement

### 1. Executive Summary

Phase 3 implements the approved creative and technical direction:
**A Finite 3D Curved Screen Carousel combined with an Architectural Floating Exhibition Wall.**

The portfolio developer identity remains strictly preserved:
**Farouk Messai — Software Developer | Mobile & Web Development**

This implementation resolves the primary creative challenge of presenting interactive developer projects inside cinematic video footage:
1. **Physical Scene Integration**: Act III background video scrubs from $0.0\text{s} \to 3.75\text{s}$ as Farouk walks into the exhibition pavilion, and **holds stably at $t = 3.75\text{s}$** while the visitor browses all projects in 3D. Farouk stands naturally at the exhibition wall on the right ($x \approx 0.70$) observing the display, while the curved 3D screens occupy the center and left. As the user completes the gallery, the video resumes scrubbing from $3.75\text{s} \to 10.0\text{s}$ as Farouk departs for the engineering lab.
2. **True Finite 3D Screen Arc**: Built with pure CSS 3D transforms (`perspective: 1200px`, `transform-style: preserve-3d`, `rotateY`, `translateZ`, `scale`). Three neighboring screens sit on a shallow curved path: the central active project is large, frontal, and dominant ($scale = 1.0, \text{rotateY} = 0^\circ, \text{translateZ} = +35\text{px}$), while previous and next projects are smaller ($scale = 0.74$), angled back ($\pm 18^\circ$, $\text{translateZ} = -105\text{px}$), and attenuated ($opacity = 0.45$).
3. **Finite (Non-Wrapping) Navigation**: Project 0 has no previous card wrapping around; the final project has no next card wrapping around.
4. **Variable Project Counts**: The timeline dynamically scales scroll runway and presentation steps based on `PROJECTS_DATA.length`, flawlessly supporting 1, 2, 4, 5, or 10+ projects.
5. **Modal Interaction Overhaul**: Eliminated inherited pointer event suppression, locked background scrolling via both `document.body` and `lenis.stop()`, implemented focus trapping, and added Escape/arrow/touch swipe support.
6. **Editorial Header & Typography**: Removed the green "Available for Remote" pill in favor of a discreet text navigation bar (`Studio`, `Journey`, `Work`, `Engineering`, `Contact`) and a refined `Let's Talk ↗` CTA.

---

### 2. Architectural Design of the 3D Exhibition

```
+-----------------------------------------------------------------------------------------+
| FINITE 3D CURVED SCREEN CAROUSEL (CSS 3D / Hardware Accelerated)                        |
|                                                                                         |
|      PREVIOUS SCREEN                 ACTIVE CENTRAL SCREEN              NEXT SCREEN     |
|   +-------------------+             +-----------------------+        +----------------+ |
|   |                   |             |                       |        |                | |
|   |   Project (i - 1) |             |     Project (i)       |        | Project (i + 1)| |
|   |                   |             |                       |        |                | |
|   |  scale: 0.74      |             |     scale: 1.00       |        |  scale: 0.74   | |
|   |  rotY: +18deg     |             |     rotY: 0deg        |        |  rotY: -18deg  | |
|   |  transZ: -105px   |             |     transZ: +35px     |        |  transZ: -105px| |
|   |  opacity: 0.45    |             |     opacity: 1.00     |        |  opacity: 0.45 | |
|   +-------------------+             +-----------------------+        +----------------+ |
|             \                                   |                                /      |
|              +----------------------------------+-------------------------------+       |
|                                                 |                                       |
|                                  +------------------------------+                       |
|                                  |   FLOATING EXHIBITION BASE   |                       |
|                                  | Category  •  Status          |                       |
|                                  | Project Title                |                       |
|                                  | Tagline & Brief Description  |                       |
|                                  | [Gallery ↗]  [Architecture →]|                       |
|                                  | Tech Badges  |  01 • 02 • 03 |                       |
|                                  +------------------------------+                       |
+-----------------------------------------------------------------------------------------+
```

#### Screen Bezel & Display Material
- **Bezel**: Dark titanium and brushed bronze frame (`border border-[#D4AF37]/30 bg-[#0E0C0A]`) with chamfered inner border.
- **Glass Shimmer**: Diagonal top-to-bottom subtle gradient specular gloss (`bg-gradient-to-tr from-white/10 via-transparent to-transparent`) simulating physical exhibition glass.
- **Image Preservation**: All screenshots use `object-fit: contain` with an obsidian backdrop, ensuring interface elements (headers, graphs, tabs) are never cropped. Placeholder architectural diagrams feature the clear disclaimer badge `ARCHITECTURAL SPEC`.

---

### 3. Dynamic Master Timeline Formulation

The dynamic runway allocation is governed by the following formulation in [config/cinematicTimeline.ts](file:///c:/Users/MSI/Desktop/DEV/portfolio/config/cinematicTimeline.ts):

$$W_{\text{total}} = 1.0 + 1.0 + (0.35 + 0.50 N + 0.35) + 1.0 + 1.0 = 4.70 + 0.50 N$$

#### Multi-Project Scaling Proof:
- **$N = 1$**: $W = 5.20$, Act III range $[0.385, 0.615]$ (span $0.231$). Step 0 centered at $0.500$.
- **$N = 2$**: $W = 5.70$, Act III range $[0.351, 0.649]$ (span $0.298$). Steps at $0.412, 0.588$.
- **$N = 4$**: $W = 6.70$, Act III range $[0.299, 0.701]$ (span $0.403$). Steps at $0.351, 0.450, 0.550, 0.649$.
- **$N = 5$**: $W = 7.20$, Act III range $[0.278, 0.722]$ (span $0.444$). Steps at $0.326, 0.413, 0.500, 0.587, 0.674$.
- **$N = 10$**: $W = 9.70$, Act III range $[0.206, 0.794]$ (span $0.588$). 10 steps from $0.242 \to 0.758$.

---

### 4. Verification Suite Results

Automated browser CDP testing (`scripts/test-finite-3d-exhibition.mjs`) confirmed complete operational reliability:

```json
{
  "projectSteps": [
    { "index": 0, "title": "MediConnect" },
    { "index": 1, "title": "Smart Class" },
    { "index": 2, "title": "NEXFORM" },
    { "index": 3, "title": "LinguaMate" }
  ],
  "finiteBounds": true,
  "act3VideoHold": true,
  "galleryModal": true,
  "detailModal": true,
  "responsive": true
}
```

- **Act III Video Hold**: At scroll progress $0.351$, $0.450$, $0.550$, and $0.649$, `currentTime = 3.750s` with zero frame drift.
- **Finite Bounds**: Project 0 rendered with only next neighbor; Project 3 rendered with only previous neighbor (zero circular wrap).
- **Modal Containment**: Dialogs rendered at `z-[100]`, locked body overflow and Lenis, advanced slides on click/arrow, and closed on Escape.
- **Dynamic 5th Project**: Verified dynamic insertion, runway re-weighting ($W = 7.20$), and captured `act3-dynamic-5th-project.png` (`stepIndicator: '05/05'`).

---

### 5. Media & Artifact Inventory

#### A. Browser Screen Recordings (`public/recordings/` & brain artifact directory)
1. **[act3-project-switching.mp4](file:///c:/Users/MSI/Desktop/DEV/portfolio/public/recordings/act3-project-switching.mp4)** ($0.97\text{ MB}$): High-definition capture of the 3D curved exhibition carousel, stepping through all 4 projects, opening the Lightbox Modal, navigating slides, opening the Architecture Spec, and transitioning cleanly to Act IV.
2. **[complete-experience-continuous.mp4](file:///c:/Users/MSI/Desktop/DEV/portfolio/public/recordings/complete-experience-continuous.mp4)** ($3.85\text{ MB}$): Continuous master playthrough from initial Act I typing idle, through Journey, Selected Work 3D Exhibition, Engineering, and Contact.
3. **[idle-to-scroll-handoff.mp4](file:///c:/Users/MSI/Desktop/DEV/portfolio/public/recordings/idle-to-scroll-handoff.mp4)** ($1.45\text{ MB}$): The exact moment scrolling begins and idle loop hands control to scrub video.
4. **[act1-idle-loop-30s.mp4](file:///c:/Users/MSI/Desktop/DEV/portfolio/public/recordings/act1-idle-loop-30s.mp4)** ($1.48\text{ MB}$): 30+ seconds of autonomous forward typing idle loop.
5. **[slow-scroll-five-acts.mp4](file:///c:/Users/MSI/Desktop/DEV/portfolio/public/recordings/slow-scroll-five-acts.mp4)** ($4.64\text{ MB}$): Slow deliberate scrub through all five acts.
6. **[fast-scroll-and-reverse.mp4](file:///c:/Users/MSI/Desktop/DEV/portfolio/public/recordings/fast-scroll-and-reverse.mp4)** ($3.98\text{ MB}$): Fast scroll to footer and reverse scrub back to origin idle.

#### B. Visual Screenshots (`public/screenshots/` & brain artifact directory)
- **3D Carousel Project 1 (MediConnect)**: [act3-3d-carousel-project1.png](file:///c:/Users/MSI/Desktop/DEV/portfolio/public/screenshots/act3-3d-carousel-project1.png)
- **3D Carousel Project 2 (Smart Class)**: [act3-3d-carousel-project2.png](file:///c:/Users/MSI/Desktop/DEV/portfolio/public/screenshots/act3-3d-carousel-project2.png)
- **3D Carousel Project 3 (NEXFORM)**: [act3-3d-carousel-project3.png](file:///c:/Users/MSI/Desktop/DEV/portfolio/public/screenshots/act3-3d-carousel-project3.png)
- **3D Carousel Project 4 (LinguaMate)**: [act3-3d-carousel-project4.png](file:///c:/Users/MSI/Desktop/DEV/portfolio/public/screenshots/act3-3d-carousel-project4.png)
- **3D Curved Perspective Arc View**: [act3-3d-carousel-perspective-arc.png](file:///c:/Users/MSI/Desktop/DEV/portfolio/public/screenshots/act3-3d-carousel-perspective-arc.png)
- **Dynamic 5th Project Test State**: [act3-dynamic-5th-project.png](file:///c:/Users/MSI/Desktop/DEV/portfolio/public/screenshots/act3-dynamic-5th-project.png)
- **Lightbox Gallery Modal Opened**: [act3-gallery-modal-opened.png](file:///c:/Users/MSI/Desktop/DEV/portfolio/public/screenshots/act3-gallery-modal-opened.png)
- **Lightbox Gallery Modal Slide 2**: [act3-gallery-modal-interacted.png](file:///c:/Users/MSI/Desktop/DEV/portfolio/public/screenshots/act3-gallery-modal-interacted.png)
- **Architecture Spec Modal Opened**: [act3-architecture-modal-opened.png](file:///c:/Users/MSI/Desktop/DEV/portfolio/public/screenshots/act3-architecture-modal-opened.png)
- **Exhibition Outro Transition**: [act3-to-act4-transition.png](file:///c:/Users/MSI/Desktop/DEV/portfolio/public/screenshots/act3-to-act4-transition.png)
- **Desktop 1920×1080**: [responsive-desktop-1920x1080.png](file:///c:/Users/MSI/Desktop/DEV/portfolio/public/screenshots/responsive-desktop-1920x1080.png)
- **Desktop Compact 1440×900**: [responsive-desktop-1440x900.png](file:///c:/Users/MSI/Desktop/DEV/portfolio/public/screenshots/responsive-desktop-1440x900.png)
- **Tablet iPad 768×1024**: [responsive-tablet-768x1024.png](file:///c:/Users/MSI/Desktop/DEV/portfolio/public/screenshots/responsive-tablet-768x1024.png)
- **Mobile iPhone 16 Pro Max 430×932**: [responsive-mobile-430x932.png](file:///c:/Users/MSI/Desktop/DEV/portfolio/public/screenshots/responsive-mobile-430x932.png)
- **Mobile iPhone 14 390×844**: [responsive-mobile-390x844.png](file:///c:/Users/MSI/Desktop/DEV/portfolio/public/screenshots/responsive-mobile-390x844.png)

---

### 6. Engineering Verification Protocol

1. **Strict TypeScript Compilation**:
   - `npx tsc --noEmit` exited with code `0` (zero errors).
2. **ESLint Verification**:
   - `npm run lint` exited with code `0` (zero errors, zero warnings).
3. **Turbopack Production Build**:
   - `npm run build` compiled cleanly in 1458ms with 8 static pages prerendered.

