import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LandingHero } from '../components/LandingHero';
import { UNIFIED_BAND_PAGE_WIDTH_CSS } from '../lib/unifiedBandLayout';

const CONTACT_DELAY_MS = 1_800;
const ACTIONS_AFTER_EQUATION_MS = 900;

type BandSide = 'design' | 'software';

type HomeMobileProps = {
  useUnifiedBand?: boolean;
};

/**
 * Phone / coarse-pointer home: smash → equation → pick a side → settled band.
 * No sticky morph scrub runway.
 */
export function HomeMobile({ useUnifiedBand = false }: HomeMobileProps) {
  const [taglineVisible, setTaglineVisible] = useState(false);
  const [actionsVisible, setActionsVisible] = useState(false);
  const [stage, setStage] = useState<'smash' | 'band'>('smash');
  const [bandSide, setBandSide] = useState<BandSide | null>(null);
  const [contactReady, setContactReady] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('home-mobile-flow');
    return () => {
      document.documentElement.classList.remove(
        'home-mobile-flow',
        'home-nav-visible',
        'home-smash-hidden',
      );
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const showNav = taglineVisible || stage === 'band';
    root.classList.toggle('home-nav-visible', showNav);
    root.classList.toggle('home-smash-hidden', stage === 'band');
  }, [taglineVisible, stage]);

  useEffect(() => {
    if (!taglineVisible || stage !== 'smash') {
      setActionsVisible(false);
      return;
    }
    const id = window.setTimeout(() => setActionsVisible(true), ACTIONS_AFTER_EQUATION_MS);
    return () => window.clearTimeout(id);
  }, [taglineVisible, stage]);

  useEffect(() => {
    if (stage !== 'band') {
      setContactReady(false);
      return;
    }
    const id = window.setTimeout(() => setContactReady(true), CONTACT_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [stage]);

  const enterBand = (side: BandSide) => {
    setBandSide(side);
    setStage('band');
    window.scrollTo(0, 0);
  };

  return (
    <div
      className="home-welcome home-welcome--mobile"
      style={{
        width: useUnifiedBand ? UNIFIED_BAND_PAGE_WIDTH_CSS : undefined,
        minHeight: useUnifiedBand ? '100vh' : undefined,
      }}
    >
      {stage === 'smash' ? (
        <section className="home-hero home-hero--mobile" aria-label="Welcome">
          <div className="home-hero__stage">
            <div className="home-hero__frame">
              <video
                className="home-hero__media"
                autoPlay
                muted
                playsInline
                poster="/brand/SparXion_Logo_Smash_poster.jpg"
                aria-hidden="true"
                onEnded={() => setTaglineVisible(true)}
              >
                <source src="/brand/SparXion_Logo_Smash.mp4" type="video/mp4" />
              </video>
              <p
                className={[
                  'home-brand-phrase',
                  'home-brand-phrase--artboard',
                  taglineVisible ? 'home-brand-phrase--visible' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                Spark × Action = Discovery
              </p>
            </div>
          </div>
          <div className="home-hero__veil" aria-hidden="true" />

          <div
            className={[
              'home-mobile-actions',
              actionsVisible ? 'home-mobile-actions--visible' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <p className="home-mobile-actions__label">Discover</p>
            <div className="home-mobile-actions__row">
              <button
                type="button"
                className="home-mobile-actions__btn"
                onClick={() => enterBand('design')}
              >
                Product design
              </button>
              <button
                type="button"
                className="home-mobile-actions__btn"
                onClick={() => enterBand('software')}
              >
                Software design
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section
          id="work"
          className="home-morph home-morph--settled home-morph--mobile"
          aria-label="Explore the work"
        >
          <div className="home-morph__sticky">
            <LandingHero
              useUnifiedBand={useUnifiedBand}
              morphProgress={1}
              openBandSide={bandSide}
            />
            <Link
              to="/contact"
              className={[
                'home-contact-overlay',
                contactReady ? 'home-contact-overlay--visible' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              tabIndex={contactReady ? 0 : -1}
              aria-hidden={!contactReady}
            >
              Contact
            </Link>
            <p className="home-morph__copy">© {new Date().getFullYear()} SparXion</p>
          </div>
        </section>
      )}
    </div>
  );
}
