// src/data/software.ts
// sparXion Software Portfolio
// Generated: April 29, 2026
// Source of truth: 2026-CodingProjectsSummary-Technical.md + 2025-1210-SOFTWARE_PORTFOLIO_SUMMARY.md

export type SoftwareCategory =
  | 'all'
  | 'ai-tools'
  | 'web-apps'
  | 'ios'
  | 'extensions'
  | 'developer-tools'
  | 'python'
  | 'education';

export type PublicationStatus =
  | 'live'        // publicly deployed and accessible
  | 'published'   // in app store / web store
  | 'production'  // built and deployed, not publicly marketed
  | 'development' // actively in development
  | 'nascent'     // early stage
  | 'internal';   // client or personal use, not public

export interface SoftwareItem {
  id: string;
  title: string;
  subtitle: string;
  categories: SoftwareCategory[];
  status: PublicationStatus;
  year: string;
  tagline: string;
  problem: string;
  solution: string;
  stack: string[];
  highlights: string[];
  liveUrl?: string;
  githubUrl?: string;
  storeUrl?: string;
  repoPath: string;         // local path for reference
  featured: boolean;
  monetized?: boolean;
  monetizationNote?: string;
}

// ─────────────────────────────────────────────
// FEATURED / FLAGSHIP
// ─────────────────────────────────────────────

const ucid: SoftwareItem = {
  id: 'ucid',
  title: 'UC Industrial Design Career Explorer',
  subtitle: 'UC Bearcat AI Grant Winner 2025',
  categories: ['web-apps', 'ai-tools', 'education'],
  status: 'live',
  year: '2024–2025',
  tagline: 'AI-powered career guidance for design students. Grant-funded. FERPA-compliant. Shipped.',
  problem:
    'UC/DAAP industrial design students struggle to connect their specific talents to viable career paths. Generic career advice fails them — they need personalized, domain-specific guidance.',
  solution:
    'Domain-driven React/TypeScript app with Node.js backend that assesses student talents through interactive quizzes and provides personalized career path recommendations. AI-powered conversational interface (Claude + GPT-4) with confidence scoring across 8 career paths and Cincinnati industry connections (P&G, Kroger, GE Aviation).',
  stack: [
    'React 18',
    'TypeScript',
    'Node.js',
    'Prisma ORM',
    'SQLite → PostgreSQL',
    'Anthropic Claude API',
    'OpenAI GPT-4',
    'Framer Motion',
    'Netlify',
    'Railway',
    'Docker',
    'JWT Authentication',
    'FERPA-compliant architecture',
  ],
  highlights: [
    'UC Bearcat AI Grant recipient 2025',
    'FERPA-compliant data management',
    '8 career paths with AI confidence scoring',
    'Full-screen video introduction with skip',
    'Cincinnati industry connections baked in',
    '9 REST API endpoints',
    'Production deployed on Netlify + Railway',
  ],
  liveUrl: 'https://ucidapp.netlify.app',
  repoPath: '/Users/johnviolette/UC | ID App Design/ucid-app/',
  featured: true,
};

const aiTunerWeb: SoftwareItem = {
  id: 'ai-tuner-web',
  title: 'AI Tuner',
  subtitle: 'Visual AI Customization Suite — Web',
  categories: ['ai-tools', 'web-apps'],
  status: 'live',
  year: '2023–Present',
  tagline: '16 parameters. 12 personality styles. The visual interface for tuning AI behavior.',
  problem:
    'AI practitioners and power users have no intuitive visual interface for adjusting model parameters, personality styles, and output behavior. The settings are buried in API calls or hidden entirely.',
  solution:
    'Visual AI customization tool that exposes 16 parameters and 12 personality styles through a clean interface. Cross-platform web app with multiple variant versions (Creative, Portal, v3.5) for different use cases. Cursor IDE extension also available.',
  stack: [
    'React',
    'TypeScript',
    'Vite',
    'Tailwind CSS',
    'Netlify',
    'Claude API',
    'OpenAI API',
    'Grok API',
    'Firebase Analytics',
  ],
  highlights: [
    '16 tunable parameters',
    '12 personality styles',
    'Multiple deployment variants (Creative, Portal, v3.5)',
    'Cursor IDE extension version',
    'Grok watcher integration',
    'Cross-platform production deployment',
  ],
  liveUrl: 'https://aitunerapp.com',
  repoPath: '/Users/johnviolette/AI-Tuner-v3.5/',
  featured: true,
};

