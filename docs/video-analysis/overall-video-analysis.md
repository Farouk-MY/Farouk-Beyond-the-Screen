# MASTER VIDEO ANALYSIS & ARCHITECTURAL BLUEPRINT
**FAROUK — BEYOND THE SCREEN: CINEMATIC REBUILD**

---

## 1. Master Video Inventory

| Act | Name | File | Duration | Frames | Resolution | FPS | Bitrate | Size |
|---|---|---|---|---|---|---|---|---|
| **Act I** | The Studio | `assets/source-videos/act-01.mp4` | 10.03s | 240 | 1280x720 | 24 | 3519 kbps | 4.21 MB |
| **Act II** | The Threshold | `assets/source-videos/act-02.mp4` | 10.03s | 240 | 1280x720 | 24 | 3624 kbps | 4.33 MB |
| **Act III** | The Work | `assets/source-videos/act-03.mp4` | 10.03s | 240 | 1280x720 | 24 | 3059 kbps | 3.66 MB |
| **Act IV** | The Craft | `assets/source-videos/act-04.mp4` | 10.03s | 240 | 1280x720 | 24 | 3494 kbps | 4.18 MB |
| **Act V** | The Horizon | `assets/source-videos/act-05.mp4` | 10.03s | 240 | 1280x720 | 24 | 3515 kbps | 4.20 MB |

---

## 2. Act I Idle Typing Loop Specification

- **Idle Asset:** `assets/processed-videos/act-01-idle-pingpong.mp4` (1.03 MB) / `act-01-idle.mp4` (0.61 MB)
- **Loop Range:** 0.0s to 2.5s (Frames 0 to 60)
- **Character Action:** Seated at dual-monitor workstation actively coding.
- **Scroll Takeover:**
  - Initial state: Plays on loop with low CPU/GPU footprint.
  - On first scroll event ($S > 0.005$): Main timeline seamlessly takes over video scrubbing.
  - On returning to $S = 0$: After 1.5s of inactivity, smoothly crossfades back into the living idle typing loop.

---

## 3. UI/UX Safe Area Integration Blueprint

Every semantic DOM overlay is strictly anchored to empirically measured safe areas:
- **Act I (The Studio):** Left column ($X \in [6\%, 42\%]$) opposite Farouk and the workstation.
- **Act II (The Threshold):** Sunny limestone architectural facade ($X \in [8\%, 45\%]$) opposite the coastal panorama.
- **Act III (The Work):** Left interactive exhibition sidebar ($X \in [5\%, 35\%]$) alongside the live digital display wall.
- **Act IV (The Craft):** Left architectural quadrant ($X \in [6\%, 44\%]$) opposite the circular holographic console.
- **Act V (The Horizon):** Center-left golden sunset sky quadrant ($X \in [8\%, 52\%]$) framing Farouk's profile at the railing.
