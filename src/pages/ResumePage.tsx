import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { resumeData } from '../data/resume';
import type { ResumeFocusArea } from '../types/domain';

const R = resumeData;

function formatRange(range: { start: number; end: number | 'Present' }) {
  if (range.end !== 'Present' && range.start === range.end) return `${range.start}`;
  return `${range.start}–${range.end}`;
}

/** Build a Markdown document from the currently-curated view. */
function buildMarkdown(active: Set<ResumeFocusArea>) {
  const matches = (areas: ResumeFocusArea[]) =>
    active.size === 0 || areas.some((a) => active.has(a));

  const lines: string[] = [];
  lines.push(`# ${R.name}`);
  lines.push(`**${R.title}**`);
  lines.push('');
  lines.push(R.tagline);
  lines.push('');
  const contact = [R.email, R.phone, R.location, R.website, R.linkedin]
    .filter(Boolean)
    .join(' · ');
  lines.push(contact);

  if (active.size > 0) {
    const labels = R.focusAreas
      .filter((f) => active.has(f.id))
      .map((f) => f.label)
      .join(', ');
    lines.push('');
    lines.push(`_Curated view: ${labels}_`);
  }

  lines.push('');
  lines.push('## Summary');
  lines.push(R.summary);

  const skillGroups = R.skillGroups.filter((g) => matches(g.focusAreas));
  if (skillGroups.length) {
    lines.push('');
    lines.push('## Capabilities');
    for (const g of skillGroups) {
      lines.push('');
      lines.push(`### ${g.title}`);
      for (const s of g.skills) lines.push(`- ${s}`);
    }
  }

  const experience = R.experience.filter((e) => matches(e.focusAreas));
  if (experience.length) {
    lines.push('');
    lines.push('## Experience');
    for (const e of experience) {
      lines.push('');
      lines.push(`### ${e.role} — ${e.org}`);
      const meta = [formatRange(e.timeRange), e.location].filter(Boolean).join(' · ');
      lines.push(`_${meta}_`);
      lines.push('');
      lines.push(e.summary);
      for (const h of e.highlights) lines.push(`- ${h}`);
      if (e.clients?.length) lines.push(`- Clients: ${e.clients.join(', ')}`);
    }
  }

  if (R.education.length) {
    lines.push('');
    lines.push('## Education');
    for (const ed of R.education) {
      lines.push(`- **${ed.institution}** — ${ed.credential}${ed.detail ? ` (${ed.detail})` : ''}`);
    }
  }

  lines.push('');
  lines.push('## Selected Clients');
  lines.push(R.selectedClients.join(' · '));

  return lines.join('\n');
}

