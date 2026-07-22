import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { LandingHero } from '../components/LandingHero';
import { UNIFIED_BAND_PAGE_WIDTH_CSS } from '../lib/unifiedBandLayout';

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

/** Prefer the real scrollport (body can own scroll when html/body are height-locked). */
function getScrollTop(): number {
  const se = document.scrollingElement;
  if (se && se.scrollTop > 0) return se.scrollTop;
  return Math.max(
    window.scrollY,
    document.documentElement.scrollTop,
    document.body.scrollTop,
  );
}

const CONTACT_OVERLAY_DELAY_MS = 7_000;

export function HomePage() {
  const [searchParams] = useSearchParams();
  const useUnifiedBand =
    searchParams.get('unified') === '1' || searchParams.get('unified') === 'true';

  const [videoEnded, setVideoEnded] = useState(false);
  const [morphProgress, setMorphProgress] = useState(0);
  const [morphSettled, setMorphSettled] = useState(false);
  const [contactReady, setContactReady] = useState(false);
  const morphTrackRef = useRef<HTMLElement>(null);
  const reduceMotionRef = useRef(false);
  /** Hold morph at complete through sticky end bounce; clear when scrolling back into the track. */
  const morphCompleteLatchedRef = useRef(false);

  useEffect(() => {
    if (!useUnifiedBand) return;
    document.documentElement.classList.add('unified-band-page');
    return () => document.documentElement.classList.remove('unified-band-page');
  }, [useUnifiedBand]);

  useEffect(() => {
    reduceMotionRef.current =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  /** Contact overlay: 7s after the band stage settles — stays put while the X slides. */
  useEffect(() => {
    if (!morphSettled) {
      setContactReady(false);
      return;
    }
    const id = window.setTimeout(() => setContactReady(true), CONTACT_OVERLAY_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [morphSettled]);

  const updateMorphProgress = useCallback(() => {
    const track = morphTrackRef.current;
    if (!track) return;
    if (reduceMotionRef.current) {
      morphCompleteLatchedRef.current = true;
      setMorphProgress(1);
      setMorphSettled(true);
      return;
    }
    // Once settled, stop scrubbing — band stage owns wheel input.
    if (morphCompleteLatchedRef.current && track.classList.contains('home-morph--settled')) {
      setMorphProgress(1);
      setMorphSettled(true);
      return;
    }
    const rect = track.getBoundingClientRect();
    const scrollTop = getScrollTop();
    const trackTop = scrollTop + rect.top;
    const scrollable = Math.max(1, track.offsetHeight - window.innerHeight);
    const raw = clamp01((scrollTop - trackTop) / scrollable);

    if (raw >= 0.98) morphCompleteLatchedRef.current = true;
    else if (raw < 0.75) morphCompleteLatchedRef.current = false;

    const complete = morphCompleteLatchedRef.current && raw >= 0.75;
    setMorphProgress(complete ? 1 : raw);
    setMorphSettled(complete);
  }, []);

  /**
   * Collapse scrub runway, then pin the band flush to the viewport top.
   * useLayoutEffect avoids a frame where scroll is past the new max height
   * (that was jumping to the page bottom with the band mid-screen).
   */
  useLayoutEffect(() => {
    if (!morphSettled) return;
    const track = morphTrackRef.current;
    if (!track) return;
    window.scrollTo(0, track.offsetTop);
  }, [morphSettled]);

  useEffect(() => {
    updateMorphProgress();
    const opts: AddEventListenerOptions = { passive: true };
    window.addEventListener('scroll', updateMorphProgress, opts);
    document.addEventListener('scroll', updateMorphProgress, opts);
    document.body.addEventListener('scroll', updateMorphProgress, opts);
    window.addEventListener('resize', updateMorphProgress);
    return () => {
      window.removeEventListener('scroll', updateMorphProgress);
      document.removeEventListener('scroll', updateMorphProgress);
      document.body.removeEventListener('scroll', updateMorphProgress);
      window.removeEventListener('resize', updateMorphProgress);
    };
  }, [updateMorphProgress]);

  const scrollToMorph = () => {
    morphTrackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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
          onEnded={() => setVideoEnded(true)}
        >
          <source src="/brand/SparXion_Logo_Smash.mp4" type="video/mp4" />
        </video>
        <div className="home-hero__veil" aria-hidden="true" />

        <button
          type="button"
          className={[
            'home-scroll-cue',
            videoEnded ? 'home-scroll-cue--visible' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-label="Scroll to explore the work"
          onClick={scrollToMorph}
        >
          <span className="home-scroll-cue__arrow" aria-hidden="true" />
        </button>
      </section>

      <section
        ref={morphTrackRef}
        id="work"
        className={['home-morph', morphSettled ? 'home-morph--settled' : '']
          .filter(Boolean)
          .join(' ')}
        aria-label="Explore the work"
        data-morph-progress={morphProgress.toFixed(3)}
      >
        <div className="home-morph__sticky">
          <LandingHero
            useUnifiedBand={useUnifiedBand}
            morphProgress={morphProgress}
          />
          <Link
            to="/contact"
            className={[
              'home-contact-overlay',
              morphSettled && contactReady ? 'home-contact-overlay--visible' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            tabIndex={morphSettled && contactReady ? 0 : -1}
            aria-hidden={!(morphSettled && contactReady)}
          >
            Contact
          </Link>
          <p className="home-morph__copy">© {new Date().getFullYear()} SparXion</p>
        </div>
      </section>
    </div>
  );
}
