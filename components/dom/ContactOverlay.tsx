'use client';

import React, { useState } from 'react';
import { DEVELOPER_PROFILE } from '@/config/portfolioData';

interface ContactOverlayProps {
  opacity: number;
}

export function ContactOverlay({ opacity }: ContactOverlayProps) {
  const { contact } = DEVELOPER_PROFILE;
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const isVisible = opacity > 0.01;

  return (
    <section
      id="act-5-beyond"
      aria-label="Act V — The Horizon: Contact & Collaboration"
      className={`absolute inset-0 flex flex-col justify-between p-6 sm:p-14 lg:p-20 pt-20 sm:pt-24 pb-12 pointer-events-none transition-opacity duration-200 ease-out ${
        isVisible ? 'visible' : 'invisible'
      }`}
      style={{ opacity }}
    >
      {/* Left-aligned editorial contact layout over the sunset horizon and open sea */}
      <div className="max-w-xl lg:max-w-2xl pointer-events-auto">
        {/* Chapter Badging */}
        <div className="flex items-center gap-2.5 mb-3">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono tracking-wider border border-[#BA5227]/30 bg-[#BA5227]/10 text-[#E59368]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#BA5227]" />
            ACT V — THE HORIZON
          </span>
          <span className="text-[11px] font-mono tracking-widest text-[#B5A99B] uppercase">
            Sunset Balcony Overlook
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-5xl font-heading font-bold tracking-tight text-[#FAF8F5] mb-3">
          Let&apos;s build something together.
        </h2>

        <p className="text-sm sm:text-base text-[#D6CEC2] font-body leading-relaxed mb-6 max-w-lg">
          The continuous cinematic journey concludes at the Mediterranean horizon. Open for software developer roles, technical partnerships, and challenging mobile or web builds.
        </p>

        {/* Direct Contact Card with Real Mailto & Instant Copy */}
        <div className="p-5 sm:p-6 rounded-2xl border border-[#E8E2D8]/15 bg-[#1C1512]/80 backdrop-blur-md shadow-xl mb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono uppercase text-[#A89D8F] tracking-wider">
              Direct Communication
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#D4AF37]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              <span>{contact.availability}</span>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-[#E8E2D8]/10 bg-[#2A201A]/50">
            <a
              href={`mailto:${contact.email}`}
              className="text-xs sm:text-sm font-mono font-medium text-[#FAF8F5] hover:text-[#E59368] transition-colors truncate"
              title="Send email via mailto:"
            >
              {contact.email}
            </a>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`mailto:${contact.email}`}
                className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-[#BA5227] text-[#FAF8F5] hover:bg-[#CF6234] transition-all text-center inline-flex items-center gap-1.5"
              >
                <span>Compose Mail</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
              <button
                onClick={handleCopyEmail}
                className="px-3 py-1.5 rounded-lg text-xs font-mono border border-[#E8E2D8]/20 bg-[#1C1512] text-[#D6CEC2] hover:text-[#FAF8F5] hover:border-[#BA5227]/40 transition-colors cursor-pointer"
                aria-label="Copy email address"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-[#A89D8F]">
            <span>Location: {contact.location}</span>
            <span>Response within 24-48 hours</span>
          </div>
        </div>

        {/* Verified Professional Profiles */}
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl text-xs font-mono border border-[#E8E2D8]/15 bg-[#1C1512]/75 text-[#FAF8F5] hover:border-[#BA5227]/50 hover:text-[#E59368] transition-colors inline-flex items-center gap-2 backdrop-blur-md"
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
            className="px-4 py-2.5 rounded-xl text-xs font-mono border border-[#E8E2D8]/15 bg-[#1C1512]/75 text-[#FAF8F5] hover:border-[#BA5227]/50 hover:text-[#E59368] transition-colors inline-flex items-center gap-2 backdrop-blur-md"
          >
            <span>LinkedIn Profile</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>

      {/* Editorial Footer */}
      <footer className="border-t border-[#E8E2D8]/10 pt-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#A89D8F] pointer-events-auto">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#BA5227]" />
          <span>FAROUK MESSAI — Software Developer | Mobile &amp; Web Development</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>© 2026 Farouk Messai</span>
          <span className="text-[#E59368]">Five Acts Completed</span>
        </div>
      </footer>
    </section>
  );
}
