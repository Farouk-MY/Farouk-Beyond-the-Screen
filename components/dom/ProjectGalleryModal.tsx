'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import type { ProjectItem, ProjectMedia } from '@/types/portfolio';
import { useSmoothScroll } from '@/components/providers/SmoothScrollProvider';
import { useTranslation } from '@/context/LocaleContext';
import { useAudio } from '@/context/AudioContext';

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
  const { t, isRtl } = useTranslation();
  const { playClick } = useAudio();
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
    playClick('light');
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalImages - 1));
  }, [totalImages, playClick]);

  const handleNext = useCallback(() => {
    if (totalImages <= 1) return;
    playClick('light');
    setCurrentIndex((prev) => (prev < totalImages - 1 ? prev + 1 : 0));
  }, [totalImages, playClick]);

  // Background Scroll Lock, Focus Management & Keyboard Trap
  useEffect(() => {
    if (!isOpen) return;

    // 1. Pause Lenis and lock body scroll
    const lenis = getLenis();
    if (lenis) lenis.stop();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // 2. Focus management
    const prevActiveElement = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    // 3. Keyboard handlers
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (isRtl) handleNext();
        else handlePrev();
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (isRtl) handlePrev();
        else handleNext();
        return;
      }

      // Trap focus inside modal
      if (e.key === 'Tab' && modalContentRef.current) {
        const focusable = modalContentRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
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
  }, [isOpen, onClose, getLenis, handleNext, handlePrev, isRtl]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Only swipe if horizontal motion exceeds vertical
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        if (isRtl) handlePrev();
        else handleNext();
      } else {
        if (isRtl) handleNext();
        else handlePrev();
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  if (!isOpen || !project || totalImages === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  const handleClose = () => {
    playClick('light');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} Image Gallery`}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-10 bg-[#0A0706]/90 backdrop-blur-2xl pointer-events-auto select-none"
      onClick={handleClose}
    >
      <div
        ref={modalContentRef}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl bg-[#140F0C] border border-[#D4AF37]/25 shadow-2xl overflow-hidden ${
          isRtl ? 'text-right' : 'text-left'
        }`}
      >
        {/* Top Header Strip */}
        <div className={`flex items-center justify-between px-5 sm:px-8 py-3.5 border-b border-[#E8E2D8]/10 bg-[#1C1512]/80 backdrop-blur-md ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
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

          <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <span className="text-[10px] font-mono text-[#A89D8F] hidden sm:inline">
              ESC {isRtl ? 'للإغلاق' : 'to close'}
            </span>
            <button
              ref={closeButtonRef}
              onClick={handleClose}
              aria-label={t.common.close}
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

          {/* Asset Classification Badge */}
          <div className={`absolute top-4 ${isRtl ? 'right-4' : 'left-4'} px-3 py-1 rounded-full text-[10px] font-mono border backdrop-blur-md ${
            currentImage.isPlaceholder
              ? 'border-[#D4AF37]/35 bg-[#1C1512]/90 text-[#D4AF37]'
              : 'border-[#BA5227]/40 bg-[#BA5227]/20 text-[#E59368]'
          }`}>
            {currentImage.isPlaceholder
              ? (isRtl ? 'مخطط معماري توضيحي للنظام' : 'Architectural System Illustration')
              : (isRtl ? 'لقطة شاشة إنتاجية موثقة' : 'Verified Production Interface')}
          </div>

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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={isRtl ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={isRtl ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Footer Info & Caption */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 sm:px-8 py-3.5 border-t border-[#E8E2D8]/10 bg-[#1C1512]/90 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-mono text-[#D4C9BC] truncate">
              {currentImage.caption || currentImage.alt}
            </p>
          </div>

          <div className={`flex items-center gap-2 text-xs font-mono text-[#A89D8F] ${isRtl ? 'flex-row-reverse' : ''}`}>
            <span>{currentIndex + 1} / {totalImages}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