const aiTuneriOS: SoftwareItem = {
  id: 'ai-tuner-ios',
  title: 'AI Tuner iOS',
  subtitle: 'Mobile AI Model Tuning — App Store Ready',
  categories: ['ios', 'ai-tools'],
  status: 'published',
  year: '2024–Present',
  tagline: 'AI tuning in your pocket. App Store submission configured.',
  problem:
    'AI practitioners need mobile access to tune and compare models while away from desktop environments.',
  solution:
    'SwiftUI iOS app for AI model tuning and comparison. Firebase Analytics integrated. Full App Store submission infrastructure configured — fastlane, provisioning profiles, App Store Connect listing in progress.',
  stack: [
    'Swift',
    'SwiftUI',
    'Firebase Analytics',
    'Fastlane',
    'Xcode',
    'App Store Connect',
  ],
  highlights: [
    'App Store submission docs complete',
    'Firebase Analytics integrated',
    'Fastlane configured for deployment',
    'Native SwiftUI interface',
    'AI model comparison features',
  ],
  repoPath: '/Users/johnviolette/AI-Tuner-v3.5/AI-Tuner-iOS/AITuner4/',
  featured: true,
};

const emailAssetExtractor: SoftwareItem = {
  id: 'email-asset-extractor',
  title: 'Email Asset Extractor',
  subtitle: 'Chrome Extension — Published, Freemium',
  categories: ['extensions'],
  status: 'published',
  year: '2023–Present',
  tagline: 'Extract web assets from emails in one click. $29 Pro tier. Chrome Web Store.',
  problem:
    'Designers and developers receiving HTML emails constantly need to extract images, fonts, colors, and assets — a tedious manual process with no good tool.',
  solution:
    'Chrome extension (free and pro builds) that extracts web assets from HTML emails automatically. Commercial freemium model with $29 Pro tier. Published on Chrome Web Store.',
  stack: [
    'JavaScript',
    'Chrome Extension APIs',
    'HTML/CSS',
    'Web Store deployment',
  ],
  highlights: [
    'Published on Chrome Web Store',
    'Freemium model — $29 Pro tier',
    'Free and Pro build variants',
    'Store collateral and web assets included',
    'Commercial product',
  ],
  monetized: true,
  monetizationNote: '$29 Pro tier — Chrome Web Store',
  repoPath: '/Users/johnviolette/Email Asset Extractor/',
  featured: true,
};

// ─────────────────────────────────────────────
// PRODUCTION / LIVE
// ─────────────────────────────────────────────

const whseWebsite: SoftwareItem = {
  id: 'whse',
  title: 'WHSE Creative Network',
  subtitle: 'Professional Talent Marketplace',
  categories: ['web-apps'],
  status: 'production',
  year: '2023–Present',
  tagline: 'A professional talent marketplace for creatives. Deployed.',
  problem:
    'Creative professionals need a curated marketplace that reflects the aesthetic and values of creative work itself — not a generic job board.',
  solution:
    'Vite/React site for showcasing WHSE creatives with Tailwind CSS styling. Professional talent marketplace with design-forward presentation.',
  stack: [
    'React',
    'Vite',
    'TypeScript',
    'Tailwind CSS',
  ],
  highlights: [
    'Talent marketplace architecture',
    'Design-forward aesthetic',
    'Production deployed',
  ],
  repoPath: '/Users/johnviolette/WHSE | Website/',
  featured: false,
};

