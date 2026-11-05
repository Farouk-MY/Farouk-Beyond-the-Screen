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
      className={`absolute inset-0 flex flex-col justify-between p-4 sm:p-10 lg:p-16 pt-28 sm:pt-32 lg:pt-36 pb-6 sm:pb-8 pointer-events-none transition-opacity duration-200 ease-out select-none ${
        isVisible ? 'visible' : 'invisible'
      }`}
      style={{ opacity }}
    >
      {/* Left/Center editorial contact layout over the sunset horizon and open sea */}
      <div className="w-full max-w-lg lg:max-w-xl mr-auto pointer-events-auto">
        {/* Section Label — Placed clearly below the floating logo */}
        <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono tracking-widest border border-[#D4AF37]/40 bg-[#1A1411]/80 text-[#E59368]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#BA5227] animate-pulse" />
            05 / CONTACT
          </span>
          <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[#FAF8F5]/85 uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            Sunset Balcony Overlook
          </span>
        </div>

        {/* Cinematic Headline */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-[#FAF8F5] leading-[1.06] mb-2 sm:mb-3 drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
          Let&apos;s build something <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E59368] via-[#D4AF37] to-[#FAF8F5]">extraordinary.</span>
        </h2>

        <p className="text-xs sm:text-sm text-[#D6CEC2] font-body leading-relaxed mb-4 sm:mb-5 max-w-lg drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          The continuous cinematic journey concludes at the Mediterranean horizon. Open to software developer roles, collaborative projects, and engineering high-craft digital platforms across web &amp; mobile surfaces.
        </p>

        {/* Sculpted Glass Dispatch Console */}
        <div className="w-full rounded-3xl border border-[#D4AF37]/30 bg-[#0D0A08]/85 backdrop-blur-2xl shadow-[0_30px_70px_-15px_rgba(0,0,0,0.85)] p-4 sm:p-5 flex flex-col gap-3.5 mb-3 sm:mb-4">
          {/* Live Availability Badge */}
          <div className="flex items-center justify-between pb-2.5 border-b border-[#E8E2D8]/10 text-[10px] sm:text-[11px] font-mono">
            <span className="text-[#A89D8F] uppercase tracking-wider">Direct Dispatch</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              <span>Open to Roles &amp; Projects</span>
            </span>
          </div>

          {/* Email Dispatch Tile */}
          <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-[#18110E] to-[#120D0B] border border-[#E8E2D8]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 shadow-inner">
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-mono uppercase text-[#A89D8F] tracking-widest block mb-0.5">Primary Inbox</span>
              <a
                href={`mailto:${contact.email}`}
                className="text-xs sm:text-sm font-mono font-bold text-[#FAF8F5] hover:text-[#E59368] transition-colors truncate block"
                title="Compose email"
              >
                {contact.email}
              </a>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`mailto:${contact.email}`}
                className="px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-[#BA5227] text-[#FAF8F5] hover:bg-[#CF6234] transition-all inline-flex items-center gap-1 shadow-sm active:scale-95"
              >
                <span>Compose Mail</span>
                <span className="text-xs">↗</span>
              </a>
              <button
                onClick={handleCopyEmail}
                className="px-2.5 py-1.5 rounded-xl text-xs font-mono border border-[#E8E2D8]/20 bg-[#1A1411] text-[#D6CEC2] hover:text-[#FAF8F5] hover:border-[#D4AF37]/60 transition-colors cursor-pointer inline-flex items-center gap-1 active:scale-95"
                aria-label="Copy email address"
              >
                {copied ? 'Copied ✓' : copyError ? 'Manual Copy' : 'Copy ⎘'}
              </button>
            </div>
          </div>

          {/* Verified Channels Grid: GitHub & LinkedIn */}
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 sm:p-3 rounded-2xl border border-[#E8E2D8]/15 bg-black/40 hover:bg-[#1C1512] hover:border-[#D4AF37]/50 transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-[#A89D8F] mb-0.5">
                <span>GITHUB</span>
                <span className="text-[#D4AF37] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
              </div>
              <div className="text-xs sm:text-sm font-mono font-bold text-[#FAF8F5] truncate">@Farouk-MY</div>
              <span className="text-[8px] sm:text-[9px] font-mono text-[#E59368] mt-0.5">Source &amp; Repositories</span>
            </a>

            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 sm:p-3 rounded-2xl border border-[#E8E2D8]/15 bg-black/40 hover:bg-[#1C1512] hover:border-[#D4AF37]/50 transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-[#A89D8F] mb-0.5">
                <span>LINKEDIN</span>
                <span className="text-[#D4AF37] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
              </div>
              <div className="text-xs sm:text-sm font-mono font-bold text-[#FAF8F5] truncate">Farouk Messai</div>
              <span className="text-[8px] sm:text-[9px] font-mono text-[#E59368] mt-0.5">Professional Network</span>
            </a>
          </div>

          {/* Location & Response SLA */}
          <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-[#A89D8F] pt-2 border-t border-[#E8E2D8]/10">
            <span>Location: <strong className="text-[#FAF8F5]">Algeria (Remote Worldwide)</strong></span>
            <span className="text-[#34D399]">Avg Response: &lt; 24h</span>
          </div>
        </div>
      </div>

      {/* Refined Minimal Horizon Footer */}
      <footer className="border-t border-[#E8E2D8]/10 pt-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#A89D8F] pointer-events-auto">
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
              <span>Back to Origin</span>
              <span>↑</span>
            </button>
          )}
          <span>© 2026 Farouk Messai</span>
        </div>
      </footer>
    </section>
  );
}
