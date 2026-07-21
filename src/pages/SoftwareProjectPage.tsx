import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  getSoftwareById,
  softwareStatusLabels,
  type PublicationStatus,
} from '../data/software';
import { UcidAppRedirect } from './UcidAppRedirect';
import { isUcidProjectId } from '../lib/ucidAppUrl';
import { softwareBandImageHref } from '../lib/softwareBandImageHref';

function statusBadgeClass(status: PublicationStatus): string {
  switch (status) {
    case 'live':
      return 'bg-emerald-50 text-emerald-900 border-emerald-200';
    case 'published':
      return 'bg-sky-50 text-sky-900 border-sky-200';
    case 'production':
      return 'bg-violet-50 text-violet-900 border-violet-200';
    case 'development':
      return 'bg-amber-50 text-amber-900 border-amber-200';
    case 'nascent':
      return 'bg-bg-gray text-medium-gray border-border-gray';
    case 'internal':
      return 'bg-bg-gray text-light-gray border-border-gray';
    default:
      return 'bg-bg-gray text-medium-gray border-border-gray';
  }
}

function primaryUrl(item: {
  liveUrl?: string;
  storeUrl?: string;
  githubUrl?: string;
}): string | undefined {
  return item.liveUrl ?? item.storeUrl ?? item.githubUrl;
}

export function SoftwareProjectPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  if (id && isUcidProjectId(id)) {
    return <UcidAppRedirect />;
  }

  const item = id ? getSoftwareById(id) : undefined;

  if (!item) {
    return (
      <div className="max-w-[1600px] mx-auto px-medium py-large">
        <p className="text-body text-medium-gray mb-medium">Project not found.</p>
        <Link to="/software" className="text-body text-black underline hover:no-underline">
          ← Back to software
        </Link>
      </div>
    );
  }

  const launchUrl = primaryUrl(item);
  const bandSrc = softwareBandImageHref(item.id);

  return (
    <div className="min-h-screen">
      <div className="max-w-[900px] mx-auto px-medium py-large">
        <button
          type="button"
          onClick={() => {
            // If we came from the band, go back to home (band restores via session)
            // Otherwise go to the portfolio grid
            navigate(-1);
          }}
          className="inline-block text-small text-medium-gray hover:text-black mb-medium transition-standard bg-transparent border-0 p-0 cursor-pointer"
        >
          ← Back
        </button>

        <div className="mb-large rounded-card overflow-hidden border border-border-gray">
          <img
            src={bandSrc}
            alt=""
            className="w-full aspect-[1440/296] object-cover object-center"
          />
        </div>

        <header className="mb-large">
          <div className="flex flex-wrap items-center gap-tiny mb-small">
            <span
              className={`inline-flex text-tiny font-medium px-small py-tiny rounded-subtle border ${statusBadgeClass(item.status)}`}
            >
              {softwareStatusLabels[item.status]}
            </span>
            {item.featured ? (
              <span className="inline-flex text-tiny font-medium px-small py-tiny rounded-subtle border border-black bg-black text-white">
                Featured
              </span>
            ) : null}
            {item.monetized ? (
              <span className="inline-flex text-tiny font-medium px-small py-tiny rounded-subtle border border-border-gray bg-white text-dark-gray">
                Monetized
              </span>
            ) : null}
          </div>
          <h1 className="text-h1 text-black mb-small">{item.title}</h1>
          <p className="text-body text-medium-gray mb-small">
            {item.subtitle} · {item.year}
          </p>
          <p className="text-h3 text-dark-gray font-normal">{item.tagline}</p>
          {item.monetizationNote ? (
            <p className="text-small text-medium-gray mt-small">{item.monetizationNote}</p>
          ) : null}
        </header>

        {launchUrl ? (
          <div className="mb-large flex flex-wrap gap-small">
            <a
              href={launchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex text-small font-medium px-medium py-small rounded-subtle border border-black bg-black text-white hover:bg-dark-gray transition-standard no-underline"
            >
              {item.liveUrl ? 'Visit live site' : item.storeUrl ? 'View in store' : 'View on GitHub'}
            </a>
            {item.githubUrl && item.githubUrl !== launchUrl ? (
              <a
                href={item.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex text-small font-medium px-medium py-small rounded-subtle border border-border-gray bg-white text-dark-gray hover:border-black transition-standard no-underline"
              >
                GitHub
              </a>
            ) : null}
          </div>
        ) : item.githubUrl ? (
          <div className="mb-large">
            <a
              href={item.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex text-small font-medium px-medium py-small rounded-subtle border border-black bg-black text-white hover:bg-dark-gray transition-standard no-underline"
            >
              View on GitHub
            </a>
          </div>
        ) : null}

        <div className="mb-large">
          <h2 className="text-h3 text-black mb-small">Problem</h2>
          <p className="text-body text-dark-gray whitespace-pre-wrap">{item.problem}</p>
        </div>

        <div className="mb-large">
          <h2 className="text-h3 text-black mb-small">Solution</h2>
          <p className="text-body text-dark-gray whitespace-pre-wrap">{item.solution}</p>
        </div>

        {item.stack.length > 0 ? (
          <div className="mb-large">
            <h2 className="text-h3 text-black mb-small">Stack</h2>
            <ul className="flex flex-wrap gap-tiny list-none p-0 m-0">
              {item.stack.map((tech) => (
                <li
                  key={tech}
                  className="text-small px-small py-tiny rounded-subtle border border-border-gray bg-very-light-gray text-dark-gray"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {item.highlights.length > 0 ? (
          <div className="mb-large">
            <h2 className="text-h3 text-black mb-small">Highlights</h2>
            <ul className="list-disc pl-large text-body text-dark-gray space-y-tiny">
              {item.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
