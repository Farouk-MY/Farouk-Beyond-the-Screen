# Photo-First Project Gallery Report: Selected Work

**Project:** FAROUK — BEYOND THE SCREEN  
**Subject:** Farouk Messai — Software Developer | Mobile & Web Development  
**Design Phase:** Phase 2 Creative Direction & Photo-First Gallery Rebuild  
**Status:** Completed & Verified  

---

## 1. Executive Summary

This report documents the architectural rebuild of the **Selected Work** showcase (formerly Act III). 

Previously, the project display relied heavily on dense typography, text-heavy description blocks, and lacked imagery or interactive visual proof. The rebuild shifts the showcase to an award-winning, **Photo-First** exhibition format:
1. Every project features a prominent 16:10 visual cover preview and an interactive thumbnail rail.
2. Clicking either the cover image or the "Explore Gallery ↗" prompt launches a dedicated, high-resolution **Lightbox Gallery Modal** with multi-image navigation (`01 / 04`), captions, and keyboard/touch support.
3. The panel is strictly constrained to the left architectural safe area (`max-w-lg lg:max-w-xl`, $w \approx 40-42\%$), ensuring that Farouk and the physical digital exhibition wall in the 3D footage remain completely visible on the right.
4. Until real verified production screenshots are supplied by the owner, honest, high-density SVG architectural specification diagrams (`isPlaceholder: true`) are utilized, strictly complying with the rule against fabricated mockups.

---

## 2. Visual Hierarchy & Safe-Area Architectural Compliance

In Act III of the cinematic footage, Farouk enters an architectural gallery and stands beside a large digital exhibition screen on the right ($x \approx 0.52 - 0.95$). Any centered or wide UI overlay obstructs either the character or the physical exhibition terminal.

### 2.1 Calibrated Left Safe Area
- **Bounding Box:** Positioned at `left-6 md:left-14 lg:left-20`, top `14%`, max-width `max-w-lg lg:max-w-xl` (approximately 40% of viewport width).
- **Backdrop Styling:** `backdrop-blur-xl bg-[#140F0C]/85 border border-[#D4AF37]/20 rounded-2xl p-6 shadow-2xl`.
- **Right Viewport Freedom:** The entire right $58\%$ of the canvas remains unimpeded, allowing the user to watch the character move through the exhibition space and interact with the display wall.

---

## 3. Photo-First Interaction Components

### 3.1 16:10 Visual Cover Container
- Rendered using Next.js `Image` with responsive `fill` and `object-cover`.
- Subtle hover zoom (`scale-[1.02]` with 500ms easing).
- Persistent bottom-right interactive pill: `Explore Gallery ↗` with backdrop blur.
- "ARCHITECTURAL SPEC" indicator badge when `isPlaceholder: true`.

### 3.2 Interactive Thumbnail Strip
- Directly beneath the cover preview, a horizontal thumbnail strip displays all gallery images for the active project.
- Active thumbnail is highlighted with an Ochre Gold ring (`ring-2 ring-[#D4AF37]`).
- Clicking any thumbnail launches the Lightbox Modal directly focused on that image.

### 3.3 Deep Architectural Breakdown Action
- Alongside "Explore Gallery ↗", an intentional secondary CTA "Architecture Details →" opens the comprehensive technical modal (`ProjectDetailModal`), revealing:
  - Full system architecture description
  - Complete technology stack badges
  - Verified performance metrics (e.g. `< 120ms latency`, `60 FPS WebGL`)
  - Verified GitHub source code link (or honest disclaimer if closed-source)

---

## 4. Lightbox Gallery Modal Architecture (`ProjectGalleryModal.tsx`)

The Lightbox Gallery Modal provides an immersive visual inspection experience:

```
┌────────────────────────────────────────────────────────────────────────┐
│ [01 / 03]   MediConnect Pro — Clinical Platform           [ESC] [✕]    │
│                                                                        │
│   [ < ]                 [ HIGH-RESOLUTION IMAGE ]               [ > ]  │
│                                                                        │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ Telehealth WebRTC Session & Real-Time Vital Signs Pipeline          │ │
│ │ Encrypted peer-to-peer data channel architecture.                  │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│                 [thumb 1]   [thumb 2]   [thumb 3]                      │
└────────────────────────────────────────────────────────────────────────┘
```

