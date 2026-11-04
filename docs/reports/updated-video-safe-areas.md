# UPDATED VIDEO-BASED TEXT SAFE AREAS REPORT
## FAROUK — BEYOND THE SCREEN
**Document Version:** 2.0 (Calibrated Editorial Safe Areas)  
**Date:** November 2026  
**Engineering Baseline:** Standalone Cinematic Production Release

---

### 1. Overview & Methodology

In the previous implementation, text overlays were styled with arbitrary Tailwind max-widths and placed inside variable-height normal-flow DOM sections. This frequently caused typography to collide with Farouk or obscure crucial scene elements such as the digital exhibition display wall in Act III or the circular holographic pedestal in Act IV.

In this revision, safe areas were determined by extracting 24 representative frames per act, plotting Farouk's normalized bounding box $[x, y, w, h]$ over time, and deriving non-intersecting editorial layout corridors.

```
Coordinate System: Normalized Viewport Coordinates
[0.0, 0.0] = Top-Left
[1.0, 1.0] = Bottom-Right
```

---

### 2. Act-by-Act Safe Area Specifications

#### Act I — The Studio (`origin`)
* **Character Motion & Trajectory:**
  * $t \in [0.0\text{s}, 5.0\text{s}]$ ($0\% - 50\%$): Farouk seated at walnut desk typing on mechanical keyboard ($x: 0.42 - 0.64, y: 0.27 - 0.95$).
  * $t \in [5.0\text{s}, 7.0\text{s}]$ ($50\% - 70\%$): Farouk rests hands, stands up from ergonomic chair ($x: 0.45 - 0.65, y: 0.22 - 0.97$).
  * $t \in [7.0\text{s}, 10.0\text{s}]$ ($70\% - 100\%$): Farouk turns right and walks to the sliding glass door ($x: 0.52 \to 0.86, y: 0.18 - 0.98$).
* **Calibrated Safe Area:**
  * **Normalized Position:** $x = 0.06$, $y = 0.10$, $w = 0.40$, $h = 0.50$
  * **Max Content Width:** $560\text{px}$
  * **Art-Directed Visibility Window:** Local progress $[0.00, 0.70]$ ($t = 0.0\text{s} - 7.0\text{s}$). Fades out gracefully as Farouk stands and walks toward the door.
  * **Visual Background Clearance:** Clean upper-left limestone/plaster wall above monitors and desk mat. Zero obstruction of dual displays or character.

---

#### Act II — The Threshold (`journey`)
* **Character Motion & Trajectory:**
  * $t \in [0.0\text{s}, 2.0\text{s}]$ ($0\% - 20\%$): Farouk slides door open and steps onto terrace ($x: 0.58 \to 0.48, y: 0.22 - 0.96$).
  * $t \in [2.0\text{s}, 10.0\text{s}]$ ($20\% - 100\%$): Farouk walks forward along the stone promenade path toward the distant pavilion ($x: 0.48 \pm 0.03, y: 0.26 - 0.96$).
* **Calibrated Safe Area:**
  * **Normalized Position:** $x = 0.08$, $y = 0.16$, $w = 0.42$, $h = 0.65$
  * **Max Content Width:** $580\text{px}$
  * **Art-Directed Visibility Window:** Local progress $[0.05, 0.95]$ ($t = 0.5\text{s} - 9.5\text{s}$).
  * **Visual Background Clearance:** Expansive, serene sunlit limestone facade on the left with natural olive tree foliage shadows. Central stone promenade and panoramic coastal cliffs on the right remain completely visible.

---

#### Act III — The Work (`work`)
* **Character Motion & Trajectory:**
  * $t \in [0.0\text{s}, 2.0\text{s}]$ ($0\% - 20\%$): Farouk steps through the pavilion entrance doorway ($x: 0.45 \to 0.52, y: 0.23 - 0.95$).
  * $t \in [2.0\text{s}, 3.0\text{s}]$ ($20\% - 30\%$): Farouk crosses over to the right of the exhibition wall ($x: 0.52 \to 0.65$).
  * $t \in [3.0\text{s}, 10.0\text{s}]$ ($30\% - 100\%$): Farouk settles on the right side ($x: 0.72 - 0.88, y: 0.25 - 0.97$) admiring the interactive display wall.
