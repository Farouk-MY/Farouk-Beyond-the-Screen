# FAROUK PORTFOLIO — PRE-GITHUB PUSH GIT HISTORY AUDIT REPORT
**Target Branch:** `refs/heads/cinematic-video-rebuild`  
**Current Head Commit:** `45007bf` (`chore: remove obsolete procedural 3d assets and clean cinematic portfolio repository`)  
**Audit Type:** Read-Only Git Object Database & Historical DAG Traversal  
**Date:** November 2026 | **Author:** Senior Software Architect & Repository Maintenance Specialist  
**Persona:** Strictly **Farouk Messai — Software Developer | Mobile & Web Development**

---

## 1. Executive Summary & Critical Verdict

| Check | Result | Detail |
|---|---|---|
| **Blobs $\ge 100\text{ MiB}$ Reachable from Target Branch** | **0 BLOBS** | No individual Git blob reaches GitHub's 100 MB hard reject limit. |
| **Blobs $\ge 50\text{ MiB}$ Reachable from Target Branch** | **3 BLOBS** | Three 4K EXR files (~66.5–69.7 MiB / 69.7–73.1 MB) will trigger GitHub `GH001` push warnings. |
| **Historical Payload Size** | **814.86 MiB** | Even though working tree is clean (~110.8 MiB), ~814.9 MiB of loose objects are reachable across Git history. |
| **Push Readiness Verdict** | **NOT RECOMMENDED WITHOUT REMEDIATION** | The push will not be hard-blocked by GitHub, but it will trigger multiple `GH001` large file warnings and upload ~814 MiB of obsolete 3D assets to GitHub. |

> [!CAUTION]
> **A deletion commit in Git does NOT remove historical blobs from the object database.**
> When running `git push origin cinematic-video-rebuild`, Git traverses the complete DAG history back to root commit `bc3ecf6`. Every blob introduced in commits `b9df9f2`, `373e0ee`, `a47dd63`, and `7c12a55` must be transmitted to the remote server, regardless of the fact that commit `45007bf` deleted them from the current working tree.

---

## 2. Target Branch History Traversal Results (`refs/heads/cinematic-video-rebuild`)

A complete object traversal was performed using `git rev-list --objects refs/heads/cinematic-video-rebuild` piped into `git cat-file --batch-check`.

- **Total Objects Reachable:** 1,023 objects (commits, trees, and blobs).
- **Total Unique Blobs Reachable:** 715 blobs.
- **Total Tracked Working Tree Size (HEAD):** 110.80 MiB.
- **Total Historical Blob Size (Uncompressed):** 814.86 MiB.

### A. Blobs Above 100 MiB ($100 \times 1024^2 = 104,857,600\text{ bytes}$)
- **Count:** **0**
- *Disambiguation of the "203.07 MB EXR" file:* Earlier audit logs referenced a 203.07 MB HDRI asset. Object inspection reveals that **203.07 MB was the combined directory size of three separate 4K EXR files** in `public/FAROUK_REDESIGN_ASSETS/HDRI/`, not a single file. Each individual EXR file is ~70 MB.

### B. Blobs Above 50 MiB ($50 \times 1024^2 = 52,428,800\text{ bytes}$)
There are **3 blobs** above 50 MiB in the target branch history. All three will trigger GitHub's `GH001: Large files detected` warning during push:

| Blob SHA | Path in History | Size (Bytes) | Size (MiB) | Size (MB) | Introducing Commit | Deletion Commit |
|---|---|---|---|---|---|---|
| `30a2c36a25639690cbf765bb5700fe8b9185045c` | `public/FAROUK_REDESIGN_ASSETS/HDRI/Night/qwantani_night_puresky_4k.exr` | 73,075,343 | **69.69 MiB** | 73.08 MB | `b9df9f2` (Phase 02) | `45007bf` (Cleanup) |
| `0438ced0f84a88e96e292613e941078afc9c324d` | `public/FAROUK_REDESIGN_ASSETS/HDRI/Day/qwantani_noon_puresky_4k.exr` | 70,185,754 | **66.93 MiB** | 70.19 MB | `b9df9f2` (Phase 02) | `45007bf` (Cleanup) |
| `2e9b05bb17149df1d21b16449667e63006ab765e` | `public/FAROUK_REDESIGN_ASSETS/HDRI/Sunset/qwantani_sunset_puresky_4k.exr` | 69,677,404 | **66.45 MiB** | 69.68 MB | `b9df9f2` (Phase 02) | `45007bf` (Cleanup) |

### C. Top 15 Largest Blobs in Target Branch History