const idCareerSorter: SoftwareItem = {
  id: 'id-career-sorter',
  title: 'Industrial Design Career Sorter',
  subtitle: 'Open Source — AI-Powered Career Matching',
  categories: ['python', 'ai-tools', 'education'],
  status: 'published',
  year: '2023–2024',
  tagline: 'NLP-powered career matching for design students. Open source on GitHub.',
  problem:
    'Students have interests and skills but no systematic way to map them to real design career paths.',
  solution:
    'Python tool using sentence-transformers NLP to match student interests to career paths across 35 interest categories, 28 skill domains, and 25 professional roles. Graph database with relationship mapping. CLI interface with session-based summarization.',
  stack: [
    'Python 3.13',
    'Neo4j graph database',
    'sentence-transformers (all-MiniLM-L6-v2)',
    'NumPy',
    'REST API',
    'GitHub',
  ],
  highlights: [
    '35 interest categories',
    '28 skill domains',
    '25 professional roles',
    'Neo4j graph database',
    'Open source — GitHub',
    'Curated learning resources (Coursera, Udemy)',
    'Session-based role summarization',
  ],
  githubUrl: 'https://github.com/JVDesign2025/id-career-sorter',
  repoPath: '/Users/johnviolette/',
  featured: false,
};

const jvDatabaseVault: SoftwareItem = {
  id: 'jv-database-vault',
  title: 'JV Database Vault',
  subtitle: 'RAG-Powered Personal Knowledge System',
  categories: ['ai-tools', 'web-apps'],
  status: 'internal',
  year: '2024–Present',
  tagline: 'Personal RAG-powered knowledge vault. Vector search. Could be a product.',
  problem:
    'Personal growth content, notes, and knowledge accumulate without a way to search, connect, and retrieve insights across the full corpus.',
  solution:
    'RAG-powered personal database vault using Next.js frontend, FastAPI backend, and Chroma DB vector search with Grok API integration. Functional personal tool with productization potential.',
  stack: [
    'Next.js',
    'FastAPI',
    'Chroma DB',
    'Grok API',
    'Python',
    'Vector search',
    'RAG architecture',
  ],
  highlights: [
    'Full RAG architecture',
    'Chroma DB vector search',
    'Grok API integration',
    'Functional personal tool',
    'Productization potential assessed',
  ],
  repoPath:
    '~/Library/Mobile Documents/com~apple~CloudDocs/449/JV-database-vault/',
  featured: false,
};

const stylescout: SoftwareItem = {
  id: 'style-scout',
  title: 'Style Scout',
  subtitle: 'Chrome Extension — Store-Ready',
  categories: ['extensions'],
  status: 'production',
  year: '2024',
  tagline: 'Styling insights from any webpage. Chrome extension. Store bundles ready.',
  problem:
    'Designers and developers need quick access to the CSS styling decisions behind any webpage they encounter.',
  solution:
    'Chrome extension for extracting styling insights. Store-ready bundles included, pending Chrome Web Store submission.',
  stack: [
    'JavaScript',
    'Chrome Extension APIs',
    'CSS',
    'Web Store packaging',
  ],
  highlights: [
    'Store-ready bundles complete',
    'Chrome Web Store submission pending',
    'Styling analysis features',
  ],
  repoPath: '/Users/johnviolette/Style-Scout/',
  featured: false,
};

// ─────────────────────────────────────────────
// ACTIVE DEVELOPMENT
// ─────────────────────────────────────────────

const project417Vault: SoftwareItem = {
  id: 'project-417',
  title: 'Project 417 Vault',
  subtitle: 'Swift Document Management — iOS',
  categories: ['ios'],
  status: 'development',
  year: '2025–Present',
  tagline: 'Native Swift document management for iOS. Unit + UI tests. In active development.',
  problem:
    'Personal and creative documents need a native iOS management experience with reliable organization and retrieval.',
  solution:
    'Swift document management app with native iOS integration. Full Xcode project with unit tests and UI tests for reliable document organization.',
  stack: [
    'Swift',
    'Xcode',
    'iOS',
    'Unit Testing',
    'UI Testing',
  ],
  highlights: [
    'Native Swift implementation',
    'Full unit and UI test coverage',
    'iOS-native document management',
    'Active development',
  ],
  repoPath: '/Users/johnviolette/Project 417 Vault/',
  featured: false,
};

