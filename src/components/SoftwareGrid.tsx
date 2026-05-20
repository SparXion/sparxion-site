import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getSoftwareByCategorySorted,
  softwareFilterCategories,
  softwareItems,
  softwareStatusLabels,
} from '../data/software';
import type { PublicationStatus, SoftwareCategory } from '../data/software';
import { softwareBandImageHref } from '../lib/softwareBandImageHref';

const visibleFilterTabs = softwareFilterCategories.filter(
  (tab) =>
    tab.id === 'all' || softwareItems.some((s) => s.categories.includes(tab.id)),
);

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

export function SoftwareGrid() {
  const [category, setCategory] = useState<SoftwareCategory>('all');
  const items = useMemo(() => getSoftwareByCategorySorted(category), [category]);

  return (
    <>
      <div className="flex flex-wrap gap-small mb-large border-b border-border-gray pb-medium">
        {visibleFilterTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setCategory(tab.id)}
            className={`text-small px-medium py-small rounded-subtle border transition-standard ${
              category === tab.id
                ? 'bg-black text-white border-black'
                : 'bg-white text-dark-gray border-border-gray hover:border-black'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="text-body text-medium-gray">Nothing in this category yet.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-large list-none p-0 m-0">
          {items.map((item) => {
            const muted = item.status === 'internal' || item.status === 'nascent';
            const thumbSrc = softwareBandImageHref(item.id);

            return (
              <li key={item.id}>
                <Link
                  to={`/software/${item.id}`}
                  className={`group block no-underline text-inherit rounded-card overflow-hidden border transition-standard ${
                    muted
                      ? 'border-dashed border-border-gray bg-very-light-gray/80 opacity-[0.82] saturate-[0.65] hover:opacity-100 hover:saturate-100'
                      : 'border-border-gray bg-white hover:shadow-medium'
                  }`}
                >
                  <div className="aspect-[16/10] overflow-hidden bg-bg-gray">
                    <img
                      src={thumbSrc}
                      alt={item.title}
                      className={`w-full h-full object-cover transition-[filter] duration-300 ease-out ${
                        muted ? 'opacity-90' : 'grayscale group-hover:grayscale-0'
                      }`}
                      loading="lazy"
                    />
                  </div>
                  <div className={`p-medium ${muted ? 'text-medium-gray' : ''}`}>
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
                    <h2
                      className={`text-h3 mb-tiny ${muted ? 'text-medium-gray' : 'text-black'}`}
                    >
                      {item.title}
                    </h2>
                    <p className="text-small text-medium-gray mb-tiny">{item.subtitle}</p>
                    <p
                      className={`text-body line-clamp-2 ${muted ? 'text-medium-gray' : 'text-dark-gray'}`}
                    >
                      {item.tagline}
                    </p>
                    {item.stack.length > 0 ? (
                      <p className="text-tiny text-light-gray mt-small line-clamp-1">
                        {item.stack.slice(0, 4).join(' · ')}
                        {item.stack.length > 4 ? '…' : ''}
                      </p>
                    ) : null}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
