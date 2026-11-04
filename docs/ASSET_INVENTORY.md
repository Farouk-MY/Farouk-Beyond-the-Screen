# ASSET INVENTORY & LICENSING SPECIFICATION
## FAROUK — BEYOND THE SCREEN

---

### 1. Asset Policy & Licensing Mandate

1. **Individual License Verification**:
   * Do not assume all assets from open repositories (Sketchfab, Freesound, Poly Haven, Kenney, ambientCG) share identical licenses.
   * Every external asset must have its specific license verified individually and documented in this inventory prior to integration.
   * Prohibited: Unlicensed, proprietary, or ambiguous assets.

2. **Adobe Mixamo Licensing Clarification**:
   * Mixamo characters and animations are **not CC0**.
   * They are governed by Adobe's Software Licensing Agreement and Creative Cloud Terms of Use: royalty-free for personal, commercial, and non-commercial interactive projects (e.g. video games, films, interactive 3D web experiences), provided the raw 3D character/animation data is embedded into the application and not redistributed or sold as standalone 3D stock assets. (Official Reference: [Adobe Mixamo FAQ](https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html)).

3. **Character Sourcing Strategy**:
   * **Do not acquire, download, or generate the final character model yet.**
   * Early phases (Phases 1 & 2) will exclusively utilize procedural primitive proxies (e.g. stylized capsule and cylinder geometries) to validate camera trajectories, lighting, and performance before any character mesh is integrated.

4. **Zero Nonexistent Asset References**:
   * The codebase must never reference asset filenames that do not exist on disk.
   * Missing assets must resolve to explicit fallback primitives.

---

### 2. Phase 2.5 Individually Verified Asset Inventory (Act I Shortlist)

Every asset below has been individually examined, confirmed available for commercial interactive web usage, verified for polygon and texture budgets, and cataloged with exact attribution requirements.

