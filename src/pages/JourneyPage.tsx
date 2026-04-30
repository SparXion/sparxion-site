import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { journeyData } from '../data/journey';

import type { Era, Image } from '../types/domain';

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
      className={`relative flex gap-xlarge pb-xlarge md:pb-xlarge transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Timeline line - desktop */}
      <div className="hidden md:block relative">
        <div className="w-px bg-black h-full absolute left-0 top-0" style={{ minHeight: '100%' }} />
        <div className="w-3 h-3 bg-black rounded-full absolute -left-1.5 top-0" />
        {isLast && (
          <div className="w-px bg-black h-20 absolute left-0 top-full" />
        )}
      </div>

      {/* Timeline dot - mobile */}
      <div className="md:hidden absolute left-0 top-0 w-2 h-2 bg-black rounded-full -translate-x-1" />

      {/* Content */}
      <div className="flex-1 pl-medium md:pl-0">
        <div className="mb-small">
          <h2 className="text-h2 mb-tiny">{era.headline}</h2>
          <p className="text-body text-medium-gray mb-medium">
            {formatYearRange()}
          </p>
        </div>
        
        <p className="text-body mb-large">{era.summary}</p>

        {/* Image grid */}
        {era.images && era.images.length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-5 gap-small mb-large">
            {era.images.map((image: Image, i: number) => (
              <div
                key={i}
                className="aspect-square bg-white border border-gray era-image flex items-center justify-center p-small"
                style={{ minHeight: '80px' }}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-5 gap-small mb-large">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="aspect-square bg-gray border border-gray era-image"
                style={{ minHeight: '80px' }}
                aria-label={`${era.name} image ${i}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function JourneyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1600px] mx-auto px-medium py-xlarge">
        <h1 className="text-h1 mb-large">John's Journey</h1>
        <p className="text-body mb-xlarge">
          The chronological sequence of eras that tells the story.
        </p>
        
        {/* Timeline sections */}
        <div className="relative mt-xlarge">
          {journeyData.eras.map((era, index) => (
            <EraSection
              key={era.name}
              era={era}
              isLast={index === journeyData.eras.length - 1}
            />
          ))}
        </div>

        {/* Closing block */}
        <div className="text-center mt-xlarge pt-xlarge border-t border-gray">
          <p className="text-body mb-large">
            The equation remains the same: spark + action = delight at human scale.
          </p>
          <Link
            to="/projects"
            className="btn text-body px-xlarge py-medium inline-block bg-black text-white hover:bg-dark-gray transition-standard"
          >
            Dive into Projects
          </Link>
        </div>
      </div>
    </div>
  );
}
