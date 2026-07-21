import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LandingHero } from '../components/LandingHero';
import { UNIFIED_BAND_PAGE_WIDTH_CSS } from '../lib/unifiedBandLayout';

export function HomePage() {
  const [searchParams] = useSearchParams();
  const useUnifiedBand =
    searchParams.get('unified') === '1' || searchParams.get('unified') === 'true';

  useEffect(() => {
    if (!useUnifiedBand) return;
    document.documentElement.classList.add('unified-band-page');
    return () => document.documentElement.classList.remove('unified-band-page');
  }, [useUnifiedBand]);

  return (
    <div
      className="home-welcome"
      style={{
        width: useUnifiedBand ? UNIFIED_BAND_PAGE_WIDTH_CSS : undefined,
        minHeight: useUnifiedBand ? '100vh' : undefined,
      }}
    >
      <section className="home-hero" aria-label="Welcome">
        <video
          className="home-hero__media"
          autoPlay
          muted
          playsInline
          poster="/brand/SparXion_Logo_Smash_poster.jpg"
          aria-hidden="true"
        >
          <source src="/brand/SparXion_Logo_Smash.mp4" type="video/mp4" />
        </video>
        <div className="home-hero__veil" aria-hidden="true" />

        <div className="home-hero__content">
          <h1 className="home-hero__headline">Spark x Action = Discovery</h1>
          <p className="home-hero__support">
            Welcome — industrial design and AI-native tools from Cincinnati,
            delivered at human scale.
          </p>
        </div>
      </section>

      <section id="work" className="home-bands" aria-label="Explore the work">
        <LandingHero useUnifiedBand={useUnifiedBand} />
      </section>
    </div>
  );
}
