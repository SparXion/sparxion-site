import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getPortfolioItemsByCategory,
  portfolioFilterTabs,
  portfolioItems,
} from '../data/portfolio';
import type { PortfolioCategory } from '../types/domain';
import { portfolioImageUrl } from '../lib/portfolioUrls';

const visibleFilterTabs = portfolioFilterTabs.filter(
  (tab) =>
    tab.id === 'all' || portfolioItems.some((p) => p.categories.includes(tab.id)),
);

export function PortfolioPage() {
  const [category, setCategory] = useState<PortfolioCategory>('all');
  const items = useMemo(() => getPortfolioItemsByCategory(category), [category]);

  return (
    <div className="min-h-screen">
      <div className="max-w-[1600px] mx-auto px-medium py-large">
        <header className="mb-large max-w-3xl">
          <h1 className="text-h1 text-black mb-small">Portfolio</h1>
          <p className="text-body text-medium-gray">
            Physical product design, footwear, toys, systems thinking, and original IP — shipped
            work, not renderings.
          </p>
        </header>

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
          <p className="text-body text-medium-gray">
            Nothing in this category yet. Software projects will appear here as they are published.
          </p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-large list-none p-0 m-0">
            {items.map((item) => {
              const thumb = item.images[0];
              if (!thumb) return null;
              return (
                <li key={item.id}>
                  <Link
                    to={`/portfolio/${item.id}`}
                    className="group block no-underline text-inherit border border-border-gray rounded-card overflow-hidden hover:shadow-medium transition-standard"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-bg-gray">
                      <img
                        src={portfolioImageUrl(item.id, thumb)}
                        alt=""
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-[filter] duration-300 ease-out"
                      />
                    </div>
                    <div className="p-medium">
                      <h2 className="text-h3 text-black mb-tiny">{item.title}</h2>
                      <p className="text-small text-medium-gray mb-tiny">
                        {item.client} · {item.year}
                      </p>
                      <p className="text-body text-dark-gray line-clamp-2">{item.tagline}</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
