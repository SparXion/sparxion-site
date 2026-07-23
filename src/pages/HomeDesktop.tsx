import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
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
const CONTACT_OVERLAY_DELAY_MOBILE_MS = 1_800;
/** Scroll arrow after the brand equation has had a beat on screen. */
const SCROLL_CUE_AFTER_TAGLINE_MS = 1_400;
/** Artboard Y for the equation under the smash mark (1920×1080). */
const EQUATION_ARTBOARD_Y = 860 / 1080;
/** Fade the chevron before the equation overlaps it. */
const CUE_CLEARANCE_PX = 28;
/**
 * When LandingHero’s sticky owns the screen (top = 0), equation sits this far
 * above the viewport — “just off the page.” Work backward: equationTop =
 * stickyTop − eqH − gap, so motion stays 1:1 with scroll (no ease/accel).
 */
const EQUATION_OFF_PAGE_GAP_PX = 28;

type HomeDesktopProps = {
  useUnifiedBand?: boolean;
};

/** Desktop / trackpad home: smash → scroll morph → band stage. */
export function HomeDesktop({ useUnifiedBand = false }: HomeDesktopProps) {
  const [scrollCueVisible, setScrollCueVisible] = useState(false);
  const [scrollCueAllowed, setScrollCueAllowed] = useState(false);
  const [taglineVisible, setTaglineVisible] = useState(false);
  const [morphProgress, setMorphProgress] = useState(0);
  const [morphSettled, setMorphSettled] = useState(false);
  const [contactReady, setContactReady] = useState(false);
  const [equationTopPx, setEquationTopPx] = useState(0);
  const morphTrackRef = useRef<HTMLElement>(null);
  const morphStickyRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const equationRef = useRef<HTMLParagraphElement>(null);
  const cueRef = useRef<HTMLButtonElement>(null);
  const reduceMotionRef = useRef(false);
  /** Hold morph at complete through sticky end bounce; clear when scrolling back into the track. */
  const morphCompleteLatchedRef = useRef(false);

  useEffect(() => {
    reduceMotionRef.current =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    if (!morphSettled) {
      setContactReady(false);
      return;
    }
    const mobile =
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: none), (pointer: coarse), (max-width: 720px)').matches;
    const delay = mobile ? CONTACT_OVERLAY_DELAY_MOBILE_MS : CONTACT_OVERLAY_DELAY_MS;
    const id = window.setTimeout(() => setContactReady(true), delay);
    return () => window.clearTimeout(id);
  }, [morphSettled]);

  useEffect(() => {
    if (!taglineVisible) {
      setScrollCueAllowed(false);
      setScrollCueVisible(false);
      return;
    }
    const id = window.setTimeout(() => setScrollCueAllowed(true), SCROLL_CUE_AFTER_TAGLINE_MS);
    return () => window.clearTimeout(id);
  }, [taglineVisible]);

  const updateEquationLayout = useCallback(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const eq = equationRef.current;
    const eqH = eq?.offsetHeight ?? 28;
    const vh = window.innerHeight;
    const centerTop = (vh - eqH) / 2;

    const fr = frame.getBoundingClientRect();
    const naturalTop = fr.top + fr.height * EQUATION_ARTBOARD_Y;
    const held = naturalTop < centerTop ? centerTop : naturalTop;

    const sticky = morphStickyRef.current;
    const stickyTop = sticky?.getBoundingClientRect().top ?? vh;
    const linked = stickyTop - eqH - EQUATION_OFF_PAGE_GAP_PX;
    const top = Math.min(held, linked);
    setEquationTopPx(top);

    const cue = cueRef.current;
    if (!cue || !eq || !scrollCueAllowed) {
      setScrollCueVisible(false);
      return;
    }
    const eqBottom = top + eqH;
    const cueTop = cue.getBoundingClientRect().top;
    const clearOfCue = eqBottom < cueTop - CUE_CLEARANCE_PX;
    const stillInHero = fr.bottom > vh * 0.35 && top > vh * 0.2;
    setScrollCueVisible(clearOfCue && stillInHero);
  }, [scrollCueAllowed]);

  const updateMorphProgress = useCallback(() => {
    const track = morphTrackRef.current;
    if (!track) return;
    if (reduceMotionRef.current) {
      morphCompleteLatchedRef.current = true;
      setMorphProgress(1);
      setMorphSettled(true);
      return;
    }
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

  useLayoutEffect(() => {
    if (!morphSettled) return;
    const track = morphTrackRef.current;
    if (!track) return;
    window.scrollTo(0, track.offsetTop);
  }, [morphSettled]);

  useEffect(() => {
    const tick = () => {
      updateMorphProgress();
      updateEquationLayout();
    };
    tick();
    const opts: AddEventListenerOptions = { passive: true };
    window.addEventListener('scroll', tick, opts);
    document.addEventListener('scroll', tick, opts);
    document.body.addEventListener('scroll', tick, opts);
    window.addEventListener('resize', tick);
    return () => {
      window.removeEventListener('scroll', tick);
      document.removeEventListener('scroll', tick);
      document.body.removeEventListener('scroll', tick);
      window.removeEventListener('resize', tick);
    };
  }, [updateMorphProgress, updateEquationLayout]);

  useLayoutEffect(() => {
    updateEquationLayout();
  }, [taglineVisible, morphSettled, updateEquationLayout]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('home-nav-visible', scrollCueVisible);
    root.classList.toggle(
      'home-smash-hidden',
      scrollCueAllowed && !scrollCueVisible,
    );
    return () => {
      root.classList.remove('home-nav-visible', 'home-smash-hidden');
    };
  }, [scrollCueAllowed, scrollCueVisible]);

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
        <div className="home-hero__stage">
          <div className="home-hero__frame" ref={frameRef}>
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
          </div>
        </div>
        <div className="home-hero__veil" aria-hidden="true" />

        <button
          ref={cueRef}
          type="button"
          className={[
            'home-scroll-cue',
            scrollCueVisible ? 'home-scroll-cue--visible' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-label="Scroll to explore the work"
          onClick={scrollToMorph}
        >
          <span className="home-scroll-cue__arrow" aria-hidden="true" />
        </button>
      </section>

      <div className="home-bridge" aria-hidden="true" />

      <section
        ref={morphTrackRef}
        id="work"
        className={['home-morph', morphSettled ? 'home-morph--settled' : '']
          .filter(Boolean)
          .join(' ')}
        aria-label="Explore the work"
        data-morph-progress={morphProgress.toFixed(3)}
      >
        <div className="home-morph__sticky" ref={morphStickyRef}>
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

      <p
        ref={equationRef}
        className={[
          'home-brand-phrase',
          'home-brand-phrase--scroll',
          taglineVisible ? 'home-brand-phrase--visible' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        style={{ top: equationTopPx }}
        aria-hidden={!taglineVisible}
      >
        Spark × Action = Discovery
      </p>
    </div>
  );
}