const illustratorAutomation: SoftwareItem = {
  id: 'illustrator-automation',
  title: 'Illustrator Automation Standalone',
  subtitle: 'Python → Adobe Illustrator Automation',
  categories: ['developer-tools', 'python'],
  status: 'development',
  year: '2024–Present',
  tagline: 'Python scripts that control Illustrator. GUI and CLI. Designer meets developer.',
  problem:
    'Adobe Illustrator has a powerful scripting API but no accessible interface for non-developers. Designers who know what they want can\'t automate it without writing code.',
  solution:
    'Python automation tool with both GUI and CLI entry points that generates and executes Illustrator scripts. Bridges the gap between design intent and code execution.',
  stack: [
    'Python',
    'Adobe Illustrator API',
    'GUI (Tkinter or similar)',
    'CLI',
    'VS Code / Cursor extension',
  ],
  highlights: [
    'GUI and CLI interfaces',
    'Generates Illustrator scripts from Python',
    'Designed for designer audience',
    'VS Code / Cursor extension variant',
    'Adobe API integration',
  ],
  repoPath:
    '~/Library/Mobile Documents/com~apple~CloudDocs/Insanity Folder/Illustrator-Automation-Standalone/',
  featured: false,
};

const cursorAiTuner: SoftwareItem = {
  id: 'cursor-ai-tuner',
  title: 'Cursor AI Tuner Extension',
  subtitle: 'TypeScript Extension for Cursor IDE',
  categories: ['developer-tools', 'ai-tools'],
  status: 'production',
  year: '2024–Present',
  tagline: 'AI Tuner inside Cursor. TypeScript extension for the IDE you\'re already using.',
  problem:
    'AI Tuner web app users want the same parameter control without leaving their coding environment.',
  solution:
    'TypeScript Cursor IDE extension that brings AI Tuner controls directly into the development environment. Includes AI Absolute Mode Overlay and Cypress test suite.',
  stack: [
    'TypeScript',
    'Cursor Extension API',
    'VS Code Extension API',
    'Cypress',
    'JavaScript',
  ],
  highlights: [
    'Native Cursor IDE integration',
    'AI Absolute Mode Overlay',
    'Cypress test suite',
    'TypeScript implementation',
    'VS Code compatible',
  ],
  repoPath: '/Users/johnviolette/AI-Tuner-v3.5/cursor-ai-tuner/',
  featured: false,
};

const drgnFli: SoftwareItem = {
  id: 'drgn-fli',
  title: 'DRGN | FLI',
  subtitle: 'iOS Game — Swift',
  categories: ['ios'],
  status: 'nascent',
  year: '2025–Present',
  tagline: 'Swift iOS game. Early development. Core mechanics first.',
  problem:
    'Mobile gaming needs engaging mechanics and polished interfaces to compete in the App Store.',
  solution:
    'Swift-based iOS game project focusing on core gameplay development and user experience iteration before investing in advanced features.',
  stack: [
    'Swift',
    'iOS',
    'Xcode',
  ],
  highlights: [
    'Early gameplay development',
    'Native Swift/iOS',
    'Iterative mechanics approach',
  ],
  repoPath: '/Users/johnviolette/DRGN | FLI Game/',
  featured: false,
};

const neutraNarc: SoftwareItem = {
  id: 'neutranarcpython',
  title: 'NeutraNarc Medical Tools',
  subtitle: 'Python — Medical Device Design Support',
  categories: ['python'],
  status: 'internal',
  year: '2025–Present',
  tagline: 'Python tooling supporting medical device design for law enforcement.',
  problem:
    'Drug neutralization container design for law enforcement requires computational modeling support alongside physical industrial design.',
  solution:
    'Python project supporting the NeutraNarc medical device consulting engagement — computational design support for drug neutralization containers and related tools.',
  stack: [
    'Python',
    'Blender API',
    'FreeCAD',
  ],
  highlights: [
    'Medical device context',
    'Law enforcement application',
    'Blender/Python integration',
    'Active consulting project',
  ],
  repoPath: '/Users/johnviolette/NN - Medical waste disposal/',
  featured: false,
};

