// Physical design portfolio — filenames match synced assets in public/portfolio/{id}/
// Run: ./scripts/sync-portfolio-images.sh

import type { PortfolioCategory, PortfolioItem } from '../types/domain';

const cm = [
  '2024-PortfolioFiles-HW-CM-Pg00.png',
  '2024-PortfolioFiles-HW-CM-Pg01.png',
  '2024-PortfolioFiles-HW-CM-Pg02.png',
  '2024-PortfolioFiles-HW-CM-Pg03.png',
  '2024-PortfolioFiles-HW-CM-Pg04.png',
  '2024-PortfolioFiles-HW-CM-Pg05.png',
  '2024-PortfolioFiles-HW-CM-Pg06.png',
  '2024-PortfolioFiles-HW-CM-Pg07.png',
  '2024-PortfolioFiles-HW-CM-Pg08.png',
];

const twin = [
  '2024-PortfolioFiles-HW-Twin00.png',
  '2024-PortfolioFiles-HW-Twin01.png',
  '2024-PortfolioFiles-HW-Twin02.png',
  '2024-PortfolioFiles-HW-Twin03.png',
  '2024-PortfolioFiles-HW-Twin04.png',
  '2024-PortfolioFiles-HW-Twin05.png',
  '2024-PortfolioFiles-HW-Twin06.png',
  '2024-PortfolioFiles-HW-Twin07.png',
  '2024-PortfolioFiles-HW-Twin08.png',
];

const crashers = [
  '2024-PortfolioFiles-HW-Crash01.png',
  '2024-PortfolioFiles-HW-Crash02.png',
  '2024-PortfolioFiles-HW-Crash03.png',
];

const acan0Png = [
  '2024-PortfolioFiles-0-SeriesPg00.png',
  '2024-PortfolioFiles-0-SeriesPg01.png',
  '2024-PortfolioFiles-0-SeriesPg02.png',
  '2024-PortfolioFiles-0-SeriesPg03.png',
  '2024-PortfolioFiles-0-SeriesPg04.png',
  '2024-PortfolioFiles-0-SeriesPg05.png',
  '2024-PortfolioFiles-0-SeriesPg06.png',
  '2024-PortfolioFiles-0-SeriesPg06a.png',
];

const hwArtPng = [
  'HW-ArtCollection-001.png',
  'HW-ArtCollection-002.png',
  'HW-ArtCollection-003.png',
  'HW-ArtCollection-004.png',
  'HW-ArtCollection-005.png',
  'HW-ArtCollection-006.png',
  'HW-ArtCollection-007.png',
  'HW-ArtCollection-008.png',
  'HW-ArtCollection-009.png',
  'HW-ArtCollection-010.png',
];

const acgSketch = Array.from({ length: 16 }, (_, i) => {
  const n = String(i + 1).padStart(3, '0');
  return `ACG-FocusedConcept-${n}.png`;
});

const eps = [
  'EPS-PitchV4-01.png',
  'EPS-PitchV4-02.png',
  'EPS-PitchV4-03.png',
  'EPS-PitchV4-04.png',
  'EPS-PitchV4-05.png',
  'EPS-PitchV4-06.png',
  'EPS-PitchV4-07.png',
  'EPS-PitchV4-08.png',
  'EPS-PitchV4-09.png',
  'EPS-PitchV4-10.png',
  'EPS-PitchV4-11.png',
  'EPS-PitchV4-12.png',
  'EPS-PitchV4-13.png',
  'EPS-PitchV4-14.png',
  'EPS-PitchV4-15.png',
  'EPS-PitchV4-Appendix.png',
];

const paw = [
  '2024-Portfolio-Paw-001.png',
  '2024-Portfolio-Paw-002.png',
  '2024-Portfolio-Paw-003.png',
  '2024-Portfolio-Paw-006.png',
  '2024-Portfolio-Paw-007.png',
  '2024-Portfolio-Paw-008.png',
  'Interview-Pres2024-001-Ninja1.png',
  'Interview-Pres2024-001-NinjaTeam.png',
];

