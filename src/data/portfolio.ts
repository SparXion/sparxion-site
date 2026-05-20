// Physical design portfolio — ids match Portfolio/01-MASTERS folder names.
// Images: npm run sync-portfolio

import type { PortfolioCategory, PortfolioItem } from '../types/domain';
import { DESIGN_BAND_PROJECT_IDS } from './designBandProjectIds';
import { galleryImagesForPortfolio } from './portfolioImageManifest';

function portfolioGallery(id: string): Pick<PortfolioItem, 'images' | 'pageCount'> {
  const images = [...galleryImagesForPortfolio(id)];
  return { images, pageCount: images.length };
}

const portfolioById: Record<string, PortfolioItem> = {
  'hw-custom-motors': {
    id: 'hw-custom-motors',
    title: 'Hot Wheels Custom Motors',
    client: 'Mattel',
    year: '2006–2011',
    categories: ['toys'],
    ...portfolioGallery('hw-custom-motors'),
    assetFile: '2025PortfolioCMHQ.pdf',
    tagline: 'A complete product platform — car design, play system, and every single part drawn.',
    story:
      "Custom Motors wasn't just car design — it was a complete product architecture. The Pop & Swap system let kids customize their cars in ways that had never been done before. Every component was drawn in orthographic detail. Every part was engineered for manufacturing. And it shipped. This is the project that proves systems thinking, technical rigor, and full production ownership in one body of work.",
    skillsDemo: [
      'Platform architecture',
      'Systems design',
      'Technical illustration',
      'Orthographic drawing',
      'Design-for-manufacturing',
      'Production oversight',
      'Play pattern design',
    ],
    revenueNote: '~$35MM+ combined Hot Wheels Innovation Lines (industry reporting)',
    featured: true,
  },
  'hw-twinduction': {
    id: 'hw-twinduction',
    title: 'Hot Wheels Twinduction',
    client: 'Mattel',
    year: '2006–2011',
    categories: ['toys'],
    ...portfolioGallery('hw-twinduction'),
    assetFile: '2025PortfolioTwinductionHQ.pdf',
    tagline: 'Concept to die-cast. It shipped. Kids played with it.',
    story:
      "Twinduction is the full arc — sketch to shelf. A futuristic muscle car concept that went through the complete Mattel production pipeline and came out the other side as a real Hot Wheels die-cast. It's sitting in kids' collections right now. That's the job.",
    skillsDemo: [
      'Automotive concept design',
      'Die-cast design',
      'Concept-to-manufacture',
      'Hot Wheels brand language',
      'Production coordination',
    ],
    hasBlenderAnimation: true,
    featured: true,
  },
  'hw-crashers': {
    id: 'hw-crashers',
    title: 'Hot Wheels Crashers',
    client: 'Mattel',
    year: '2006–2011',
    categories: ['toys'],
    ...portfolioGallery('hw-crashers'),
    assetFile: '2025PortfolioHW_CrashersHQ.pdf',
    tagline: 'I invented the spring trigger crash mechanism. Watch it work.',
    story:
      'Three slides and a video that says everything. Hot Wheels Crashers combined car design with a spring-loaded trigger mechanism that John invented from scratch — concept, prototype, fabrication, production. The video demonstrates the mechanism working. This is what happens when a designer can also build the thing.',
    skillsDemo: [
      'Mechanism invention',
      'Car design',
      'Physical model making',
      'Prototype fabrication',
      'Spring trigger engineering',
    ],
    featured: true,
  },
  'hw-tri-n-stop-me': {
    id: 'hw-tri-n-stop-me',
    title: 'Hot Wheels Tri-N-Stop Me',
    client: 'Mattel (originated as personal project)',
    year: '2004–2011',
    categories: ['toys', 'independent-ip'],
    ...portfolioGallery('hw-tri-n-stop-me'),
    assetFile: 'TriNStop-Portfolio.pdf',
    tagline: 'Art Center night class → Alias → Mattel. Play pattern that shipped.',
    story:
      'The origin arc lives here: an Art Center at Night class project became the reason to teach himself Alias 3D, then a Hot Wheels original design, then the Tri-N-Stop Me play pattern and vehicle line. Personal initiative, self-directed learning, and production result — vehicle design and die-cast play mechanics in one thread.',
    skillsDemo: [
      'Vehicle design',
      'Play pattern',
      'Alias 3D',
      'Concept origination',
      'Design-to-production',
      'Hot Wheels',
    ],
    featured: true,
  },
  'hw-art': {
    id: 'hw-art',
    title: 'Hot Wheels Original Art',
    client: 'Mattel',
    year: '2006–2011',
    categories: ['toys', 'art'],
    ...portfolioGallery('hw-art'),
    assetFile: 'HWArt.pdf',
    tagline: '20+ original Hot Wheels designs. Side project. All shipped.',
    story:
      "While running Custom Motors, Crashers, and Color Shifters as primary lines, John designed 20+ original Hot Wheels cars as a side project. Car design, livery, graphics, character — the full Hot Wheels aesthetic language applied at volume. Every one of them shipped. Real product, real shelves. This is what creative output looks like when it never stops.",
    skillsDemo: [
      'Car design',
      'Graphic design',
      'Brand illustration',
      'Hot Wheels aesthetic language',
      'Volume creative production',
      'Livery and color design',
    ],
    featured: false,
  },
  'nike-acg': {
    id: 'nike-acg',
    title: 'Nike ACG',
    client: 'Nike (via Faulconer Design)',
    year: '2000–2006',
    categories: ['footwear'],
    ...portfolioGallery('nike-acg'),
    assetFile: 'ACGPortfolioFINAL.pdf',
    tagline: 'Trail performance — green details on black. Focused shoe design.',
    story:
      'Nike ACG footwear exploration centered on the shoe itself: performance trail language, green accent details, and black backgrounds that keep the form legible. Strategic outdoor work without the full Cascade range presentation — design discipline on a single product read.',
    skillsDemo: [
      'Footwear design',
      'Trail performance',
      'Concept development',
      'Nike brand standards',
      'Color and material',
    ],
    featured: true,
  },
  'nike-cascade': {
    id: 'nike-cascade',
    title: 'Nike Cascade RS',
    client: 'Nike (via Faulconer Design)',
    year: '2000–2006',
    categories: ['footwear'],
    ...portfolioGallery('nike-cascade'),
    assetFile: 'ACGPortfolioFINAL.pdf',
    tagline: 'Full ACG Cascade RS — research through range, bright and strategic.',
    story:
      'The complete Cascade RS program: competitive analysis, aesthetic influence mapping (off-road hardware, adventure gear, structural triangles), and full design development in the bright purple, pink, and orange range presentation. Nike-level creative rigor at trail/outdoor performance scale.',
    skillsDemo: [
      'Footwear design',
      'Market research',
      'Strategic design thinking',
      'Concept development',
      'Range presentation',
      'Aesthetic influence mapping',
    ],
    featured: true,
  },
  'nike-eps': {
    id: 'nike-eps',
    title: 'Nike EPS Glitz',
    client: 'Nike (via Faulconer Design)',
    year: '2000–2006',
    categories: ['footwear'],
    ...portfolioGallery('nike-eps'),
    assetFile: '2025PortfolioEPSGlitzHQ.pdf',
    tagline: 'Nike footwear concept — fashion direction, full range.',
    story:
      'EPS Glitz demonstrates a completely different register of Nike design from the ACG work — fashion-forward, expressive, high-energy. Same brand, different vocabulary. The range between ACG and Glitz is the point.',
    skillsDemo: [
      'Footwear design',
      'Fashion direction',
      'Nike brand range',
      'Concept development',
      'Color and material',
    ],
    featured: false,
  },
  'nike-zion': {
    id: 'nike-zion',
    title: 'Nike Zion Footwear',
    client: 'Nike',
    year: '2000–2006',
    categories: ['footwear'],
    ...portfolioGallery('nike-zion'),
    assetFile: 'NikeZion-Portfolio.pdf',
    tagline: 'Basketball footwear concept development.',
    story:
      'Nike Zion-era basketball footwear exploration — concept sketches and range development aligned with performance and brand direction.',
    skillsDemo: ['Footwear design', 'Basketball performance', 'Concept development', 'Nike brand'],
    featured: false,
  },
  'paw-patrol': {
    id: 'paw-patrol',
    title: 'Paw Patrol Aqua Pups',
    client: 'Spin Master',
    year: '2019–2021',
    categories: ['toys'],
    ...portfolioGallery('paw-patrol'),
    assetFile: '2025PortfolioPaw_PatrolHQ.pdf',
    tagline: 'From TV narrative to shelf product. Show to Shelf pipeline.',
    story:
      'Paw Patrol runs on a tight TV-to-product pipeline — episodes are written, toys have to match. Aqua Pups and Ninja series required coordinating design with entertainment teams under deadline pressure. Preschool design at a licensed IP scale, delivered on schedule.',
    skillsDemo: [
      'Preschool toy design',
      'Licensed IP management',
      'TV-to-product pipeline',
      'Rapid concept development',
      'Spin Master relationship',
    ],
    featured: false,
  },
  'gi-joe': {
    id: 'gi-joe',
    title: 'G.I. Joe',
    client: 'Hasbro',
    year: '2011–2018',
    categories: ['toys'],
    ...portfolioGallery('gi-joe'),
    assetFile: '2025PortfolioGIJHQ.pdf',
    tagline: 'Narrative-driven product design for an American icon.',
    story:
      "G.I. Joe revival work at Hasbro — part of the larger Hasbro Universe Writers' Room initiative where product design and storytelling were developed in parallel. Fan-focused, narrative-driven design for one of the most recognized action figure lines in history.",
    skillsDemo: [
      'Action figure design',
      'Licensed IP',
      'Narrative-driven design',
      'Hasbro relationship',
      'Fan market understanding',
    ],
    featured: false,
  },
  valaverse: {
    id: 'valaverse',
    title: 'Valaverse Action Force',
    client: 'Valaverse',
    year: 'Recent',
    categories: ['toys'],
    ...portfolioGallery('valaverse'),
    assetFile: '2025PortfolioValaverseHQ.pdf',
    tagline: 'Collector-grade action figures for a premium adult audience.',
    story:
      "Valaverse Action Force targets the adult collector market — premium product, premium standards. Design that holds up to scrutiny from people who know exactly what they're looking at.",
    skillsDemo: ['Action figure design', 'Collector market', 'Premium product design', 'Adult audience'],
    featured: false,
  },
  'power-rangers': {
    id: 'power-rangers',
    title: 'Power Rangers Arsenal',
    client: 'Bandai / Hasbro',
    year: '2011–2013',
    categories: ['toys'],
    ...portfolioGallery('power-rangers'),
    assetFile: '2025PortfolioPower_RangersHQ.pdf',
    tagline: 'Morpher ecosystem with integrated electronics. $85MM.',
    story:
      'Power Rangers brand relaunch — Morpher and Figure ecosystem with integrated electronics. Led electronic programming, role-play toy development, and mentored the team to scale interactive features across the full product line.',
    skillsDemo: [
      'Electronics integration',
      'Role-play toy design',
      'Team leadership',
      'Interactive feature development',
      'Licensed IP at scale',
    ],
    revenueNote: '~$85MM (industry reporting)',
    featured: false,
  },
  'star-wars': {
    id: 'star-wars',
    title: 'Star Wars MicroMachines',
    client: 'Hasbro / Lucasfilm',
    year: '2015–2016',
    categories: ['toys'],
    ...portfolioGallery('star-wars'),
    assetFile: 'SWMMPortfolio.pdf',
    tagline: '150+ vehicles for Force Awakens. Lucasfilm approved. All shipped.',
    story:
      'Episode VII launch — 150+ MicroMachines vehicles designed, licensor-approved, and produced. John created the production tracking system that managed concept-to-manufacture workflow for the entire line while coordinating directly with Lucasfilm on approvals. Volume, quality, deadline. All three.',
    skillsDemo: [
      'Vehicle design at scale',
      'Licensor management',
      'Production systems design',
      'Manufacturing coordination',
      'Star Wars brand standards',
    ],
    revenueNote: '~$750MM+ product line (industry reporting)',
    featured: true,
  },
  apparel: {
    id: 'apparel',
    title: 'Apparel & Container Systems',
    client: 'Marmot · Mashie',
    year: 'Early 2000s',
    categories: ['systems'],
    ...portfolioGallery('apparel'),
    assetFile: 'Marmot001.pdf',
    tagline: 'Outdoor and golf — modular container architecture before the category existed.',
    story:
      'Marmot internal organization systems for outdoor gear, and the Mashie golf brand with apparel, accessories, and personal caddie architecture — same systems-first thinking applied across markets. Peak Design and Osprey came later; this work was ahead of the travel-pack and golf-organizer categories.',
    skillsDemo: [
      'Systems design',
      'Container architecture',
      'Apparel design',
      'Brand creation',
      'Outdoor gear',
      'Golf market',
    ],
    featured: true,
  },
  mwls: {
    id: 'mwls',
    title: 'Midnight Wolf Light Society',
    client: 'Original IP',
    year: 'Recent',
    categories: ['independent-ip'],
    ...portfolioGallery('mwls'),
    assetFile: 'MWLS001.pdf',
    tagline: 'Arduino-powered light box. Original product. Built from scratch.',
    story:
      'Midnight Wolf Light Society is where industrial design meets maker culture. An original product — Arduino-controlled light box with custom smart cat branding — designed, engineered, and fabricated by John. No client brief. No constraints except the ones he set.',
    skillsDemo: [
      'Product design',
      'Electronics (Arduino)',
      'Physical fabrication',
      'Brand creation',
      'Original IP',
      'Packaging design',
    ],
    featured: true,
  },
  'naughty-connie': {
    id: 'naughty-connie',
    title: 'Naughty Connie',
    client: 'Original IP',
    year: 'Created years ago — ongoing',
    categories: ['independent-ip', 'art'],
    ...portfolioGallery('naughty-connie'),
    assetFile: '2026NC001.png',
    tagline: 'Original character. Complete brand universe. She has attitude.',
    story:
      'Naughty Connie is proof of creative voice. A completely self-originated character IP — multiple costume contexts (casual, tactical, catsuit, evening), consistent anatomy, original logotype with real typographic craft, band/entertainment branding built around her. Technical illustration at animation-ready professional standard. The hardest thing to design is genuine personality. She has it.',
    skillsDemo: [
      'Character design',
      'Brand identity',
      'Technical illustration',
      'Typography',
      'Original IP creation',
      'Entertainment design',
    ],
    featured: true,
  },
  'concept-art': {
    id: 'concept-art',
    title: 'Concept Art',
    client: 'Personal / Various',
    year: 'Ongoing',
    categories: ['art'],
    ...portfolioGallery('concept-art'),
    assetFile: 'ConceptArt001.pdf',
    tagline: 'Raw visual range across vehicles, characters, and worlds.',
    story:
      'The concept art portfolio is the unfiltered version — illustration, ideation, and visual thinking across vehicles, characters, environments, and products. No client brief, no constraints, just the full vocabulary.',
    skillsDemo: [
      'Concept illustration',
      'Visual ideation',
      'Cross-discipline rendering',
      'Vehicle design',
      'Character illustration',
    ],
    featured: false,
  },
  'drgn-fli': {
    id: 'drgn-fli',
    title: 'DRGN | FLI',
    client: 'Original IP',
    year: '2025–Present',
    categories: ['independent-ip', 'art'],
    ...portfolioGallery('drgn-fli'),
    assetFile: 'DRGNFLI-Concepts.pdf',
    tagline: 'Visual development for the DRGN | FLI game world.',
    story:
      'Concept and key art for DRGN | FLI — visual development alongside the Swift iOS build (see Software for implementation status).',
    skillsDemo: ['Character and world ideation', 'Game art direction', 'Original IP'],
    featured: false,
  },
};

/** Design band master list — same order as hero tiles. */
export const portfolioItems: PortfolioItem[] = DESIGN_BAND_PROJECT_IDS.map(
  (id) => portfolioById[id],
).filter(Boolean);

export const featuredPortfolioItems = portfolioItems.filter((p) => p.featured);

export const getPortfolioItemById = (id: string): PortfolioItem | undefined =>
  portfolioById[id];

export const getPortfolioItemsByCategory = (
  category: PortfolioCategory,
): PortfolioItem[] =>
  category === 'all'
    ? portfolioItems
    : portfolioItems.filter((p) => p.categories.includes(category));

export const portfolioFilterTabs: { id: PortfolioCategory; label: string }[] = [
  { id: 'all', label: 'All Work' },
  { id: 'footwear', label: 'Footwear' },
  { id: 'toys', label: 'Toys' },
  { id: 'systems', label: 'Systems & Apparel' },
  { id: 'independent-ip', label: 'Independent IP' },
  { id: 'art', label: 'Art & Illustration' },
  { id: 'software', label: 'Software' },
];
