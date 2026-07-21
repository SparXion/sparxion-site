import { Journey } from '../types/domain';
import ucLogo from '../assets/uc-logo.png';
import geLogo from '../assets/ge-logo.svg';
import fisherPriceLogo from '../assets/fisher-price-logo.png';
import jossLogo from '../assets/joss-logo.png';
import nikeLogo from '../assets/nike-logo.png';

const portfolioImg = (id: string, file = 'band.jpg') =>
  `/portfolio/${id}/${file}`;

const softwareImg = (id: string, file = 'band.jpg') =>
  `/software-assets/${id}/${file}`;

// Journey timeline - chronological sequence of eras
export const journeyData: Journey = {
  eras: [
    {
      name: 'Foundations',
      timeRange: {
        start: 1990,
        end: 1999,
      },
      headline: '1990s — Foundations',
      summary:
        'University of Cincinnati and early co-ops built the bedrock of design thinking, systems synthesis, and user-centered prototyping. Collaborations with GE Appliances, Fisher-Price, Joss Design Group, and Nike honed rapid learning and translating human needs into tangible form.',
      coreFocus: 'Design education and foundational skills',
      keyClients: ['GE Appliances', 'Fisher-Price', 'Joss Design Group', 'Nike'],
      images: [
        { url: ucLogo, alt: 'University of Cincinnati logo', role: 'supporting' as const },
        { url: geLogo, alt: 'GE Appliances logo', role: 'supporting' as const },
        { url: fisherPriceLogo, alt: 'Fisher-Price logo', role: 'supporting' as const },
        { url: jossLogo, alt: 'Joss Design Group logo', role: 'supporting' as const },
        { url: nikeLogo, alt: 'Nike logo', role: 'supporting' as const },
      ],
      outputs: [],
    },
    {
      name: 'Footwear Design',
      timeRange: {
        start: 2000,
        end: 2006,
      },
      headline: '2000–2006 — Footwear Design',
      summary:
        'At Faulconer Design/Development, sharpened precision in form, material innovation, and brand expression across global and niche labels including Nike, The North Face, Dr. Martens, Asics, and Zoot Sports. Delivered delight through purposeful, performance-driven footwear solutions that felt instinctive to wear and use.',
      coreFocus: 'Product design and user experience in footwear',
      keyClients: ['Nike', 'The North Face', 'Dr. Martens', 'Asics', 'Zoot Sports'],
      images: [
        {
          url: '/journey/footwear-2000-2006/black-diamond-001.jpg',
          alt: 'Black Diamond ski boots and liners',
          role: 'supporting' as const,
        },
        {
          url: '/journey/footwear-2000-2006/zoot-012.jpg',
          alt: 'Zoot Sports triathlon running shoe',
          role: 'supporting' as const,
        },
        {
          url: '/journey/footwear-2000-2006/zoot-012-outsole.jpg',
          alt: 'Zoot Sports outsole detail',
          role: 'supporting' as const,
        },
        {
          url: '/journey/footwear-2000-2006/pi-light-lateral.jpg',
          alt: 'Pearl Izumi Light lateral view',
          role: 'supporting' as const,
        },
        {
          url: '/journey/footwear-2000-2006/pi-light-outsole.jpg',
          alt: 'Pearl Izumi Light outsole',
          role: 'supporting' as const,
        },
        {
          url: '/journey/footwear-2000-2006/modulo-005.jpg',
          alt: 'Modular Nike chassis footwear concept',
          role: 'supporting' as const,
          caption: '/portfolio/nike-acg',
        },
        {
          url: '/journey/footwear-2000-2006/modulo-005-3.jpg',
          alt: 'Modular footwear chassis variant',
          role: 'supporting' as const,
          caption: '/portfolio/nike-acg',
        },
        {
          url: '/journey/footwear-2000-2006/fdd-aw06-013.jpg',
          alt: 'Dr. Martens air-cushioned outsole concept',
          role: 'supporting' as const,
        },
        {
          url: '/journey/footwear-2000-2006/fdd-aw06-183.jpg',
          alt: 'Faulconer Design footwear concept',
          role: 'supporting' as const,
        },
        {
          url: '/journey/footwear-2000-2006/fdd-aw06-184.jpg',
          alt: 'Faulconer Design footwear concept detail',
          role: 'supporting' as const,
        },
      ],
      outputs: [],
    },
    {
      name: 'Hot Wheels',
      timeRange: {
        start: 2006,
        end: 2011,
      },
      headline: '2006–2011 — Hot Wheels',
      summary:
        'Applied foundational design thinking to large-scale manufacturing at Mattel, blending the pure fun + play delight of Hot Wheels with sophisticated brand voice and collector appeal (e.g., Ferrari series, swappable systems, track & playsets). Mastered balancing childlike joy with premium execution to create experiences that resonated across millions without one voice overpowering the other.',
      coreFocus: 'Scaled delight in play mechanics',
      keyClients: ['Mattel'],
      images: [
        {
          url: portfolioImg('hw-custom-motors', '002.jpg'),
          alt: 'Hot Wheels Custom Motors modular system',
          role: 'supporting' as const,
          caption: '/portfolio/hw-custom-motors',
        },
        {
          url: portfolioImg('hw-twinduction'),
          alt: 'Hot Wheels Twinduction',
          role: 'supporting' as const,
          caption: '/portfolio/hw-twinduction',
        },
        {
          url: portfolioImg('hw-crashers'),
          alt: 'Hot Wheels Crashers',
          role: 'supporting' as const,
          caption: '/portfolio/hw-crashers',
        },
        {
          url: portfolioImg('hw-art', '002.jpg'),
          alt: 'Hot Wheels original concept art',
          role: 'sketch' as const,
          caption: '/portfolio/hw-art',
        },
        {
          url: portfolioImg('hw-tri-n-stop-me'),
          alt: 'Hot Wheels Tri-N-Stop Me',
          role: 'supporting' as const,
          caption: '/portfolio/hw-tri-n-stop-me',
        },
      ],
      outputs: [],
    },
    {
      name: 'Hasbro',
      timeRange: {
        start: 2011,
        end: 2018,
      },
      headline: '2011–2018 — Hasbro',
      summary:
        'Led cross-functional teams at Hasbro to orchestrate narrative + technology ecosystems, including the $750MM Star Wars Micro Machines launch, Power Rangers relaunch with interactive electronics, Micronauts modular systems, and the pioneering Playmation wearable-tech + app partnership with Disney. Delivered delight at global scale by integrating story, play mechanics, and emerging tech into cohesive brand worlds.',
      coreFocus: 'Multi-brand toy innovation and storytelling',
      keyClients: ['Hasbro', 'Disney'],
      images: [
        {
          url: portfolioImg('star-wars', '002.jpg'),
          alt: 'Star Wars Micro Machines Millennium Falcon playset',
          role: 'supporting' as const,
          caption: '/portfolio/star-wars',
        },
        {
          url: portfolioImg('power-rangers'),
          alt: 'Power Rangers Arsenal',
          role: 'supporting' as const,
          caption: '/portfolio/power-rangers',
        },
        {
          url: portfolioImg('gi-joe', '002.jpg'),
          alt: 'G.I. Joe Desert Duel set',
          role: 'supporting' as const,
          caption: '/portfolio/gi-joe',
        },
        {
          url: portfolioImg('star-wars'),
          alt: 'Star Wars Micro Machines',
          role: 'supporting' as const,
          caption: '/portfolio/star-wars',
        },
        {
          url: portfolioImg('power-rangers', '002.jpg'),
          alt: 'Power Rangers product exploration',
          role: 'supporting' as const,
          caption: '/portfolio/power-rangers',
        },
      ],
      outputs: [],
    },
    {
      name: 'Indie Toy World',
      timeRange: {
        start: 2018,
        end: 2021,
      },
      headline: '2018–2021 — Indie Toy World',
      summary:
        'Brought agile, rapid-turnaround design leadership to fast-moving independent brands including Spin Master (Paw Patrol ecosystem), Valaverse, and Wicked Cool Toys. Focused on nimble execution that bridged entertainment IP to shelf, maintaining delight and brand integrity in compressed timelines.',
      coreFocus: 'Diverse toy industry experience',
      keyClients: ['Spin Master', 'Valaverse', 'Wicked Cool Toys'],
      images: [
        {
          url: portfolioImg('paw-patrol', '002.jpg'),
          alt: 'Paw Patrol Aqua Pups vehicle concepts',
          role: 'supporting' as const,
          caption: '/portfolio/paw-patrol',
        },
        {
          url: portfolioImg('paw-patrol'),
          alt: 'Paw Patrol Aqua Pups',
          role: 'supporting' as const,
          caption: '/portfolio/paw-patrol',
        },
        {
          url: portfolioImg('valaverse'),
          alt: 'Valaverse Action Force',
          role: 'supporting' as const,
          caption: '/portfolio/valaverse',
        },
        {
          url: portfolioImg('valaverse', '002.jpg'),
          alt: 'Valaverse Action Force designs',
          role: 'supporting' as const,
          caption: '/portfolio/valaverse',
        },
        {
          url: portfolioImg('gi-joe'),
          alt: 'Action figure systems work',
          role: 'supporting' as const,
          caption: '/portfolio/gi-joe',
        },
      ],
      outputs: [],
    },
    {
      name: 'Storytelling & World Building',
      timeRange: {
        start: 2019,
        end: 2026,
      },
      headline: '2019–Ongoing — Storytelling & World Building',
      summary:
        'Created Project 417 — an ambitious seven-galaxy transmedia franchise with complete production bible and generational IP infrastructure. Shifted creative expression toward narrative architecture and world-building, discovering AI as a new portal for amplification through intensive collaboration with Grok + Cursor.',
      coreFocus: 'Narrative systems and immersive experiences',
      keyClients: [],
      images: [
        {
          url: portfolioImg('concept-art', '002.jpg'),
          alt: 'Original concept art character study',
          role: 'sketch' as const,
          caption: '/portfolio/concept-art',
        },
        {
          url: portfolioImg('mwls'),
          alt: 'Midnight Wolf Light Society',
          role: 'supporting' as const,
          caption: '/portfolio/mwls',
        },
        {
          url: portfolioImg('drgn-fli'),
          alt: 'DRGN | FLI world building',
          role: 'supporting' as const,
          caption: '/portfolio/drgn-fli',
        },
        {
          url: portfolioImg('naughty-connie'),
          alt: 'Naughty Connie original IP',
          role: 'supporting' as const,
          caption: '/portfolio/naughty-connie',
        },
        {
          url: softwareImg('project-417'),
          alt: 'Project 417 Vault',
          role: 'supporting' as const,
          caption: '/software/project-417',
        },
      ],
      outputs: [],
    },
    {
      name: 'Digital & Cognitive Pivot',
      timeRange: {
        start: 2024,
        end: 2026,
      },
      headline: '2024–Present — Digital & Cognitive Pivot',
      summary:
        'Extended the same synthesis and reduction principles into code and AI, producing 30+ projects including the UCID career exploration app and AI Tuner behavioral control surface. Built cognitive instruments that amplify creative genius — tools that work while you sleep, delivering delight at human scale in the digital realm.',
      coreFocus: 'Digital tools and human-centered software design',
      keyClients: [],
      images: [
        {
          url: softwareImg('ucid'),
          alt: 'UC Industrial Design Career Explorer',
          role: 'supporting' as const,
          caption: '/software/ucid',
        },
        {
          url: softwareImg('ai-tuner-web'),
          alt: 'AI Tuner web app',
          role: 'supporting' as const,
          caption: '/software/ai-tuner-web',
        },
        {
          url: softwareImg('ai-tuner-ios'),
          alt: 'AI Tuner iOS',
          role: 'supporting' as const,
          caption: '/software/ai-tuner-ios',
        },
        {
          url: softwareImg('id-career-sorter'),
          alt: 'Industrial Design Career Sorter',
          role: 'supporting' as const,
          caption: '/software/id-career-sorter',
        },
        {
          url: softwareImg('whse'),
          alt: 'WHSE Creative Network',
          role: 'supporting' as const,
          caption: '/software/whse',
        },
      ],
      outputs: [],
    },
    {
      name: 'Global Integration',
      timeRange: {
        start: 2024,
        end: 2026,
      },
      headline: 'Current & Active — Global Integration',
      summary:
        'Bringing principled design leadership to enterprise contexts, including P&G rapid design sprints and design support for Diversipak/Neutranarc. Applying the same discovery-synthesis-production-delight loop to help multi-billion organizations + startups compress timelines and unlock productivity at human scale.',
      coreFocus: 'Enterprise design leadership',
      keyClients: ['P&G', 'Diversipak', 'Neutranarc'],
      images: [
        {
          url: softwareImg('pg-exploration'),
          alt: 'P&G AI Exploration',
          role: 'supporting' as const,
          caption: '/software/pg-exploration',
        },
        {
          url: softwareImg('neutranarcpython'),
          alt: 'NeutraNarc medical tools',
          role: 'supporting' as const,
          caption: '/software/neutranarcpython',
        },
        {
          url: softwareImg('email-asset-extractor'),
          alt: 'Email Asset Extractor',
          role: 'supporting' as const,
          caption: '/software/email-asset-extractor',
        },
        {
          url: softwareImg('style-scout'),
          alt: 'Style Scout',
          role: 'supporting' as const,
          caption: '/software/style-scout',
        },
        {
          url: softwareImg('illustrator-automation'),
          alt: 'Illustrator automation tools',
          role: 'supporting' as const,
          caption: '/software/illustrator-automation',
        },
      ],
      outputs: [],
    },
  ],
};
