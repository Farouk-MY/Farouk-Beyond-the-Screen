export type Locale = 'en' | 'ar';

export interface TranslationDictionary {
  locale: Locale;
  dir: 'ltr' | 'rtl';
  meta: {
    title: string;
    description: string;
    keywords: string[];
    siteName: string;
    ogTitle: string;
    ogDescription: string;
  };
  common: {
    openToWorkBadge: string;
    downloadCv: string;
    exploreWork: string;
    getInTouch: string;
    letsTalk: string;
    close: string;
    backToOrigin: string;
    averageResponse: string;
    copy: string;
    copied: string;
    composeMail: string;
    viewGallery: string;
    viewArchitecture: string;
    projectDetails: string;
    status: string;
    architectureOverview: string;
    keyFeatures: string;
    technologies: string;
    githubSource: string;
    liveDemo: string;
    privateRepoNotice: string;
    directDispatch: string;
    primaryInbox: string;
    allRightsReserved: string;
    scrollHint: string;
    stepCounter: (current: number, total: number) => string;
    soundOn: string;
    soundOff: string;
    toggleSound: string;
    switchLanguage: string;
    currentLanguageName: string;
    otherLanguageName: string;
    otherLocale: Locale;
  };
  navigation: {
    studio: string;
    journey: string;
    work: string;
    engineering: string;
    contact: string;
    menu: string;
    closeMenu: string;
  };
  hero: {
    eyebrow: string;
    subEyebrow: string;
    name: string;
    role: string;
    bioIntro: string;
    pillMobileWeb: string;
    pillCleanArch: string;
    pillCinematic: string;
  };
  journey: {
    eyebrow: string;
    subEyebrow: string;
    title: string;
    subtitle: string;
    milestone1: {
      step: string;
      label: string;
      title: string;
      body: string;
    };
    milestone2: {
      step: string;
      label: string;
      title: string;
      body: string;
    };
    milestone3: {
      step: string;
      label: string;
      title: string;
      body: string;
    };
  };
  projects: {
    eyebrow: string;
    subEyebrow: string;
    items: {
      id: string;
      name: string;
      tagline: string;
      categoryLabel: string;
      description: string;
      technologies: string[];
      keyFeatures: string[];
      architectureOverview: string;
      caseStudy: {
        problem: string;
        solution: string;
        role: string;
        architecture: string;
        decisions: { title: string; explanation: string }[];
      };
      status: string;
      links: {
        github: string | null;
        live: string | null;
      };
    }[];
  };
  engineering: {
    eyebrow: string;
    subEyebrow: string;
    headline: string;
    description: string;
    domains: {
      id: string;
      title: string;
      description: string;
      technologies: string[];
    }[];
  };
  contact: {
    eyebrow: string;
    subEyebrow: string;
    headlineBefore: string;
    headlineHighlight: string;
    subtitle: string;
    location: string;
    githubTitle: string;
    githubSubtitle: string;
    linkedinTitle: string;
    linkedinSubtitle: string;
  };
}

