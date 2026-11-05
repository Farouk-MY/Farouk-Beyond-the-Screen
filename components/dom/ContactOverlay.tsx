'use client';

import React, { useState } from 'react';
import { DEVELOPER_PROFILE } from '@/config/portfolioData';

interface ContactOverlayProps {
  opacity: number;
  onBackToTop?: () => void;
}

export function ContactOverlay({ opacity, onBackToTop }: ContactOverlayProps) {
  const { contact } = DEVELOPER_PROFILE;
  const [copied, setCopied] = useState<boolean>(false);
  const [copyError, setCopyError] = useState<boolean>(false);

  const handleCopyEmail = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(contact.email);
        setCopied(true);
        setCopyError(false);
        setTimeout(() => setCopied(false), 2500);
      } else {
        throw new Error('Clipboard API unavailable');
      }
    } catch {
      setCopyError(true);
      setTimeout(() => setCopyError(false), 3000);
    }
  };

  const isVisible = opacity > 0.01;

  return (
    <section
      id="scene-contact"
      aria-label="Contact: The Horizon & Collaboration"
      className={`absolute inset-0 flex flex-col justify-between p-4 sm:p-10 lg:p-16 pt-24 sm:pt-28 pb-6 sm:pb-8 pointer-events-none transition-opacity duration-200 ease-out ${
        isVisible ? 'visible' : 'invisible'
      }`}
      style={{ opacity }}
    >
      {/* Left/Center editorial contact layout over the sunset horizon and open sea */}
      <div className="w-full max-w-lg lg:max-w-xl mr-auto pointer-events-auto">
        {/* Section Label */}
        <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono tracking-wider border border-[#BA5227]/30 bg-[#BA5227]/10 text-[#E59368]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#BA5227]" />
            CONTACT
          </span>
          <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[#D4C9BC] uppercase">
            Sunset Balcony Overlook
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-heading font-bold tracking-tight text-[#FAF8F5] mb-2 sm:mb-3">
          Have something interesting in mind?
        </h2>

        <p className="text-xs sm:text-sm text-[#D6CEC2] font-body leading-relaxed mb-5 max-w-lg">
          The continuous cinematic journey concludes at the Mediterranean sunset horizon. Let&apos;s create something meaningful together across mobile, web, and distributed systems.
        </p>

        {/* Direct Contact Card with Real Mailto & Confirmed Copy */}
        <div className="p-4 sm:p-5 rounded-2xl border border-[#E8E2D8]/15 bg-[#15100E]/85 backdrop-blur-xl shadow-xl mb-4">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[10px] font-mono uppercase text-[#A89D8F] tracking-wider">
              Direct Communication
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#D4AF37]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              <span>{contact.availability}</span>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-3 rounded-xl border border-[#E8E2D8]/10 bg-[#1C1512]/70">
            <a
              href={`mailto:${contact.email}`}
              className="text-xs sm:text-sm font-mono font-medium text-[#FAF8F5] hover:text-[#E59368] transition-colors truncate"
              title="Compose email"
            >
              {contact.email}
            </a>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`mailto:${contact.email}`}
                className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-[#BA5227] text-[#FAF8F5] hover:bg-[#CF6234] transition-all text-center inline-flex items-center gap-1.5 shadow-sm"
              >
                <span>Compose Mail</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
              <button
                onClick={handleCopyEmail}
                className="px-2.5 py-1.5 rounded-lg text-xs font-mono border border-[#E8E2D8]/20 bg-[#1C1512] text-[#D6CEC2] hover:text-[#FAF8F5] hover:border-[#BA5227]/40 transition-colors cursor-pointer"
                aria-label="Copy email address"
              >
                {copied ? 'Copied ✓' : copyError ? 'Manual Copy' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-[#A89D8F]">
            <span>Location: {contact.location}</span>
            <span>Response within 24–48 hours</span>
          </div>
        </div>

        {/* Verified Professional Profiles */}
        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl text-xs font-mono border border-[#E8E2D8]/15 bg-[#15100E]/80 text-[#FAF8F5] hover:border-[#BA5227]/50 hover:text-[#E59368] transition-colors inline-flex items-center gap-2 backdrop-blur-md"
          >
            <span>GitHub Profile</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl text-xs font-mono border border-[#E8E2D8]/15 bg-[#15100E]/80 text-[#FAF8F5] hover:border-[#BA5227]/50 hover:text-[#E59368] transition-colors inline-flex items-center gap-2 backdrop-blur-md"
          >
            <span>LinkedIn Profile</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>

      {/* New Editorial Footer (Phase 5: Minimal, warm, typographic, no ACT labels or fake metrics) */}
      <footer className="border-t border-[#E8E2D8]/10 pt-3 mt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#A89D8F] pointer-events-auto">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#BA5227]" />
          <span className="text-[11px] sm:text-xs">
            FAROUK MESSAI — Software Developer | Mobile &amp; Web Development
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          {onBackToTop && (
            <button
              onClick={onBackToTop}
              className="text-[#D4AF37] hover:text-[#FAF8F5] transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              <span>Back to Top</span>
              <span>↑</span>
            </button>
          )}
          <span>© 2026 Farouk Messai</span>
        </div>
      </footer>
    </section>
  );
}
