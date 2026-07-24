import type { Resume } from '../types/domain';

// ————————————————————————————————————————————————————————————————
// Resume database
// ----------------------------------------------------------------
// Source of truth for /resume and the future xAI capability chatbot.
// Facts drawn from Professional Summary Dev canonical sources:
//   - 2026-0427-REFERENCE_COMPLETE_CAREER.md
//   - Resume-Documentation/RESUME_VERSIONS/*
//   - John Software Dev Overview/Professional_Summaries/*
// Revenue figures marked as industry-reported where the career reference
// notes they are not company-confirmed.
// ————————————————————————————————————————————————————————————————

export const resumeData: Resume = {
  name: 'John Mark Violette',
  title: 'Creator | Commercializer | Educator',
  tagline: 'Spark × Action = Discovery — instruments of discovery at human scale.',
  location: 'Cincinnati, Ohio',
  email: 'john@sparxion.com',
  phone: '310-400-2251',
  website: 'https://sparxion.com',
  linkedin: 'https://www.linkedin.com/in/john-violette',

  summary:
    'Creator, commercializer, and educator with 30 years of industrial design expertise and a track record of major product launches at Hasbro, Mattel, Nike, and Spin Master — including industry-reported $750MM+ Star Wars Micro Machines, $85MM Power Rangers relaunch, and $50MM Stretch Armstrong revival. Now building AI-amplified software (UCID grant winner, AI Tuner, 20+ shipped projects), delivering enterprise AI thought leadership, and turning client insights into rapid video clip sketches that make concepts legible. Same loop everywhere: discover the real problem, synthesize it, ship a working thing, leave delight you can use.',

  focusAreas: [
    {
      id: 'physical',
      label: 'Physical & Product Design',
      blurb: 'Footwear, toys, consumer products, and medical devices — form, materials, manufacturing.',
    },
    {
      id: 'digital',
      label: 'Digital, Software & AI',
      blurb: 'Full-stack apps, browser extensions, and AI tools — React/TypeScript, Python, Claude/Claude Code, Cursor, Grok.',
    },
    {
      id: 'creative',
      label: 'Creative Direction & Storytelling',
      blurb: 'Brand ecosystems, world-building, and entertainment-to-shelf narrative systems.',
    },
    {
      id: 'leadership',
      label: 'Leadership & Enterprise',
      blurb: 'Team leadership, mentorship, enterprise AI consulting, and design education.',
    },
  ],

  skillGroups: [
    {
      id: 'product',
      title: 'Product & Industrial Design',
      focusAreas: ['physical'],
      skills: [
        'Footwear design & development',
        'Toy & play-mechanic design',
        'Consumer product & medical device design',
        'Form, CMF & material innovation',
        'Design for manufacturing (injection molding, die-casting)',
        'Physical prototyping & model-making',
        'ASTM / CPSIA / FDA considerations',
      ],
    },
    {
      id: 'digital',
      title: 'Digital, Software & AI',
      focusAreas: ['digital'],
      skills: [
        'React · TypeScript · Vite · Tailwind · Next.js',
        'Python · FastAPI · Flask · Node.js',
        'Swift / SwiftUI · Chrome & Safari extensions',
        'PostgreSQL · Neo4j · vector / RAG systems',
        'Conversational knowledge vaults — RAG + Grok (xAI) chat over an archive (417 Vault)',
        'Bespoke in-site instruments — like this curate-and-download résumé module',
        'Claude / Claude Code · Cursor · Grok (xAI) · prompt engineering',
        'AI-amplified full-stack to production',
        'FERPA-aware educational platforms',
      ],
    },
    {
      id: 'creative',
      title: 'Creative Direction & Storytelling',
      focusAreas: ['creative'],
      skills: [
        'Brand systems & entertainment IP ecosystems',
        'World-building & narrative architecture',
        'Show-to-shelf product storytelling',
        'Client insight synthesis → video clip sketches',
        'Concept art · Blender · Procreate · Alias 3D',
        'Writers\' room direction & pitch craft',
        '16-discipline AI-assisted creative methodology',
      ],
    },
    {
      id: 'leadership',
      title: 'Leadership, Strategy & Process',
      focusAreas: ['leadership'],
      skills: [
        'Cross-functional team leadership & mentorship',
        'Enterprise AI integration consulting',
        'Design sprints & rapid discovery',
        'Discovery → Synthesis → Production → Delight',
        'Teaching & knowledge transfer (UC / DAAP)',
        'Licensor approvals & overseas production',
      ],
    },
  ],

  experience: [
    // ——— Named engagement when public; otherwise capture as capability under SparXion ———
    {
      id: 'pg-thought-leadership',
      role: 'Thought Leadership Consultant',
      org: 'Procter & Gamble',
      location: 'Cincinnati, OH',
      timeRange: { start: 2025, end: 'Present' },
      focusAreas: ['leadership', 'digital', 'creative'],
      summary:
        'AI integration thought leadership for P&G design teams — how AI tools advance creative capability without replacing human judgment.',
      highlights: [
        'Strategic consulting on AI tool integration strategies for design workflows.',
        'Grounded recommendations in real workflow analysis (supported by the P&G AI Exploration research project).',
        'Focus: amplify design-team productivity and discovery, not replace craft.',
      ],
      clients: ['Procter & Gamble'],
      href: '/software/pg-exploration',
    },
    {
      id: 'sparxion',
      role: 'Founder & Principal Designer',
      org: 'SparXion',
      location: 'Cincinnati, OH (prev. Los Angeles)',
      timeRange: { start: 2021, end: 'Present' },
      focusAreas: ['digital', 'creative', 'leadership', 'physical'],
      summary:
        'Independent practice spanning AI software, narrative IP, enterprise design consulting, and medical-device product work — self-taught full-stack development amplified by Claude / Claude Code, Cursor, and Grok.',
      highlights: [
        'Stitch client and consumer insights into rapid video clip “sketches” — short concept films that make an idea legible before full production.',
        '417 Vault: a conversational knowledge vault (Next.js, FastAPI, Chroma DB vector search, Grok xAI API) — turns a personal archive into something you can have a contextual conversation with.',
        'Build bespoke in-site instruments — including this website’s résumé module, a custom tool for evaluating my capabilities with curated views, downloads, and a planned Grok-powered chat.',
        'Built 20+ software projects across web apps, AI tools, and browser extensions — including AI Tuner (visual prompt engineering), WHSE Creative Network, Email Asset Extractor (Chrome Web Store), and ID Career Sorter (open source).',
        'UC Bearcat AI Grant 2025 winner for the UCID Industrial Design Career Explorer — FERPA-compliant React/TypeScript app, built with Claude / Claude Code and Cursor.',
        'NeutraNarc / Diversipak: industrial design consulting for drug-neutralization medical containers (Blender, FreeCAD, Python).',
        'University of Cincinnati: Adjunct Professor, Summer 2025 (product / industrial design); starting Masters in Design Fall 2026.',
        'Project 417 — seven-book science fiction universe with AI-assisted world-building across 16+ creative and technical disciplines.',
      ],
      clients: ['NeutraNarc', 'Diversipak', 'University of Cincinnati'],
      href: '/software',
    },
    {
      id: 'spin-master',
      role: 'Product Design Temp',
      org: 'Spin Master',
      location: 'Culver City, CA',
      timeRange: { start: 2019, end: 2021 },
      focusAreas: ['physical', 'creative', 'leadership'],
      summary:
        'Rapid entertainment-to-shelf toy design for Paw Patrol, aligning product with seasonal TV narratives under compressed timelines.',
      highlights: [
        'Designed Paw Patrol toy lines including Ninja series and Aqua Pups — pup vehicles and headquarters tied to TV storytelling.',
        'Managed "Show to Shelf" pipeline coordinating with entertainment teams.',
        'Mentored internal designers on narrative-to-product workflows.',
      ],
      clients: ['Spin Master'],
      href: '/portfolio/paw-patrol',
    },
    {
      id: 'freelance-2019',
      role: 'Freelance Designer',
      org: 'Wicked Cool Toys · Far Out Toys',
      location: 'Los Angeles, CA',
      timeRange: { start: 2019, end: 2019 },
      focusAreas: ['physical', 'creative'],
      summary:
        'Short-term contract product development — rapid concept-to-prototype across multiple entertainment toy clients.',
      highlights: [
        'Wicked Cool Toys: 20+ Micro Machines vehicles.',
        'Far Out Toys: 3 playsets.',
        'Illustrator-based design iterations with deadline-driven delivery.',
      ],
      clients: ['Wicked Cool Toys', 'Far Out Toys'],
      href: '/portfolio',
    },
    {
      id: 'hasbro',
      role: 'Product Design Manager',
      org: 'Hasbro',
      location: 'Burbank, CA',
      timeRange: { start: 2011, end: 2018 },
      focusAreas: ['physical', 'creative', 'leadership'],
      summary:
        'Led cross-functional design teams across major entertainment brands — narrative ecosystems, interactive electronics, and licensor-managed global launches.',
      highlights: [
        'Star Wars Micro Machines (Episode VII): 150+ vehicles; concept-to-production tracking system; Lucasfilm approvals — industry-reported $750MM+.',
        'Power Rangers brand relaunch: Morpher/figure ecosystem with integrated electronics; mentored team to scale interactive features — industry-reported ~$85MM.',
        'Disney Playmation partnership: pioneered wearable tech + mobile app integration for physical play.',
        'Stretch Armstrong revival: co-developed Netflix animated series concept; pivoted from failed concepts via rapid innovation — industry-reported ~$50MM.',
        'Directed Hasbro Universe writers\' room storytelling for Micronauts, G.I. Joe, and M.A.S.K.; designed interchangeable Micronauts systems.',
        'G.I. Joe Toys R Us exclusive revival; streamlined overseas production and vendor management.',
      ],
      clients: ['Hasbro', 'Disney', 'Lucasfilm'],
      href: '/portfolio/star-wars',
    },
    {
      id: 'mattel',
      role: 'Project Designer — Hot Wheels',
      org: 'Mattel',
      location: 'El Segundo, CA',
      timeRange: { start: 2006, end: 2011 },
      focusAreas: ['physical', 'creative'],
      summary:
        'Innovation-line design for Hot Wheels — mechanical play systems, collector licensing, and Track & Play Sets at global manufacturing scale.',
      highlights: [
        'Custom Motors and Crashers innovation lines with swappable systems and flipping mechanisms — industry-reported $35MM+ combined.',
        'Ferrari collections: 40+ vehicles across kid and collector markets; taught team detailing standards for licensor approval.',
        'Led Track & Play Sets development (2008–2011); mechanical systems design with Asian manufacturing integration.',
      ],
      clients: ['Mattel', 'Ferrari'],
      href: '/portfolio/hw-custom-motors',
    },
    {
      id: 'faulconer',
      role: 'Designer',
      org: 'Faulconer Design / Development',
      location: 'Newport Beach, CA',
      timeRange: { start: 2000, end: 2006 },
      focusAreas: ['physical'],
      summary:
        'Footwear design across Nike (primary), Dr. Martens, and 10+ brands — concept-to-production workflows integrating technical design with manufacturing.',
      highlights: [
        'Directed footwear design for Nike, Dr. Martens, The North Face, Asics, Zoot Sports, and additional labels.',
        'Developed new processes for product differentiation and brand expression.',
        'Self-taught Alias 3D (2006); modeled Mazda and BMW transportation concepts alongside footwear work.',
      ],
      clients: ['Nike', 'Dr. Martens', 'The North Face', 'Asics', 'Zoot Sports'],
      href: '/journey',
    },
    {
      id: 'jakks',
      role: 'Product Manager / Designer',
      org: 'Jakks Pacific',
      location: 'Malibu, CA',
      timeRange: { start: 1999, end: 2000 },
      focusAreas: ['physical', 'leadership'],
      summary:
        'Full product development from concept through Asian manufacturing — introduced systematic industrial design practices to a consumer-products company.',
      highlights: [
        'MXS toy line: die-cast motocross cycles with action figures and track sets.',
        'Remco brand development including first modular construction platform.',
        '1/43-scale collector police cars; production timeline, factory coordination, and quality control.',
      ],
      clients: ['Jakks Pacific', 'Remco'],
      href: '/journey',
    },
    {
      id: 'coops',
      role: 'Design Co-ops',
      org: 'GE Appliances · Fisher-Price · Joss Design Group · Nike',
      location: 'Various',
      timeRange: { start: 1995, end: 1998 },
      focusAreas: ['physical'],
      summary:
        'University of Cincinnati co-op rotations that built the bedrock of design thinking, systems synthesis, and user-centered prototyping.',
      highlights: [
        'GE Appliances (1995–1996): manufacturing processes, UX innovation, design for manufacturing.',
        'Fisher-Price (1996): child development, play patterns, safety-integrated toy design.',
        'Joss Design Group (1997): graphic + industrial design integration, client collaboration.',
        'Nike (1997–1998, two rotations, Beaverton): athletic footwear, performance innovation, brand standards.',
        'Transportation design studios sponsored by General Motors (1998) and Chrysler (1997).',
      ],
      clients: ['GE Appliances', 'Fisher-Price', 'Joss Design Group', 'Nike'],
      href: '/journey',
    },
  ],

  education: [
    {
      institution: 'University of Cincinnati — DAAP',
      credential: 'B.S. Industrial Design',
      detail: 'Co-op program; transportation studios with GM and Chrysler.',
      timeRange: { start: 1993, end: 1998 },
    },
    {
      institution: 'University of Cincinnati',
      credential: 'Masters in Design (starting Fall 2026)',
      detail: 'Adjunct Professor, Summer 2025 — product / industrial design.',
      timeRange: { start: 2026, end: 2028 },
    },
    {
      institution: 'Art Center at Night',
      credential: '3D Alias Studio · Transportation & Product Design',
      detail: 'Studios at Mazda Design (Irvine) and Mitsubishi Motors (Cypress); Mazda "Next" and BMW "0-Series" concepts.',
      timeRange: { start: 2004, end: 2006 },
    },
  ],

  selectedClients: [
    'Hasbro',
    'Disney',
    'Lucasfilm',
    'Mattel',
    'Nike',
    'Spin Master',
    'P&G',
    'Dr. Martens',
    'The North Face',
    'Fisher-Price',
    'GE Appliances',
    'Jakks Pacific',
    'NeutraNarc',
    'University of Cincinnati',
  ],
};
