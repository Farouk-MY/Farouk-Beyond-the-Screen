import type { DeveloperProfile, SkillItem, ProjectItem } from '@/types/portfolio';

export const DEVELOPER_PROFILE: DeveloperProfile = {
  name: 'Farouk Messai',
  title: 'Software Developer | Mobile & Web Development',
  tagline: 'Engineering responsive web applications, interactive 3D platforms, and cross-platform mobile systems with clean architecture and modern user interfaces.',
  bioIntroduction:
    'Software developer specializing in modern web ecosystems, 3D WebGL interfaces, and cross-platform mobile applications. Focused on translating complex system requirements into performant, intuitive, and architecturally resilient software solutions.',
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
    github: 'https://github.com/faroukmessai',
    linkedin: 'https://linkedin.com/in/faroukmessai',
    location: 'Algeria (Available for Remote Worldwide)',
    availability: 'Open to Software Developer Roles & Collaborative Projects',
  },
};

export const SKILLS_DATA: SkillItem[] = [
  // Web Development
  { id: 'nextjs', name: 'Next.js (App Router)', category: 'web', role: 'Full-stack React framework for SSR and static generation', featured: true },
  { id: 'react', name: 'React', category: 'web', role: 'Component-based reactive UI architecture', featured: true },
  { id: 'typescript', name: 'TypeScript', category: 'web', role: 'Strict static type safety and scalable interface contracts', featured: true },
  { id: 'threejs', name: 'Three.js / React Three Fiber', category: 'web', role: 'Interactive 3D canvas rendering, scene graphs, and shaders', featured: true },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'web', role: 'Utility-first modern responsive design system', featured: true },
  { id: 'javascript', name: 'JavaScript (ES6+)', category: 'web', role: 'Modern language primitives and asynchronous patterns' },
  { id: 'html_css', name: 'HTML5 & Semantic Web', category: 'web', role: 'Accessible DOM structuring and modern web standards' },

  // Mobile Development
  { id: 'flutter', name: 'Flutter', category: 'mobile', role: 'Declarative high-performance cross-platform mobile UI', featured: true },
  { id: 'dart', name: 'Dart', category: 'mobile', role: 'Strongly-typed language powering Flutter ecosystems', featured: true },
  { id: 'react_native', name: 'React Native (Expo SDK)', category: 'mobile', role: 'Cross-platform native iOS & Android applications', featured: true },
  { id: 'mobile_ux', name: 'Mobile UI/UX Design', category: 'mobile', role: 'Platform-native guidelines (Material Design & Cupertino)' },
  { id: 'state_mgmt', name: 'State Management', category: 'mobile', role: 'Predictable client state with Riverpod and Zustand' },

  // Backend & Databases
  { id: 'nodejs', name: 'Node.js', category: 'backend', role: 'Asynchronous event-driven runtime environment', featured: true },
  { id: 'express', name: 'Express.js', category: 'backend', role: 'RESTful API routing and middleware pipelines' },
  { id: 'fastapi', name: 'FastAPI (Python)', category: 'backend', role: 'High-performance asynchronous Python REST APIs and WebSocket handling', featured: true },
  { id: 'postgresql', name: 'PostgreSQL', category: 'backend', role: 'Relational data modeling, indexing, and complex queries', featured: true },
  { id: 'supabase', name: 'Supabase', category: 'backend', role: 'Postgres cloud backend with real-time subscriptions, storage, and auth', featured: true },
  { id: 'prisma', name: 'Prisma ORM', category: 'backend', role: 'Type-safe database ORM and migration workflow' },
  { id: 'rest_apis', name: 'RESTful API Design', category: 'backend', role: 'Resource-oriented API schemas and HTTP status protocols' },

  // Tools & Technologies
  { id: 'git', name: 'Git & GitHub', category: 'tools', role: 'Version control, branch workflows, and PR code reviews', featured: true },
  { id: 'turbopack', name: 'Turbopack / Vite', category: 'tools', role: 'Rapid development bundling and build pipelines' },
  { id: 'docker', name: 'Docker Containers', category: 'tools', role: 'Consistent containerized environments for service isolation' },
  { id: 'postman', name: 'Postman', category: 'tools', role: 'API testing, request collection debugging, and documentation' },
  { id: 'linux', name: 'Linux / Bash', category: 'tools', role: 'Server administration, script automation, and CLI workflows' },
];

