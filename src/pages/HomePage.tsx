import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
          <div className="home-hero__ctas">
            <Link to="/contact" className="home-cta home-cta--primary">
              Get in touch
            </Link>
            <a href="#work" className="home-cta home-cta--ghost">
              Explore the work
            </a>
          </div>
        </div>
      </section>

      <section id="work" className="home-bands" aria-label="Explore the work">
        <LandingHero useUnifiedBand={useUnifiedBand} />

        <div className="home-work home-work--after-bands">
          <div className="home-work__inner">
            <div className="home-work__products">
              <p className="home-work__products-label">Live products &amp; contact</p>
              <div className="home-work__product-row">
                <Link to="/ucid" className="home-cta home-cta--outline">
                  UCID App
                </Link>
                <a
                  href="https://aitunerapp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="home-cta home-cta--outline"
                >
                  AI Tuner
                </a>
                <a
                  href="mailto:john@sparxion.com"
                  className="home-cta home-cta--outline"
                >
                  john@sparxion.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