const gij = [
  '2024-Portfolio-GIJ-001a.png',
  '2024-Portfolio-GIJ-001b.png',
  '2024-Portfolio-GIJ-001c.png',
  '2024-Portfolio-GIJ-001d.png',
];

const vv = [
  '2024-PortfolioFiles-VV-001.png',
  '2024-PortfolioFiles-VV-002.png',
  '2024-PortfolioFiles-VV-003.png',
  '2024-PortfolioFiles-VV-004.png',
  '2024-PortfolioFiles-VV-005.png',
  '2024-PortfolioFiles-VV-006.png',
];

const mmpr = [
  '2025-Portfolio-MMPR-Pg01.png',
  '2025-Portfolio-MMPR-Pg02.png',
  'Cheetah-Beast-Blaster.png',
  'Cheetah-Beast-Blaster1.png',
  'unnamed.jpg',
];

const sw = [
  'SW-MM-Portfolio-001.png',
  'SW-MM-Portfolio-002.png',
  'SW-MM-Portfolio-003.png',
  'SW-MM-Portfolio-004.png',
];

const mwlsPng = [
  'IMG_2251.png',
  'IMG_2252.png',
  'IMG_2255.png',
  'IMG_2256.png',
  'IMG_2261.png',
  'IMG_2262.png',
  'IMG_2263.png',
  'IMG_2264.png',
  'IMG_2267.png',
  'IMG_2271.png',
  'IMG_2272.png',
  'IMG_2273.png',
  'IMG_2276.png',
];

const nc = ['2026-NC-001.png', '2026-NC-002.png', '2026-NC-003.png'];

const marmotJpg = [
  'MarmotComp.001.jpg',
  'MarmotComp.002.jpg',
  'MarmotComp.003.jpg',
  'MarmotComp.004.jpg',
  'MarmotComp.005.jpg',
  'MarmotComp.006.jpg',
  'MarmotComp.007.jpg',
  'MarmotComp.008.jpg',
  'MarmotSki.001.jpg',
  'MarmotSki.002.jpg',
  'MarmotSki.003.jpg',
  'TrailPack.001 .jpg',
  'TrailPack.002.1.jpg',
  'TrailPack.002.jpg',
  'TrailPack.003.jpg',
  'TrailPack.004.jpg',
];

const mashieFiles = [
  'MashieApp copy.png',
  'MashieGlove.001.jpg',
  'MashieGlove.002.jpg',
  'MashieGlove.003.jpg',
  'MashieGlove.004.jpg',
  'MashieGlove.005.jpg',
];

const conceptFiles = [
  'Buggy-001a.jpg',
  'Buggy-002-Flyer.jpg',
  'Fairy.png',
  'Gift_Of_Flight.png',
  'Helmet-Concept-002.png',
  'Helmet-Concept-003.png',
  'Helmet-Concept-004.png',
  'Hover.png',
  'IMG_1139.JPG',
  'Mag_Rifle_+_Pistol.png',
  'Mag_Rifle_+_PistolA.png',
  'MaraJade-007a.jpg',
  'NCComp004.jpg',
  'NCComp3.jpg',
  'Portfolio-Content-ROM.png',
  'ROM_6.0_Hover (1).jpg',
  'ROM_6.0_Hover_2 (1).jpg',
  'ROM_6.0_Matte_Black_2.png',
  'ROM_Head_1.0.jpg',
  'ROM_Head_1.jpg',
  'ROM_Pistol_1.0.jpg',
  'ROM_Pistol_2.0CR.jpg',
  'ROM_Pistol_2.0HP.png',
  'ROM_Pistol_2.1LR.jpg',
  'ROM_Pistol_2.1MR.jpg',
  'SplitJet-001Closed.jpg',
  'SplitJet-001Notes.jpg',
  'SplitJet-001Open.jpg',
  'Switchblade-003a.jpg',
  'TrakkerConvertTechPage3.png',
  'Vamp-MkIII-002.jpg',
];

const customMotors: PortfolioItem = {
  id: 'custom-motors',
  title: 'Hot Wheels Custom Motors',
  client: 'Mattel',
  year: '2006–2011',
  categories: ['toys'],
  images: cm,
  assetFile: '2025PortfolioCMHQ.pdf',
  pageCount: 9,
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
};