* **Exhibition Wall Coordinates:**
  * Display Screen Position: Center-Right ($x \approx 0.38 - 0.70, y \approx 0.22 - 0.78$).
* **Calibrated Safe Area:**
  * **Normalized Position:** $x = 0.06$, $y = 0.12$, $w = 0.38$, $h = 0.78$
  * **Max Content Width:** $560\text{px}$
  * **Art-Directed Visibility Window:** Local progress $[0.10, 0.98]$ ($t = 1.0\text{s} - 9.8\text{s}$).
  * **Visual Background Clearance:** Left architectural corridor and stone pillar. Leaves both the digital exhibition screen and Farouk completely unobstructed.

---

#### Act IV — The Craft (`craft`)
* **Character Motion & Trajectory:**
  * $t \in [0.0\text{s}, 2.0\text{s}]$ ($0\% - 20\%$): Farouk enters from the left doorway ($x: 0.24 \to 0.38, y: 0.14 - 0.98$).
  * $t \in [2.5\text{s}, 7.5\text{s}]$ ($25\% - 75\%$): Farouk stands at the central circular console pedestal on the right ($x: 0.52 \to 0.65, y: 0.28 - 0.96$) activating the 3D system architecture graph.
  * $t \in [8.0\text{s}, 10.0\text{s}]$ ($80\% - 100\%$): Farouk turns back and walks toward the left balcony window ($x: 0.50 \to 0.35, y: 0.20 - 0.98$).
* **Critical Safety Discovery:**
  * **The left side of the frame is NOT safe for the entire 10 seconds!** Farouk enters through the left side and exits through the left side.
* **Calibrated Safe Area:**
  * **Normalized Position:** $x = 0.06$, $y = 0.14$, $w = 0.42$, $h = 0.70$
  * **Max Content Width:** $600\text{px}$
  * **Art-Directed Visibility Window:** Local progress $[0.22, 0.74]$ ($t = 2.2\text{s} - 7.4\text{s}$). The overlay fades in after Farouk reaches the central pedestal and fades out before he walks across the left quadrant to exit.
  * **Visual Background Clearance:** Travertine stone wall opposite the circular holographic table.

---

#### Act V — The Horizon (`beyond`)
* **Character Motion & Trajectory:**
  * $t \in [0.0\text{s}, 3.0\text{s}]$ ($0\% - 30\%$): Farouk steps through the open glass door onto the balcony ($x: 0.55 \to 0.52, y: 0.15 - 0.98$).
  * $t \in [3.0\text{s}, 5.0\text{s}]$ ($30\% - 50\%$): Farouk walks toward the glass balustrade railing on the right ($x: 0.52 \to 0.70, y: 0.25 - 0.96$).
  * $t \in [5.0\text{s}, 10.0\text{s}]$ ($50\% - 100\%$): Farouk rests his hands on the railing gazing out over the sunset ocean ($x: 0.70 - 0.85, y: 0.28 - 0.97$).
* **Calibrated Safe Area:**
  * **Normalized Position:** $x = 0.08$, $y = 0.14$, $w = 0.44$, $h = 0.72$
  * **Max Content Width:** $580\text{px}$
  * **Art-Directed Visibility Window:** Local progress $[0.15, 1.00]$ ($t = 1.5\text{s} - 10.0\text{s}$). Fades in as Farouk moves to the railing on the right.
  * **Visual Background Clearance:** Expansive, open sunset sky and golden sea horizon on the left half of the frame. Exceptional emotional resonance and visual calm for contact actions.

---

### 3. Responsive Safe Area Adjustments

On portrait mobile viewports ($390 \times 844$, $430 \times 932$):
1. **Act-Specific Focal Point Framing:**
   * Desktop uses centered `object-position: 50% 50%`.
   * Mobile dynamically offsets `object-position`:
     * Act I: `55% 50%` (keeps Farouk seated at desk)
     * Act II: `50% 50%` (promenade and ocean)
     * Act III: `65% 50%` (preserves exhibition display wall and character)
     * Act IV: `60% 50%` (circular console table)
     * Act V: `70% 50%` (Farouk at the railing)
2. **Compact Editorial Card Padding:**
   * Mobile overlays use responsive padding (`p-5`, `max-w-md`) with soft backdrop-blur (`bg-[#1C1512]/80 backdrop-blur-md`) ensuring typography remains razor-sharp without obscuring the focal subject.

