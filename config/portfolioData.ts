import type { DeveloperProfile, SkillItem, ProjectItem } from '@/types/portfolio';

export const DEVELOPER_PROFILE: DeveloperProfile = {
  name: 'Farouk Messai',
  title: 'Software Developer | Mobile & Web Development',
  tagline:
    'Engineering responsive web applications, cross-platform mobile systems, and creative digital interfaces with clean architecture and modern design principles.',
  bioIntroduction:
    'Software developer focused on building robust web ecosystems and cross-platform mobile applications. Committed to clean code, component-driven design systems, and thoughtful user experiences.',
  journeyNarrative: {
    part1Title: '01 / The Local Sanctuary',
    part1Body:
      'The journey started at the developer workstation — exploring core algorithms, experimenting with interface interactions, and understanding the nuances of clean software architecture.',
    part2Title: '02 / Crossing Into Scale',
    part2Body:
      'Local experiments evolved into distributed applications. Moving from isolated codebases toward full-stack integrations required mastering data schemas, asynchronous workflows, and API design.',
    part3Title: '03 / Modern Web & Mobile Frontier',
    part3Body:
      'Today, engineering focuses on unified user experiences across web and mobile surfaces — leveraging TypeScript, modern frameworks, and component-driven modularity to build reliable production tools.',
  },
  contact: {
    email: 'farouk.messai.dev@gmail.com',
    github: 'https://github.com/Farouk-MY',
    linkedin: 'https://linkedin.com/in/faroukmessai',
    location: 'Algeria (Available for Remote Worldwide)',
    availability: 'Open to Software Developer Roles & Collaborative Projects',
  },
};

export const ENGINEERING_DOMAINS = [
  {
    id: 'web',
    title: 'Web Development',
    description: 'Component-driven, server-rendered and responsive web architectures with modern TypeScript and React.',
    technologies: ['Next.js (App Router)', 'React 19', 'TypeScript', 'Tailwind CSS', 'Three.js / WebGL'],
  },
  {
    id: 'mobile',
    title: 'Mobile Development',
    description: 'High-performance cross-platform iOS & Android applications with native feel and reactive state.',
    technologies: ['Flutter / Dart', 'React Native (Expo SDK)', 'Riverpod', 'Zustand', 'Platform Channels'],
  },
  {
    id: 'backend',
    title: 'Backend & Data',
    description: 'Scalable RESTful services, real-time database schemas, authentication, and relational data modeling.',
    technologies: ['Node.js & Express', 'FastAPI (Python)', 'PostgreSQL', 'Supabase', 'Prisma ORM'],
  },
  {
    id: 'ai-systems',
    title: 'AI & Intelligent Systems',
    description: 'Pragmatic AI integrations, vector embeddings with pgvector, and Retrieval-Augmented Generation workflows.',
    technologies: ['RAG Architectures', 'pgvector / ChromaDB', 'LLM Tool Calling', 'WebSocket Signaling', 'Git / CI/CD'],
  },
];

