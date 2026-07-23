import { Link, useNavigate, useParams } from 'react-router-dom';
import { getPortfolioItemById } from '../data/portfolio';
import { portfolioBandImageHref } from '../lib/portfolioBandImageHref';
import { portfolioImageUrl } from '../lib/portfolioUrls';

export function PortfolioProjectPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const item = id ? getPortfolioItemById(id) : undefined;

  if (!item) {
    return (
      <div className="max-w-[1600px] mx-auto px-medium py-large">
        <p className="text-body text-medium-gray mb-medium">Project not found.</p>
        <Link to="/portfolio" className="text-body text-black underline hover:no-underline">
          ← Back to portfolio
        </Link>
      </div>
    );
  }

  const bandSrc = portfolioBandImageHref(item.id);
  const videoSrc = item.videoFile
    ? portfolioImageUrl(item.id, item.videoFile)
    : null;

  return (
    <div className="min-h-screen">
      <div className="max-w-[900px] mx-auto px-medium py-large">
        <button
          type="button"
          onClick={() => {
            navigate(-1);
          }}
          className="inline-block text-small text-medium-gray hover:text-black mb-medium transition-standard bg-transparent border-0 p-0 cursor-pointer"
        >
          ← Back
        </button>

        <div className="mb-medium overflow-hidden">
          <img
            src={bandSrc}
            alt=""
            className="w-full aspect-[1440/296] object-cover object-center"
          />
        </div>

        {/* Title block sits directly under the banner */}
        <header className="mb-large">
          <h1 className="text-h1 text-black mb-small">{item.title}</h1>
          <p className="text-body text-medium-gray mb-small">
            {item.client} · {item.year}
          </p>
          <p className="text-h3 text-dark-gray font-normal">{item.tagline}</p>
          {item.revenueNote ? (
            <p className="text-small text-medium-gray mt-small">{item.revenueNote}</p>
          ) : null}
        </header>

        {/* Work images next */}
        {videoSrc ? (
          <div className="mb-large overflow-hidden bg-black">
            <video
              src={videoSrc}
              controls
              playsInline
              className="w-full max-h-[70vh]"
              preload="metadata"
            />
          </div>
        ) : null}

        {item.images.length > 0 ? (
          <div className="mb-large flex flex-col gap-medium">
            {item.images.map((file) => (
              <img
                key={file}
                src={portfolioImageUrl(item.id, file)}
                alt=""
                className="w-full"
                loading="lazy"
              />
            ))}
          </div>
        ) : null}

        {/* Long copy at the bottom */}
        <div className="mb-large">
          <p className="text-body text-dark-gray whitespace-pre-wrap">{item.story}</p>
        </div>

        {item.skillsDemo.length > 0 ? (
          <div className="mb-large">
            <h2 className="text-h3 text-black mb-small">Capabilities</h2>
            <ul className="list-disc pl-large text-body text-dark-gray space-y-tiny">
              {item.skillsDemo.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {item.images.length > 0 || item.assetFile ? (
          <p className="text-small text-medium-gray mb-large">
            Source deck: {item.assetFile} ({item.pageCount} pages)
          </p>
        ) : null}
      </div>
    </div>
  );
}