const twinduction: PortfolioItem = {
  id: 'twinduction',
  title: 'Hot Wheels Twinduction',
  client: 'Mattel',
  year: '2006–2011',
  categories: ['toys'],
  images: twin,
  assetFile: '2025PortfolioTwinductionHQ.pdf',
  pageCount: 9,
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
};

const hwCrashers: PortfolioItem = {
  id: 'hw-crashers',
  title: 'Hot Wheels Crashers',
  client: 'Mattel',
  year: '2006–2011',
  categories: ['toys'],
  images: crashers,
  videoFile: 'Crashermovies/FrontFlipSideTrigger.MOV',
  assetFile: '2025PortfolioHW_CrashersHQ.pdf',
  pageCount: 3,
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
};

const acan0: PortfolioItem = {
  id: 'acan0',
  title: 'ACAN0 Series',
  client: 'Mattel (originated as personal project)',
  year: '2004–2006 → produced',
  categories: ['toys', 'independent-ip'],
  images: acan0Png,
  assetFile: '2025PortfolioACAN0SeriesHQ.pdf',
  pageCount: 8,
  tagline: 'Art Center night class → learned Alias → Mattel produced it.',
  story:
    'This is the origin story. An Art Center at Night class project became the reason to teach himself Alias 3D. The Alias model became a Hot Wheels original design. The whole arc — personal initiative, self-directed learning, production result — in one project. This is how John works: the spark always leads to something real.',
  skillsDemo: [
    'Alias 3D',
    'Automotive design',
    'Self-directed learning',
    'Concept origination',
    'Design-to-production',
  ],
  featured: true,
};

const hwArt: PortfolioItem = {
  id: 'hw-art',
  title: 'Hot Wheels Original Art',
  client: 'Mattel',
  year: '2006–2011',
  categories: ['toys', 'art'],
  images: hwArtPng,
  assetFile: 'HWArt.pdf',
  pageCount: 10,
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
};

const pawPatrol: PortfolioItem = {
  id: 'paw-patrol',
  title: 'Paw Patrol Aqua Pups',
  client: 'Spin Master',
  year: '2019–2021',
  categories: ['toys'],
  images: paw,
  assetFile: '2025PortfolioPaw_PatrolHQ.pdf',
  pageCount: 8,
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
};

const giJoe: PortfolioItem = {
  id: 'gi-joe',
  title: 'G.I. Joe',
  client: 'Hasbro',
  year: '2011–2018',
  categories: ['toys'],
  images: gij,
  assetFile: '2025PortfolioGIJHQ.pdf',
  pageCount: 4,
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
};

const valaverse: PortfolioItem = {
  id: 'valaverse',
  title: 'Valaverse Action Force',
  client: 'Valaverse',
  year: 'Recent',
  categories: ['toys'],
  images: vv,
  assetFile: '2025PortfolioValaverseHQ.pdf',
  pageCount: 6,
  tagline: 'Collector-grade action figures for a premium adult audience.',
  story:
    "Valaverse Action Force targets the adult collector market — premium product, premium standards. Design that holds up to scrutiny from people who know exactly what they're looking at.",
  skillsDemo: ['Action figure design', 'Collector market', 'Premium product design', 'Adult audience'],
  featured: false,
};

const powerRangers: PortfolioItem = {
  id: 'power-rangers',
  title: 'Power Rangers Arsenal',
  client: 'Bandai / Hasbro',
  year: '2011–2013',
  categories: ['toys'],
  images: mmpr,
  assetFile: '2025PortfolioPower_RangersHQ.pdf',
  pageCount: 2,
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
};

const starWars: PortfolioItem = {
  id: 'star-wars',
  title: 'Star Wars MicroMachines',
  client: 'Hasbro / Lucasfilm',
  year: '2015–2016',
  categories: ['toys'],
  images: sw,
  assetFile: 'SWMMPortfolio.pdf',
  pageCount: 4,
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
};