export const SKILLS_DATA: SkillItem[] = [
  // Web Development
  { id: 'nextjs', name: 'Next.js (App Router)', category: 'web', role: 'Full-stack React framework with SSR and streaming', featured: true },
  { id: 'react', name: 'React', category: 'web', role: 'Component-based reactive UI architecture', featured: true },
  { id: 'typescript', name: 'TypeScript', category: 'web', role: 'Strict static type safety and contract-driven interfaces', featured: true },
  { id: 'threejs', name: 'Three.js', category: 'web', role: 'Interactive 3D canvas rendering and shaders', featured: true },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'web', role: 'Utility-first responsive design systems', featured: true },
  { id: 'javascript', name: 'JavaScript (ES6+)', category: 'web', role: 'Modern language primitives and asynchronous patterns' },
  { id: 'html_css', name: 'HTML5 & Semantic Web', category: 'web', role: 'Accessible DOM structuring and web standards' },

  // Mobile Development
  { id: 'flutter', name: 'Flutter', category: 'mobile', role: 'Declarative cross-platform mobile UI engineering', featured: true },
  { id: 'dart', name: 'Dart', category: 'mobile', role: 'Strongly-typed language powering Flutter apps', featured: true },
  { id: 'react_native', name: 'React Native (Expo)', category: 'mobile', role: 'Cross-platform iOS & Android mobile systems', featured: true },
  { id: 'mobile_ux', name: 'Mobile UI/UX', category: 'mobile', role: 'Platform-native Material Design and iOS patterns' },
  { id: 'state_mgmt', name: 'State Management', category: 'mobile', role: 'Predictable reactive state with Riverpod & Zustand' },

  // Backend & Databases
  { id: 'nodejs', name: 'Node.js', category: 'backend', role: 'Asynchronous event-driven server runtime', featured: true },
  { id: 'express', name: 'Express.js', category: 'backend', role: 'RESTful API routing and middleware pipelines' },
  { id: 'fastapi', name: 'FastAPI (Python)', category: 'backend', role: 'High-performance asynchronous Python REST APIs', featured: true },
  { id: 'postgresql', name: 'PostgreSQL', category: 'backend', role: 'Relational data modeling, indexing, and pgvector', featured: true },
  { id: 'supabase', name: 'Supabase', category: 'backend', role: 'Postgres cloud backend with auth, storage, and real-time', featured: true },
  { id: 'prisma', name: 'Prisma ORM', category: 'backend', role: 'Type-safe database ORM and migrations' },

  // Tools & Technologies
  { id: 'git', name: 'Git & GitHub', category: 'tools', role: 'Version control, branch workflows, and code review', featured: true },
  { id: 'turbopack', name: 'Turbopack / Vite', category: 'tools', role: 'Rapid development bundling and build pipelines' },
  { id: 'docker', name: 'Docker Containers', category: 'tools', role: 'Consistent containerized environments for service isolation' },
  { id: 'linux', name: 'Linux / Bash', category: 'tools', role: 'Server administration, script automation, and CLI workflows' },
];

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'mediconnect',
    name: 'MediConnect',
    tagline: 'Cross-Platform Telemedicine & Clinical Coordination System',
    category: 'mobile',
    categoryLabel: 'Mobile & Cloud System',
    description:
      'A comprehensive healthcare coordination system facilitating practitioner appointments, WebRTC video consultations, encrypted patient QR identification, and AI pre-consultation questionnaires.',
    technologies: ['React Native', 'Expo SDK 54', 'TypeScript', 'FastAPI', 'Python', 'WebRTC', 'Supabase / PostgreSQL', 'Zustand'],
    keyFeatures: [
      'Appointment booking with real-time practitioner schedule conflict resolution',
      'Native peer-to-peer WebRTC video consultations with WebSocket session signaling',
      'Encrypted patient QR code for rapid check-in at physical medical clinics',
      'Multilingual AI pre-consultation symptom questionnaire with structured triage flow',
    ],
    architectureOverview:
      'Engineered with React Native (Expo) on the mobile client communicating via WebSocket and REST to an asynchronous Python / FastAPI backend, supported by Supabase PostgreSQL.',
    status: 'Architecture Prototype',
    links: {
      github: null,
      live: null,
    },
    metrics: [
      { label: 'Mobile Client', value: 'Expo SDK 54 / RN' },
      { label: 'Backend API', value: 'FastAPI (Python)' },
      { label: 'Real-Time', value: 'WebRTC & WS' },
    ],
    visualAnchor: {
      sceneKey: 'mobile-display',
      timeSeconds: 3.5,
      label: 'Smartphone / Mobile Display',
    },
    coverImage: {
      src: '/projects/mediconnect/cover.webp',
      alt: 'MediConnect Telemedicine & Consultation Platform Preview',
      isPlaceholder: true,
    },
    galleryImages: [
      {
        src: '/projects/mediconnect/cover.webp',
        alt: 'MediConnect Architecture Overview',
        caption: 'Cross-platform Telemedicine & Clinical Coordination System',
        isPlaceholder: true,
      },
      {
        src: '/projects/mediconnect/screen-01.webp',
        alt: 'Client-to-Signaling Node Flow',
        caption: 'React Native (Expo) client signaling pipeline to FastAPI gateway',
        isPlaceholder: true,
      },
      {
        src: '/projects/mediconnect/screen-02.webp',
        alt: 'WebRTC P2P Session Lifecycle',
        caption: 'Peer-to-peer encrypted WebRTC session handshake and telemetry',
        isPlaceholder: true,
      },
    ],
    featured: true,
  },
  {
    id: 'smart-class',
    name: 'Smart Class',
    tagline: 'Intelligent Collaborative Virtual Learning & Pedagogical Platform',
    category: 'mobile',
    categoryLabel: 'Cross-Platform & Cloud',
    description:
      'A virtual classroom ecosystem combining multi-surface Flutter client applications with local AI-assisted course creation, intelligent lecture video navigation, and self-hosted pedagogical tutoring.',
    technologies: ['Flutter', 'Dart', 'Riverpod', 'Node.js', 'Express', 'TypeScript', 'PostgreSQL 17', 'pgvector', 'Prisma ORM'],
    keyFeatures: [
      'AI Course Creator & Pedagogical Studio with structured prompt templates',
      'Conversational AI Tutor using pgvector for Retrieval-Augmented Generation (RAG)',
      'Interactive Course Reader with chalkboard video player and clickable timestamp markers',
      'Study tool suite including automated lecture summaries and animated flip-card memory decks',
    ],
    architectureOverview:
      'Built with Flutter across web, tablet, and mobile utilizing Riverpod for reactive state, supported by a Node.js / Express backend with Prisma ORM and PostgreSQL with pgvector.',
    status: 'Completed Application',
    links: {
      github: null,
      live: null,
    },
    metrics: [
      { label: 'UI Client', value: 'Flutter / Riverpod' },
      { label: 'Backend API', value: 'Node.js / Express' },
      { label: 'Vector Store', value: 'PostgreSQL pgvector' },
    ],
    visualAnchor: {
      sceneKey: 'dashboard-display',
      timeSeconds: 6.0,
      label: 'Dashboard / Learning Platform Display',
    },
    coverImage: {
      src: '/projects/smart-class/cover.webp',
      alt: 'Smart Class Education Management & Analytics Platform Preview',
      isPlaceholder: true,
    },
    galleryImages: [
      {
        src: '/projects/smart-class/cover.webp',
        alt: 'Smart Class Analytics Dashboard',
        caption: 'Institutional Education Management & Real-Time Analytics',
        isPlaceholder: true,
      },
      {
        src: '/projects/smart-class/screen-01.webp',
        alt: 'Real-time Analytics Pipeline',
        caption: 'Edge aggregator and Prisma ORM data progression pipeline',
        isPlaceholder: true,
      },
    ],
    featured: true,
  },
  {
    id: 'nexform',
    name: 'NEXFORM',
    tagline: 'Interactive 3D Setup Studio & Product Customization Platform',
    category: 'web',
    categoryLabel: '3D Web Platform',
    description:
      'A connected design-to-purchase 3D e-commerce platform featuring an interactive Setup Studio for designing gaming and workspace environments, a compatibility-aware PC builder, and real-time 3D product customization.',
    technologies: ['Next.js (App Router)', 'React', 'Three.js', 'React Three Fiber', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Zustand', 'Zod'],
    keyFeatures: [
      'Browser-based 3D Setup Studio for assembling desks, monitors, and peripherals in a dimensional room editor',
      'Real-time 3D product customization with material switches, dimension inspection, and clearance validation',
      'PC Lab compatibility engine validating physical clearances and component form factors',
      'Connected design-to-purchase cart system linking 3D scene elements directly to checkout',
    ],
    architectureOverview:
      'Constructed with Next.js App Router and React Three Fiber / Three.js for real-time WebGL rendering, backed by Supabase PostgreSQL and Zustand for scene state management.',
    status: 'Production Prototype',
    links: {
      github: null,
      live: null,
    },
    metrics: [
      { label: '3D Engine', value: 'React Three Fiber' },
      { label: 'Scene State', value: 'Zustand Graph' },
      { label: 'Framework', value: 'Next.js App Router' },
    ],
    visualAnchor: {
      sceneKey: '3d-configurator',
      timeSeconds: 8.5,
      label: '3D Controller Configurator',
    },
    coverImage: {
      src: '/projects/nexform/cover.webp',
      alt: 'NEXFORM 3D Product Customization Engine Preview',
      isPlaceholder: true,
    },
    galleryImages: [
      {
        src: '/projects/nexform/cover.webp',
        alt: 'NEXFORM 3D Viewport',
        caption: 'Interactive 3D Setup Studio & Product Customization Platform',
        isPlaceholder: true,
      },
      {
        src: '/projects/nexform/screen-01.webp',
        alt: 'GLSL Shader Pipeline',
        caption: 'Custom PBR material model and HDR reflection pipeline',
        isPlaceholder: true,
      },
    ],
    featured: true,
  },
  {
    id: 'linguamate',
    name: 'LinguaMate',
    tagline: 'Multilingual AI Companion & Interactive Language Learning App',
    category: 'mobile',
    categoryLabel: 'Mobile Application',
    description:
      'A cross-platform mobile application combining real-time speech dialogue, interactive pronunciation feedback, and vocabulary retention algorithms to assist learners in mastering new languages.',
    technologies: ['Flutter', 'Dart', 'Riverpod', 'Supabase', 'GoRouter', 'Dio', 'Flutter TTS', 'Speech-to-Text', 'Secure Storage'],
    keyFeatures: [
      'Interactive conversational speech scenarios with real-time text-to-speech and voice recognition',
      'Dynamic vocabulary review with local secure storage and offline history caching',
      'Supabase cloud integration for user profile synchronization and backend edge services',
      'Multilingual interface support with fluid reactive UI powered by Flutter Riverpod',
    ],
    architectureOverview:
      'Constructed natively in Flutter and Dart with Riverpod for state management, Dio for network communications, Supabase for cloud data persistence and authentication, and native audio/speech plugins.',
    status: 'Production Prototype',
    links: {
      github: null,
      live: null,
    },
    metrics: [
      { label: 'Framework', value: 'Flutter (Dart)' },
      { label: 'State Mgmt', value: 'Riverpod' },
      { label: 'Backend', value: 'Supabase Cloud' },
    ],
    visualAnchor: {
      sceneKey: 'mobile-display',
      timeSeconds: 3.5,
      label: 'Smartphone / Mobile Display',
    },
    coverImage: {
      src: '/projects/linguamate/cover.webp',
      alt: 'LinguaMate Language Learning Companion Preview',
      isPlaceholder: true,
    },
    galleryImages: [
      {
        src: '/projects/linguamate/cover.webp',
        alt: 'LinguaMate Dual-Surface UI',
        caption: 'Conversational Speech Dialogue & Language Learning App',
        isPlaceholder: true,
      },
      {
        src: '/projects/linguamate/screen-01.webp',
        alt: 'Speech Analysis Pipeline',
        caption: 'Whisper ASR and phonetic accuracy scoring pipeline',
        isPlaceholder: true,
      },
    ],
    featured: true,
  },
];
