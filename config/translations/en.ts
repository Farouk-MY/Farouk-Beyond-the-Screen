import type { TranslationDictionary } from './types';

export const enDictionary: TranslationDictionary = {
  locale: 'en',
  dir: 'ltr',
  meta: {
    title: 'Farouk Messai — Software Developer | Mobile & Web Development',
    description:
      'Cinematic digital portfolio of Farouk Messai, featuring production systems in Next.js, React Native, and Flutter across modern web and cross-platform architectures.',
    keywords: [
      'Farouk Messai',
      'Software Developer',
      'Mobile Development',
      'Web Development',
      'Flutter',
      'Next.js',
      'React Native',
      'TypeScript',
      'FastAPI',
      'Tunisia',
      'Portfolio',
    ],
    siteName: 'Farouk Messai — Portfolio',
    ogTitle: 'Farouk Messai — Software Developer | Mobile & Web Development',
    ogDescription:
      'Explore the continuous cinematic portfolio film of Farouk Messai, featuring production systems in Next.js, React Native, and Flutter.',
  },
  common: {
    openToWorkBadge: 'Open to PFE Internships & Junior Software Development Opportunities',
    downloadCv: 'Download CV',
    exploreWork: 'Explore Work',
    getInTouch: 'Get In Touch',
    letsTalk: "Let's Talk",
    close: 'Close',
    backToOrigin: 'Back to Origin ↑',
    averageResponse: 'Avg Response: < 24h',
    copy: 'Copy',
    copied: 'Copied ✓',
    composeMail: 'Compose Mail',
    viewGallery: 'View Gallery',
    viewArchitecture: 'Architecture Specs',
    projectDetails: 'Project Details & Case Study',
    status: 'Status',
    architectureOverview: 'System Architecture Overview',
    keyFeatures: 'Core Capabilities',
    technologies: 'Core Stack',
    githubSource: 'GitHub Source',
    liveDemo: 'Live Demo',
    privateRepoNotice: 'Source code repository awaiting public release',
    directDispatch: 'Direct Dispatch',
    primaryInbox: 'Primary Inbox',
    allRightsReserved: '© 2026 Farouk Messai. All rights reserved.',
    scrollHint: 'Scroll to explore portfolio film',
    stepCounter: (current: number, total: number) =>
      `${String(current).padStart(2, '0')} / ${String(total).padStart(2, '0')}`,
    soundOn: 'Sound Active',
    soundOff: 'Sound Muted',
    toggleSound: 'Toggle Sound',
    switchLanguage: 'Switch to Arabic',
    currentLanguageName: 'EN',
    otherLanguageName: 'العربية',
    otherLocale: 'ar',
    loadingExperience: 'Entering Cinematic Experience',
    loadingProgress: 'Initializing Studio Environment...',
    skipIntro: 'Skip Intro',
  },
  navigation: {
    studio: 'Studio',
    journey: 'Journey',
    work: 'Work',
    engineering: 'Engineering',
    contact: 'Contact',
    menu: 'Menu',
    closeMenu: 'Close Menu',
  },
  hero: {
    eyebrow: '01 / STUDIO',
    subEyebrow: 'Architectural Workspace',
    name: 'Farouk Messai',
    role: 'Software Developer | Mobile & Web Development',
    bioIntro:
      'Software developer focused on building robust web ecosystems and cross-platform mobile applications. Committed to clean code, component-driven design systems, and thoughtful user experiences.',
    pillMobileWeb: 'Mobile & Web Engineering',
    pillCleanArch: 'Clean Architecture',
    pillCinematic: 'Interactive Cinematic Portfolio',
  },
  journey: {
    eyebrow: '02 / JOURNEY',
    subEyebrow: 'Architectural Promenade',
    title: 'Beyond the Threshold',
    subtitle:
      'Stepping from the quiet workspace onto the sunlit stone terrace — moving from isolated explorations into scalable, interconnected web & mobile architectures.',
    milestone1: {
      step: '01',
      label: 'The Local Sanctuary',
      title: 'Foundation & Core Concepts',
      body: 'The journey started at the developer workstation — exploring core algorithms, experimenting with interface interactions, and understanding the nuances of clean software architecture.',
    },
    milestone2: {
      step: '02',
      label: 'Crossing Into Scale',
      title: 'Systems & Full-Stack Expansion',
      body: 'Local experiments evolved into distributed applications. Moving from isolated codebases toward full-stack integrations required mastering data schemas, asynchronous workflows, and API design.',
    },
    milestone3: {
      step: '03',
      label: 'Modern Web & Mobile Frontier',
      title: 'Cross-Surface Production Craft',
      body: 'Today, engineering focuses on unified user experiences across web and mobile surfaces — leveraging TypeScript, modern frameworks, and component-driven modularity to build reliable production tools.',
    },
  },
  projects: {
    eyebrow: '03 / SELECTED WORK',
    subEyebrow: 'Architectural Exhibition',
    items: [
      {
        id: 'mediconnect',
        name: 'MediConnect',
        tagline: 'Cross-Platform Telemedicine & Clinical Coordination System',
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
        caseStudy: {
          problem:
            'Accessing clinical consultations remotely is often hindered by fragmented scheduling tools, poor video reliability on low-bandwidth mobile devices, and unstandardized pre-visit triage.',
          solution:
            'Architected a resilient React Native cross-platform application paired with an asynchronous FastAPI gateway and WebRTC signaling server, enabling instant appointment locking, WebRTC video, and deterministic pre-consultation summaries.',
          role: 'Lead Full-Stack Developer: Designed mobile UI flows, implemented WebRTC peer connection management, structured PostgreSQL schemas with Row-Level Security, and built the FastAPI triage microservice.',
          architecture:
            'Decoupled client-server topology. The Expo/React Native mobile client communicates through a WebSocket signaling broker for WebRTC peer handshakes, while transactional operations are handled by REST endpoints on FastAPI connected to PostgreSQL.',
          decisions: [
            {
              title: 'WebRTC for Direct Peer Audio/Video',
              explanation: 'Chosen over proprietary streaming services to reduce server egress bandwidth and ensure end-to-end encrypted consultations.',
            },
            {
              title: 'FastAPI for Asynchronous Ingestion',
              explanation: 'Employed Python with Pydantic typing to handle non-blocking concurrent booking requests and AI questionnaire processing.',
            },
          ],
        },
        status: 'Architecture Prototype',
        links: {
          github: null,
          live: null,
        },
      },
      {
        id: 'smart-class',
        name: 'Smart Class',
        tagline: 'Intelligent Collaborative Virtual Learning & Pedagogical Platform',
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
        caseStudy: {
          problem:
            'Students waste hours manually scrubbing through recorded lecture videos to find specific concepts, while educators lack automated tools to transform syllabus notes into quizzes and flashcards.',
          solution:
            'Developed a multi-platform Flutter client integrated with an Express/Prisma indexing service that generates semantic embeddings for lecture transcripts, enabling natural language search directly to precise video timestamps.',
          role: 'Full-Stack Software Developer: Implemented reactive Flutter Riverpod UI architecture, vector database ingestion pipeline with pgvector, and responsive lecture video player.',
          architecture:
            'Flutter multi-surface client communicating with a Node.js Express API. Lecture transcripts are tokenized and stored as high-dimensional vector embeddings in PostgreSQL using the pgvector extension for sub-50ms cosine similarity queries.',
          decisions: [
            {
              title: 'Flutter & Riverpod for Reactive State',
              explanation: 'Single codebase delivering native compile targets for mobile, tablet, and web with strict immutable state separation.',
            },
            {
              title: 'PostgreSQL pgvector over External Vector Stores',
              explanation: 'Keeps transactional user data and AI vector embeddings in a single ACID-compliant database, minimizing operational overhead.',
            },
          ],
        },
        status: 'Completed Application',
        links: {
          github: null,
          live: null,
        },
      },
      {
        id: 'nexform',
        name: 'NEXFORM',
        tagline: 'Interactive 3D Setup Studio & Product Customization Platform',
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
        caseStudy: {
          problem:
            'Static 2D images in e-commerce fail to convey true physical scale, component clearances, and aesthetic synergy when building customized workspaces and PC setups.',
          solution:
            'Created an interactive in-browser 3D WebGL configurator using Three.js and React Three Fiber, allowing real-time material swapping, parametric sizing, and hardware clearance checks.',
          role: 'Frontend & 3D Web Developer: Programmed the 3D scene graph, implemented Draco/Meshopt compression loading pipelines, designed responsive UI overlay controls, and engineered the Zustand scene store.',
          architecture:
            'Next.js 16 App Router hosting a dynamic WebGL canvas. Scene graph state is managed outside the render loop in a centralized Zustand store to guarantee 60 FPS performance without React re-render penalties.',
          decisions: [
            {
              title: 'Selective Asset Compression',
              explanation: 'Employed Draco geometry compression for intricate furniture models to reduce payload size by over 65%.',
            },
            {
              title: 'Lifecycle-Aware Three.js Resource Disposal',
              explanation: 'Explicitly disposed of custom render targets and BufferGeometries upon scene transitions to eliminate GPU VRAM memory leaks.',
            },
          ],
        },
        status: 'Production Prototype',
        links: {
          github: null,
          live: null,
        },
      },
      {
        id: 'linguamate',
        name: 'LinguaMate',
        tagline: 'Multilingual AI Companion & Interactive Language Learning App',
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
        caseStudy: {
          problem:
            'Traditional language apps focus on multiple-choice quizzes rather than spontaneous verbal communication, leaving learners unable to practice real dialogue with immediate pronunciation feedback.',
          solution:
            'Built an AI-powered conversational partner on mobile with speech recognition, real-time phonetic analysis, and spaced repetition flashcards that adapt to user error patterns.',
          role: 'Mobile Developer: Engineered audio capture pipelines, integrated speech-to-text APIs, built clean layered architecture in Flutter with Riverpod, and configured Supabase authentication.',
          architecture:
            'Layered Clean Architecture in Flutter (Data, Domain, Presentation). Audio stream is processed on-device and submitted to lightweight inference endpoints, while learning milestones sync to Supabase.',
          decisions: [
            {
              title: 'Offline-First SQLite Cache',
              explanation: 'Ensured vocabulary reviews and flashcard exercises function with zero network latency, syncing progress upon reconnection.',
            },
            {
              title: 'Riverpod Notifiers for Predictable State',
              explanation: 'Guarantees clean unit-testable view models with granular rebuild triggers during active audio recording and playback.',
            },
          ],
        },
        status: 'Production Prototype',
        links: {
          github: null,
          live: null,
        },
      },
    ],
  },
  engineering: {
    eyebrow: '04 / ENGINEERING',
    subEyebrow: 'Systems Lab & Domains',
    headline: 'Engineering Craft',
    description:
      'Specialized technical competencies honed across production platforms and cross-surface architectures.',
    domains: [
      {
        id: 'web',
        title: 'Web Development',
        description:
          'Component-driven, server-rendered and responsive web architectures with modern TypeScript and React.',
        technologies: ['Next.js (App Router)', 'React 19', 'TypeScript', 'Tailwind CSS', 'Three.js / WebGL'],
      },
      {
        id: 'mobile',
        title: 'Mobile Development',
        description:
          'High-performance cross-platform iOS & Android applications with native feel and reactive state.',
        technologies: ['Flutter / Dart', 'React Native (Expo SDK)', 'Riverpod', 'Zustand', 'Platform Channels'],
      },
      {
        id: 'backend',
        title: 'Backend & Data',
        description:
          'Scalable RESTful services, real-time database schemas, authentication, and relational data modeling.',
        technologies: ['Node.js & Express', 'FastAPI (Python)', 'PostgreSQL', 'Supabase', 'Prisma ORM'],
      },
      {
        id: 'ai-systems',
        title: 'AI & Intelligent Systems',
        description:
          'Pragmatic AI integrations, vector embeddings with pgvector, and Retrieval-Augmented Generation workflows.',
        technologies: ['RAG Architectures', 'pgvector / ChromaDB', 'LLM Tool Calling', 'WebSocket Signaling', 'Git / CI/CD'],
      },
    ],
  },
  contact: {
    eyebrow: '05 / CONTACT',
    subEyebrow: 'Sunset Balcony Overlook',
    headlineBefore: "Let's build something",
    headlineHighlight: 'extraordinary.',
    subtitle:
      'The continuous cinematic journey concludes at the Mediterranean horizon. Open to software developer roles, collaborative projects, and engineering high-craft digital platforms across web & mobile surfaces.',
    location: 'Tunisia (Available for Remote Worldwide)',
    githubTitle: '@Farouk-MY',
    githubSubtitle: 'Source & Repositories',
    linkedinTitle: 'Farouk Messai',
    linkedinSubtitle: 'Professional Network',
  },
};