function downloadFile(filename: string, contents: string, mime: string) {
  const blob = new Blob([contents], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function ResumePage() {
  const [active, setActive] = useState<Set<ResumeFocusArea>>(new Set());

  const matches = useMemo(
    () => (areas: ResumeFocusArea[]) =>
      active.size === 0 || areas.some((a) => active.has(a)),
    [active],
  );

  const toggle = (id: ResumeFocusArea) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const skillGroups = R.skillGroups.filter((g) => matches(g.focusAreas));
  const experience = R.experience.filter((e) => matches(e.focusAreas));

  const handleMarkdown = () => {
    const slug = R.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    downloadFile(`${slug}-resume.md`, buildMarkdown(active), 'text/markdown');
  };

  return (
    <div className="violet-stage resume-page">
      <div className="violet-stage__inner resume-page__inner">
        {/* ——— Header ——— */}
        <header className="resume-page__header">
          <p className="violet-stage__eyebrow">Résumé</p>
          <h1 className="violet-stage__title resume-page__name">{R.name}</h1>
          <p className="resume-page__title-line">{R.title}</p>
          <p className="resume-page__tagline">{R.tagline}</p>

          <ul className="resume-page__contact">
            <li>
              <a href={`mailto:${R.email}`}>{R.email}</a>
            </li>
            {R.phone && <li>{R.phone}</li>}
            <li>{R.location}</li>
            {R.linkedin && (
              <li>
                <a href={R.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </li>
            )}
          </ul>
        </header>

        {/* ——— Curate + download controls ——— */}
        <section className="resume-page__controls" aria-label="Curate this résumé">
          <div className="resume-page__controls-head">
            <p className="resume-page__controls-label">
              Curate the view — show only what you're here for:
            </p>
            <div className="resume-page__actions">
              <button
                type="button"
                className="resume-page__action"
                onClick={() => window.print()}
              >
                Print / Save PDF
              </button>
              <button
                type="button"
                className="resume-page__action resume-page__action--ghost"
                onClick={handleMarkdown}
              >
                Download .md
              </button>
            </div>
          </div>

          <div className="resume-page__facets" role="group" aria-label="Focus areas">
            <button
              type="button"
              className={`resume-facet${active.size === 0 ? ' resume-facet--on' : ''}`}
              onClick={() => setActive(new Set())}
            >
              All
            </button>
            {R.focusAreas.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`resume-facet${active.has(f.id) ? ' resume-facet--on' : ''}`}
                onClick={() => toggle(f.id)}
                title={f.blurb}
              >
                {f.label}
              </button>
            ))}
          </div>
        </section>

        {/* ——— Summary ——— */}
        <section className="resume-page__section">
          <h2 className="resume-page__section-title">Summary</h2>
          <p className="resume-page__summary">{R.summary}</p>
        </section>

        {/* ——— Capabilities ——— */}
        {skillGroups.length > 0 && (
          <section className="resume-page__section">
            <h2 className="resume-page__section-title">Capabilities</h2>
            <div className="resume-page__skills">
              {skillGroups.map((g) => (
                <div key={g.id} className="resume-skill-group">
                  <h3 className="resume-skill-group__title">{g.title}</h3>
                  <ul className="resume-skill-group__list">
                    {g.skills.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ——— Experience ——— */}
        {experience.length > 0 && (
          <section className="resume-page__section">
            <h2 className="resume-page__section-title">Experience</h2>
            <div className="resume-page__experience">
              {experience.map((e) => (
                <article key={e.id} className="resume-exp">
                  <div className="resume-exp__head">
                    <h3 className="resume-exp__role">
                      {e.role} <span className="resume-exp__org">· {e.org}</span>
                    </h3>
                    <p className="resume-exp__meta">
                      {formatRange(e.timeRange)}
                      {e.location ? ` · ${e.location}` : ''}
                    </p>
                  </div>
                  <p className="resume-exp__summary">{e.summary}</p>
                  <ul className="resume-exp__highlights">
                    {e.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                  {e.clients && e.clients.length > 0 && (
                    <p className="resume-exp__clients">
                      <span>Clients:</span> {e.clients.join(', ')}
                    </p>
                  )}
                  {e.href && (
                    <Link to={e.href} className="resume-exp__link">
                      See the work →
                    </Link>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ——— Education ——— */}
        <section className="resume-page__section">
          <h2 className="resume-page__section-title">Education</h2>
          <ul className="resume-page__education">
            {R.education.map((ed) => (
              <li key={ed.institution}>
                <strong>{ed.institution}</strong> — {ed.credential}
                {ed.detail && <span className="resume-page__edu-detail"> · {ed.detail}</span>}
              </li>
            ))}
          </ul>
        </section>

        {/* ——— Selected clients ——— */}
        <section className="resume-page__section">
          <h2 className="resume-page__section-title">Selected Clients</h2>
          <div className="resume-page__clients">
            {R.selectedClients.map((c) => (
              <span key={c} className="resume-page__client-chip">
                {c}
              </span>
            ))}
          </div>
        </section>

        {/* ——— Future: xAI capability chatbot (coming soon) ——— */}
        <section className="resume-page__chatbot" aria-label="Ask about my experience">
          <div className="resume-page__chatbot-inner">
            <p className="resume-page__chatbot-eyebrow">Coming soon</p>
            <h2 className="resume-page__chatbot-title">Ask my experience anything</h2>
            <p className="resume-page__chatbot-copy">
              An interactive assistant — built on this same résumé data and
              powered by xAI — so you can ask how I'd tackle your problem and get
              a real answer, not a bullet list.
            </p>
            <button type="button" className="resume-page__chatbot-cta" disabled>
              In development
            </button>
          </div>
        </section>

        <div className="resume-page__foot">
          <Link to="/contact" className="violet-stage__cta">
            Let's talk
          </Link>
        </div>
      </div>
    </div>
  );
}
