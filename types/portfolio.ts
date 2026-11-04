export type SkillCategory = 'all' | 'web' | 'mobile' | 'backend' | 'tools';

export interface SkillItem {
  id: string;
  name: string;
  category: 'web' | 'mobile' | 'backend' | 'tools';
  role: string;
  featured?: boolean;
}

export interface ProjectItem {
  id: string;
  name: string;
  tagline: string;
  category: string;
  categoryLabel: string;
  description: string;
  technologies: string[];
  keyFeatures: string[];
  architectureOverview: string;
  status: 'Production Prototype' | 'Architecture Prototype' | 'Completed Application';
  links: {
    github: string | null;
    live: string | null;
  };
  metrics?: { label: string; value: string }[];
}

export interface DeveloperProfile {
  name: string;
  title: string;
  tagline: string;
  bioIntroduction: string;
  journeyNarrative: {
    part1Title: string;
    part1Body: string;
    part2Title: string;
    part2Body: string;
    part3Title: string;
    part3Body: string;
  };
  contact: {
    email: string;
    github: string;
    linkedin: string;
    location: string;
    availability: string;
  };
}

export interface ActDefinition {
  id: string;
  actNumber: string;
  name: string;
  subtitle: string;
  range: [number, number]; // [startProgress, endProgress]
  description: string;
  accentColor: string;
}


