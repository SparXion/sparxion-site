import { Journey } from '../types/domain';
import ucLogo from '../assets/uc-logo.png';
import geLogo from '../assets/ge-logo.svg';
import fisherPriceLogo from '../assets/fisher-price-logo.png';
import jossLogo from '../assets/joss-logo.png';
import nikeLogo from '../assets/nike-logo.png';

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
      summary: 'University of Cincinnati and early co-ops built the bedrock of design thinking, systems synthesis, and user-centered prototyping. Collaborations with GE Appliances, Fisher-Price, Joss Design Group, and Nike honed rapid learning and translating human needs into tangible form.',
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
      summary: 'At Faulconer Design/Development, sharpened precision in form, material innovation, and brand expression across global and niche labels including Nike, The North Face, Dr. Martens, Asics, and Zoot Sports. Delivered delight through purposeful, performance-driven footwear solutions that felt instinctive to wear and use.',
      coreFocus: 'Product design and user experience in footwear',
      keyClients: ['Nike', 'The North Face', 'Dr. Martens', 'Asics', 'Zoot Sports'],
      images: [],
      outputs: [],
    },
    {
      name: 'Hot Wheels',
      timeRange: {
        start: 2006,
        end: 2011,
      },
      headline: '2006–2011 — Hot Wheels',
      summary: 'Applied foundational design thinking to large-scale manufacturing at Mattel, blending the pure fun + play delight of Hot Wheels with sophisticated brand voice and collector appeal (e.g., Ferrari series, swappable systems, track & playsets). Mastered balancing childlike joy with premium execution to create experiences that resonated across millions without one voice overpowering the other.',
      coreFocus: 'Scaled delight in play mechanics',
      keyClients: ['Mattel'],
      images: [],
      outputs: [],
    },
    {
      name: 'Hasbro',
      timeRange: {
        start: 2011,
        end: 2018,
      },
      headline: '2011–2018 — Hasbro',
      summary: 'Led cross-functional teams at Hasbro to orchestrate narrative + technology ecosystems, including the $750MM Star Wars Micro Machines launch, Power Rangers relaunch with interactive electronics, Micronauts modular systems, and the pioneering Playmation wearable-tech + app partnership with Disney. Delivered delight at global scale by integrating story, play mechanics, and emerging tech into cohesive brand worlds.',
      coreFocus: 'Multi-brand toy innovation and storytelling',
      keyClients: ['Hasbro', 'Disney'],
      images: [],
      outputs: [],
    },
    {
      name: 'Indie Toy World',
      timeRange: {
        start: 2018,
        end: 2021,
      },
      headline: '2018–2021 — Indie Toy World',
      summary: 'Brought agile, rapid-turnaround design leadership to fast-moving independent brands including Spin Master (Paw Patrol ecosystem), Valaverse, and Wicked Cool Toys. Focused on nimble execution that bridged entertainment IP to shelf, maintaining delight and brand integrity in compressed timelines.',
      coreFocus: 'Diverse toy industry experience',
      keyClients: ['Spin Master', 'Valaverse', 'Wicked Cool Toys'],
      images: [],
      outputs: [],
    },
    {
      name: 'Storytelling & World Building',
      timeRange: {
        start: 2019,
        end: 2026, // Ongoing
      },
      headline: '2019–Ongoing — Storytelling & World Building',
      summary: 'Created Project 417 — an ambitious seven-galaxy transmedia franchise with complete production bible and generational IP infrastructure. Shifted creative expression toward narrative architecture and world-building, discovering AI as a new portal for amplification through intensive collaboration with Grok + Cursor.',
      coreFocus: 'Narrative systems and immersive experiences',
      keyClients: [],
      images: [],
      outputs: [],
    },
    {
      name: 'Digital & Cognitive Pivot',
      timeRange: {
        start: 2024,
        end: 2026, // Present
      },
      headline: '2024–Present — Digital & Cognitive Pivot',
      summary: 'Extended the same synthesis and reduction principles into code and AI, producing 30+ projects including the UCID career exploration app and AI Tuner behavioral control surface. Built cognitive instruments that amplify creative genius — tools that work while you sleep, delivering delight at human scale in the digital realm.',
      coreFocus: 'Digital tools and human-centered software design',
      keyClients: [],
      images: [],
      outputs: [],
    },
    {
      name: 'Global Integration',
      timeRange: {
        start: 2024,
        end: 2026, // Current & Active
      },
      headline: 'Current & Active — Global Integration',
      summary: 'Bringing principled design leadership to enterprise contexts, including P&G rapid design sprints and design support for Diversipak/Neutranarc. Applying the same discovery-synthesis-production-delight loop to help multi-billion organizations + startups compress timelines and unlock productivity at human scale.',
      coreFocus: 'Enterprise design leadership',
      keyClients: ['P&G', 'Diversipak', 'Neutranarc'],
      images: [],
      outputs: [],
    },
  ],
};