const pgExploration: SoftwareItem = {
  id: 'pg-exploration',
  title: 'P&G AI Exploration',
  subtitle: 'Python — AI Integration Research',
  categories: ['python', 'ai-tools'],
  status: 'internal',
  year: '2025–Present',
  tagline: 'Python exploration supporting P&G AI integration consulting.',
  problem:
    'P&G design teams need AI tool integration strategies grounded in real workflow analysis.',
  solution:
    'Python exploration project with extensive markdown documentation supporting the Procter & Gamble AI integration thought leadership consulting engagement.',
  stack: [
    'Python',
    'Markdown documentation',
    'AI APIs',
  ],
  highlights: [
    'Supports active P&G consulting',
    'Extensive documentation',
    'AI workflow research',
    'Internal — client confidential',
  ],
  repoPath: '/Users/johnviolette/P&G | Exploration/',
  featured: false,
};

const grokSafariExtension: SoftwareItem = {
  id: 'grok-safari',
  title: 'AI Grok Download Safari Extension',
  subtitle: 'Safari Extension — Grok Chat Export',
  categories: ['extensions'],
  status: 'production',
  year: '2024',
  tagline: 'Export Grok conversations from Safari. Swift + JavaScript.',
  problem:
    'Grok users on Safari have no way to export or save their AI conversations for reference or archiving.',
  solution:
    'Safari web extension that exports Grok chats with proper formatting. Swift + JavaScript hybrid for native Safari integration.',
  stack: [
    'Swift',
    'JavaScript',
    'Safari Extension APIs',
    'Xcode',
  ],
  highlights: [
    'Safari native integration',
    'Swift + JavaScript hybrid',
    'Grok chat export',
    'Active project',
  ],
  repoPath: '/Users/johnviolette/AI | Grok Download Safari Extension/',
  featured: false,
};

// ─────────────────────────────────────────────
// MASTER EXPORT
// ─────────────────────────────────────────────

export const softwareItems: SoftwareItem[] = [
  // Featured first
  ucid,
  aiTunerWeb,
  aiTuneriOS,
  emailAssetExtractor,
  // Production / Live
  whseWebsite,
  idCareerSorter,
  jvDatabaseVault,
  stylescout,
  cursorAiTuner,
  grokSafariExtension,
  // Active Development
  project417Vault,
  illustratorAutomation,
  neutraNarc,
  pgExploration,
  // Nascent
  drgnFli,
];

export const featuredSoftware = softwareItems.filter((s) => s.featured);

export const getSoftwareById = (id: string): SoftwareItem | undefined =>
  softwareItems.find((s) => s.id === id);

export const getSoftwareByCategory = (category: SoftwareCategory): SoftwareItem[] =>
  category === 'all'
    ? softwareItems
    : softwareItems.filter((s) => s.categories.includes(category));

/** Featured items first; stable relative order within each group. */
export const getSoftwareByCategorySorted = (category: SoftwareCategory): SoftwareItem[] => {
  const list = getSoftwareByCategory(category);
  return [...list].sort((a, b) => {
    if (a.featured === b.featured) return 0;
    return a.featured ? -1 : 1;
  });
};

export const getSoftwareByStatus = (status: PublicationStatus): SoftwareItem[] =>
  softwareItems.filter((s) => s.status === status);

export const softwareFilterCategories: { id: SoftwareCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'ai-tools', label: 'AI Tools' },
  { id: 'web-apps', label: 'Web Apps' },
  { id: 'ios', label: 'iOS' },
  { id: 'extensions', label: 'Extensions' },
  { id: 'developer-tools', label: 'Dev Tools' },
  { id: 'python', label: 'Python' },
  { id: 'education', label: 'Education' },
];

export const softwareStatusLabels: Record<PublicationStatus, string> = {
  live: 'Live',
  published: 'Published',
  production: 'Production',
  development: 'In Development',
  nascent: 'Early Dev',
  internal: 'Internal',
};