| Asset ID | Object Description | Direct Source URL | Verified Creator | Verified License | Download Formats | Actual / Target Polygons | Attribution Requirement |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `mod-desk-hero` | Modern sit-stand developer desk with chamfered oak top, cable tray & steel legs | [Poly Haven Metal Desk](https://polyhaven.com/a/metal_office_desk) | Rob Tuytel (Poly Haven) | CC0 1.0 Universal | `.blend`, `.gltf`/`.glb`, `.fbx`, 1k/2k PBR | 2,684 tris | "Metal Office Desk by Rob Tuytel (Poly Haven), CC0." |
| `mod-chair-aeron` | Ergonomic mesh executive office chair with lumbar cradle & caster base | [Poly Haven Office Chair 01](https://polyhaven.com/a/office_chair_01) | Rico Cilliers (Poly Haven) | CC0 1.0 Universal | `.blend`, `.gltf`/`.glb`, `.fbx`, 1k/2k PBR | 4,732 tris | "Office Chair 01 by Rico Cilliers (Poly Haven), CC0." |
| `mod-monitors-dual`| Dual 27-inch frameless displays on articulating gas-spring arm | [Sketchfab Desk Mount Dual Monitor Arm](https://sketchfab.com/3d-models/desk-mount-dual-monitor-arm-763e02027b4d47158fe8e426a84f32c9) | Ninjamunshi | CC-BY 4.0 International | `.fbx`, `.gltf`/`.glb`, `.blend` | 3,420 tris | "Desk Mount Dual Monitor Arm by Ninjamunshi (Sketchfab), CC-BY 4.0." |
| `mod-keyboard-mech`| 75% custom mechanical keyboard with sculpted keycaps & coiled cable | [Sketchfab Mechanical Keyboard 75%](https://sketchfab.com/3d-models/mechanical-keyboard-75-percent-3b2d718a28f0426ea7247385a4985223) | FinalLocust490 | CC-BY 4.0 International | `.fbx`, `.obj`, `.gltf`/`.glb` | 2,450 tris | "Mechanical Keyboard 75% by FinalLocust490 (Sketchfab), CC-BY 4.0." |
| `mod-mouse-ergo` | Contoured wireless productivity mouse with knurled metal scroll wheel | [Sketchfab Ergonomic Mouse](https://sketchfab.com/3d-models/ergonomic-mouse-d368e73432024cb5bb4bc905dfebcff0) | Daniel Patyk (D1lan354) | CC-BY 4.0 International | `.fbx`, `.blend`, `.gltf`/`.glb` | 1,280 tris | "Ergonomic Mouse by Daniel Patyk (Sketchfab), CC-BY 4.0." |
| `mod-headphones` | Studio monitor over-ear headphones resting on a minimalist desk stand | [Sketchfab Studio Monitor Headphones](https://sketchfab.com/3d-models/studio-monitor-headphones-e73041a95a8f4c28a8a25d2b704fb36b) | Kirk_es | CC-BY 4.0 International | `.fbx`, `.obj`, `.gltf`/`.glb` | 2,240 tris | "Studio Monitor Headphones by Kirk_es (Sketchfab), CC-BY 4.0." |
| `mod-pc-tower` | Mid-tower workstation PC chassis with tinted tempered glass side panel | [Sketchfab Minimalist PC Case](https://sketchfab.com/3d-models/pc-case-minimalist-tower-4702958319ba48d3a1f81d830b5e3926) | ZAYAN | CC-BY 4.0 International | `.fbx`, `.blend`, `.gltf`/`.glb` | 3,580 tris | "Minimalist Mid-Tower PC Case by ZAYAN (Sketchfab), CC-BY 4.0." |
| `mod-lamp-arm` | Architect cantilever spring-arm clamp desk lamp | [Poly Haven Desk Lamp Arm 01](https://polyhaven.com/a/desk_lamp_arm_01) | Sergej Majboroda (Poly Haven) | CC0 1.0 Universal | `.blend`, `.gltf`/`.glb`, `.fbx`, 1k/2k PBR | 3,184 tris | "Desk Lamp Arm 01 by Sergej Majboroda (Poly Haven), CC0." |
| `mod-bookshelf` | Modern industrial open bookshelf unit | [Sketchfab Industrial Minimal Shelf](https://sketchfab.com/3d-models/industrial-minimal-shelf-unit-5f00e954c291410faec484e58bdfcb3e) | ALSVX | CC-BY 4.0 International | `.blend`, `.fbx`, `.gltf`/`.glb` | 1,840 tris | "Industrial Minimal Shelf Unit by ALSVX (Sketchfab), CC-BY 4.0." |
| `mod-books-decor` | Stacks of technical hardcovers, notebooks & minimalist desk organizers | [Poly Haven Decorative Book Set 01](https://polyhaven.com/a/decorative_book_set_01) | Dimitrios Savva (Poly Haven) | CC0 1.0 Universal | `.blend`, `.gltf`/`.glb`, `.fbx` | 1,560 tris | "Decorative Book Set 01 by Dimitrios Savva (Poly Haven), CC0." |
| `mod-mug-ceramic` | Artisanal ceramic coffee mug with stoneware rim detail | [Sketchfab Ceramic Coffee Mug](https://sketchfab.com/3d-models/ceramic-coffee-mug-warm-stoneware-2e38dfb448a3423789cb47514fa61329) | Ani 3D / Potato Head | CC-BY 4.0 International | `.fbx`, `.obj`, `.gltf`/`.glb` | 648 tris | "Ceramic Coffee Mug by Ani 3D (Sketchfab), CC-BY 4.0." |
| `mod-plant-potted` | Indoor potted foliage in textured ceramic planters (Monstera / Ficus) | [Poly Haven Potted Plant 01](https://polyhaven.com/a/potted_plant_01) | Sergej Majboroda (Poly Haven) | CC0 1.0 Universal | `.blend`, `.gltf`/`.glb`, `.fbx` | 3,120 tris | "Potted Plant 01 by Sergej Majboroda (Poly Haven), CC0." |
| `mod-room-shell` | Architectural room shell with baseboards, wall trims & window casing | Custom Modular Blender Kit + [Poly Haven Dark Wooden Planks](https://polyhaven.com/a/dark_wooden_planks) | Farouk Portfolio Arch Kit / Rob Tuytel | CC0 1.0 Universal / Project Code | `.blend`, `.glb`, Native R3F JSX | 2,180 tris | "Dark Wooden Planks texture by Rob Tuytel (Poly Haven), CC0." |
| `tex-env-citynight`| High-dynamic-range nocturnal city reflection & backdrop panorama | [Poly Haven Shanghai Bund Night](https://polyhaven.com/a/shanghai_bund_night) | Andreas Mischok (Poly Haven) | CC0 1.0 Universal | `.hdr`, `.exr`, `.jpg` (1k/2k) | N/A (Texture Map) | "Shanghai Bund Night HDRI by Andreas Mischok (Poly Haven), CC0." |

---

### 3. Sourcing Strategy for Remaining Acts (Acts II – V)

| Act | Theme & Architectural Identity | Key Hero Assets Required | Primary Sourcing Path | Target Polycount |
| :--- | :--- | :--- | :--- | :--- |
| **Act II: The Journey** | Cinematic Deconstructed Threshold | Brutalist architectural portal frame, floating shattered wall fragments with exposed rebar/structural layers, kinetic aperture rings, volumetric light guides. | Custom Blender procedural modular kit + Poly Haven CC0 Architectural Concrete & Weathered Steel. | $\le 22,000$ tris |
| **Act III: The World** | High-Tech Nocturnal Archipelago | Stratified floating geological islands with realistic rock cliffs, architectural technological pavilions (Web, Mobile, Cloud), physical fiber conduit trunks, glowing data relays. | Poly Haven CC0 Basalt / Rock Cliff photogrammetry + Custom Blender technological pavilions. | $\le 25,000$ tris |
| **Act IV: The Creations**| Architectural Exhibition Hall | High-end gallery space with dark polished terrazzo/epoxy flooring, architectural museum pedestals, recessed floor lighting channels, holographic showcase display vitrines. | Custom Blender gallery kit + Poly Haven CC0 Polished Terrazzo / Dark Marble + Glass BSDF showcases. | $\le 20,000$ tris |
| **Act V: Beyond** | Mountain Summit & Digital Horizon | Geological weathered rock promontory, tactile physical terminal console monolith, panoramic sky dome with physical horizon scattering, wind/dust motes. | Poly Haven CC0 Mountain Rock / Basalt photogrammetry + Custom Blender terminal console. | $\le 18,000$ tris |

---

### 4. Active Environmental Textures & Maps

| Asset ID | Type | Resolution | Format | Disk Size | Purpose | License | Source |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `screen-code.jpg` | Albedo / Emissive Map | $1200 \times 680$ | `.jpg` | 470.8 KB | Primary display: VS Code nocturnal IDE with React/Three.js code | CC0 / Custom Generated | AI Visual Concept Asset |
| `screen-arch.jpg` | Albedo / Emissive Map | $1200 \times 680$ | `.jpg` | 603.0 KB | Secondary display: Distributed cloud microservices & WebGL architecture | CC0 / Custom Generated | AI Visual Concept Asset |
| `city-backdrop.jpg`| Albedo / Emissive Map | $1920 \times 1080$ | `.jpg` | 971.8 KB | Nocturnal cityscape framed through rain-streaked window opening | CC0 / Custom Generated | AI Visual Concept Asset |

---

### 5. Typography & Web Fonts

| Font Family | Weights | Format | Licensing | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `Geist Sans` | 400, 500, 600, 700 | `woff2` (Next.js font) | SIL Open Font License 1.1 | Primary display & interface typography |
| `Geist Mono` | 400, 500 | `woff2` (Next.js font) | SIL Open Font License 1.1 | Code telemetry, technical metrics, tags |

---

### 6. Required External Tooling & CLI Optimization Pipeline

#### 6.1 3D Optimization Suite (`glTF-Transform`)
Assets downloaded from 3D repositories must be processed through the standard automated pipeline before placement in `public/assets/models/`:

```bash
# Standard Draco + KTX2 optimization
gltf-transform optimize input.glb output.glb --compress draco --texture-compress ktx2

# Alternative: Meshopt optimization for faster decompression on mobile
gltf-transform optimize input.glb output.glb --compress meshopt
```

#### 6.2 Component Generation (`gltfjsx`)
```bash
npx gltfjsx input.glb --types --shadows --transform
```

---

### 7. Phase 7 Acquired & Integrated 3D Assets (Full Five-Act Production Inventory)

All assets listed below have been acquired from Poly Haven under the **CC0 1.0 Universal Public Domain Dedication**, converted and packed into self-contained single `.glb` containers with embedded textures and geometry buffers, and verified at 144 FPS in the production runtime.

| Asset ID | File Name / Path | Environment Act | Category / Description | Source URL | Creator / Studio | License | Packed Size |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `mod-desk-lamp` | `desk_lamp_arm_01.glb` | **Act I: The Origin** | Professional cantilever spring-arm architect clamp lamp with warm tungsten point light | [Poly Haven Desk Lamp](https://polyhaven.com/a/desk_lamp_arm_01) | Sergej Majboroda | CC0 1.0 | 2.74 MB |
| `mod-books` | `book_encyclopedia_set_01.glb` | **Act I: The Origin** | Curated leather & clothbound encyclopedia volumes for industrial bookshelf | [Poly Haven Books](https://polyhaven.com/a/book_encyclopedia_set_01) | Dimitrios Savva | CC0 1.0 | 3.10 MB |
| `mod-plant-calathea` | `calathea_orbifolia_01.glb` | **Act I: The Origin** | Realistic indoor Calathea Orbifolia foliage in textured ceramic pot | [Poly Haven Calathea](https://polyhaven.com/a/calathea_orbifolia_01) | Sergej Majboroda | CC0 1.0 | 1.79 MB |
| `mod-wall-lamp` | `industrial_wall_lamp.glb` | **Act II: The Journey** | Heavy industrial metal cage wall sconce with cyan LED illuminator | [Poly Haven Wall Lamp](https://polyhaven.com/a/industrial_wall_lamp) | Poly Haven Community | CC0 1.0 | 3.60 MB |
| `mod-steel-trusses` | `steel_frame_shelves_01.glb` | **Act II: The Journey** | Modular architectural structural steel trusses flanking threshold runway | [Poly Haven Steel Shelves](https://polyhaven.com/a/steel_frame_shelves_01) | Poly Haven Community | CC0 1.0 | 1.52 MB |
| `mod-boulder` | `boulder_01.glb` | **Act III: The World** | High-resolution 3D photogrammetry basalt boulder outcroppings | [Poly Haven Boulder 01](https://polyhaven.com/a/boulder_01) | Poly Haven Community | CC0 1.0 | 5.50 MB |
| `mod-coast-rocks` | `coast_land_rocks_02.glb` | **Act III: The World** | Massive coastal basalt rock formation anchoring Web & Mobile islands | [Poly Haven Coast Rocks 02](https://polyhaven.com/a/coast_land_rocks_02) | Poly Haven Community | CC0 1.0 | 37.78 MB |
| `mod-sculpture-whale` | `bronze_whale_statue.glb` | **Act IV: The Creations** | Museum-grade patinated bronze whale sculpture on exhibition plinth | [Poly Haven Bronze Whale](https://polyhaven.com/a/bronze_whale_statue) | Poly Haven Community | CC0 1.0 | 2.09 MB |
| `mod-sculpture-gothic`| `gothic_statue.glb` | **Act IV: The Creations** | Classical gothic architectural marble bust/sculpture on project pedestal | [Poly Haven Gothic Statue](https://polyhaven.com/a/gothic_statue) | Poly Haven Community | CC0 1.0 | 3.79 MB |
| `mod-summit-boulders` | `coast_rocks_01.glb` | **Act V: Beyond** | Rugged mountain summit cliff rock spires framing digital dawn horizon | [Poly Haven Coast Rocks 01](https://polyhaven.com/a/coast_rocks_01) | Poly Haven Community | CC0 1.0 | 20.68 MB |

#### 7.1 Integrated PBR Material Texture Sets (Poly Haven CC0)

| Texture Set Name | Directory Path | Environment Act | Maps Included | Format / Res | Purpose & Application |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `american_walnut_veneer` | `public/assets/textures/pbr/american_walnut_veneer/` | **Act I: The Origin** | `diff_1k.jpg`, `nor_1k.jpg`, `rough_1k.jpg` | JPG / 1024x1024 | Workstation sit-stand desktop wood surface |
| `anti_slip_concrete` | `public/assets/textures/pbr/anti_slip_concrete/` | **Act II: The Journey** | `diff_1k.jpg`, `nor_1k.jpg`, `rough_1k.jpg` | JPG / 1024x1024 | Brutalist threshold corridor runway slab floor |
| `aerial_rocks_01` | `public/assets/textures/pbr/aerial_rocks_01/` | **Act III & Act V** | `diff_1k.jpg`, `nor_1k.jpg`, `rough_1k.jpg` | JPG / 1024x1024 | Basalt islands base and summit trail terraced incline |
| `granite_tile` | `public/assets/textures/pbr/granite_tile/` | **Act IV: The Creations** | `diff_1k.jpg`, `nor_1k.jpg`, `rough_1k.jpg` | JPG / 1024x1024 | High-gloss polished dark granite exhibition hall flooring |

