'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { DEVELOPER_PROFILE, PROJECTS_DATA, ENGINEERING_DOMAINS } from '@/config/portfolioData';
import { CINEMATIC_CLIPS } from '@/config/cinematicTimeline';
import type { ProjectItem } from '@/types/portfolio';
import { ProjectDetailModal } from '@/components/dom/ProjectDetailModal';
import { ProjectGalleryModal } from '@/components/dom/ProjectGalleryModal';

export function StaticAccessiblePortfolio() {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(PROJECTS_DATA[0].id);
  const [detailProject, setDetailProject] = useState<ProjectItem | null>(null);
  const [galleryProject, setGalleryProject] = useState<ProjectItem | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [copyError, setCopyError] = useState<boolean>(false);

  const activeProject =
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
    <div className="w-full min-h-screen bg-[#0E0C0A] text-[#FAF8F5]">
      {/* Editorial Accessible Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 sm:px-12 backdrop-blur-md bg-[#0E0C0A]/90 border-b border-[#E8E2D8]/10">
        <a href="#studio" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg border border-[#D4AF37]/30 bg-[#1C1512] flex items-center justify-center p-1.5 shadow-sm group-hover:border-[#D4AF37]/60 transition-colors">
            <svg
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full text-[#E59368] group-hover:text-[#F3EFEA] transition-colors"
              aria-hidden="true"
            >
              <path
                d="M 16 48 L 16 16 L 36 16 M 16 30 L 32 30"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 32 48 L 32 16 L 44 32 L 56 16 L 56 48"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line x1="8" y1="56" x2="56" y2="56" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-mono font-bold tracking-widest text-[#FAF8F5] uppercase">
              FAROUK
            </span>
            <span className="text-[9px] font-mono tracking-wider text-[#A89D8F] uppercase">
              Digital Portfolio
            </span>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-6 text-xs font-mono text-[#D6CEC2]" aria-label="Sections">
          <a href="#studio" className="hover:text-[#FAF8F5] transition-colors">
            Studio
          </a>
          <a href="#journey" className="hover:text-[#FAF8F5] transition-colors">
            Journey
          </a>
          <a href="#work" className="hover:text-[#FAF8F5] transition-colors">
            Work
          </a>
          <a href="#craft" className="hover:text-[#FAF8F5] transition-colors">
            Craft
          </a>
          <a href="#contact" className="hover:text-[#FAF8F5] transition-colors">
            Contact
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`mailto:${DEVELOPER_PROFILE.contact.email}`}
            className="px-4 py-2 rounded-full text-xs font-mono font-medium border border-[#D4AF37]/50 bg-[#BA5227] text-[#FAF8F5] hover:bg-[#CF6234] transition-all shadow-sm"
          >
            Let&apos;s Talk ↗
          </a>
        </div>
      </header>

      {/* Main Content Sections with Poster Visuals */}
      <main className="w-full max-w-5xl mx-auto px-6 py-12 sm:px-12 space-y-24">
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
          <div className="max-w-xl">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono border border-[#BA5227]/30 bg-[#BA5227]/10 text-[#E59368] mb-4">
              01 / STUDIO
            </span>
            <h1 className="text-4xl sm:text-6xl font-heading font-bold text-[#FAF8F5] mb-2">
              {DEVELOPER_PROFILE.name}
            </h1>
            <p className="text-xl sm:text-2xl font-body text-[#E59368] mb-4">
              {DEVELOPER_PROFILE.title}
            </p>
            <p className="text-base text-[#D6CEC2] leading-relaxed mb-6">
              {DEVELOPER_PROFILE.bioIntroduction}
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#work"
                className="px-6 py-3 rounded-full text-xs font-mono font-medium bg-[#BA5227] text-[#FAF8F5] hover:bg-[#CF6234] transition-all"
              >
                Explore Selected Works &rarr;
              </a>
              <a
                href="#contact"
                className="px-6 py-3 rounded-full text-xs font-mono font-medium border border-[#E8E2D8]/20 bg-[#1C1512]/60 text-[#FAF8F5] hover:bg-white/10 transition-all"
              >
                Get In Touch
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
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono border border-[#D97706]/30 bg-[#D97706]/10 text-[#F59E0B] mb-4">
              02 / JOURNEY
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#FAF8F5] mb-4">
              Beyond the Screen Threshold
            </h2>
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-[#E8E2D8]/10 bg-[#1C1512]/80">
                <h3 className="text-xs font-mono font-bold text-[#F59E0B] mb-1">
                  {DEVELOPER_PROFILE.journeyNarrative.part1Title}
                </h3>
                <p className="text-xs sm:text-sm text-[#D6CEC2] leading-relaxed">
                  {DEVELOPER_PROFILE.journeyNarrative.part1Body}
                </p>
              </div>
              <div className="p-4 rounded-xl border border-[#E8E2D8]/10 bg-[#1C1512]/80">
                <h3 className="text-xs font-mono font-bold text-[#F59E0B] mb-1">
                  {DEVELOPER_PROFILE.journeyNarrative.part2Title}
                </h3>
                <p className="text-xs sm:text-sm text-[#D6CEC2] leading-relaxed">
                  {DEVELOPER_PROFILE.journeyNarrative.part2Body}
                </p>
              </div>
              <div className="p-4 rounded-xl border border-[#E8E2D8]/10 bg-[#1C1512]/80">
                <h3 className="text-xs font-mono font-bold text-[#F59E0B] mb-1">
                  {DEVELOPER_PROFILE.journeyNarrative.part3Title}
                </h3>
                <p className="text-xs sm:text-sm text-[#D6CEC2] leading-relaxed">
                  {DEVELOPER_PROFILE.journeyNarrative.part3Body}
                </p>
              </div>
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
              03 / SELECTED WORK
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#FAF8F5] mb-2">
              Production Architectures
            </h2>
            <p className="text-sm text-[#D6CEC2] mb-6">
              Verified full-stack and mobile applications built with modern architectural rigor.
            </p>

            {/* Project Selector Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {PROJECTS_DATA.map((proj, idx) => {
                const isActive = proj.id === selectedProjectId;
                return (
                  <button
                    key={proj.id}
                    onClick={() => setSelectedProjectId(proj.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#BA5227] text-[#FAF8F5] font-bold shadow-sm'
                        : 'border border-[#E8E2D8]/15 bg-[#1C1512]/70 text-[#B5A99B] hover:text-[#FAF8F5]'
                    }`}
                  >
                    0{idx + 1} / {proj.name}
                  </button>
                );
              })}
            </div>

            {/* Active Project Card with Visual Media Preview */}
            <div className="p-6 rounded-2xl border border-[#E8E2D8]/15 bg-[#1C1512]/90 shadow-xl space-y-5">
              {/* Cover Image Preview */}
              {activeProject.coverImage && (
                <div
                  onClick={() => setGalleryProject(activeProject)}
                  className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-[#E8E2D8]/10 cursor-pointer group bg-[#140F0C]"
                >
                  <Image
                    src={activeProject.coverImage.src}
                    alt={activeProject.coverImage.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/75 border border-[#D4AF37]/40 text-[10px] font-mono text-[#FAF8F5] backdrop-blur-sm group-hover:border-[#D4AF37] transition-colors">
                    Explore Gallery ↗
                  </div>
                  {activeProject.coverImage.isPlaceholder && (
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded text-[9px] font-mono bg-black/60 text-[#D4AF37] border border-[#D4AF37]/30">
                      ARCHITECTURAL SPEC
                    </div>
                  )}
                </div>
              )}

              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full uppercase border border-[#BA5227]/30 bg-[#BA5227]/10 text-[#E59368]">
                  {activeProject.categoryLabel}
                </span>
                <h3 className="text-2xl font-heading font-bold text-[#FAF8F5] mt-2 mb-1">
                  {activeProject.name}
                </h3>
                <p className="text-xs font-mono text-[#E59368] mb-3">{activeProject.tagline}</p>
                <p className="text-sm text-[#D6CEC2] leading-relaxed mb-4">
                  {activeProject.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {activeProject.technologies.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md text-[10px] font-mono border border-[#E8E2D8]/10 bg-[#2A201A]/60 text-[#FAF8F5]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setGalleryProject(activeProject)}
                    className="px-4 py-2 rounded-lg text-xs font-mono font-medium border border-[#D4AF37]/40 bg-[#2A201A] text-[#FAF8F5] hover:bg-[#382C24] transition-all cursor-pointer"
                  >
                    Explore Gallery ↗
                  </button>
                  <button
                    onClick={() => setDetailProject(activeProject)}
                    className="px-4 py-2 rounded-lg text-xs font-mono font-medium bg-[#BA5227] text-[#FAF8F5] hover:bg-[#CF6234] transition-all cursor-pointer"
                  >
                    Architecture Details &rarr;
                  </button>
                </div>
              </div>
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
              04 / ENGINEERING
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#FAF8F5] mb-2">
              Engineering Domains
            </h2>
            <p className="text-sm text-[#D6CEC2] mb-6">
              Specialized technical competencies across web, mobile, and backend architectures.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ENGINEERING_DOMAINS.map((dom) => (
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
                    {dom.technologies.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded text-[10px] font-mono border border-[#E8E2D8]/10 bg-[#2A201A]/50 text-[#FAF8F5]"
                      >
                        {t}
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
              05 / CONTACT
            </span>
            <h2 className="text-3xl sm:text-5xl font-heading font-bold text-[#FAF8F5] mb-3">
              Have something interesting in mind?
            </h2>
            <p className="text-base font-heading italic text-[#D4AF37] mb-2">
              Let&apos;s create something meaningful.
            </p>
            <p className="text-sm text-[#D6CEC2] leading-relaxed mb-6">
              Open for software developer roles, technical partnerships, and challenging mobile or web builds.
            </p>

            <div className="p-5 rounded-2xl border border-[#E8E2D8]/15 bg-[#1C1512]/90 mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase text-[#A89D8F]">Direct Email</span>
                <span className="text-[10px] font-mono text-[#D4AF37]">
                  {DEVELOPER_PROFILE.contact.availability}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <a
                  href={`mailto:${DEVELOPER_PROFILE.contact.email}`}
                  className="text-sm font-mono text-[#FAF8F5] hover:text-[#E59368] transition-colors truncate"
                >
                  {DEVELOPER_PROFILE.contact.email}
                </a>
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${DEVELOPER_PROFILE.contact.email}`}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono bg-[#BA5227] text-[#FAF8F5] hover:bg-[#CF6234] transition-all"
                  >
                    Compose Mail
                  </a>
                  <button
                    onClick={handleCopyEmail}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono border border-[#E8E2D8]/20 bg-[#1C1512] text-[#D6CEC2] hover:text-[#FAF8F5] transition-colors cursor-pointer"
                  >
                    {copied ? 'Copied!' : copyError ? 'Copy failed' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={DEVELOPER_PROFILE.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl text-xs font-mono border border-[#E8E2D8]/15 bg-[#1C1512]/70 text-[#FAF8F5] hover:text-[#E59368] transition-colors"
              >
                GitHub Profile &rarr;
              </a>
              <a
                href={DEVELOPER_PROFILE.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl text-xs font-mono border border-[#E8E2D8]/15 bg-[#1C1512]/70 text-[#FAF8F5] hover:text-[#E59368] transition-colors"
              >
                LinkedIn Profile &rarr;
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Editorial Footer */}
      <footer className="border-t border-[#E8E2D8]/10 py-10 px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#A89D8F] max-w-5xl mx-auto">
        <span>© 2026 Farouk Messai — Software Developer | Mobile &amp; Web</span>
        <a href="#studio" className="hover:text-[#FAF8F5] transition-colors">
          Back to top ↑
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

