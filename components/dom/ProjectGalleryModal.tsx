'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import type { ProjectItem } from '@/types/portfolio';

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
  const [prevProject, setPrevProject] = useState(project);
  if (project !== prevProject) {
    setPrevProject(project);
    setCurrentIndex(initialImageIndex);
  }
  const touchStartXRef = useRef<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const images = project?.galleryImages || (project?.coverImage ? [project.coverImage] : []);
  const totalImages = images.length;

  // Navigate images
  const handlePrev = useCallback(() => {
    if (totalImages <= 1) return;
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalImages - 1));
  }, [totalImages]);

  const handleNext = useCallback(() => {
    if (totalImages <= 1) return;
    setCurrentIndex((prev) => (prev < totalImages - 1 ? prev + 1 : 0));
  }, [totalImages]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    if (Math.abs(deltaX) > 40) {
      if (deltaX > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }
    touchStartXRef.current = null;
  };

  if (!isOpen || !project || totalImages === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} Image Gallery`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-[#0E0C0A]/90 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-2xl bg-[#15100E] border border-[#E8E2D8]/20 shadow-2xl overflow-hidden"
      >
        {/* Top Header Strip */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E2D8]/10 bg-[#1C1512]/60">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono tracking-widest text-[#BA5227] font-semibold">
              {String(currentIndex + 1).padStart(2, '0')} / {String(totalImages).padStart(2, '0')}
            </span>
            <span className="text-[#E8E2D8]/30">•</span>
            <span className="text-sm font-heading font-semibold text-[#FAF8F5]">
              {project.name}
            </span>
            <span className="hidden sm:inline-block text-xs font-mono text-[#D4C9BC]">
              ({project.categoryLabel})
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close image gallery"
            className="p-2 rounded-lg text-[#D4C9BC] hover:text-[#FAF8F5] hover:bg-white/10 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Main Image Viewport */}
        <div className="relative flex-1 flex items-center justify-center p-4 sm:p-8 bg-[#0E0C0A]/50 min-h-[300px] sm:min-h-[420px] select-none">
          {/* Main Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentImage.src}
            alt={currentImage.alt}
            className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-lg border border-[#E8E2D8]/10 transition-opacity duration-200"
          />

          {/* Left / Right Prev & Next Overlay Buttons */}
          {totalImages > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                aria-label="Previous image"
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#1C1512]/80 hover:bg-[#BA5227] text-[#FAF8F5] border border-[#E8E2D8]/15 backdrop-blur-md transition-all shadow-md cursor-pointer hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                aria-label="Next image"
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#1C1512]/80 hover:bg-[#BA5227] text-[#FAF8F5] border border-[#E8E2D8]/15 backdrop-blur-md transition-all shadow-md cursor-pointer hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Footer Info Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-t border-[#E8E2D8]/10 bg-[#1C1512]/60">
          <div>
            <p className="text-xs font-mono text-[#FAF8F5] font-medium">
              {currentImage.alt}
            </p>
            {currentImage.caption && (
              <p className="text-xs text-[#D4C9BC] font-sans mt-0.5">
                {currentImage.caption}
              </p>
            )}
            {currentImage.isPlaceholder && (
              <p className="text-[10px] font-mono text-[#D4AF37] mt-1 tracking-wider uppercase">
                Architecture Spec Preview • Production Screenshots In Progress
              </p>
            )}
          </div>

          {/* Thumbnail dots / previews */}
          {totalImages > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Jump to image ${idx + 1}`}
                  className={`relative w-12 h-8 rounded-md overflow-hidden border transition-all cursor-pointer ${
                    idx === currentIndex
                      ? 'border-[#BA5227] ring-2 ring-[#BA5227]/40 scale-105'
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
