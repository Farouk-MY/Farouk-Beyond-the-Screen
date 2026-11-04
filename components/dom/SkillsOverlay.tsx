'use client';

import React, { useState } from 'react';
import { SKILLS_DATA } from '@/config/portfolioData';
import type { SkillCategory, SkillItem } from '@/types/portfolio';

const CATEGORIES: { id: SkillCategory; label: string }[] = [
  { id: 'all', label: 'All Domains' },
  { id: 'web', label: 'Web Development' },
  { id: 'mobile', label: 'Mobile Apps' },
  { id: 'backend', label: 'Backend & DB' },
  { id: 'tools', label: 'Tools & DevOps' },
];

export function SkillsOverlay() {
  const [activeCategory, setActiveCategory] = useState<SkillCategory>('all');

  const filteredSkills =
    activeCategory === 'all'
      ? SKILLS_DATA
      : SKILLS_DATA.filter((skill) => skill.category === activeCategory);

  const getCategoryColor = (category: SkillItem['category']) => {
    switch (category) {
      case 'web':
        return 'text-[#00F2FE] border-[#00F2FE]/30 bg-[#00F2FE]/10';
      case 'mobile':
        return 'text-[#FF9F43] border-[#FF9F43]/30 bg-[#FF9F43]/10';
      case 'backend':
        return 'text-[#38F9D7] border-[#38F9D7]/30 bg-[#38F9D7]/10';
      case 'tools':
        return 'text-[#A0AEC0] border-[#A0AEC0]/30 bg-[#A0AEC0]/10';
    }
  };

  return (
    <section
      id="act-4-craft"
      aria-label="Act IV — The Craft: Innovation Lab & Engineering Mastery"
      className="relative min-h-[175vh] flex flex-col justify-center p-6 sm:p-12 lg:p-16 pointer-events-none"
    >
      {/* Left-aligned floating panel allowing the innovation lab central installation to remain visible */}
      <div className="max-w-2xl lg:max-w-3xl pointer-events-auto">
        {/* Act Badging */}
        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono border border-[#00F2FE]/30 bg-[#00F2FE]/10 text-[#00F2FE] shadow-[0_0_12px_#00F2FE20]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F2FE]" />
            ACT IV — THE CRAFT
          </span>
          <span className="text-[11px] font-mono tracking-widest text-[#8E9CAE] uppercase">
            Innovation Lab & Engineering Systems
          </span>
        </div>

        {/* Title & Description */}
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F3F6FA] mb-3">
          Engineering Domains
        </h2>
        <p className="text-sm sm:text-base text-[#8E9CAE] leading-relaxed mb-6 max-w-xl">
          Core technical competencies honed across production platforms. Verified skills organized by architectural
          specialization.
        </p>

        {/* Interactive Category Filter Tabs */}
        <div
          role="tablist"
          aria-label="Skill Categories"
          className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl border border-[#1C222D] bg-[#11141A]/90 backdrop-blur-md mb-6 w-fit max-w-full"
          onKeyDown={(e) => {
            const currentIndex = CATEGORIES.findIndex((c) => c.id === activeCategory);
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
              e.preventDefault();
              const nextIndex = (currentIndex + 1) % CATEGORIES.length;
              setActiveCategory(CATEGORIES[nextIndex].id);
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
              e.preventDefault();
              const prevIndex = (currentIndex - 1 + CATEGORIES.length) % CATEGORIES.length;
              setActiveCategory(CATEGORIES[prevIndex].id);
            }
          }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#00F2FE]/15 text-[#00F2FE] border border-[#00F2FE]/40 shadow-[0_0_12px_#00F2FE22]'
                    : 'text-[#8E9CAE] hover:text-[#F3F6FA] border border-transparent'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[500px] overflow-y-auto pr-1">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="p-3.5 rounded-xl border border-[#1C222D] bg-[#11141A]/85 backdrop-blur-sm hover:border-[#00F2FE]/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h3 className="text-xs font-mono font-bold text-[#F3F6FA] group-hover:text-[#00F2FE] transition-colors">
                    {skill.name}
                  </h3>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded-full uppercase border ${getCategoryColor(
                      skill.category
                    )}`}
                  >
                    {skill.category}
                  </span>
                </div>
                <p className="text-[11px] text-[#8E9CAE] leading-normal">{skill.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Archipelago Connection Footnote */}
        <div className="mt-4 flex items-center gap-2 text-[11px] font-mono text-[#8E9CAE]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00F2FE]" />
          <span>Navigating crystalline bridges connecting Web, Mobile, and Cloud islands</span>
        </div>
      </div>
    </section>
  );
}

