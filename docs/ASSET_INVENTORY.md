# ASSET INVENTORY & LICENSING SPECIFICATION
## FAROUK — BEYOND THE SCREEN
> **Document Version:** `2.0.0` | **Target Release:** `v1.0.0-rc1`  
> **Status:** Production Release Candidate

---

### 1. Asset Policy & Verification

Every external asset utilized in this portfolio has been individually inspected, confirmed available for interactive web usage, verified for appropriate licensing, and documented below.

---

### 2. Video Footage Assets

Cinematic clips located in `/public/videos/`:

| File Name | Duration | Resolution | Codec | FPS | Purpose | License / Ownership |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `act-01-scrub.mp4` | ~3.0s | $1920 \times 1080$ | H.264 / AAC | 24 | Act I: The Studio workstation scrub | Bespoke production asset for Farouk Messai |
| `act-02-scrub.mp4` | ~3.0s | $1920 \times 1080$ | H.264 / AAC | 24 | Act II: The Journey corridor transition | Bespoke production asset for Farouk Messai |
| `act-03-scrub.mp4` | ~3.0s | $1920 \times 1080$ | H.264 / AAC | 24 | Act III: Selected Work 3D exhibition | Bespoke production asset for Farouk Messai |
| `act-04-scrub.mp4` | ~3.0s | $1920 \times 1080$ | H.264 / AAC | 24 | Act IV: Engineering systems lab scrub | Bespoke production asset for Farouk Messai |
| `act-05-scrub.mp4` | ~3.0s | $1920 \times 1080$ | H.264 / AAC | 24 | Act V: Beyond / Contact coastal terrace | Bespoke production asset for Farouk Messai |
| `new Act1.mp4` | ~5.0s | $1920 \times 1080$ | H.264 / AAC | 24 | Alternative Act I high-fidelity sequence | Bespoke production asset for Farouk Messai |

---

### 3. Typography Assets

| Font Family | Source | Distribution Path | License | Verified Attribution |
| :--- | :--- | :--- | :--- | :--- |
| **Noto Sans Arabic** (Variable) | Google Fonts | `public/FAROUK_REDESIGN_ASSETS/Fonts/Noto_Sans_Arabic/` | SIL Open Font License 1.1 (OFL) | Copyright 2022 The Noto Project Authors |
| **Space Grotesk** | Google Fonts | `next/font/google` | SIL Open Font License 1.1 (OFL) | Florian Karsten |
| **Manrope** | Google Fonts | `next/font/google` | SIL Open Font License 1.1 (OFL) | Mikhail Sharanda |
| **IBM Plex Mono** | Google Fonts | `next/font/google` | SIL Open Font License 1.1 (OFL) | Mike Abbink, Bold Monday |

---

### 4. Audio Architecture (Procedural Sound)

| Sound Profile | Generation Method | Network Size | Latency | License |
| :--- | :--- | :--- | :--- | :--- |
| **Walnut Mechanical Tap** | Filtered square wave + bandpass burst | 0 KB | $\le 1\text{ ms}$ | MIT / CC0 (Custom Synthesized) |
| **Harmonic Pentatonic Chime** | Dual sine oscillators + exponential envelope | 0 KB | $\le 1\text{ ms}$ | MIT / CC0 (Custom Synthesized) |
| **Atmospheric Whoosh** | Modulated pink noise sweep | 0 KB | $\le 1\text{ ms}$ | MIT / CC0 (Custom Synthesized) |
| **Feedback Arpeggio** | Dual-frequency confirmation pulse | 0 KB | $\le 1\text{ ms}$ | MIT / CC0 (Custom Synthesized) |

*Note: No third-party MP3/WAV/OGG sound files are downloaded over the network. The procedural audio engine synthesizes all sound effects on demand via the browser's Web Audio API context.*

---

### 5. Curriculum Vitae Documents

| Document | Format | Location | Size | Generator |
| :--- | :--- | :--- | :--- | :--- |
| **Farouk Messai CV (English)** | Clean PDF | `public/cv/farouk-messai-cv-en.pdf` | 85.6 KB | Edge CDP `Page.printToPDF` |
| **Farouk Messai CV (Arabic)** | Clean PDF | `public/cv/farouk-messai-cv-ar.pdf` | 133.7 KB | Edge CDP `Page.printToPDF` |

---

### 6. Project Visual Assets

| Asset Name | Format | Location | Purpose | License |
| :--- | :--- | :--- | :--- | :--- |
| `act-*-poster.jpg` | High-res JPEG | `public/posters/` | Static poster fallback for video canvas | Bespoke production asset |
| `farouk-avatar.jpg` | JPEG | `public/assets/images/` | Developer avatar image | Personal asset |
| Project Mockups & Diagrams | WebP / SVG | `public/assets/projects/` | Architectural specs & exhibition previews | Bespoke project asset |