### Key Modal Capabilities:
1. **Multi-Image Support:** Dynamically renders any number of gallery items defined in `ProjectMedia[]`.
2. **Sequential Pagination:** Prominent counter `01 / 03` in IBM Plex Mono.
3. **Keyboard Controls:** Left Arrow (previous), Right Arrow (next), Escape (close).
4. **Touch & Gesture Support:** Integrated touch swipe gesture detection for mobile and tablet viewports.
5. **Captions & Metadata:** Bottom caption banner displaying the detailed architectural role of each screenshot.
6. **Accessibility:** Focus trap, `aria-modal="true"`, `role="dialog"`, accessible button labels.

---

## 5. Honest Specification Graphics (No Fabricated Mockups)

To strictly uphold persona integrity and prevent misleading representations, honest vector architectural diagrams were designed and rendered for all four projects:

| Project | Asset Key | Visual Architecture Represented |
| :--- | :--- | :--- |
| **MediConnect** | `cover.webp` | Doctor/patient clinical teleconsultation topology |
| | `screen-01.webp` | Multi-role WebRTC & WebSocket session lifecycle |
| | `screen-02.webp` | Real-time vital signs telemetry & Node.js ingest |
| **Smart Class** | `cover.webp` | Unified classroom analytics dashboard overview |
| | `screen-01.webp` | Automated grading & attendance pipeline architecture |
| **NEXFORM** | `cover.webp` | Interactive 3D product configurator & lighting controls |
| | `screen-01.webp` | Dynamic GLSL material pipeline & WebGL state tree |
| **LinguaMate** | `cover.webp` | Mobile language learning lesson & audio visualizer |
| | `screen-01.webp` | Speech-to-text inference pipeline & pronunciation scoring |

---

## 6. Guide: Adding, Updating & Reordering Project Images

The gallery is data-driven and defined in `types/portfolio.ts` and `config/portfolioData.ts`.

### 6.1 Data Schema (`types/portfolio.ts`)
```ts
export interface ProjectMedia {
  src: string;          // Path in /public, e.g. '/projects/my-app/screen-01.webp'
  alt: string;          // Accessible image description
  caption?: string;      // Contextual caption displayed in the lightbox
  width?: number;        // Intrinsic width (optional)
  height?: number;       // Intrinsic height (optional)
  isPlaceholder?: boolean; // Set to false when using real production screenshots
}

export interface ProjectItem {
  id: string;
  name: string;
  categoryLabel: string;
  coverImage?: ProjectMedia;
  galleryImages?: ProjectMedia[];
  // ... other fields
}
```

### 6.2 Step-by-Step Instructions for the Project Owner:
1. **Prepare Real Screenshots:**
   - Capture crisp screenshots of your live mobile or web apps (recommended: 1920×1080 or 1600×1000).
   - Convert to modern WebP format: `cwebp -q 85 input.png -o cover.webp`.
2. **Place Images in `public/projects/<project-id>/`:**
   - E.g. `public/projects/mediconnect/cover.webp`
   - E.g. `public/projects/mediconnect/screen-01.webp`
3. **Update `config/portfolioData.ts`:**
   ```ts
   coverImage: {
     src: '/projects/mediconnect/cover.webp',
     alt: 'MediConnect Live WebRTC Consultation Interface',
     caption: 'Production teleconsultation dashboard running active session',
     isPlaceholder: false, // Set to false!
   },
   galleryImages: [
     {
       src: '/projects/mediconnect/cover.webp',
       alt: 'Overview',
       caption: 'Production teleconsultation dashboard',
       isPlaceholder: false,
     },
     {
       src: '/projects/mediconnect/screen-01.webp',
       alt: 'Patient Medical Records View',
       caption: 'Encrypted patient records management module',
       isPlaceholder: false,
     },
   ],
   ```
4. **Reorder or Add Images:** Simply rearrange or add objects in the `galleryImages` array. The gallery, thumbnail strip, and lightbox counter adapt automatically.