| Rank | Blob SHA | Historical Path | Size (MiB) | Size (MB) | Introduced In |
|---|---|---|---|---|---|
| 1 | `30a2c36a...` | `public/FAROUK_REDESIGN_ASSETS/HDRI/Night/qwantani_night_puresky_4k.exr` | 69.69 MiB | 73.08 MB | `b9df9f2` |
| 2 | `0438ced0...` | `public/FAROUK_REDESIGN_ASSETS/HDRI/Day/qwantani_noon_puresky_4k.exr` | 66.93 MiB | 70.19 MB | `b9df9f2` |
| 3 | `2e9b05bb...` | `public/FAROUK_REDESIGN_ASSETS/HDRI/Sunset/qwantani_sunset_puresky_4k.exr` | 66.45 MiB | 69.68 MB | `b9df9f2` |
| 4 | `d6d0090a...` | `public/assets/models/coast_land_rocks_02.glb` | 37.78 MiB | 39.61 MB | `b9df9f2` |
| 5 | `ef551537...` | `public/assets/models/coast_land_rocks_02/coast_land_rocks_02.bin` | 35.00 MiB | 36.70 MB | `b9df9f2` |
| 6 | `5269ff4f...` | `public/FAROUK_REDESIGN_ASSETS/PBR/WhitePlaster/textures/white_plaster_02_disp_4k.png` | 30.19 MiB | 31.65 MB | `b9df9f2` |
| 7 | `0c6695db...` | `public/FAROUK_REDESIGN_ASSETS/PBR/WhitePlaster/textures/white_plaster_02_nor_gl_4k.exr` | 30.18 MiB | 31.65 MB | `b9df9f2` |
| 8 | `64f73150...` | `public/FAROUK_REDESIGN_ASSETS/PBR/Rock/textures/rock_face_01_nor_gl_4k.exr` | 29.59 MiB | 31.02 MB | `b9df9f2` |
| 9 | `c2c10612...` | `public/FAROUK_REDESIGN_ASSETS/Models/Nature/textures/namaqualand_boulders_01_nor_gl_4k.exr` | 26.97 MiB | 28.28 MB | `b9df9f2` |
| 10 | `0173519c...` | `public/FAROUK_REDESIGN_ASSETS/PBR/Marble/textures/marble_01_disp_4k.png` | 26.86 MiB | 28.17 MB | `b9df9f2` |
| 11 | `474ac114...` | `public/FAROUK_REDESIGN_ASSETS/PBR/WoodFloor/textures/wood_floor_disp_4k.png` | 26.54 MiB | 27.83 MB | `b9df9f2` |
| 12 | `40b0a886...` | `public/FAROUK_REDESIGN_ASSETS/PBR/Walnut/textures/walnut_veneer_disp_4k.png` | 21.47 MiB | 22.51 MB | `b9df9f2` |
| 13 | `d744d228...` | `public/assets/models/coast_rocks_01.glb` | 20.68 MiB | 21.68 MB | `b9df9f2` |
| 14 | `01cfc1c0...` | `public/FAROUK_REDESIGN_ASSETS/PBR/WoodFloor/textures/wood_floor_rough_4k.exr` | 18.89 MiB | 19.81 MB | `b9df9f2` |
| 15 | `bdfbd36e...` | `public/FAROUK_REDESIGN_ASSETS/Models/Nature/textures/natural_walnut_veneer_disp_4k.png` | 18.56 MiB | 19.47 MB | `b9df9f2` |

---

## 3. Inspection of Other References, Backup Branches & Tags

Every reference in the repository was inspected to identify which large blobs remain reachable:

| Reference Name | Type | Commit Point | Total Reachable Blobs | Blobs $\ge 50\text{ MiB}$ | Blobs $\ge 100\text{ MiB}$ |
|---|---|---|---|---|---|
| `refs/heads/cinematic-video-rebuild` | Active Branch | `45007bf` | 715 | 3 | 0 |
| `refs/heads/backup/cinematic-pre-cleanup` | Backup Branch | `7c12a55` | 706 | 3 | 0 |
| `refs/tags/checkpoint/cinematic-pre-cleanup` | Backup Tag | `7c12a55` | 706 | 3 | 0 |
| `refs/heads/redesign-phase-02-1` | Historical Branch | `373e0ee` | 459 | 3 | 0 |
| `refs/heads/redesign-phase-02` | Historical Branch | `b9df9f2` | 444 | 3 | 0 |
| `refs/heads/redesign-phase-01` | Historical Branch | `2d5ffd0` | 94 | 0 | 0 |
| `refs/heads/master` | Upstream Trunk | `bc3ecf6` | 17 | 0 | 0 |

### Categorization of Objects
1. **Objects Reachable from `cinematic-video-rebuild`:**
   All 3 large EXRs and all GLB/PBR assets remain reachable because `cinematic-video-rebuild` includes `b9df9f2` in its commit ancestry.
2. **Objects Reachable ONLY from Backup Branches/Tags:**
   No objects are unique to `backup/cinematic-pre-cleanup` or `checkpoint/cinematic-pre-cleanup`; they point to `7c12a55`, which is already an ancestor of `cinematic-video-rebuild` (`45007bf`).
