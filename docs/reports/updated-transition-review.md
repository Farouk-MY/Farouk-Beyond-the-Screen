# UPDATED ACT BOUNDARY & TRANSITION REVIEW
## FAROUK — BEYOND THE SCREEN
**Document Version:** 2.0 (Engineering Repair & Visual Calibration)  
**Date:** November 2026  
**Engineering Baseline:** Standalone Cinematic Production Release

---

### 1. Executive Summary

A critical visual re-evaluation of the five AI-generated footage acts was conducted to replace naive mathematical continuity scores (previously reported as 92%–96%) with an honest, frame-by-frame structural and compositional audit. 

The source videos are fixed 1280 × 720, 24 FPS, 10.0-second Intra-only MP4 files. Because re-generation of the footage was strictly forbidden, the transition engine was engineered to eliminate frozen incoming frames, avoid artificial dissolves that mask mismatched geometry, and apply art-directed, boundary-specific architectural cuts.

---

### 2. Boundary Analysis & Transition Strategies

#### Boundary 1: Act I $\to$ Act II (The Studio Exit $\to$ The Terrace Threshold)
* **Outgoing Composition (Act I, $t = 9.8\text{s} - 10.0\text{s}$):**
  * Interior camera angle in the studio.
  * Farouk is standing on the right ($x \approx 0.66, y \approx 0.18, w \approx 0.20, h \approx 0.80$), reaching his right hand forward to grip the bronze sliding door handle.
* **Incoming Composition (Act II, $t = 0.0\text{s} - 0.2\text{s}$):**
  * Exterior camera angle on the sunlit terrace, looking slightly over Farouk's right shoulder as he slides the door open and steps onto the stone floor ($x \approx 0.58, y \approx 0.22, w \approx 0.22, h \approx 0.76$).
* **Compositional Difference:**
  * Perspective shift from interior side-profile to exterior third-person tracking.
* **Calibrated Strategy:** **Short Architectural Crossfade (`short-crossfade`)**
  * **Global Scroll Window:** $S \in [0.188, 0.212]$ ($\Delta S = 0.024$, ~12svh of travel).
  * **Dynamic Progression:** Outgoing Act I completes hand contact on handle ($9.8\text{s} \to 10.0\text{s}$) while Act II advances its first 6 frames ($0.0\text{s} \to 0.25\text{s}$). Neither video is frozen.
  * **Visual Effect:** Simulates a camera cut through the glass door frame from interior to exterior.

---

#### Boundary 2: Act II $\to$ Act III (The Terrace Promenade $\to$ The Digital Gallery)
* **Outgoing Composition (Act II, $t = 9.8\text{s} - 10.0\text{s}$):**
  * Farouk walking along the stone terrace promenade, approaching the doorway of the modernist exhibition pavilion ($x \approx 0.48, y \approx 0.27$).
* **Incoming Composition (Act III, $t = 0.0\text{s} - 0.2\text{s}$):**
  * Interior exhibition hall looking toward the entrance threshold as Farouk steps through the door and turns toward the exhibition wall ($x \approx 0.45, y \approx 0.23$).
* **Compositional Difference:**
  * Outdoor sunlit limestone terrace transitions to shaded, recessed cove-lit gallery interior.
* **Calibrated Strategy:** **Direct Architectural Cut (`architectural-cut`)**
  * **Global Scroll Window:** $S \in [0.390, 0.410]$ ($\Delta S = 0.020$, ~10svh of travel).
  * **Dynamic Progression:** Rapid, crisp threshold cut. Act II reaches the pavilion threshold and cuts cleanly as Farouk steps across the interior floor slab.
  * **Visual Effect:** Feels like an intentional cinematic shot cut entering a new architectural pavilion.

---

#### Boundary 3: Act III $\to$ Act IV (The Digital Gallery $\to$ The Systems Lab)
* **Outgoing Composition (Act III, $t = 9.8\text{s} - 10.0\text{s}$):**
  * Farouk standing on the right ($x \approx 0.73$) observing the 3D controller customization display on the digital exhibition wall.
