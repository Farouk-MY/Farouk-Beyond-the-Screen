'use client';

import React, { useState } from 'react';
import { ENGINEERING_DOMAINS } from '@/config/portfolioData';

interface SkillsOverlayProps {
  opacity: number;
}

export function SkillsOverlay({ opacity }: SkillsOverlayProps) {
  const [selectedDomainId, setSelectedDomainId] = useState<string>(ENGINEERING_DOMAINS[0].id);

  const activeDomain =
    ENGINEERING_DOMAINS.find((d) => d.id === selectedDomainId) || ENGINEERING_DOMAINS[0];

  const isVisible = opacity > 0.01;

  return (
    <section
      id="act-4-craft"
      aria-label="Act IV — The Craft: Systems Lab & Engineering Domains"
      className={`absolute inset-0 flex flex-col justify-center p-6 sm:p-12 lg:p-16 pt-20 sm:pt-24 pointer-events-none transition-opacity duration-200 ease-out ${
        isVisible ? 'visible' : 'invisible'
      }`}
      style={{ opacity }}
    >
      {/* Left-aligned floating panel — Visible while Farouk interacts with central holographic table */}
      <div className="max-w-xl lg:max-w-2xl mr-auto pointer-events-auto">
        {/* Chapter Badging */}
        <div className="flex items-center gap-2.5 mb-3">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono tracking-wider border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#E5C358]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            ACT IV — THE CRAFT
          </span>
          <span className="text-[11px] font-mono tracking-widest text-[#B5A99B] uppercase">
            Systems Lab &amp; Engineering Domains
          </span>
        </div>

        {/* Heading & Subtitle */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold tracking-tight text-[#FAF8F5] mb-2">
          Engineering Domains
        </h2>
        <p className="text-xs sm:text-sm text-[#D6CEC2] font-body leading-relaxed mb-5 max-w-lg">
          Specialized technical competencies honed across production platforms and cross-surface architectures.
        </p>

        {/* Four Clean Domain Selector Tabs */}
        <div
          role="tablist"
          aria-label="Engineering Domains"
          className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl border border-[#E8E2D8]/15 bg-[#1C1512]/75 backdrop-blur-md mb-4 w-fit max-w-full"
        >
          {ENGINEERING_DOMAINS.map((domain, idx) => {
            const isActive = domain.id === selectedDomainId;
            return (
              <button
                key={domain.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedDomainId(domain.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#D4AF37] text-[#1C1512] font-bold shadow-sm'
                    : 'text-[#B5A99B] hover:text-[#FAF8F5] hover:bg-white/5'
                }`}
              >
                0{idx + 1} / {domain.title}
              </button>
            );
          })}
        </div>

        {/* Active Domain Detail Card */}
        <div className="p-5 sm:p-6 rounded-2xl border border-[#E8E2D8]/15 bg-[#1C1512]/80 backdrop-blur-md shadow-xl transition-all">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg sm:text-xl font-heading font-bold text-[#FAF8F5]">
              {activeDomain.title}
            </h3>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#E5C358]">
              Specialization
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#D6CEC2] font-body leading-relaxed mb-4">
            {activeDomain.description}
          </p>

          {/* Key Technologies */}
          <div>
            <span className="block text-[10px] font-mono uppercase text-[#A89D8F] mb-2 tracking-wider">
              Core Technologies &amp; Frameworks
            </span>
            <div className="flex flex-wrap gap-1.5">
              {activeDomain.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-md text-xs font-mono border border-[#E8E2D8]/15 bg-[#2A201A]/60 text-[#FAF8F5]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Quiet Subtitle Note */}
        <div className="mt-3 flex items-center gap-2 text-[11px] font-mono text-[#A89D8F]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
          <span>Architectural systems designed for maintainability and scalability</span>
        </div>
      </div>
    </section>
  );
}
