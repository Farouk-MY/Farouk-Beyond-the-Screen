'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import type { ProjectItem, ProjectMedia } from '@/types/portfolio';
import { useSmoothScroll } from '@/components/providers/SmoothScrollProvider';

interface ProjectGalleryModalProps {
  project: ProjectItem | null;
  isOpen: boolean;
  onClose: () => void;
  initialImageIndex?: number;
}

export function ProjectGalleryModal({
  project,
  isOpen,
  onClose,
  initialImageIndex = 0,
}: ProjectGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(initialImageIndex);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const { getLenis } = useSmoothScroll();

  // Compute safe images array: galleryImages, or fallback to coverImage, or empty
  const images: ProjectMedia[] = React.useMemo(() => {
    if (!project) return [];
    if (project.galleryImages && project.galleryImages.length > 0) {
      return project.galleryImages;
    }
    if (project.coverImage) {
      return [project.coverImage];
    }
    return [];
  }, [project]);

  const totalImages = images.length;

  // Reset/clamp current index whenever project changes
  const prevProjectIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (project && project.id !== prevProjectIdRef.current) {
      prevProjectIdRef.current = project.id;
      setCurrentIndex(Math.max(0, Math.min(initialImageIndex, Math.max(0, images.length - 1))));
    }
  }, [project, initialImageIndex, images.length]);

  // Navigate images
  const handlePrev = useCallback(() => {
    if (totalImages <= 1) return;
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalImages - 1));
  }, [totalImages]);

  const handleNext = useCallback(() => {
    if (totalImages <= 1) return;
    setCurrentIndex((prev) => (prev < totalImages - 1 ? prev + 1 : 0));
  }, [totalImages]);

  // Background Scroll Lock, Focus Management & Keyboard Trap
  useEffect(() => {
    if (!isOpen) return;

    // 1. Pause Lenis and lock body scroll
    const lenis = getLenis();
    if (lenis) lenis.stop();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // 2. Focus management: save active element, focus close button
    const prevActiveElement = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    // 3. Keyboard handlers (Escape, ArrowLeft, ArrowRight, Tab focus trap)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
        return;
      }

      // Trap focus inside modal
      if (e.key === 'Tab' && modalContentRef.current) {
        const focusable = modalContentRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      if (lenis) lenis.start();
      prevActiveElement?.focus();
    };
  }, [isOpen, onClose, handlePrev, handleNext, getLenis]);

  // Touch swipe handling with directional detection
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Only trigger horizontal swipe if deltaX is dominant over deltaY
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  if (!isOpen || !project || totalImages === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} Image Gallery`}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-10 bg-[#0A0706]/90 backdrop-blur-2xl pointer-events-auto select-none"
      onClick={onClose}
    >
      <div
        ref={modalContentRef}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl bg-[#140F0C] border border-[#D4AF37]/25 shadow-2xl overflow-hidden"
      >
        {/* Top Header Strip */}
        <div className="flex items-center justify-between px-5 sm:px-8 py-3.5 border-b border-[#E8E2D8]/10 bg-[#1C1512]/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono tracking-widest bg-[#BA5227]/20 border border-[#BA5227]/40 text-[#E59368] font-bold">
              {String(currentIndex + 1).padStart(2, '0')} / {String(totalImages).padStart(2, '0')}
            </span>
            <span className="text-[#E8E2D8]/30 hidden sm:inline">•</span>
            <h2 className="text-sm sm:text-base font-heading font-bold text-[#FAF8F5]">
              {project.name}
            </h2>
            <span className="hidden md:inline-block text-xs font-mono text-[#D4C9BC]">
              ({project.categoryLabel})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[#A89D8F] hidden sm:inline mr-2">
              ESC to close
            </span>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              aria-label="Close project gallery"
              className="p-2 rounded-lg text-[#D4C9BC] hover:text-[#FAF8F5] hover:bg-white/10 transition-colors cursor-pointer border border-[#E8E2D8]/15 bg-[#1C1512]"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Main Image Viewport with Object Contain */}
        <div className="relative flex-1 flex items-center justify-center p-4 sm:p-8 bg-[#090706] min-h-[300px] sm:min-h-[460px] overflow-hidden">
          {/* Subtle architectural glass shine */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] via-transparent to-white/[0.04] pointer-events-none" />

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={currentImage.src}
            src={currentImage.src}
            alt={currentImage.alt || `${project.name} view ${currentIndex + 1}`}
            className="max-h-[62vh] max-w-full object-contain rounded-xl shadow-2xl border border-[#E8E2D8]/10 transition-opacity duration-200"
          />

          {/* Left / Right Previous & Next Buttons */}
          {totalImages > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                aria-label="Previous image"
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-3 sm:p-3.5 rounded-full bg-[#1C1512]/90 hover:bg-[#BA5227] text-[#FAF8F5] border border-[#D4AF37]/30 backdrop-blur-md transition-all shadow-xl cursor-pointer hover:scale-105 active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                aria-label="Next image"
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-3 sm:p-3.5 rounded-full bg-[#1C1512]/90 hover:bg-[#BA5227] text-[#FAF8F5] border border-[#D4AF37]/30 backdrop-blur-md transition-all shadow-xl cursor-pointer hover:scale-105 active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Footer Info & Thumbnail Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 sm:px-8 py-3.5 border-t border-[#E8E2D8]/10 bg-[#1C1512]/90">
          <div className="max-w-md">
            <p className="text-xs sm:text-sm font-mono text-[#FAF8F5] font-semibold">
              {currentImage.alt}
            </p>
            {currentImage.caption && (
              <p className="text-xs text-[#D4C9BC] font-sans mt-0.5 line-clamp-2">
                {currentImage.caption}
              </p>
            )}
            {currentImage.isPlaceholder && (
              <p className="text-[10px] font-mono text-[#D4AF37] mt-1 tracking-wider uppercase font-medium">
                ARCHITECTURAL SPECIFICATION • PROVISIONAL SYSTEM DATA
              </p>
            )}
          </div>

          {/* Interactive Thumbnail Previews */}
          {totalImages > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Jump to image ${idx + 1}`}
                  className={`relative w-14 sm:w-16 aspect-[16/10] rounded-md overflow-hidden border transition-all cursor-pointer ${
                    idx === currentIndex
                      ? 'border-[#D4AF37] ring-2 ring-[#BA5227] scale-105 opacity-100'
                      : 'border-[#E8E2D8]/20 opacity-50 hover:opacity-90'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
