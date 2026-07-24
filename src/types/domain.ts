// Domain Model Types for SparXion
// Based on 2026-0213-Grok-Sparxion Domain Model.md

// Value Objects
export type ProcessPhase = 'Discovery' | 'Synthesis' | 'Production' | 'Delight';

export interface EthosStatement {
  tagline: string; // "Delight delivered at human scale."
  supportingParagraphs: string[];
}

export interface Tagline {
  text: string; // "Spark x Action = Discovery"
}

export interface DelightMetric {
  qualitative?: string; // e.g., "made kids feel heroic"
  quantitative?: string; // e.g., "$750MM line"
}

// Entities
export interface Person {
  name: string; // "Johnny Carthief / John Mark Violette"
  ethos: string;
  bioSummary: string;
  contactInfo: {
    email: string; // "john@sparxion.com"
    location: string; // "Cincinnati"
    linkedin?: string; // "https://www.linkedin.com/in/john-violette"
  };
}

export interface Image {
  url: string;
  caption?: string;
  role: 'hero' | 'supporting' | 'sketch' | 'final';
  alt: string;
  eraReference?: string;
}

export type OutputType = 'PhysicalProduct' | 'DigitalTool' | 'NarrativeSystem' | 'EnterpriseIntegration';

export interface Output {
  title: string;
  eraReference: string; // Era name
  type: OutputType;
  description: string;
  impact?: string; // e.g., "$750MM line"
  techStack?: string[]; // for digital outputs
  liveUrl?: string;
  processPhases: ProcessPhase[];
  delightMetrics: DelightMetric[];
  images: Image[];
  links: Array<{
    type: 'demo' | 'repo' | 'caseStudy';
    url: string;
    label: string;
  }>;
}

export interface Era {
  name: string; // e.g., "Hot Wheels Era 2006–2011"
  timeRange: {
    start: number;
    end: number;
  };
  headline: string;
  summary: string; // 1-2 sentences
  keyClients?: string[];
  coreFocus: string; // e.g., "scaled delight in play mechanics"
  images: Image[];
  outputs: Output[];
}

// Aggregates
export interface Journey {
  eras: Era[]; // Must be chronological, no gaps/overlaps
}

export interface PortfolioItemAggregate {
  output: Output;
  images: Image[];
  links: Array<{
    type: 'demo' | 'repo' | 'caseStudy';
    url: string;
    label: string;
  }>;
  delightMetrics: DelightMetric[];
}

export interface NavigationItem {
  label: string;
  path: string;
  external?: boolean;
}

// ——— Resume module ———
// The resume "database". Every capability and experience is tagged with one or
// more focus areas so a visitor can curate the resume down to what they care
// about, then download exactly that view (PDF/Markdown). The same structured
// data is the future feed for the xAI-powered capability chatbot.

export type ResumeFocusArea =
  | 'physical' // Physical & Industrial Product Design
  | 'digital' // Digital, Software & AI Tools
  | 'creative' // Creative Direction & Storytelling
  | 'leadership'; // Leadership, Strategy & Enterprise

export interface ResumeFocusAreaMeta {
  id: ResumeFocusArea;
  label: string;
  blurb: string;
}

export interface ResumeExperience {
  id: string;
  role: string;
  org: string;
  location?: string;
  timeRange: { start: number; end: number | 'Present' };
  focusAreas: ResumeFocusArea[];
  summary: string;
  highlights: string[];
  clients?: string[];
  /** Optional deep-link into the site (portfolio/software/journey). */
  href?: string;
}

export interface ResumeSkillGroup {
  id: string;
  title: string;
  focusAreas: ResumeFocusArea[];
  skills: string[];
}

export interface ResumeEducation {
  institution: string;
  credential: string;
  detail?: string;
  timeRange?: { start: number; end: number };
}

export interface Resume {
  name: string;
  title: string;
  tagline: string;
  location: string;
  email: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  summary: string;
  focusAreas: ResumeFocusAreaMeta[];
  skillGroups: ResumeSkillGroup[];
  experience: ResumeExperience[];
  education: ResumeEducation[];
  /** Marquee clients across the career, for a quick credibility strip. */
  selectedClients: string[];
}

export interface FooterContent {
  copyright: string;
  links: NavigationItem[];
}

/** Case-study grid on /portfolio (synced assets live under /public/portfolio/{id}/) */
export type PortfolioCategory =
  | 'all'
  | 'footwear'
  | 'toys'
  | 'systems'
  | 'independent-ip'
  | 'art'
  | 'software';

export interface PortfolioItem {
  id: string;
  title: string;
  client: string;
  year: string;
  categories: PortfolioCategory[];
  /** Filenames only; resolved via /portfolio/{id}/{file} */
  images: string[];
  /** Optional demo video relative to project folder (e.g. Crashermovies/foo.MOV) */
  videoFile?: string;
  assetFile: string;
  pageCount: number;
  tagline: string;
  story: string;
  skillsDemo: string[];
  revenueNote?: string;
  hasBlenderAnimation?: boolean;
  featured: boolean;
}