const nikeAcg: PortfolioItem = {
  id: 'nike-acg',
  title: 'Nike ACG Cascade RS',
  client: 'Nike (via Faulconer Design)',
  year: '2000–2006',
  categories: ['footwear'],
  images: acgSketch,
  assetFile: 'ACGPortfolioFINAL.pdf',
  pageCount: 37,
  tagline: 'Research → insight → design. Nike ACG at full strategic depth.',
  story:
    'The ACG Cascade RS work shows footwear design at its most strategic. Competitive analysis, aesthetic influence mapping (off-road vehicle hardware, adventure gear, triangles as structural strength), full design development. This is Nike-level creative rigor applied to a trail/outdoor performance context.',
  skillsDemo: [
    'Footwear design',
    'Market research',
    'Strategic design thinking',
    'Concept development',
    'Nike brand standards',
    'Aesthetic influence mapping',
  ],
  featured: true,
};

const epsGlitz: PortfolioItem = {
  id: 'eps-glitz',
  title: 'Nike EPS Glitz',
  client: 'Nike (via Faulconer Design)',
  year: '2000–2006',
  categories: ['footwear'],
  images: eps,
  assetFile: '2025PortfolioEPSGlitzHQ.pdf',
  pageCount: 15,
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
};

const marmot: PortfolioItem = {
  id: 'marmot',
  title: 'Marmot Container Systems',
  client: 'Marmot',
  year: 'Early 2000s',
  categories: ['systems'],
  images: marmotJpg,
  assetFile: 'Marmot001.pdf',
  pageCount: 16,
  tagline: 'Designed internal container systems before the travel pack category existed.',
  story:
    'Peak Design. Osprey Farpoint. Those came later. This Marmot work was designing modular internal container and organization systems for outdoor gear before the market had a name for it. The category caught up to where John already was.',
  skillsDemo: [
    'Systems design',
    'Container architecture',
    'Outdoor gear design',
    'Ahead-of-market thinking',
    'Modular product systems',
  ],
  featured: true,
};

const mashie: PortfolioItem = {
  id: 'mashie',
  title: 'Mashie Golf Brand',
  client: 'Mashie (personal/consulting)',
  year: 'Early 2000s',
  categories: ['systems'],
  images: mashieFiles,
  assetFile: 'Mashie001.pdf',
  pageCount: 6,
  tagline: 'Golf apparel brand with original container architecture. Built before the category.',
  story:
    "Same systems-first thinking as Marmot, applied to golf. Mashie is a complete brand — apparel, accessories, personal caddie organization system — designed around a modular container architecture that organized gear in ways that didn't exist yet in the golf market.",
  skillsDemo: [
    'Apparel design',
    'Brand creation',
    'Systems design',
    'Golf market',
    'Complete brand development',
  ],
  featured: false,
};

const mwls: PortfolioItem = {
  id: 'mwls',
  title: 'Midnight Wolf Light Society',
  client: 'Original IP',
  year: 'Recent',
  categories: ['independent-ip'],
  images: mwlsPng,
  assetFile: 'MWLS001.pdf',
  pageCount: 12,
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
};

const naughtyConnie: PortfolioItem = {
  id: 'naughty-connie',
  title: 'Naughty Connie',
  client: 'Original IP',
  year: 'Created years ago — ongoing',
  categories: ['independent-ip', 'art'],
  images: nc,
  assetFile: '2026NC001.png',
  pageCount: 3,
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
};

const conceptArt: PortfolioItem = {
  id: 'concept-art',
  title: 'Concept Art',
  client: 'Personal / Various',
  year: 'Ongoing',
  categories: ['art'],
  images: conceptFiles,
  assetFile: 'ConceptArt001.pdf',
  pageCount: 31,
  tagline: '31 pages of raw visual range.',
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
};

export const portfolioItems: PortfolioItem[] = [
  customMotors,
  twinduction,
  hwCrashers,
  acan0,
  nikeAcg,
  starWars,
  mwls,
  naughtyConnie,
  marmot,
  hwArt,
  epsGlitz,
  pawPatrol,
  giJoe,
  valaverse,
  powerRangers,
  mashie,
  conceptArt,
];

export const featuredPortfolioItems = portfolioItems.filter((p) => p.featured);

export const getPortfolioItemById = (id: string): PortfolioItem | undefined =>
  portfolioItems.find((p) => p.id === id);

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
