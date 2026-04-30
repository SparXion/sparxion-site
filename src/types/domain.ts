// Domain Model Types for SparXion
// Based on 2026-0213-Grok-Sparxion Domain Model.md

// Value Objects
export type ProcessPhase = 'Discovery' | 'Synthesis' | 'Production' | 'Delight';

export interface EthosStatement {
  tagline: string; // "Delight delivered at human scale."
  supportingParagraphs: string[];
}

export interface Tagline {
  text: string; // "Where your spark meets action"
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
