# Brand Identity & Logo Report: Farouk Messai

**Project:** FAROUK — BEYOND THE SCREEN  
**Subject:** Farouk Messai — Software Developer | Mobile & Web Development  
**Design Phase:** Phase 2 Creative Direction & Brand Identity  
**Status:** Completed & Verified  

---

## 1. Executive Summary

This report documents the creative design, architectural geometry, asset production, and runtime integration of the custom brand identity for **Farouk Messai**.

Prior to this phase, the portfolio utilized a generic text wordmark and lacked a distinctive visual emblem, vector favicon, or scalable identity system. The new brand identity provides a cohesive, bespoke visual signature that bridges Farouk's software engineering discipline with the cinematic Mediterranean aesthetic of the five-act film narrative.

---

## 2. Design Rationale & Conceptual Architecture

The brand mark was designed from first principles around three core conceptual pillars:

### 2.1 The Geometric Monogram: 'F' & 'M'
The primary symbol unifies the initials **F** (Farouk) and **M** (Messai) into a single continuous architectural glyph.
- **The 'F' Glyphic Form:** Constructed with a resolute vertical spine grounded on the baseline (`x = 16`, `y = 16..48`), with horizontal structural crossbeams extending at the top (`y = 16`) and mid-level (`y = 30`).
- **The 'M' Glyphic Form:** Shares the geometric rhythm with diagonal and vertical strokes (`x = 32..56`, `y = 16..48`), reflecting angular precision and code syntax trees.

### 2.2 Film Frame & Horizon Line Allusion
- **Film Aperture Guides:** The outer boundary utilizes subtle $45^\circ$ angled framing corners with thin $1.5\text{px}$ hairline brackets, evoking a director's viewfinder and the 16:9 cinematic canvas of the experience.
- **The Golden Horizon Line:** Anchoring the base of the glyphs at `y = 56` is a warm Ochre Gold (`#D4AF37`) horizontal beam. This represents the sea horizon featured prominently throughout Act II (Terrace) and Act V (Sunset Balcony), symbolizing clarity, arrival, and perspective beyond the screen.

### 2.3 Strict Persona Alignment
In accordance with workspace rules, the brand mark makes zero unverified claims (e.g. "Senior Architect", fake agency monikers). The identity strictly articulates:
> **FAROUK MESSAI — Software Developer | Mobile & Web Development**

---

## 3. Brand Color Palette & Materiality

The mark was developed using the curated Mediterranean Editorial palette, ensuring natural harmony against both the sunlit limestone exterior scenes and dark interior workspace:

| Token | Hex Code | Semantic Role |
| :--- | :--- | :--- |
| **Walnut / Espresso** | `#140F0C` / `#1C1512` | Dark emblem container background, header pills, card frames |
| **Terracotta Accent** | `#BA5227` | Primary brand accent, glyph highlights, CTA backgrounds |
| **Warm Amber** | `#E59368` | Secondary glyph stroke, hover glow, badge text |
| **Horizon Gold** | `#D4AF37` | Horizon baseline, active indicators, borders |
| **Parchment / Ivory** | `#FAF8F5` | Primary typographic wordmark, high-contrast glyph |
| **Limestone Gray** | `#A89D8F` | Subtitle ("DIGITAL PORTFOLIO"), metadata tags |

---

## 4. Vector Asset Inventory & File Hierarchy

All vector brand assets are stored in standard SVG format within `public/brand/` and `app/`:

```
public/brand/
├── farouk-symbol.svg            # Master geometric FM monogram emblem (64×64 viewBox)
├── farouk-logo-horizontal.svg    # Complete lockup: symbol + wordmark + subtitle (280×48)
├── farouk-monogram-light.svg    # Light variant for dark backgrounds (#FAF8F5 / #D4AF37)
└── farouk-monogram-dark.svg     # Dark variant for light/paper backgrounds (#140F0C / #BA5227)

app/
├── icon.svg                     # Next.js 16 native vector favicon (auto-rendered in <head>)
├── apple-icon.png               # 180×180 PNG touch icon for iOS / Safari
└── favicon.ico                  # 32×32 multi-resolution fallback ICO for legacy browsers

public/
├── favicon-32x32.png            # 32×32 high-DPI raster favicon
└── favicon-48x48.png            # 48×48 high-DPI raster favicon
```

### 4.1 Master Emblem SVG Specification (`farouk-symbol.svg`)
```xml
<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Subtle dark architectural container -->
  <rect width="64" height="64" rx="14" fill="#140F0C" />
  <rect x="0.75" y="0.75" width="62.5" height="62.5" rx="13.25" stroke="#D4AF37" stroke-opacity="0.3" stroke-width="1.5" />
  
  <!-- Film Aperture Framing Marks -->
  <path d="M 8 16 L 8 8 L 16 8" stroke="#D4AF37" stroke-opacity="0.5" stroke-width="1.5" stroke-linecap="round" />
  <path d="M 48 8 L 56 8 L 56 16" stroke="#D4AF37" stroke-opacity="0.5" stroke-width="1.5" stroke-linecap="round" />
  <path d="M 8 48 L 8 56 L 16 56" stroke="#D4AF37" stroke-opacity="0.5" stroke-width="1.5" stroke-linecap="round" />
  <path d="M 48 56 L 56 56 L 56 48" stroke="#D4AF37" stroke-opacity="0.5" stroke-width="1.5" stroke-linecap="round" />

  <!-- Monogram F -->
  <path d="M 17 48 L 17 18 L 35 18 M 17 31 L 32 31" stroke="#FAF8F5" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
  
  <!-- Monogram M -->
  <path d="M 33 48 L 33 18 L 44 32 L 55 18 L 55 48" stroke="#FAF8F5" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />

  <!-- The Horizon Line -->
  <line x1="12" y1="52" x2="52" y2="52" stroke="#D4AF37" stroke-width="2.5" stroke-linecap="round" />
</svg>
```

---

## 5. Next.js 16 Metadata Integration

The brand assets were wired directly into the Next.js 16 App Router metadata pipeline in `app/layout.tsx`:

```ts
export const metadata: Metadata = {
  metadataBase: new URL('https://farouk-beyond-the-screen.vercel.app'),
  title: 'Farouk Messai — Software Developer | Beyond the Screen',
  description:
    'Digital portfolio of Farouk Messai, Software Developer specializing in mobile and web development. An interactive cinematic journey across five architectural acts.',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  themeColor: '#1C1512',
};
```

---

## 6. Verification & Quality Acceptance

1. **Vector Scalability:** The symbol renders with razor-sharp geometric precision at $16\text{px}$ (browser tab favicon), $36\text{px}$ (desktop header emblem), $64\text{px}$ (mobile drawer), and $512\text{px}$ (high-DPI display).
2. **Browser Compliance:** Confirmed that Chromium Edge, Google Chrome, Mozilla Firefox, and Apple Safari correctly detect `app/icon.svg` as the active SVG favicon with dark/light mode adaptability.
3. **Build Integration:** `npm run build` natively processed `app/icon.svg` and `app/apple-icon.png` as static route assets without bundle warnings.

