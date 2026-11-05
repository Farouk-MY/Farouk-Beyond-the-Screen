'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/context/LocaleContext';
import { useAudio } from '@/context/AudioContext';

interface SkillsOverlayProps {
  opacity: number;
}

export function SkillsOverlay({ opacity }: SkillsOverlayProps) {
  const { t, isRtl } = useTranslation();
  const { playClick } = useAudio();
  const domains = t.engineering.domains;

  const [selectedDomainId, setSelectedDomainId] = useState<string>(domains[0]?.id || 'web');

  const activeDomain =
    domains.find((d) => d.id === selectedDomainId) || domains[0];

  const isVisible = opacity > 0.01;

  const handleSelectDomain = (id: string) => {
    playClick('light');
    setSelectedDomainId(id);
  };

  return (
    <section
      id="scene-engineering"
      aria-label="Engineering: Systems Lab & Specializations"
      className={`absolute inset-0 flex flex-col justify-center p-4 sm:p-10 lg:p-14 pt-28 sm:pt-32 lg:pt-36 pointer-events-none transition-opacity duration-200 ease-out select-none ${
        isVisible ? 'visible' : 'invisible'
      }`}
      style={{ opacity }}
    >
      {/* Left-aligned floating panel — Visible while Farouk interacts with central holographic table */}
      <div className={`w-full max-w-lg lg:max-w-xl ${isRtl ? 'ml-auto text-right' : 'mr-auto text-left'} pointer-events-auto`}>
        {/* Section Label */}
        <div className={`flex items-center gap-2 mb-2.5 sm:mb-3 ${isRtl ? 'flex-row-reverse justify-end' : ''}`}>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono tracking-wider border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            {t.engineering.eyebrow}
          </span>
          <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[#D4C9BC] uppercase">
            {t.engineering.subEyebrow}
          </span>
        </div>

        {/* Heading & Subtitle */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold tracking-tight text-[#FAF8F5] mb-1.5 sm:mb-2 drop-shadow-sm">
          {t.engineering.headline}
        </h2>
        <p className="text-xs sm:text-sm text-[#D6CEC2] font-body leading-relaxed mb-4 max-w-lg drop-shadow-sm">
          {t.engineering.description}
        </p>

        {/* Four Clean Domain Selector Tabs */}
        <div
          role="tablist"
          aria-label="Engineering Domains"
          className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl border border-[#E8E2D8]/15 bg-[#15100E]/80 backdrop-blur-md mb-3.5 w-fit max-w-full"
        >
          {domains.map((domain, idx) => {
            const isActive = domain.id === selectedDomainId;
            return (
              <button
                key={domain.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => handleSelectDomain(domain.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#D4AF37] text-[#1C1512] font-bold shadow-sm'
                    : 'text-[#D4C9BC] hover:text-[#FAF8F5] hover:bg-white/5'
                }`}
              >
                0{idx + 1} / {domain.title}
              </button>
            );
          })}
        </div>

        {/* Active Domain Detail Card */}
        <div className="p-4 sm:p-5 rounded-2xl border border-[#E8E2D8]/15 bg-[#15100E]/85 backdrop-blur-xl shadow-xl transition-all">
          <div className={`flex items-center justify-between mb-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <h3 className="text-base sm:text-lg font-heading font-bold text-[#FAF8F5]">
              {activeDomain.title}
            </h3>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]">
              {isRtl ? 'تخصص رئيسي' : 'Core Focus'}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#D6CEC2] font-body leading-relaxed mb-3.5">
            {activeDomain.description}
          </p>

          {/* Key Technologies */}
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#A89D8F] mb-1.5">
              {isRtl ? 'حزمة التقنيات وأدوات الإنتاج:' : 'Production Stack & Tools:'}
            </span>
            <div className={`flex flex-wrap gap-1.5 ${isRtl ? 'flex-row-reverse' : ''}`}>
              {activeDomain.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-md text-xs font-mono border border-[#E8E2D8]/10 bg-[#1C1512]/60 text-[#FAF8F5]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