export const PROJECTS_DATA: ProjectItem[] = [
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
      'PC Lab compatibility engine validating physical clearances, form factors, and component specifications',
      'Connected design-to-purchase cart system linking 3D scene elements directly to catalog checkouts',
    ],
    architectureOverview:
      'Constructed with Next.js App Router and React Three Fiber / Three.js for real-time WebGL rendering, backed by Supabase PostgreSQL for catalog models and Zustand for reactive 3D scene state management.',
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
  },
  {
    id: 'mediconnect',
    name: 'MediConnect',
    tagline: 'Cross-Platform Telemedicine & Clinical Management System',
    category: 'mobile',
    categoryLabel: 'Mobile & Cloud System',
    description:
      'A comprehensive healthcare coordination system facilitating secure practitioner appointments, native WebRTC video consultations, encrypted patient QR identification, and multilingual AI pre-consultation questionnaires.',
    technologies: ['React Native', 'Expo SDK 54', 'TypeScript', 'FastAPI', 'Python', 'WebRTC', 'Supabase / PostgreSQL', 'Zustand', 'Groq & Gemini AI'],
    keyFeatures: [
      'Automated appointment booking with real-time practitioner schedule and availability conflict resolution',
      'Native peer-to-peer WebRTC video consultations with WebSocket session signaling',
      'Encrypted patient QR code for rapid check-in and identification at physical medical clinics',
      'Multilingual AI pre-consultation symptom questionnaire powered by Groq (Llama 3.3) and Google Gemini with medical RAG',
    ],
    architectureOverview:
      'Built with React Native (Expo Router) on the frontend communicating via WebSocket and REST to an asynchronous Python / FastAPI backend, backed by PostgreSQL (Supabase) with JWT authentication and ChromaDB vector search.',
    status: 'Architecture Prototype',
    links: {
      github: null,
      live: null,
    },
    metrics: [
      { label: 'Mobile Client', value: 'Expo SDK 54 / RN' },
      { label: 'Backend API', value: 'FastAPI (Python)' },
      { label: 'AI Engine', value: 'Groq & Gemini' },
    ],
  },
  {
    id: 'smart-class',
    name: 'Smart Class',
    tagline: 'Intelligent Collaborative Virtual Learning & Pedagogical Platform',
    category: 'mobile',
    categoryLabel: 'Cross-Platform & Cloud',
    description:
      'A privacy-first virtual classroom ecosystem combining multi-surface Flutter client applications with local AI-assisted course creation, intelligent lecture video navigation, and self-hosted pedagogical tutoring.',
    technologies: ['Flutter', 'Dart', 'Riverpod', 'Node.js', 'Express', 'TypeScript', 'PostgreSQL 17', 'pgvector', 'Prisma ORM'],
    keyFeatures: [
      'AI Course Creator & Pedagogical Studio with structured prompt chips and academic curriculum templates',
      'Conversational AI Tutor powered by self-hosted LLMs using pgvector for Retrieval-Augmented Generation (RAG)',
      'Interactive Course Reader featuring chalkboard video player with clickable AI timestamp markers',
      'Interactive study tools including AI lecture summaries and animated flip-card memory decks (Fiches Mémo)',
    ],
    architectureOverview:
      'Engineered with Flutter (Web, Tablet, Mobile) utilizing Riverpod for predictable reactive state, supported by a Node.js / Express backend with Prisma ORM and PostgreSQL with pgvector for local vector similarity embeddings.',
    status: 'Completed Application',
    links: {
      github: null,
      live: null,
    },
    metrics: [
      { label: 'UI Client', value: 'Flutter / Riverpod' },
      { label: 'Backend API', value: 'Node.js 24 / Express' },
      { label: 'Vector Store', value: 'PostgreSQL pgvector' },
    ],
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
      { label: 'State Mgmt', value: 'Riverpod 2.6' },
      { label: 'Backend', value: 'Supabase Cloud' },
    ],
  },
];
