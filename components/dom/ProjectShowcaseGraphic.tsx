'use client';

import React from 'react';

interface ProjectShowcaseGraphicProps {
  projectId: string;
}

export function ProjectShowcaseGraphic({ projectId }: ProjectShowcaseGraphicProps) {
  switch (projectId) {
    case 'mediconnect':
      return (
        <div className="relative w-full h-full p-3 sm:p-4 flex items-center justify-between gap-3 select-none overflow-hidden">
          {/* Subtle Ambient Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#BA5227]/15 via-transparent to-[#D4AF37]/5 pointer-events-none" />

          {/* Left: True 9:19.5 Smartphone Frame */}
          <div className="relative w-[110px] sm:w-[125px] h-[94%] rounded-[20px] bg-[#120D0B] border border-[#E8E2D8]/20 shadow-2xl p-1.5 flex flex-col justify-between shrink-0">
            {/* Dynamic Island */}
            <div className="w-10 h-2 rounded-full bg-black mx-auto mb-1 flex items-center justify-end px-1">
              <span className="w-1 h-1 rounded-full bg-[#34D399] animate-pulse" />
            </div>

            {/* Video Consultation Window */}
            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-gradient-to-br from-[#2A1D17] to-[#140F0C] border border-[#BA5227]/30 p-1 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[6.5px] font-mono">
                <span className="px-1 rounded bg-black/60 text-[#FAF8F5]">Dr. Benali</span>
                <span className="text-[#34D399]">Live</span>
              </div>
              <div className="w-7 h-7 rounded-full bg-[#BA5227]/30 border border-[#BA5227]/60 mx-auto flex items-center justify-center">
                <svg className="w-4 h-4 text-[#FAF8F5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="text-[6px] font-mono text-[#FAF8F5]/80 text-center">WebRTC 1080p</div>
            </div>

            {/* In-Call Telehealth Vitals Card */}
            <div className="w-full rounded-lg bg-black/50 border border-[#E8E2D8]/10 p-1 flex flex-col gap-0.5">
              <div className="flex items-center justify-between text-[6.5px] font-mono">
                <span className="text-[#A89D8F]">Pulse</span>
                <span className="text-[#D4AF37]">72 BPM</span>
              </div>
              <div className="h-1 w-full bg-[#BA5227]/40 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-[#BA5227]" />
              </div>
            </div>

            {/* Bottom Nav Mock */}
            <div className="flex items-center justify-around py-0.5 border-t border-[#E8E2D8]/10 text-[6.5px] font-mono text-[#D6CEC2]">
              <span className="text-[#BA5227] font-bold">Call</span>
              <span>Chat</span>
              <span>QR</span>
            </div>
          </div>

          {/* Center: Real-Time Signaling Topology Connector */}
          <div className="hidden sm:flex flex-col items-center justify-center gap-1.5 flex-1 min-w-0">
            <span className="text-[8px] font-mono text-[#D4AF37] uppercase tracking-wider">FastAPI Gateway</span>
            <div className="w-full flex items-center justify-center gap-1">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-[#BA5227] to-[#D4AF37]" />
              <div className="px-2 py-0.5 rounded-full bg-[#1C1512] border border-[#D4AF37]/40 text-[7px] font-mono text-[#FAF8F5] shrink-0">
                P2P Signaling
              </div>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-[#D4AF37] to-[#34D399]" />
            </div>
            <div className="flex items-center gap-2 text-[7px] font-mono text-[#A89D8F]">
              <span>WebSocket &bull; 12ms</span>
              <span className="text-[#34D399]">Encrypted &bull; TLS 1.3</span>
            </div>
          </div>

          {/* Right: Clinical Triage & Practitioner Console Preview */}
          <div className="flex-1 sm:max-w-[190px] h-[94%] rounded-2xl bg-[#140F0C]/90 border border-[#E8E2D8]/15 p-2 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between pb-1 border-b border-[#E8E2D8]/10 text-[8px] font-mono">
              <span className="text-[#FAF8F5] font-bold">Clinical Console</span>
              <span className="text-[#34D399] flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-[#34D399]" />
                Online
              </span>
            </div>

            <div className="flex flex-col gap-1.5 my-1 text-[7.5px] font-mono">
              <div className="p-1 rounded-lg bg-black/40 border border-[#BA5227]/30 flex items-center justify-between">
                <span className="text-[#D6CEC2]">Triage Status</span>
                <span className="text-[#E59368] font-bold">AI Verified</span>
              </div>
              <div className="p-1 rounded-lg bg-black/40 border border-[#D4AF37]/30 flex items-center justify-between">
                <span className="text-[#D6CEC2]">Encrypted QR</span>
                <span className="text-[#D4AF37] font-bold">ID #8492</span>
              </div>
              <div className="p-1 rounded-lg bg-black/40 border border-[#E8E2D8]/10 flex items-center justify-between">
                <span className="text-[#D6CEC2]">Database</span>
                <span className="text-[#FAF8F5]">Supabase PG</span>
              </div>
            </div>

            <div className="pt-1 border-t border-[#E8E2D8]/10 flex items-center justify-between text-[7px] font-mono text-[#A89D8F]">
              <span>Session: <strong className="text-[#FAF8F5]">Active</strong></span>
              <span>Audio: <strong className="text-[#34D399]">Stereo</strong></span>
            </div>
          </div>
        </div>
      );

    case 'smart-class':
      return (
        <div className="relative w-full h-full p-3 sm:p-4 flex items-center justify-between gap-3 select-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/15 via-transparent to-[#BA5227]/5 pointer-events-none" />

          {/* Full-Width Browser/Tablet Architectural Frame */}
          <div className="relative w-full h-[94%] rounded-2xl bg-[#120D0B] border border-[#E8E2D8]/20 shadow-2xl p-2 sm:p-2.5 flex flex-col justify-between">
            {/* Window Chrome Header */}
            <div className="flex items-center justify-between pb-1.5 border-b border-[#E8E2D8]/10 text-[8px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="ml-1 text-[#D4AF37] font-bold">Smart Class &bull; Flutter &amp; pgvector</span>
              </div>
              <span className="text-[#34D399] font-bold">RAG Studio Active</span>
            </div>

            {/* Split Learning Studio Content */}
            <div className="grid grid-cols-2 gap-2 my-1 flex-1 min-h-0">
              {/* Left: Chalkboard Lecture Video Panel */}
              <div className="rounded-xl bg-black/60 border border-[#BA5227]/30 p-2 flex flex-col justify-between">
                <div className="flex items-center justify-between text-[7.5px] font-mono text-[#D4AF37]">
                  <span>Lecture 04: Linear Algebra</span>
                  <span className="text-[#FAF8F5]">14:28</span>
                </div>
                {/* Chalkboard Waveform Graphic */}
                <div className="flex items-end justify-center gap-1 h-9 py-0.5">
                  {[35, 75, 45, 90, 60, 100, 50, 80, 65, 95, 40, 85].map((h, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-gradient-to-t from-[#BA5227] to-[#D4AF37] rounded-full"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between text-[7px] font-mono text-[#A89D8F]">
                  <span>Interactive Timestamps</span>
                  <span className="text-[#34D399]">Synchronized ✓</span>
                </div>
              </div>

              {/* Right: RAG AI Pedagogical Tutor Panel */}
              <div className="rounded-xl bg-[#1A1411] border border-[#D4AF37]/30 p-2 flex flex-col justify-between text-[7.5px] font-mono">
                <div className="p-1.5 rounded-lg bg-[#2A1D17] text-[#FAF8F5] border border-[#BA5227]/40 leading-snug">
                  <span className="text-[#E59368] font-bold">AI Tutor: </span>
                  Matching embeddings via cosine similarity in PostgreSQL 17...
                </div>
                <div className="p-1 rounded bg-black/50 text-[#D4AF37] self-end border border-[#D4AF37]/30">
                  98.4% Contextual Match
                </div>
                <div className="flex items-center justify-between text-[7px] text-[#A89D8F]">
                  <span>Embeddings: 1536d</span>
                  <span className="text-[#34D399]">Riverpod State OK</span>
                </div>
              </div>
            </div>

            {/* Bottom Metrics Bar */}
            <div className="flex items-center justify-between pt-1 border-t border-[#E8E2D8]/10 text-[8px] font-mono text-[#D6CEC2]">
              <span>Active Enrollment: <strong className="text-[#FAF8F5]">1,240+ Students</strong></span>
              <span>Comprehension Score: <strong className="text-[#34D399]">94.8%</strong></span>
            </div>
          </div>
        </div>
      );

    case 'nexform':
      return (
        <div className="relative w-full h-full p-3 sm:p-4 flex items-center justify-between gap-3 select-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/15 via-transparent to-[#3B82F6]/10 pointer-events-none" />

          {/* 3D WebGL Configurator Viewport Frame */}
          <div className="relative w-full h-[94%] rounded-2xl bg-[#0E0C0A] border border-[#D4AF37]/35 shadow-2xl p-2 sm:p-2.5 flex flex-col justify-between">
            {/* Viewport Top Bar */}
            <div className="flex items-center justify-between pb-1 border-b border-[#E8E2D8]/10 text-[8px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-[#BA5227]/30 text-[#E59368] font-bold">THREE.JS / R3F</span>
                <span className="text-[#FAF8F5]">Setup Studio &bull; Parametric Customizer</span>
              </div>
              <span className="text-[#34D399] font-bold">60.0 FPS</span>
            </div>

            {/* Isometric 3D Viewport Representation */}
            <div className="relative flex-1 my-1 rounded-xl bg-gradient-to-b from-black/90 to-[#140F0C] border border-[#E8E2D8]/10 flex items-center justify-between px-4 overflow-hidden">
              {/* Isometric 3D Room Grid */}
              <svg className="w-48 h-28 opacity-80" viewBox="0 0 200 120" fill="none">
                {/* Floor Grid */}
                <polygon points="100,15 170,50 100,85 30,50" stroke="#D4AF37" strokeWidth="1" strokeOpacity="0.4" fill="#D4AF37" fillOpacity="0.05" />
                <line x1="100" y1="15" x2="100" y2="85" stroke="#D4AF37" strokeWidth="0.75" strokeOpacity="0.3" strokeDasharray="2 2" />
                <line x1="30" y1="50" x2="170" y2="50" stroke="#D4AF37" strokeWidth="0.75" strokeOpacity="0.3" strokeDasharray="2 2" />

                {/* 3D Desk Geometry */}
                <polygon points="100,35 145,55 100,75 55,55" stroke="#BA5227" strokeWidth="1.5" fill="#BA5227" fillOpacity="0.3" />
                <polygon points="55,55 100,75 100,95 55,75" stroke="#BA5227" strokeWidth="1.5" fill="#BA5227" fillOpacity="0.4" />
                <polygon points="100,75 145,55 145,75 100,95" stroke="#BA5227" strokeWidth="1.5" fill="#BA5227" fillOpacity="0.5" />

                {/* Monitor Rig */}
                <rect x="85" y="30" width="30" height="18" rx="2" stroke="#FAF8F5" strokeWidth="1" fill="#FAF8F5" fillOpacity="0.25" />
              </svg>

              {/* Material Customizer & PBR Parameters */}
              <div className="flex flex-col gap-1.5 bg-black/60 p-2 rounded-xl border border-[#D4AF37]/30 text-[7.5px] font-mono">
                <span className="text-[#A89D8F] uppercase">PBR Material Model</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#D4AF37] border border-white shadow-sm" />
                  <span className="w-3 h-3 rounded-full bg-[#1C1512] border border-[#E8E2D8]/40" />
                  <span className="w-3 h-3 rounded-full bg-[#8E7970] border border-[#E8E2D8]/40" />
                </div>
                <div className="flex items-center justify-between text-[#D6CEC2] pt-1 border-t border-white/10">
                  <span>Roughness: 0.18</span>
                  <span className="text-[#D4AF37]">Metallic</span>
                </div>
              </div>
            </div>

            {/* Bottom Status / Hardware Clearance */}
            <div className="flex items-center justify-between pt-1 border-t border-[#E8E2D8]/10 text-[8px] font-mono text-[#D6CEC2]">
              <span>Dimensions: <strong className="text-[#FAF8F5]">180 &times; 85 cm</strong></span>
              <span className="text-[#34D399]">Clearance Validated &bull; Cart Connected ✓</span>
            </div>
          </div>
        </div>
      );

    case 'linguamate':
      return (
        <div className="relative w-full h-full p-3 sm:p-4 flex items-center justify-between gap-3 select-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#BA5227]/15 via-transparent to-[#D4AF37]/5 pointer-events-none" />

          {/* Left: 9:19.5 Smartphone Frame */}
          <div className="relative w-[110px] sm:w-[125px] h-[94%] rounded-[20px] bg-[#120D0B] border border-[#E8E2D8]/20 shadow-2xl p-1.5 flex flex-col justify-between shrink-0">
            {/* Dynamic Island */}
            <div className="w-10 h-2 rounded-full bg-black mx-auto mb-1 flex items-center justify-center">
              <span className="w-1 h-1 rounded-full bg-[#E59368]" />
            </div>

            {/* Conversation Dialogue Bubbles */}
            <div className="flex flex-col gap-1 my-0.5 text-[6.5px] font-mono">
              <div className="p-1 rounded-lg bg-[#2A1D17] border border-[#BA5227]/30 text-[#FAF8F5]">
                <span className="text-[#E59368] font-bold">AI:</span> Bonjour, comment vas-tu?
              </div>
              <div className="p-1 rounded-lg bg-[#1A1411] border border-[#D4AF37]/30 text-[#FAF8F5] self-end max-w-[90%]">
                <span className="text-[#D4AF37] font-bold">You:</span> Je vais très bien!
              </div>
            </div>

            {/* Phonetic Score Pill */}
            <div className="rounded-lg bg-black/60 border border-[#34D399]/40 p-1 flex items-center justify-between text-[7px] font-mono">
              <span className="text-[#A89D8F]">Accuracy</span>
              <span className="text-[#34D399] font-bold">98.2%</span>
            </div>

            {/* Mini Waveform */}
            <div className="flex items-center justify-center gap-0.5 h-4 py-0.5">
              {[20, 60, 100, 40, 80, 50, 90, 30].map((h, i) => (
                <div key={i} className="w-1 bg-[#BA5227] rounded-full" style={{ height: `${h}%` }} />
              ))}
            </div>

            <div className="py-0.5 border-t border-[#E8E2D8]/10 text-[6.5px] font-mono text-center text-[#D6CEC2]">
              Riverpod &bull; Supabase
            </div>
          </div>

          {/* Center / Right: Speech Recognition Pipeline & Vocabulary Studio */}
          <div className="flex-1 h-[94%] rounded-2xl bg-[#140F0C]/90 border border-[#E8E2D8]/15 p-2 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between pb-1 border-b border-[#E8E2D8]/10 text-[8px] font-mono">
              <span className="text-[#FAF8F5] font-bold">Speech Dialogue Engine</span>
              <span className="text-[#34D399]">Real-Time TTS</span>
            </div>

            <div className="flex flex-col gap-1.5 my-1 text-[7.5px] font-mono">
              <div className="p-1.5 rounded-lg bg-black/40 border border-[#BA5227]/30 flex items-center justify-between">
                <span className="text-[#D6CEC2]">Phonetic Engine</span>
                <span className="text-[#E59368] font-bold">Whisper STT</span>
              </div>
              <div className="p-1.5 rounded-lg bg-black/40 border border-[#D4AF37]/30 flex items-center justify-between">
                <span className="text-[#D6CEC2]">Vocabulary Cache</span>
                <span className="text-[#D4AF37] font-bold">Secure Local Storage</span>
              </div>
              <div className="p-1.5 rounded-lg bg-black/40 border border-[#E8E2D8]/10 flex items-center justify-between">
                <span className="text-[#D6CEC2]">Audio Latency</span>
                <span className="text-[#34D399]">&lt; 35ms Native</span>
              </div>
            </div>

            <div className="pt-1 border-t border-[#E8E2D8]/10 flex items-center justify-between text-[7px] font-mono text-[#A89D8F]">
              <span>Languages: <strong className="text-[#FAF8F5]">FR / EN / ES</strong></span>
              <span className="text-[#34D399]">Sync OK ✓</span>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="w-full h-full flex items-center justify-center p-6 text-center text-[#D6CEC2] font-mono text-xs">
          <span>Architectural System Blueprint</span>
        </div>
      );
  }
}