* **Incoming Composition (Act IV, $t = 0.0\text{s} - 0.2\text{s}$):**
  * Farouk entering the systems observatory through the corridor entrance on the left ($x \approx 0.24, y \approx 0.14$).
* **Compositional Difference:**
  * Character position shifts from exhibition wall on right to corridor entrance on left.
* **Calibrated Strategy:** **Corridor Dissolve (`corridor-dissolve`)**
  * **Global Scroll Window:** $S \in [0.588, 0.612]$ ($\Delta S = 0.024$, ~12svh of travel).
  * **Dynamic Progression:** Outgoing Act III finishes viewing display wall and fades out cleanly as Act IV starts walking from the doorway toward the circular console pedestal.
  * **Visual Effect:** Represents traversing the connecting corridor between the exhibition gallery and the technological observatory.

---

#### Boundary 4: Act IV $\to$ Act V (The Systems Lab $\to$ The Sunset Balcony)
* **Outgoing Composition (Act IV, $t = 9.8\text{s} - 10.0\text{s}$):**
  * Farouk turns away from the circular holographic table and steps toward the panoramic balcony window on the left ($x \approx 0.35, y \approx 0.20$).
* **Incoming Composition (Act V, $t = 0.0\text{s} - 0.2\text{s}$):**
  * Farouk steps through the open glass door onto the sunset balcony terrace overlooking the ocean ($x \approx 0.55, y \approx 0.15$).
* **Compositional Difference:**
  * Interior technological lab with travertine stone transitions to open-air coastal balcony bathed in golden sunset light.
* **Calibrated Strategy:** **Balcony Dissolve (`balcony-dissolve`)**
  * **Global Scroll Window:** $S \in [0.788, 0.812]$ ($\Delta S = 0.024$, ~12svh of travel).
  * **Dynamic Progression:** Outgoing Act IV character approaches the glass door while Act V character immediately steps through onto the stone terrace.
  * **Visual Effect:** Natural continuation of the character's movement toward the coastal horizon.

---

### 3. Elimination of Frozen Frames

In the previous implementation, the transition logic held incoming clips frozen on their very first frame ($t = 0.0\text{s}$) while the outgoing clip faded out. This resulted in an unnatural frozen image artifact.

In the repaired engine (`computeActOpacitiesAndTimes`):
1. **Bidirectional Temporal Progression:** During the transition window $[S_{\text{boundary}} - \delta, S_{\text{boundary}} + \delta]$, both videos actively advance their `currentTime` according to local scroll progress:
   $$\text{localTime}_{\text{out}} = 10.0 \times \frac{S - S_{\text{start,out}}}{S_{\text{end,out}} - S_{\text{start,out}}}$$
   $$\text{localTime}_{\text{in}} = 10.0 \times \frac{S - S_{\text{start,in}}}{S_{\text{end,in}} - S_{\text{start,in}}}$$
2. **True Seek Coalescing:** The seek queue ensures that frames are decoded and presented without lag or stutter during scrubbing.
3. **Zero Frozen Frames:** At the exact boundary midpoint ($S = S_{\text{boundary}}$), the outgoing video is at frame 239 ($9.96\text{s}$) and the incoming video is at frame 0 ($0.0\text{s}$), advancing smoothly frame-by-frame forward or backward.

---

### 4. Remaining Limitations Disclosed Honestly

* **Camera Geometry Variation:** Because the five acts were generated with separate camera trajectories, slight variations in focal length, lighting temperature, and room height exist between scenes.
* **Character Costume Consistency:** Farouk's clothing (black turtleneck, red-and-black Buffalo plaid overshirt, dark denim) is consistent across all acts, but small fabric fold variations reflect separate video generations.
* **No Video Recompression Artifacts:** Source video assets remain bit-for-bit untouched in their original 1280 × 720 resolution.

