# Farouk — Beyond the Screen
## Project Gallery & Modal Interaction Repair Report

### 1. Architectural Diagnosis & Root Causes

During Phase 2, visual inspection and automated browser testing revealed that modal overlays (both the image lightbox gallery and the architecture detail drawer) exhibited intermittent click unresponsiveness and background scroll leakage.

An in-depth inspection of the DOM hierarchy and event propagation identified four discrete root causes:

1. **Inherited Pointer Event Suppression**:
   - The master overlay container (`CinematicOverlay.tsx`) and section wrapper (`ProjectsOverlay.tsx`) set `pointer-events: none` on their root `fixed inset-0` containers to allow scroll events to fall through to the master Lenis runway.
   - When modals were rendered inside these subtrees without explicit `pointer-events: auto` on their outer fixed backdrop wrapper, all mouse clicks, touch taps, and wheel events were silently dropped by the browser.

2. **Dual-Layer Scroll Leakage (Lenis + Native Window)**:
   - Setting `overflow: hidden` on `document.body` alone was insufficient because Lenis intercepts wheel and touch gestures on `window` and continues driving smooth scroll RAF updates.
   - Users scrolling their trackpad or mouse wheel inside a modal inadvertently scrubbed the background video and shifted the active scene beneath the modal.

3. **Focus Leaks & Keyboard Trapping**:
   - Opening a modal did not trap keyboard focus (`Tab`, `Shift+Tab`). Screen readers and keyboard navigation escaped to background navigation links.
   - The `Escape` key and arrow keys (`ArrowLeft`, `ArrowRight`) were not globally bound to the modal lifecycle.

4. **Touch Gesture Conflicts on Mobile**:
   - Mobile touch swipes lacked horizontal dominance checking, causing diagonal page scrolls to trigger inadvertent image transitions.

---

### 2. Implementation & Architectural Solutions

Both [ProjectGalleryModal.tsx](file:///c:/Users/MSI/Desktop/DEV/portfolio/components/dom/ProjectGalleryModal.tsx) and [ProjectDetailModal.tsx](file:///c:/Users/MSI/Desktop/DEV/portfolio/components/dom/ProjectDetailModal.tsx) were refactored to implement production-grade modal containment:

#### A. Explicit Pointer Events & Elevated Z-Index
```tsx
<div
  role="dialog"
  aria-modal="true"
  className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto"
  onClick={handleBackdropClick}
>
  {/* Dark translucent backdrop with blur */}
  <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />
  ...
</div>
```
- Root container is elevated to `z-[100]`, above all cinematic video layers (`z-0`), background vignettes (`z-10`), and section overlays (`z-20` to `z-30`).
- `pointer-events-auto` ensures immediate registration of all click and touch interactions.

#### B. Coordinated Scroll Locking (Lenis + DOM Body)
Both modals integrate with the global smooth scroll provider via `useSmoothScroll`:
```tsx
useEffect(() => {
  const lenis = getLenis();
  if (lenis) {
    lenis.stop(); // Halts Lenis ticker and scroll listener
  }
  const originalOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden'; // Locks native browser window

  return () => {
    document.body.style.overflow = originalOverflow;
    if (lenis) {
      lenis.start(); // Resumes smooth scrolling seamlessly
    }
  };
}, [getLenis]);
```

#### C. Comprehensive Keyboard Orchestration & Focus Trap
```tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextSlide();
    } else if (e.key === 'Tab') {
      // Focus trapping inside modal
      const modal = modalRef.current;
      if (!modal) return;
      const focusableElements = modal.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length === 0) return;

      const firstEl = focusableElements[0];
      const lastEl = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [onClose, prevSlide, nextSlide]);
```

#### D. Precise Touch Swipe with Directional Dominance
```tsx
const handleTouchStart = (e: React.TouchEvent) => {
  touchStartX.current = e.touches[0].clientX;
  touchStartY.current = e.touches[0].clientY;
};

const handleTouchEnd = (e: React.TouchEvent) => {
  if (touchStartX.current === null || touchStartY.current === null) return;
  const deltaX = e.changedTouches[0].clientX - touchStartX.current;
  const deltaY = e.changedTouches[0].clientY - touchStartY.current;

  // Enforce horizontal dominance: only trigger when horizontal motion exceeds vertical motion
  if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
    if (deltaX < 0) nextSlide();
    else prevSlide();
  }

  touchStartX.current = null;
  touchStartY.current = null;
};
```

---

### 3. Empirical Verification Results

The automated CDP test suite (`scripts/test-finite-3d-exhibition.mjs`) evaluated all interaction pathways in headless Microsoft Edge (1920×1080):

| Test Case | Expected Behavior | Measured Output | Status |
| :--- | :--- | :--- | :--- |
| **Modal Activation** | Clicking `Gallery ↗` opens dialog with `z-[100]` | `isOpen: true`, dialog in DOM | **PASSED** |
| **Scroll Lock** | `document.body.style.overflow` set to `hidden` | `bodyOverflow: 'hidden'` | **PASSED** |
| **Lenis Interception** | `lenis.stop()` halts runway progress | Scroll position locked at 0.351 | **PASSED** |
| **Slide Navigation** | Clicking Next slide advances counter from 01 to 02 | `counter: '02 / 03'` | **PASSED** |
| **Escape Key Dismissal** | Pressing `Escape` closes modal cleanly | `isOpen: false` | **PASSED** |
| **Scroll Restoration** | `document.body.style.overflow` restored | `bodyOverflow: ''` | **PASSED** |
| **Architecture Modal** | Clicking `Architecture →` opens spec drawer | `isOpen: true`, `bodyOverflow: 'hidden'` | **PASSED** |
| **Spec Dismissal** | Pressing `Escape` closes architecture drawer | `isOpen: false`, `bodyOverflow: ''` | **PASSED** |

### 4. Visual Evidence Artifacts

- **Gallery Modal Activated**: [act3-gallery-modal-opened.png](file:///c:/Users/MSI/Desktop/DEV/portfolio/public/screenshots/act3-gallery-modal-opened.png)
- **Gallery Modal Slide Advanced**: [act3-gallery-modal-interacted.png](file:///c:/Users/MSI/Desktop/DEV/portfolio/public/screenshots/act3-gallery-modal-interacted.png)
- **Architecture Spec Modal Activated**: [act3-architecture-modal-opened.png](file:///c:/Users/MSI/Desktop/DEV/portfolio/public/screenshots/act3-architecture-modal-opened.png)

