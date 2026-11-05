'use client';

import React, { useState } from 'react';
import { DEVELOPER_PROFILE, PROJECTS_DATA } from '@/config/portfolioData';
import { CINEMATIC_CLIPS } from '@/config/cinematicTimeline';
import type { ProjectItem } from '@/types/portfolio';
import type { TranslationDictionary } from '@/config/translations/types';
import { useTranslation } from '@/context/LocaleContext';
import { ProjectDetailModal } from '@/components/dom/ProjectDetailModal';
import { ProjectGalleryModal } from '@/components/dom/ProjectGalleryModal';

type LocalizedProject = TranslationDictionary['projects']['items'][number];

export function StaticAccessiblePortfolio() {
  const { t, isRtl, toggleLocale, locale } = useTranslation();
  const localizedProjects = t.projects.items;

  const [selectedProjectId, setSelectedProjectId] = useState<string>(localizedProjects[0]?.id || 'mediconnect');
  const [detailProject, setDetailProject] = useState<LocalizedProject | null>(null);
  const [galleryProject, setGalleryProject] = useState<ProjectItem | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [copyError, setCopyError] = useState<boolean>(false);

  const activeLocalized =
    localizedProjects.find((p) => p.id === selectedProjectId) || localizedProjects[0];
  const activeRaw =
    PROJECTS_DATA.find((p) => p.id === selectedProjectId) || PROJECTS_DATA[0];

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(DEVELOPER_PROFILE.contact.email);
      setCopied(true);
      setCopyError(false);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopyError(true);
      setTimeout(() => setCopyError(false), 3000);
    }
  };

  return (
    <div className={`w-full min-h-screen bg-[#0E0C0A] text-[#FAF8F5] ${isRtl ? 'text-right' : 'text-left'}`}>
      {/* Editorial Accessible Header */}
      <header className={`sticky top-0 z-40 flex items-center justify-between px-6 py-4 sm:px-12 backdrop-blur-md bg-[#0E0C0A]/90 border-b border-[#E8E2D8]/10 ${isRtl ? 'flex-row-reverse' : ''}`}>
        <a href="#studio" className={`flex items-center gap-3 group ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div className="w-9 h-9 rounded-lg border border-[#D4AF37]/30 bg-[#1C1512] flex items-center justify-center p-1.5 shadow-sm group-hover:border-[#D4AF37]/60 transition-colors">
            <svg
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full text-[#E59368]"
              aria-hidden="true"
            >
              <rect x="12" y="12" width="7" height="40" rx="1.5" fill="currentColor" />
              <path d="M12 13.5C12 12.6716 12.6716 12 13.5 12H50.5C51.3284 12 52 12.6716 52 13.5V18.5C52 19.3284 51.3284 20 50.5 20H13.5C12.6716 20 12 19.3284 12 18.5V13.5Z" fill="currentColor" />
              <rect x="12" y="28" width="18" height="6" rx="1.2" fill="#BA5227" />
              <path d="M30 19L36.5 36.5C36.8 37.3 37.9 37.3 38.2 36.5L44.5 19H50.5L40.2 46C39.5 47.8 36.9 47.8 36.2 46L27 21.5L30 19Z" fill="currentColor" />
              <rect x="45" y="19" width="7" height="33" rx="1.5" fill="currentColor" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-mono font-bold tracking-widest text-[#FAF8F5] uppercase">
              {t.hero.name.toUpperCase()}
            </span>
            <span className="text-[9px] font-mono tracking-wider text-[#A89D8F] uppercase">
              {isRtl ? 'ملف الأعمال الرقمي' : 'Digital Portfolio'}
            </span>
          </div>
        </a>

        <nav className={`hidden md:flex items-center gap-6 text-xs font-mono text-[#D6CEC2] ${isRtl ? 'flex-row-reverse' : ''}`} aria-label="Sections">
          <a href="#studio" className="hover:text-[#FAF8F5] transition-colors">{t.navigation.studio}</a>
          <a href="#journey" className="hover:text-[#FAF8F5] transition-colors">{t.navigation.journey}</a>
          <a href="#work" className="hover:text-[#FAF8F5] transition-colors">{t.navigation.work}</a>
          <a href="#craft" className="hover:text-[#FAF8F5] transition-colors">{t.navigation.engineering}</a>
          <a href="#contact" className="hover:text-[#FAF8F5] transition-colors">{t.navigation.contact}</a>
        </nav>

        <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <button
            onClick={toggleLocale}
            className="px-2.5 py-1 rounded-full text-xs font-mono border border-[#D4AF37]/35 text-[#D4AF37] hover:text-[#FAF8F5] hover:bg-white/5 transition-all cursor-pointer"
          >
            {locale === 'en' ? 'العربية' : 'EN'}
          </button>

          <a
            href={`mailto:${DEVELOPER_PROFILE.contact.email}`}
            className="px-4 py-2 rounded-full text-xs font-mono font-medium border border-[#D4AF37]/50 bg-[#BA5227] text-[#FAF8F5] hover:bg-[#CF6234] transition-all shadow-sm"
          >
            {t.common.letsTalk} {isRtl ? '↖' : '↗'}
          </a>
        </div>
      </header>

      {/* Main Accessible Stack */}
      <main className="max-w-5xl mx-auto px-6 sm:px-12 py-12 space-y-24">
        {/* SECTION 01: STUDIO */}
        <section
          id="studio"
          aria-label="Studio"
          className="relative rounded-3xl overflow-hidden border border-[#E8E2D8]/15 bg-[#1C1512]/60 p-8 sm:p-12 shadow-2xl"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(14,12,10,0.92) 50%, rgba(14,12,10,0.65)), url(${CINEMATIC_CLIPS[0].poster})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono border border-[#BA5227]/30 bg-[#BA5227]/10 text-[#E59368] mb-4">
              {t.hero.eyebrow}
            </span>
            <h1 className="text-4xl sm:text-6xl font-heading font-extrabold text-[#FAF8F5] mb-2">
              {t.hero.name}
            </h1>
            <p className="text-base sm:text-lg font-mono text-[#E59368] mb-4">
              {t.hero.role}
            </p>
            <p className="text-sm text-[#D6CEC2] leading-relaxed mb-6">
              {t.hero.bioIntro}
            </p>

            <div className={`flex flex-wrap gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <a
                href="#work"
                className="px-5 py-2.5 rounded-full text-xs font-mono font-medium bg-[#BA5227] text-[#FAF8F5] hover:bg-[#CF6234] transition-all inline-flex items-center gap-1.5 shadow-sm"
              >
                <span>{t.common.exploreWork}</span>
                <span className={isRtl ? 'rtl-flip' : ''}>&rarr;</span>
              </a>
              <a
                href={`/cv/farouk-messai-cv-${locale}.pdf`}
                download={`farouk-messai-cv-${locale}.pdf`}
                className="px-5 py-2.5 rounded-full text-xs font-mono font-medium border border-[#D4AF37]/35 bg-[#1A1411] text-[#D4AF37] hover:bg-[#2A1F18] transition-all inline-flex items-center gap-1.5 shadow-sm"
              >
                <span>{t.common.downloadCv} (PDF)</span>
              </a>
            </div>
          </div>
        </section>

        {/* SECTION 02: JOURNEY */}
        <section
          id="journey"
          aria-label="Journey"
          className="relative rounded-3xl overflow-hidden border border-[#E8E2D8]/15 bg-[#1C1512]/60 p-8 sm:p-12 shadow-2xl"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(14,12,10,0.92) 50%, rgba(14,12,10,0.65)), url(${CINEMATIC_CLIPS[1].poster})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#E5C358] mb-4">
              {t.journey.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#FAF8F5] mb-2">
              {t.journey.title}
            </h2>
            <p className="text-sm text-[#D6CEC2] mb-6">
              {t.journey.subtitle}
            </p>
            <div className="space-y-4">
              {[t.journey.milestone1, t.journey.milestone2, t.journey.milestone3].map((m) => (
                <div key={m.step} className="p-4 rounded-xl border border-[#E8E2D8]/10 bg-[#140F0C]/80">
                  <div className="text-xs font-mono text-[#D4AF37] font-bold mb-1">{m.step} — {m.title}</div>
                  <p className="text-xs text-[#D6CEC2] leading-relaxed">{m.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 03: SELECTED WORK */}
        <section
          id="work"
          aria-label="Selected Work"
          className="relative rounded-3xl overflow-hidden border border-[#E8E2D8]/15 bg-[#1C1512]/60 p-8 sm:p-12 shadow-2xl"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(14,12,10,0.92) 50%, rgba(14,12,10,0.65)), url(${CINEMATIC_CLIPS[2].poster})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono border border-[#BA5227]/30 bg-[#BA5227]/10 text-[#E59368] mb-4">
              {t.projects.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#FAF8F5] mb-4">
              {activeLocalized.name}
            </h2>
            <p className="text-sm font-mono text-[#E59368] mb-4">
              {activeLocalized.tagline}
            </p>
            <p className="text-sm text-[#D6CEC2] leading-relaxed mb-6">
              {activeLocalized.description}
            </p>

            {/* Project Selectors */}
            <div className="flex flex-wrap gap-2 mb-6">
              {localizedProjects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProjectId(p.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    p.id === selectedProjectId
                      ? 'bg-[#BA5227] text-[#FAF8F5] font-bold'
                      : 'border border-[#E8E2D8]/20 bg-[#1C1512] text-[#D4C9BC]'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>

            <div className={`flex gap-3 ${isRtl ? 'flex-row-reverse justify-end' : ''}`}>
              <button
                onClick={() => setDetailProject(activeLocalized)}
                className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-[#D4AF37] text-[#140F0C] hover:bg-[#E5C358] transition-colors cursor-pointer"
              >
                {t.common.viewArchitecture}
              </button>
              <button
                onClick={() => setGalleryProject(activeRaw)}
                className="px-4 py-2 rounded-xl text-xs font-mono border border-[#E8E2D8]/20 bg-[#1C1512] text-[#FAF8F5] hover:bg-white/10 transition-colors cursor-pointer"
              >
                {t.common.viewGallery}
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 04: ENGINEERING */}
        <section
          id="craft"
          aria-label="Engineering"
          className="relative rounded-3xl overflow-hidden border border-[#E8E2D8]/15 bg-[#1C1512]/60 p-8 sm:p-12 shadow-2xl"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(14,12,10,0.92) 50%, rgba(14,12,10,0.65)), url(${CINEMATIC_CLIPS[3].poster})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#E5C358] mb-4">
              {t.engineering.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#FAF8F5] mb-2">
              {t.engineering.headline}
            </h2>
            <p className="text-sm text-[#D6CEC2] mb-6">
              {t.engineering.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {t.engineering.domains.map((dom) => (
                <div
                  key={dom.id}
                  className="p-5 rounded-2xl border border-[#E8E2D8]/10 bg-[#1C1512]/80"
                >
                  <h3 className="text-base font-heading font-bold text-[#FAF8F5] mb-1">
                    {dom.title}
                  </h3>
                  <p className="text-xs text-[#D6CEC2] leading-relaxed mb-3">
                    {dom.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {dom.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded text-[10px] font-mono border border-[#E8E2D8]/10 bg-[#2A201A]/50 text-[#FAF8F5]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 05: CONTACT */}
        <section
          id="contact"
          aria-label="Contact"
          className="relative rounded-3xl overflow-hidden border border-[#E8E2D8]/15 bg-[#1C1512]/60 p-8 sm:p-12 shadow-2xl"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(14,12,10,0.92) 50%, rgba(14,12,10,0.65)), url(${CINEMATIC_CLIPS[4].poster})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono border border-[#BA5227]/30 bg-[#BA5227]/10 text-[#E59368] mb-4">
              {t.contact.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-[#FAF8F5] mb-3">
              {t.contact.headlineBefore} {t.contact.headlineHighlight}
            </h2>
            <p className="text-sm text-[#D6CEC2] leading-relaxed mb-6">
              {t.contact.subtitle}
            </p>

            <div className="p-5 rounded-2xl border border-[#E8E2D8]/15 bg-[#1C1512]/90 mb-5">
              <div className={`flex items-center justify-between mb-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <span className="text-[10px] font-mono uppercase text-[#A89D8F]">{t.common.directDispatch}</span>
                <span className="text-[10px] font-mono text-[#D4AF37]">
                  {t.common.openToWorkBadge}
                </span>
              </div>
              <div className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 ${isRtl ? 'sm:flex-row-reverse' : ''}`}>
                <a
                  href={`mailto:${DEVELOPER_PROFILE.contact.email}`}
                  className="text-sm font-mono text-[#FAF8F5] hover:text-[#E59368] transition-colors truncate"
                >
                  {DEVELOPER_PROFILE.contact.email}
                </a>
                <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <a
                    href={`mailto:${DEVELOPER_PROFILE.contact.email}`}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono bg-[#BA5227] text-[#FAF8F5] hover:bg-[#CF6234] transition-all"
                  >
                    {t.common.composeMail}
                  </a>
                  <button
                    onClick={handleCopyEmail}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono border border-[#E8E2D8]/20 bg-[#1C1512] text-[#D6CEC2] hover:text-[#FAF8F5] transition-colors cursor-pointer"
                  >
                    {copied ? t.common.copied : copyError ? 'Copy failed' : t.common.copy}
                  </button>
                </div>
              </div>
            </div>

            <div className={`flex flex-wrap gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <a
                href={DEVELOPER_PROFILE.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl text-xs font-mono border border-[#E8E2D8]/15 bg-[#1C1512]/70 text-[#FAF8F5] hover:text-[#E59368] transition-colors"
              >
                GitHub &rarr;
              </a>
              <a
                href={DEVELOPER_PROFILE.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl text-xs font-mono border border-[#E8E2D8]/15 bg-[#1C1512]/70 text-[#FAF8F5] hover:text-[#E59368] transition-colors"
              >
                LinkedIn &rarr;
              </a>
              <a
                href={`/cv/farouk-messai-cv-${locale}.pdf`}
                download={`farouk-messai-cv-${locale}.pdf`}
                className="px-4 py-2 rounded-xl text-xs font-mono border border-[#D4AF37]/30 bg-[#1C1512]/70 text-[#D4AF37] hover:text-[#FAF8F5] transition-colors"
              >
                {t.common.downloadCv} (PDF) &darr;
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Editorial Footer */}
      <footer className={`border-t border-[#E8E2D8]/10 py-10 px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#A89D8F] max-w-5xl mx-auto ${isRtl ? 'flex-row-reverse' : ''}`}>
        <span>© 2026 Farouk Messai — {t.hero.role}</span>
        <a href="#studio" className="hover:text-[#FAF8F5] transition-colors">
          {t.common.backToOrigin}
        </a>
      </footer>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={detailProject}
        isOpen={Boolean(detailProject)}
        onClose={() => setDetailProject(null)}
      />

      {/* Project Gallery Modal */}
      <ProjectGalleryModal
        project={galleryProject}
        isOpen={Boolean(galleryProject)}
        onClose={() => setGalleryProject(null)}
      />
    </div>
  );
}
