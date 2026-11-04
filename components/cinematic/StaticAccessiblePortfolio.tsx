'use client';

import React, { useState } from 'react';
import { DEVELOPER_PROFILE, PROJECTS_DATA, ENGINEERING_DOMAINS } from '@/config/portfolioData';
import { CINEMATIC_CLIPS } from '@/config/cinematicTimeline';
import type { ProjectItem } from '@/types/portfolio';
import { ProjectDetailModal } from '@/components/dom/ProjectDetailModal';
import { ThemeSelector } from '@/components/dom/ThemeSelector';

export function StaticAccessiblePortfolio() {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(PROJECTS_DATA[0].id);
  const [modalProject, setModalProject] = useState<ProjectItem | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const activeProject =
    PROJECTS_DATA.find((p) => p.id === selectedProjectId) || PROJECTS_DATA[0];

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(DEVELOPER_PROFILE.contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0E0C0A] text-[#FAF8F5]">
      {/* Accessible Static Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 sm:px-12 backdrop-blur-md bg-[#0E0C0A]/90 border-b border-[#E8E2D8]/10">
        <div>
          <span className="text-sm font-heading font-bold uppercase tracking-wider text-[#FAF8F5]">
            {DEVELOPER_PROFILE.name}
          </span>
          <span className="block text-[11px] font-mono text-[#B5A99B]">
            {DEVELOPER_PROFILE.title}
          </span>
        </div>

        <nav className="hidden sm:flex items-center gap-4 text-xs font-mono">
          <a href="#act-1-origin" className="text-[#D6CEC2] hover:text-[#FAF8F5] transition-colors">
            I. Studio
          </a>
          <a href="#act-2-journey" className="text-[#D6CEC2] hover:text-[#FAF8F5] transition-colors">
            II. Threshold
          </a>
          <a href="#act-3-work" className="text-[#D6CEC2] hover:text-[#FAF8F5] transition-colors">
            III. Work
          </a>
          <a href="#act-4-craft" className="text-[#D6CEC2] hover:text-[#FAF8F5] transition-colors">
            IV. Craft
          </a>
          <a href="#act-5-beyond" className="text-[#D6CEC2] hover:text-[#FAF8F5] transition-colors">
            V. Contact
          </a>
        </nav>

        <ThemeSelector />
      </header>

      {/* Main Content Sections with Poster Visuals */}
      <main className="w-full max-w-5xl mx-auto px-6 py-12 sm:px-12 space-y-24">
        {/* ACT I: HERO */}
        <section
          id="act-1-origin"
          aria-label="Act I — The Studio"
          className="relative rounded-3xl overflow-hidden border border-[#E8E2D8]/15 bg-[#1C1512]/60 p-8 sm:p-12 shadow-2xl"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(14,12,10,0.92) 50%, rgba(14,12,10,0.65)), url(${CINEMATIC_CLIPS[0].poster})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="max-w-xl">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono border border-[#BA5227]/30 bg-[#BA5227]/10 text-[#E59368] mb-4">
              ACT I — THE STUDIO
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
                href="#act-3-work"
                className="px-6 py-3 rounded-full text-xs font-mono font-medium bg-[#BA5227] text-[#FAF8F5] hover:bg-[#CF6234] transition-all"
              >
                Explore Selected Works &rarr;
              </a>
              <a
                href="#act-5-beyond"
                className="px-6 py-3 rounded-full text-xs font-mono font-medium border border-[#E8E2D8]/20 bg-[#1C1512]/60 text-[#FAF8F5] hover:bg-white/10 transition-all"
              >
                Get In Touch
              </a>
            </div>
          </div>
        </section>

        {/* ACT II: THRESHOLD */}
        <section
          id="act-2-journey"
          aria-label="Act II — The Threshold"
          className="relative rounded-3xl overflow-hidden border border-[#E8E2D8]/15 bg-[#1C1512]/60 p-8 sm:p-12 shadow-2xl"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(14,12,10,0.92) 50%, rgba(14,12,10,0.65)), url(${CINEMATIC_CLIPS[1].poster})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono border border-[#D97706]/30 bg-[#D97706]/10 text-[#F59E0B] mb-4">
              ACT II — THE THRESHOLD
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#FAF8F5] mb-4">
              Beyond the Studio Threshold
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

        {/* ACT III: WORK */}
        <section
          id="act-3-work"
          aria-label="Act III — The Work"
          className="relative rounded-3xl overflow-hidden border border-[#E8E2D8]/15 bg-[#1C1512]/60 p-8 sm:p-12 shadow-2xl"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(14,12,10,0.92) 50%, rgba(14,12,10,0.65)), url(${CINEMATIC_CLIPS[2].poster})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono border border-[#BA5227]/30 bg-[#BA5227]/10 text-[#E59368] mb-4">
              ACT III — THE WORK
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#FAF8F5] mb-2">
              Selected Works
            </h2>
            <p className="text-sm text-[#D6CEC2] mb-6">
              Production architectures and cross-platform mobile implementations.
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

            {/* Active Project Card */}
            <div className="p-6 rounded-2xl border border-[#E8E2D8]/15 bg-[#1C1512]/90 shadow-xl">
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
              <button
                onClick={() => setModalProject(activeProject)}
                className="px-4 py-2 rounded-lg text-xs font-mono font-medium bg-[#BA5227] text-[#FAF8F5] hover:bg-[#CF6234] transition-all cursor-pointer"
              >
                Inspect Architecture &rarr;
              </button>
            </div>
          </div>
        </section>

        {/* ACT IV: CRAFT */}
        <section
          id="act-4-craft"
          aria-label="Act IV — The Craft"
          className="relative rounded-3xl overflow-hidden border border-[#E8E2D8]/15 bg-[#1C1512]/60 p-8 sm:p-12 shadow-2xl"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(14,12,10,0.92) 50%, rgba(14,12,10,0.65)), url(${CINEMATIC_CLIPS[3].poster})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#E5C358] mb-4">
              ACT IV — THE CRAFT
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

        {/* ACT V: CONTACT */}
        <section
          id="act-5-beyond"
          aria-label="Act V — The Horizon"
          className="relative rounded-3xl overflow-hidden border border-[#E8E2D8]/15 bg-[#1C1512]/60 p-8 sm:p-12 shadow-2xl"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(14,12,10,0.92) 50%, rgba(14,12,10,0.65)), url(${CINEMATIC_CLIPS[4].poster})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono border border-[#BA5227]/30 bg-[#BA5227]/10 text-[#E59368] mb-4">
              ACT V — THE HORIZON
            </span>
            <h2 className="text-3xl sm:text-5xl font-heading font-bold text-[#FAF8F5] mb-3">
              Let&apos;s build something together.
            </h2>
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
                    {copied ? 'Copied!' : 'Copy'}
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

      {/* Accessible Footer */}
      <footer className="border-t border-[#E8E2D8]/10 py-8 px-6 text-center text-xs font-mono text-[#A89D8F]">
        <span>FAROUK MESSAI — Software Developer | Mobile &amp; Web Development • © 2026</span>
      </footer>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={modalProject}
        isOpen={Boolean(modalProject)}
        onClose={() => setModalProject(null)}
      />
    </div>
  );
}

