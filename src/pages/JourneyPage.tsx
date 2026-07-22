import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { journeyData } from '../data/journey';

import type { Era, Image } from '../types/domain';

function EraImage({ image }: { image: Image }) {
  const isLogoLike =
    typeof image.url === 'string' &&
    (image.url.includes('logo') || image.url.endsWith('.svg'));

  const img = (
    <img
      src={image.url}
      alt={image.alt}
      className={
        isLogoLike
          ? 'max-w-full max-h-full object-contain'
          : 'w-full h-full object-cover'
      }
      loading="lazy"
    />
  );

  const shellClass = isLogoLike
    ? 'journey-era__thumb journey-era__thumb--logo'
    : 'journey-era__thumb';

  if (image.caption?.startsWith('http')) {
    return (
      <a
        href={image.caption}
        target="_blank"
        rel="noopener noreferrer"
        className={`${shellClass} journey-era__thumb--link`}
        aria-label={`Open ${image.alt}`}
      >
        {img}
      </a>
    );
  }

  if (image.caption?.startsWith('/')) {
    return (
      <Link
        to={image.caption}
        className={`${shellClass} journey-era__thumb--link`}
        aria-label={`Open ${image.alt}`}
      >
        {img}
      </Link>
    );
  }

  return <div className={shellClass}>{img}</div>;
}

function EraSection({ era, isLast }: { era: Era; isLast: boolean }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const formatYearRange = () => {
    const end = era.timeRange.end === new Date().getFullYear() ? 'Present' : era.timeRange.end;
    return `${era.timeRange.start}–${end}`;
  };

  return (
    <div
      ref={sectionRef}
      className={`journey-era${isVisible ? ' journey-era--visible' : ''}${
        isLast ? ' journey-era--last' : ''
      }`}
    >
      <div className="journey-era__rail" aria-hidden="true">
        <span className="journey-era__dot" />
        <span className="journey-era__line" />
      </div>

      <div className="journey-era__body">
        <h2 className="journey-era__headline">{era.headline}</h2>
        <p className="journey-era__years">{formatYearRange()}</p>
        <p className="journey-era__summary">{era.summary}</p>

        {era.images && era.images.length > 0 && (
          <div className="journey-era__grid">
            {era.images.map((image: Image, i: number) => (
              <EraImage key={`${era.name}-${i}`} image={image} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function JourneyPage() {
  return (
    <div className="violet-stage journey-page">
      <div className="violet-stage__inner journey-page__inner">
        <p className="violet-stage__eyebrow">Story</p>
        <h1 className="violet-stage__title">Journey</h1>
        <p className="violet-stage__lede">
          The chronological sequence of eras that tells the story.
        </p>

        <div className="journey-page__timeline">
          {journeyData.eras.map((era, index) => (
            <EraSection
              key={era.name}
              era={era}
              isLast={index === journeyData.eras.length - 1}
            />
          ))}
        </div>

        <div className="journey-page__close">
          <p className="journey-page__close-copy">
            The equation remains the same: Spark × Action = Discovery.
          </p>
          <Link to="/#work" className="violet-stage__cta">
            Explore the work
          </Link>
        </div>
      </div>
    </div>
  );
}