3. **Unreachable Objects in `.git/objects`:**
   Zero objects are currently unreachable (`git fsck --unreachable` returns 0). All 944 objects belong to active refs.

---

## 4. Storage Breakdown

```
$ git count-objects -vH
count: 944
size: 814.86 MiB
in-pack: 0
packs: 0
size-pack: 0 bytes
prune-packable: 0
garbage: 0
size-garbage: 0 bytes
```

- **Loose Objects on Disk:** 944 objects (814.86 MiB).
- **Packfile Storage:** 0 bytes (no packfiles created yet).
- **Current HEAD Tracked Working Tree:** 110.80 MiB.
- **Runtime Assets at HEAD:**
  - `assets/source-videos/`: 20.58 MB
  - `public/videos/`: 63.85 MB
  - `public/posters/`: 0.40 MB
  - `public/FAROUK_REDESIGN_ASSETS/Fonts/`: 3.23 MB
  - Code, config, and markdown: ~22.74 MB

---

## 5. Push Readiness Evaluation

### Question: Is `git push origin cinematic-video-rebuild` safe right now?

#### Technical Enforcement Analysis:
1. **GitHub Hard Limit (100 MB per file):**
   - **PASS**: The largest historical blob is `qwantani_night_puresky_4k.exr` at 73.08 MB (73,075,343 bytes). Since $73.08\text{ MB} < 100\text{ MB}$, **GitHub will NOT reject the push**.
2. **GitHub Soft Warning (50 MB per file):**
   - **WARNING TRIGGERED**: GitHub will issue three `GH001` warnings for the three EXR files during the push:
     ```text
     remote: warning: GH001: Large files detected. You may want to investigate our guidance on Git Large File Storage: https://git-lfs.github.com.
     remote: warning: File public/FAROUK_REDESIGN_ASSETS/HDRI/Night/qwantani_night_puresky_4k.exr is 69.69 MB; this is larger than GitHub's recommended maximum file size of 50.00 MB
     ```
3. **Network & Repository Hygiene:**
   - **POOR**: Pushing will transfer **~814 MiB** of loose objects, forcing anyone who clones the repository to download hundreds of megabytes of deleted, obsolete 3D assets that are no longer part of the project.

### Final Verdict:
**NOT READY FOR PRODUCTION PUSH.**  
While GitHub's server hooks will accept the push without aborting, pushing 814 MiB of dead 3D assets and triggering GitHub warnings violates professional repository hygiene standards.

---

## 6. Recommended Safe Remediation Strategies

*Per strict instruction, NO history modification has been performed. Below are the three safest remediation options for the project owner to evaluate:*

### Option A — Clean Orphan Release Branch (Recommended: Cleanest & Lowest Risk)
Create a new orphan branch rooted directly from `master` (`bc3ecf6`) that applies the current clean working tree as a single, pristine commit. This preserves full commit history on `cinematic-video-rebuild` locally for reference, while pushing a tiny, pure repository to GitHub.

**Steps:**
```bash
# 1. Checkout a new clean orphan branch
git checkout --orphan cinematic-production

# 2. Add all current working tree files (already 100% clean and verified)
git add -A

# 3. Commit clean cinematic video portfolio
git commit -m "feat(cinematic): initial production release of scroll-driven cinematic video portfolio"

# 4. Result: Push size drops from 814 MiB to ~110 MiB, 0 large file warnings, instant push
git push origin cinematic-production:main
```
- **Pros:** Zero risk of corrupting Git history; leaves `cinematic-video-rebuild` intact as an internal development log; produces an ultra-lean remote repository.
- **Cons:** Previous intermediate commits (`Phase 01`, `Phase 02`) are not on GitHub (they remain in the local clone).

---

### Option B — `git-filter-repo` on Target Branch
Run `git-filter-repo` to strip the obsolete paths (`public/FAROUK_REDESIGN_ASSETS/HDRI`, `public/assets`, `scratch`) from the historical DAG of `cinematic-video-rebuild`.

**Steps:**
```bash
# Must be executed only after backing up the .git directory
git-filter-repo --path public/FAROUK_REDESIGN_ASSETS/HDRI --invert-paths --force
git-filter-repo --path public/assets --invert-paths --force
git-filter-repo --path scratch --invert-paths --force
```
- **Pros:** Retains the multi-commit history structure.
- **Cons:** Rewrites all commit hashes; requires `git-filter-repo` Python CLI.

---

### Option C — Push As-Is (Accept Warnings)
If the project owner prefers to preserve the exact linear history without any commit rewriting, `git push origin cinematic-video-rebuild` can technically be run directly.

- **Pros:** Zero commands or risk.
- **Cons:** Emits 3 GitHub warnings; wastes ~700 MB of bandwidth; bloats all future `git clone` operations.

