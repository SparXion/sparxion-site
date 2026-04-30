2026-0213-Grok-Sparxion Domain Model.Mode

Here is a clear, practical **domain model** tailored for your **sparxion.com** site in Cursor.

This model treats your website as a small but meaningful application (or content system) rather than a static brochure. It uses Domain-Driven Design (DDD) thinking lightly — focusing on the core concepts (entities, value objects, aggregates, relationships) that represent your professional identity, career narrative, and digital presence. The goal is to give you a shared language and structure you can reference when prompting Cursor to generate/refactor code, content, components, or even data schemas (e.g., if you add a CMS later).

### Core Domain: SparXion Personal Brand & Portfolio

**Bounded Context**: Personal Professional Identity & Narrative Showcase  
(The website is one bounded context; UCID App and AI Tuner are separate but referenced here.)

#### 1. Ubiquitous Language (key terms you'll use consistently in prompts/code/docs)
- **Spark** — the initial creative idea, insight, or human need that starts any project.
- **Action** — the disciplined execution (synthesis → production) that turns spark into a delivered instrument of delight.
- **Delight** — the measurable outcome: user feels more capable, joyful, empowered, or themselves.
- **Human Scale** — intuitive, non-overwhelming, calibrated to real human perception and capability.
- **Instrument** — the output (physical object, digital tool, narrative system) that extends human intent.
- **Window / Portal** — a medium of creative expression (e.g., industrial design → AI/code).
- **Era** — a distinct phase of your career with shared themes, outputs, and lessons.
- **Journey** — the chronological sequence of eras that tells your story.

#### 2. Entities (things with identity & lifecycle)
- **Person** (you — Johnny Carthief / John Mark Violette)  
  - Identity: unique across all contexts  
  - Attributes: name, ethos, bio summary, contact info, current location (Cincinnati)  
  - Behavior: evolves through eras; delivers delight

- **Era**  
  - Identity: name + time range (e.g., "Hot Wheels Era 2006–2011")  
  - Attributes: headline, summary (1–2 sentences), year range, key clients/brands, core focus (e.g., "scaled delight in play mechanics")  
  - Associations: many Images, many Outputs, belongs to one Journey

- **Output** (your work artifacts — the "instruments")  
  - Identity: title + era reference  
  - Types: PhysicalProduct, DigitalTool, NarrativeSystem, EnterpriseIntegration  
  - Attributes: title, description, impact (e.g., "$750MM line"), tech stack (for digital), liveUrl (if applicable)  
  - Associations: belongs to one Era, has many Images, has many Links (demo, repo, case study)

- **Image**  
  - Identity: filename or alt text + context  
  - Attributes: url, caption, role (hero, supporting, sketch, final), era reference  
  - Note: You manage these yourself — Cursor can help generate placeholders or resize logic.

#### 3. Value Objects (immutable descriptors)
- **EthosStatement** — "Delight delivered at human scale." + supporting paragraph(s)
- **Tagline** — "Where your spark meets action" (spark + action = SparXion)
- **ProcessPhase** — one of: Discovery, Synthesis, Production, Delight  
  (Used in Ethos page and sometimes in Era/Output descriptions)
- **DelightMetric** — qualitative or quantitative proof (e.g., "made kids feel heroic", "amplified creative genius for millions", "compressed 16-week process to 2 weeks")

#### 4. Aggregates (consistency boundaries)
- **JourneyAggregate**  
  Root: Journey (ordered list of Eras)  
  Invariants: Eras are chronological, no gaps/overlaps in narrative arc  
  Contains: all Era entities + their Outputs & Images

- **PortfolioItemAggregate**  
  Root: Output  
  Contains: Output + its Images + Links + DelightMetric  
  (Used for UCID and AI Tuner detail pages)

- **SiteAggregate**  
  Root: SparXionSite  
  Contains: Tagline, EthosStatement, NavigationMenu, Footer, all Pages (Home, Journey, Ethos, UCID, AI Tuner, Contact)

#### 5. Domain Services / Behaviors (what the system "does")
- **RenderJourney** — sequence Eras chronologically with images and summaries
- **ShowcaseInstrument** — display an Output with live link, screenshots, impact
- **ExpressEthos** — consistently present the unified process (Discovery → Synthesis → Production → Delight) across pages
- **DeliverDelight** — ensure every page/section feels intuitive and human-scaled (no clutter, fast load, clear CTAs)

#### 6. Relationships Summary (how things connect)
- Person **has one** Journey
- Journey **contains ordered** Eras
- Era **produces many** Outputs
- Output **embodies** ProcessPhase(s)
- Output **delivers** Delight (via DelightMetric)
- Site **presents** Journey + Ethos + selected Outputs (UCID, AI Tuner)

#### How to Use This Domain Model in Cursor
When prompting Cursor, reference these terms explicitly to keep generations consistent:

Example prompts you can copy-paste:

1. "Using the SparXion domain model: Create a React component for EraCard that takes an Era entity (with name, timeRange, summary, images array) and renders it with reveal-on-scroll animation."

2. "Following the domain model, generate markdown content for the Ethos page. Root it in the ProcessPhase value objects and tie it to the 'Delight delivered at human scale' ethos statement."

3. "Model the JourneyAggregate as a TypeScript interface hierarchy. Include Era, Output, Image, and enforce chronological order invariant."

4. "Build a navigation bar component that reflects the SparXionSite aggregate: Journey | Ethos | UCID | AI Tuner | Contact."

This domain model is intentionally small and focused — it mirrors your "simplicity wins" philosophy while giving Cursor (and you) a consistent mental map for the site.

If you want to expand it (e.g., add Repository for image loading, Event for "new project added", or make it more UCID/AI-Tuner specific), or need me to generate code snippets / interfaces from it right now, just say the word.