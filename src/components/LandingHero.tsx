import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useNavigationType, NavigationType } from 'react-router-dom';
import xMarkLargeSvg from '../assets/brand/sparxion-graphics/graphics-svg/x-mark-large.svg?raw';
import { buildLandingHeroSvg } from '../lib/buildLandingHeroSvg';
import {
  clearLandingSession,
  consumeLandingPendingDesignTileNav,
  consumeLandingPendingSoftwareTileNav,
  readLandingBandScrollPersisted,
  readLandingExpandedPersisted,
  writeLandingBandScrollPersisted,
  writeLandingExpandedPersisted,
} from '../lib/landingSession';
import {
  FULL_HERO_BAND_RIGHT_CLIP_POLYGON_POINTS,
  buildHeroBandRightDynamicClipPolygonPointsInUserSpace,
} from '../lib/heroSoftwareBandClip';
import type { BandStripHandle } from './BandStrip';
import { DesignBand } from './DesignBand';
import { SoftwareBand } from './SoftwareBand';
import { SoftwareBandV2 } from './SoftwareBandV2';
import { ANCHOR_RIGHT_U } from '../lib/heroSoftwareBandClip';
import { measureHeroXSeamPx } from '../lib/heroXSeam';
import { BAND_TILE_VIEWBOX_H } from './BandTile';
import { UnifiedBandStrip } from './UnifiedBandStrip';

const HERO_WHEEL_EPS = 1e-6;
/** Treat strip as at scroll “entry” (scrollLeft ≈ max) within this many px — avoids rail ↔ browse flicker. */
const STRIP_AT_END_PX = 3;

const DEBUG_HERO_WHEEL = import.meta.env.DEV && false;

/** When true, use inline clip computation (SoftwareBandV2) instead of SoftwareBand. */
const USE_SOFTWARE_BAND_V2 = true;

/**
 * When true, skip native `clip-path` on SVG `#hero-band-right` during unified expanded (debug only).
 * Keep `false` so the dynamic polygon tracks the large X.
 */
const TEMP_DISABLE_HERO_RIGHT_SVG_CLIP = false;

export type LandingHeroProps = {
  /** `?unified=1` — single strip + shell wedge instead of separate design/software rails. */
  useUnifiedBand?: boolean;
  /**
   * Scroll-morph prototype: 0 → idle wordmark, 1 → large X + bands revealed.
   * When set, expand is driven by this value instead of clicking the X.
   */
  morphProgress?: number;
  /** Mobile home: open a band once the large X / seams are ready. */
  openBandSide?: 'design' | 'software' | null;
};

type HeroWheelState =
  | 'interior'
  | 'design-browsing'
  | 'design-at-home'
  | 'software-browsing'
  | 'software-at-home';

/** Seam x ∈ [0, w] (hero width). Interior strictly inside (0, w); edges delegate to strip/browse. */
function deriveHeroWheelState(
  seamPx: number,
  w: number,
  D: { left: number; max: number } | undefined,
  S: { left: number; max: number } | undefined,
): HeroWheelState {
  const eps = HERO_WHEEL_EPS;
  const end = STRIP_AT_END_PX;

  if (seamPx > eps && seamPx < w - eps) return 'interior';

  if (seamPx <= eps) {
    const smax = D?.max ?? 0;
    const sleft = D?.left ?? 0;
    if (smax <= 1) return 'design-at-home';
    if (sleft >= smax - end) return 'design-at-home';
    return 'design-browsing';
  }

  if (seamPx >= w - eps) {
    const smax = S?.max ?? 0;
    const sleft = S?.left ?? 0;
    if (smax <= 1) return 'software-at-home';
    if (sleft <= end) return 'software-at-home';
    return 'software-browsing';
  }

  return 'interior';
}

/** Mirrors prior 0.57 → 0.62 “pop”, applied to the wordmark-scale `#x-mark` instead. */
const SMALL_X_HOVER_SCALE = 0.62 / 0.57;

/** Drives `#x-mark-large` grow duration (see animation in `heroCss`) + band overlay reveal delay. */
const LANDING_LARGE_X_GROW_MS = 800;

const heroCss = `
.landing-hero-css-root {
  position: relative;
  box-sizing: border-box;
  width: min(96vw, calc(100vh * 1920 / 1080));
  --landing-reveal-px: 0px;
}

/* Wide unified canvas: hero spans full artboard width (parent sets width via 100vh scale). */
.landing-hero-css-root--unified-band-page {
  width: 100% !important;
  max-width: none !important;
}

/* Lets keyframes interpolate --landing-x-t so translate + scale stay in sync */
@property --landing-x-t {
  syntax: '<number>';
  inherits: false;
  initial-value: 0;
}

.landing-hero-css-root .landing-design-band-shell {}

.landing-hero-css-root svg {
  display: block;
  width: 100%;
  height: auto;
  max-height: min(92vh, calc(100vw * 1080 / 1920));
}

.landing-hero-css-root--scroll-morph {
  width: min(96vw, calc(100vh * 1920 / 1080)) !important;
  max-width: 100%;
  height: auto;
  max-height: 100%;
  display: block;
  margin: 0 auto;
}

.landing-hero-css-root--scroll-morph svg {
  width: 100%;
  height: auto;
  max-height: min(92vh, calc(100vw * 1080 / 1920));
}

.landing-hero-css-root--bands-revealed {
  touch-action: pan-y;
}
.landing-x-overlay {
  pointer-events: none;
}
.landing-x-overlay svg {
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
}

/* Band reveal (Software wedge underlay; left half is DesignBand overlay) */
.landing-hero-css-root svg #hero-band-right {
  opacity: 0;
  transition: none;
  pointer-events: none;
  translate: var(--landing-reveal-px) 0;
  transform: none;
}

/* SVG Software wedge: hidden until large X finishes growing (JS adds --bands-revealed). */
.landing-hero-css-root--expanded:not(.landing-hero-css-root--bands-revealed) svg #hero-band-right {
  opacity: 0;
  pointer-events: none;
  transition: none;
}

/*
 * Once HTML Design/Software bands are up, keep the SVG wedge hidden.
 * Scaling it on hover used to grow an X-shaped purple mask under the tiles.
 */
.landing-hero-css-root--expanded.landing-hero-css-root--bands-revealed svg #hero-band-right {
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
}

/* Wordmark + tagline fade out on expand */
.landing-hero-css-root svg #wordmark,
.landing-hero-css-root svg #tagline {
  opacity: 1;
  transition: opacity 400ms ease;
  pointer-events: none;
}

.landing-hero-css-root--expanded svg #wordmark,
.landing-hero-css-root--expanded svg #tagline {
  opacity: 0;
}

/* Wordmark-scale X — static, hover micro-pop (same hinge as Illustrator bbox center) */
.landing-hero-css-root:not(.landing-hero-css-root--expanded) svg #x-mark {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  cursor: pointer;
  transform: scale(1);
  transform-origin: calc(var(--landing-x-sx, 971) * 1px) calc(var(--landing-x-sy, 540) * 1px);
  transition: opacity 400ms ease, transform 200ms ease;
}

.landing-hero-css-root--x-hover:not(.landing-hero-css-root--expanded) svg #x-mark {
  transform: scale(${SMALL_X_HOVER_SCALE});
}

@media (prefers-reduced-motion: reduce) {
  .landing-hero-css-root--x-hover:not(.landing-hero-css-root--expanded) svg #x-mark {
    transform: scale(1);
  }
}

.landing-hero-css-root--expanded svg #x-mark {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

/*
 * Large X: interpolate center (sx,sy)→(lx,ly) and scale sMin→1 so t=0 matches #x-mark
 * and motion is linear with no centroid jump (scale pivots large bbox center, then shifted).
 */
.landing-hero-css-root svg #x-mark-large {
  --landing-x-t: 0;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  cursor: default;
  translate: var(--landing-reveal-px) 0;
  /* view-box + viewport-space translations — matches getBBox() user coordinates */
  transform-box: view-box;
  transform-origin: 0 0;
  transform: translate(
      calc((var(--landing-x-sx, 971) + var(--landing-x-t, 0) * (var(--landing-x-lx, 971) - var(--landing-x-sx, 971))) * 1px),
      calc((var(--landing-x-sy, 540) + var(--landing-x-t, 0) * (var(--landing-x-ly, 540) - var(--landing-x-sy, 540))) * 1px)
    )
    scale(calc(var(--landing-x-grow-from, 0.36) + var(--landing-x-t, 0) * (1 - var(--landing-x-grow-from, 0.36))))
    translate(calc(var(--landing-x-lx, 971) * -1px), calc(var(--landing-x-ly, 540) * -1px));
  transition: none;
}

@keyframes landingHeroXGrow {
  from {
    --landing-x-t: 0;
  }
  to {
    --landing-x-t: 1;
  }
}

.landing-hero-css-root--expanded svg #x-mark-large {
  visibility: visible;
  opacity: 1;
  pointer-events: none;
  animation: landingHeroXGrow ${LANDING_LARGE_X_GROW_MS}ms linear forwards;
}

.landing-hero-css-root--landing-restored.landing-hero-css-root--expanded svg #x-mark-large {
  animation: none !important;
  --landing-x-t: 1;
}

@media (prefers-reduced-motion: reduce) {
  .landing-hero-css-root--expanded svg #x-mark-large {
    animation: none;
    --landing-x-t: 1;
  }
}

/* Overlay large X — appears only after grow animation completes, at final resting position */
#x-mark-large-overlay svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

#x-mark-large-overlay svg #x-mark-large-2 {
  translate: var(--landing-reveal-px) 0;
  transform-box: view-box;
  transform-origin: 0 0;
}

#x-mark-large-overlay svg {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.landing-hero-css-root--bands-revealed #x-mark-large-overlay svg {
  visibility: visible;
  opacity: 1;
}

/* Unified: hide static defs wedge paint; HTML shell carries the mask */
.landing-hero-css-root--unified-band-active svg #hero-clip-band-right {
  opacity: 0 !important;
  visibility: hidden !important;
  pointer-events: none !important;
}

/*
 * Unified strip carries its own X column — hide sketch large X + SVG wedge fill once bands show
 * so nothing stacks on top of the single HTML strip.
 */
.landing-hero-css-root--unified-band-active.landing-hero-css-root--bands-revealed svg #x-mark-large {
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
}

.landing-hero-css-root--unified-band-active.landing-hero-css-root--bands-revealed svg #hero-band-right {
  opacity: 0 !important;
  pointer-events: none !important;
}

/* ——— Scroll-morph: scrub grow / fades from --landing-morph-* (set in JS) ——— */
.landing-hero-css-root--scroll-morph svg #wordmark,
.landing-hero-css-root--scroll-morph svg #tagline {
  opacity: calc(1 - var(--landing-morph-fade, 0));
  transition: none;
}

.landing-hero-css-root--scroll-morph.landing-hero-css-root--expanded svg #wordmark,
.landing-hero-css-root--scroll-morph.landing-hero-css-root--expanded svg #tagline {
  opacity: calc(1 - var(--landing-morph-fade, 0));
}

/*
 * Grow uses the same center+scale lerp as the click-expand keyframes
 * (--landing-x-t), so the mark stays aligned through the whole scrub.
 * Do not scale #x-mark in the wordmark pocket — that drifts off the large rest pose.
 */
.landing-hero-css-root--scroll-morph.landing-hero-css-root--expanded svg #x-mark {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.landing-hero-css-root--scroll-morph.landing-hero-css-root--expanded svg #x-mark-large {
  animation: none !important;
  visibility: visible;
  opacity: 1;
  --landing-x-t: var(--landing-morph-grow, 0);
  translate: 0 0;
}

/* Idle #x-mark also sits in the optical pocket (scroll-morph + pre-expand). */
.landing-hero-css-root--scroll-morph:not(.landing-hero-css-root--expanded) svg #x-mark {
  transform-box: view-box;
  transform-origin: 0 0;
  transform: translate(
      calc(var(--landing-x-sx, 971) * 1px),
      calc(var(--landing-x-sy, 540) * 1px)
    )
    translate(
      calc(var(--landing-x-cx, 971) * -1px),
      calc(var(--landing-x-cy, 540) * -1px)
    );
}

.landing-hero-css-root--scroll-morph.landing-hero-css-root--expanded.landing-hero-css-root--bands-revealed
  svg
  #hero-band-right {
  /* HTML bands own the paint — do not fade the SVG wedge back in during morph. */
  opacity: 0;
  visibility: hidden;
  transition: none;
}

/*
 * HTML bands sit above the SVG X (z-19/20). The separate overlay X (z-50) must cover
 * the center seam once the mark is grown — do not hide it for the whole morph.
 */
.landing-hero-css-root--scroll-morph #x-mark-large-overlay svg {
  opacity: 0;
  visibility: hidden;
  transition: none;
}

.landing-hero-css-root--scroll-morph.landing-hero-css-root--morph-x-ready #x-mark-large-overlay svg {
  opacity: 1;
  visibility: visible;
}
`;

function measureXBboxes(root: HTMLElement): void {
  const svg = root.querySelector('svg');
  const small = svg?.querySelector('#x-mark') as SVGGElement | null;
  const large = svg?.querySelector('#x-mark-large') as SVGGElement | null;
  if (!svg || !small || !large) return;

  const bs = small.getBBox();
  const bl = large.getBBox();
  if (!(bl.width > 1e-6 && bl.height > 1e-6)) return;

  const sMin = Math.min(bs.width / bl.width, bs.height / bl.height);
  /**
   * Wordmark leaves a gap (~930–1010u) for the X; #x-mark’s bbox center sits a bit right
   * of that optical pocket. Grow around the nudged hinge.
   */
  const cx = bs.x + bs.width / 2;
  const cy = bs.y + bs.height / 2;
  const nudgeX = -12;
  const nudgeY = 8;
  const sx = cx + nudgeX;
  const sy = cy + nudgeY;
  const lx = bl.x + bl.width / 2;
  const ly = bl.y + bl.height / 2;

  root.style.setProperty('--landing-x-grow-from', String(sMin));
  root.style.setProperty('--landing-x-cx', String(cx));
  root.style.setProperty('--landing-x-cy', String(cy));
  root.style.setProperty('--landing-x-sx', String(sx));
  root.style.setProperty('--landing-x-sy', String(sy));
  root.style.setProperty('--landing-x-lx', String(lx));
  root.style.setProperty('--landing-x-ly', String(ly));
  root.style.setProperty('--landing-x-nudge-x', String(nudgeX));
  root.style.setProperty('--landing-x-nudge-y', String(nudgeY));
}

export function LandingHero({
  useUnifiedBand = false,
  morphProgress,
  openBandSide = null,
}: LandingHeroProps) {
  const scrollMorph = typeof morphProgress === 'number';
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const [expanded, setExpanded] = useState(false);
  const [landingRestored, setLandingRestored] = useState(false);
  const [bandRestoreScroll, setBandRestoreScroll] = useState<number | undefined>(undefined);
  /** `null` = not yet reconciled to hero width — treat as centered (W/2). `0`/`W` are explicit edges. */
  const [seamPx, setSeamPx] = useState<number | null>(null);
  const [maxRevealPx, setMaxRevealPx] = useState(0);

  const seamResolved = useMemo(() => {
    if (maxRevealPx <= 0) return 0;
    if (seamPx === null) return maxRevealPx / 2;
    return Math.min(maxRevealPx, Math.max(0, seamPx));
  }, [seamPx, maxRevealPx]);

  const landingHeroSvg = useMemo(() => buildLandingHeroSvg(), []);

  useLayoutEffect(() => {
    if (navigationType === NavigationType.Push || navigationType === NavigationType.Replace) {
      clearLandingSession();
      return;
    }
    if (navigationType !== NavigationType.Pop) return;
    const fromDesign = consumeLandingPendingDesignTileNav();
    const fromSoftware = consumeLandingPendingSoftwareTileNav();
    if (!fromDesign && !fromSoftware) return;
    if (!readLandingExpandedPersisted()) return;
    setExpanded(true);
    setLandingRestored(true);
    setBandRestoreScroll(readLandingBandScrollPersisted());
  }, [navigationType]);

  useEffect(() => {
    writeLandingExpandedPersisted(expanded);
  }, [expanded]);

  const [xHover, setXHover] = useState(false);
  const [bandsRevealed, setBandsRevealed] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);
  const xOverlayRef = useRef<HTMLDivElement>(null);
  const designStripRef = useRef<BandStripHandle>(null);
  const softwareStripRef = useRef<BandStripHandle>(null);
  const unifiedStripRef = useRef<BandStripHandle>(null);
  const heroRightSvgClipSavedRef = useRef<string | null>(null);
  /** Wheel/router reads last laid-out seam (always a number; synced from `seamResolved`). */
  const seamPxRef = useRef(0);
  const maxRevealPxRef = useRef(maxRevealPx);
  const [xSeamPx, setXSeamPx] = useState<number | undefined>(undefined);
  const [rightSeamPx, setRightSeamPx] = useState<number | undefined>(undefined);
  /**
   * Once morph finishes, stay unlocked through sticky-scroll bounce near the end.
   * Only re-lock when the user clearly scrolls back into the morph (hysteresis).
   */
  const [morphUnlocked, setMorphUnlocked] = useState(false);
  /** Large X finished growing — overlay X + seam measure may run; bands wait for this. */
  const [morphXReady, setMorphXReady] = useState(false);

  /** Morph CSS only while scrubbing — after unlock, use the normal expanded hero path. */
  const morphScrubbing = scrollMorph && !morphUnlocked;
  /** During morph scrub, wait for measured X seams so bands never paint unclipped/overlapping. */
  const seamsReady =
    typeof xSeamPx === 'number' && typeof rightSeamPx === 'number';
  const designBandVisible =
    expanded && bandsRevealed && (!morphScrubbing || seamsReady);
  const softwareBandVisible = designBandVisible;

  /**
   * Seam ↓ (X right) → design / product. Seam ↑ (X left) → software.
   * Dead zone around center so the phrase doesn't flicker at rest.
   */
  const bandExploreSide = useMemo((): 'design' | 'software' | null => {
    const bandLive =
      designBandVisible && (!scrollMorph || morphUnlocked) && maxRevealPx > 0;
    if (!bandLive) return null;
    const mid = maxRevealPx / 2;
    const dead = Math.max(24, maxRevealPx * 0.05);
    if (seamResolved < mid - dead) return 'design';
    if (seamResolved > mid + dead) return 'software';
    return null;
  }, [designBandVisible, scrollMorph, morphUnlocked, maxRevealPx, seamResolved]);

  /** Keep the last category while the tail collapses so width can ease closed. */
  const [exploreCategory, setExploreCategory] = useState('');
  useEffect(() => {
    if (bandExploreSide === 'design') setExploreCategory('product design');
    else if (bandExploreSide === 'software') setExploreCategory('software design');
  }, [bandExploreSide]);

  /** Mobile entry: snap the seam open once bands can paint. */
  useEffect(() => {
    if (!openBandSide || maxRevealPx <= 0 || !bandsRevealed) return;
    if (scrollMorph && !morphUnlocked) return;
    setSeamPx(openBandSide === 'design' ? 0 : maxRevealPx);
  }, [openBandSide, maxRevealPx, bandsRevealed, scrollMorph, morphUnlocked]);

  const expandFromX = useCallback(() => {
    if (scrollMorph) return;
    setExpanded(true);
  }, [scrollMorph]);

  /** Scroll-morph: map progress → expand / grow / band reveal + CSS vars. */
  useLayoutEffect(() => {
    if (!scrollMorph || morphProgress == null) return;
    const t = Math.min(1, Math.max(0, morphProgress));
    /*
     * Sequence — X must fully cover the seam before any band paint:
     *  0.00–0.22  fade wordmark / tagline
     *  0.16–0.78  grow X (same center lerp as click-expand)
     *  ≥0.78      morph-x-ready → overlay X + seam clips
     *  0.86–1.00  fade bands in under the overlay X
     */
    const fade = Math.min(1, Math.max(0, t / 0.22));
    const grow = Math.min(1, Math.max(0, (t - 0.16) / 0.62));
    const xReady = grow >= 0.98;
    const band = xReady ? Math.min(1, Math.max(0, (t - 0.86) / 0.14)) : 0;
    const shouldExpand = t >= 0.06;
    const shouldBands = xReady && t >= 0.86;

    if (t >= 0.98 && !morphUnlocked) setMorphUnlocked(true);
    else if (t < 0.75 && morphUnlocked) setMorphUnlocked(false);

    const morphComplete = morphUnlocked || t >= 0.98;

    setExpanded(shouldExpand);
    setBandsRevealed(shouldBands || morphComplete);
    setMorphXReady(xReady || morphComplete);

    const root = hostRef.current;
    if (!root) return;

    // After unlock we drop --scroll-morph and use the normal expanded hero.
    // Only write scrub vars while still morphing.
    if (!morphComplete) {
      root.style.setProperty('--landing-morph-fade', String(fade));
      root.style.setProperty('--landing-morph-grow', String(grow));
      root.style.setProperty('--landing-morph-band', String(band));
      root.classList.toggle('landing-hero-css-root--morph-x-ready', xReady);
      if (maxRevealPx > 0) {
        setSeamPx(maxRevealPx / 2);
        root.style.setProperty('--landing-reveal-px', '0px');
      }
      return;
    }

    root.style.removeProperty('--landing-morph-fade');
    root.style.removeProperty('--landing-morph-grow');
    root.style.removeProperty('--landing-morph-band');
    root.classList.remove('landing-hero-css-root--morph-x-ready');
  }, [scrollMorph, morphProgress, maxRevealPx, morphUnlocked]);

  useLayoutEffect(() => {
    seamPxRef.current = seamResolved;
  }, [seamResolved]);

  useLayoutEffect(() => {
    maxRevealPxRef.current = maxRevealPx;
  }, [maxRevealPx]);

  useLayoutEffect(() => {
    if (scrollMorph) return;
    if (!expanded) {
      setBandsRevealed(false);
      return;
    }
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (landingRestored || reduceMotion) {
      setBandsRevealed(true);
    }
  }, [expanded, landingRestored, scrollMorph]);

  useEffect(() => {
    if (scrollMorph) return;
    if (!expanded) return;
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (landingRestored || reduceMotion) return;
    const id = window.setTimeout(() => setBandsRevealed(true), LANDING_LARGE_X_GROW_MS);
    return () => clearTimeout(id);
  }, [expanded, landingRestored, scrollMorph]);

  useLayoutEffect(() => {
    if (morphScrubbing) {
      hostRef.current?.style.setProperty('--landing-reveal-px', '0px');
      return;
    }
    const w = maxRevealPx;
    /** Legacy translate magnitude: revealPx = W − 2·seamPx (center 0, design +W, software −W). */
    const legacyRevealPx = w > 0 ? w - 2 * seamResolved : 0;
    hostRef.current?.style.setProperty('--landing-reveal-px', `${Math.round(legacyRevealPx)}px`);
  }, [seamResolved, maxRevealPx, morphScrubbing]);

  useLayoutEffect(() => {
    const root = hostRef.current;
    if (!root) return;

    const apply = (): void => {
      const w = root.getBoundingClientRect().width;
      const fallback =
        typeof window !== 'undefined' && window.innerWidth > 0 ? window.innerWidth : 0;
      const max = Math.max(0, Math.round(w > 1 ? w : fallback));
      setMaxRevealPx(max);
      setSeamPx((prev) => {
        if (max <= 0) return null;
        if (prev === null) return max / 2;
        return Math.min(max, Math.max(0, prev));
      });
    };

    apply();
    const obs = new ResizeObserver(() => apply());
    obs.observe(root);
    return () => obs.disconnect();
  }, []);

  useLayoutEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    measureXBboxes(el);
    const ro = new ResizeObserver(() => measureXBboxes(el));
    ro.observe(el);
    return () => ro.disconnect();
  }, [expanded, landingHeroSvg, scrollMorph, morphProgress]);

  useLayoutEffect(() => {
    const root = hostRef.current;
    if (!root) return;
    /*
     * During early morph grow, skip live seam measure (feedback risk).
     * Once the X is ready, measure from the visible overlay via SVG CTM so clips
     * track letterboxed scale and tuck under the mark (UCID flat edge stays covered).
     */
    if (morphScrubbing && !morphXReady) {
      setXSeamPx(undefined);
      setRightSeamPx(undefined);
      return;
    }
    if (!expanded || (!bandsRevealed && !morphXReady)) {
      setXSeamPx(undefined);
      setRightSeamPx(undefined);
      return;
    }

    const applySeams = (): void => {
      const measured = measureHeroXSeamPx(root, ANCHOR_RIGHT_U);
      if (!measured) return;
      setXSeamPx(measured.xSeamPx);
      setRightSeamPx(measured.rightSeamPx);
    };

    applySeams();

    const svg = root.querySelector('svg');
    const xLarge = svg?.querySelector<SVGGElement>('#x-mark-large');
    if (xLarge) {
      const onAnimEnd = (): void => applySeams();
      xLarge.addEventListener('animationend', onAnimEnd, { once: true });
      return () => xLarge.removeEventListener('animationend', onAnimEnd);
    }
  }, [expanded, bandsRevealed, seamResolved, maxRevealPx, morphScrubbing, morphXReady]);

  useLayoutEffect(() => {
    const root = hostRef.current;
    if (!root) return;

    const apply = (): void => {
      const svg = root.querySelector('svg');
      const poly =
        svg?.querySelector<SVGPolygonElement>('#hero-band-right-dynamic-clip polygon') ?? null;
      const heroRight = svg?.querySelector<SVGElement>('#hero-band-right');

      const inUnifiedExpanded = expanded && useUnifiedBand && maxRevealPx > 0;

      if (heroRight) {
        if (inUnifiedExpanded && TEMP_DISABLE_HERO_RIGHT_SVG_CLIP) {
          if (heroRightSvgClipSavedRef.current === null) {
            heroRightSvgClipSavedRef.current = heroRight.getAttribute('clip-path');
          }
          heroRight.setAttribute('clip-path', 'none');
        } else if (heroRightSvgClipSavedRef.current !== null) {
          const saved = heroRightSvgClipSavedRef.current;
          if (saved) heroRight.setAttribute('clip-path', saved);
          else heroRight.removeAttribute('clip-path');
          heroRightSvgClipSavedRef.current = null;
        }
      }

      if (!(svg instanceof SVGSVGElement) || !(poly instanceof SVGPolygonElement)) {
        return;
      }

      if (!expanded || !useUnifiedBand || maxRevealPx <= 0) {
        poly.setAttribute('points', FULL_HERO_BAND_RIGHT_CLIP_POLYGON_POINTS);
        return;
      }

      if (TEMP_DISABLE_HERO_RIGHT_SVG_CLIP) {
        return;
      }

      poly.setAttribute(
        'points',
        buildHeroBandRightDynamicClipPolygonPointsInUserSpace({
          seamPx: seamResolved,
          maxRevealPx,
          heroWidthPx: maxRevealPx,
          rightSeamPx,
        }),
      );
    };

    apply();
    const obs = new ResizeObserver(() => apply());
    obs.observe(root);
    return () => {
      obs.disconnect();
    };
  }, [useUnifiedBand, expanded, seamResolved, maxRevealPx, rightSeamPx]);

  /**
   * Hero wheel: derived state from seamPx + strip scroll (no separate React state).
   * Full-bleed rails: scroll-first via scrollHorizontalBy(dx); closing gestures only when strip did not move.
   * During scroll-morph, leave vertical scroll alone until the morph finishes.
   */
  useEffect(() => {
    const root = hostRef.current;
    if (!root) return;
    if (!expanded || !bandsRevealed || !(maxRevealPx > 0)) return;
    if (morphScrubbing) return;

    const stripMoved = (
      _rail: 'design' | 'software',
      strip: BandStripHandle | null,
      dx: number,
    ): boolean => {
      if (!strip) return false;
      const before = strip.getScrollLeft();
      strip.scrollHorizontalBy(dx);
      const after = strip.getScrollLeft();
      const moved = Math.abs(after - before) > 0.5;
      return moved;
    };

    const scrollDeltaClamped = (
      info: { left: number; max: number } | undefined,
      dx: number,
    ): number => {
      if (!info || !(info.max > 1) || !Number.isFinite(dx) || dx === 0) return dx;
      const left = info.left;
      const max = info.max;
      // If we're at an end and dx would push further out-of-range, flip once (no oscillation).
      if (left <= STRIP_AT_END_PX && dx < 0) return -dx;
      if (left >= max - STRIP_AT_END_PX && dx > 0) return -dx;
      return dx;
    };

    const onWheel = (e: WheelEvent): void => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      /*
       * Dominant axis for interior reveal: prefer deltaX on ties. Using strict `>` made deltaY win
       * when |dx|≈|dy|, flipping sign and reversing X motion erratically on trackpads.
       */
      const d =
        Math.abs(e.deltaX) >= Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(d) < 0.25) return;

      const rect = root.getBoundingClientRect();
      const centerX = rect.left + rect.width * 0.5;
      const onLeft = e.clientX < centerX;
      const onRight = e.clientX >= centerX;

      const maxR = maxRevealPxRef.current;
      const s = seamPxRef.current;

      const reduceMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reduceMotion) {
        e.preventDefault();
        setSeamPx(onLeft ? 0 : maxR);
        return;
      }

      const horizontalDominant =
        Math.abs(e.deltaX) >= Math.abs(e.deltaY);
      const dx = e.deltaX;

      const designStrip = useUnifiedBand ? unifiedStripRef.current : designStripRef.current;
      const softwareStrip = useUnifiedBand ? unifiedStripRef.current : softwareStripRef.current;
      const D = designStrip?.getScrollInfo();
      const S = softwareStrip?.getScrollInfo();

      const state = deriveHeroWheelState(s, maxR, D, S);

      if (DEBUG_HERO_WHEEL) {
        console.log('[hero-wheel]', {
          state,
          seamPx: s,
          maxR,
          D,
          S,
          onLeft,
          onRight,
          dx,
          horizontalDominant,
        });
      }

      switch (state) {
        case 'interior': {
          /** Matches legacy revealPx += −d with seamPx = W/2 − revealPx/2 → Δseam = d/2. */
          e.preventDefault();
          setSeamPx((prev) => {
            const base = prev ?? maxR / 2;
            return Math.min(maxR, Math.max(0, base + d / 2));
          });
          return;
        }
        case 'design-at-home': {
          if (!horizontalDominant) return;
          /*
           * Scroll first with raw dx — do not use scrollDeltaClamped here: its end-flip makes the
           * strip always “move” at max scroll, so the seam never received the handoff back to the X.
           * If the strip cannot absorb the delta, apply the same seam physics as interior (seam += d/2).
           */
          if (stripMoved('design', designStrip, dx)) {
            e.preventDefault();
            return;
          }
          e.preventDefault();
          setSeamPx((prev) => {
            const base = prev ?? maxR / 2;
            return Math.min(maxR, Math.max(0, base + d / 2));
          });
          return;
        }
        case 'design-browsing': {
          if (!horizontalDominant) return;
          if (stripMoved('design', designStrip, scrollDeltaClamped(D, dx))) {
            e.preventDefault();
            return;
          }
          e.preventDefault();
          return;
        }
        case 'software-at-home': {
          if (!horizontalDominant) return;
          if (stripMoved('software', softwareStrip, dx)) {
            e.preventDefault();
            return;
          }
          e.preventDefault();
          setSeamPx((prev) => {
            const base = prev ?? maxR / 2;
            return Math.min(maxR, Math.max(0, base + d / 2));
          });
          return;
        }
        case 'software-browsing': {
          if (!horizontalDominant) return;
          if (stripMoved('software', softwareStrip, scrollDeltaClamped(S, dx))) {
            e.preventDefault();
            return;
          }
          e.preventDefault();
          return;
        }
        default:
          return;
      }
    };

    root.addEventListener('wheel', onWheel, { passive: false });
    return () => root.removeEventListener('wheel', onWheel);
  }, [expanded, bandsRevealed, maxRevealPx, setSeamPx, useUnifiedBand, morphScrubbing]);

  /**
   * Touch / pen: horizontal drag near the band strip moves the X seam.
   * Touches above/below the band are ignored so the page can scroll back to smash.
   */
  useEffect(() => {
    const root = hostRef.current;
    if (!root) return;
    if (!expanded || !bandsRevealed || !(maxRevealPx > 0)) return;
    if (morphScrubbing) return;

    /** Hero band strip in artboard units (see DesignBand / SoftwareBand). */
    const BAND_TOP_U = 408.8 / 1080;
    const BAND_BOT_U = (408.8 + BAND_TILE_VIEWBOX_H) / 1080;
    const BAND_PAD = 0.03;

    const inBandZone = (clientY: number): boolean => {
      const r = root.getBoundingClientRect();
      if (!(r.height > 0)) return false;
      const y = (clientY - r.top) / r.height;
      return y >= BAND_TOP_U - BAND_PAD && y <= BAND_BOT_U + BAND_PAD;
    };

    let active = false;
    let pointerId: number | null = null;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let axis: 'undecided' | 'h' | 'v' = 'undecided';
    let dragging = false;

    const endGesture = (e: PointerEvent): void => {
      if (pointerId !== null && e.pointerId !== pointerId) return;
      if (dragging && pointerId !== null) {
        try {
          root.releasePointerCapture(pointerId);
        } catch {
          /* already released */
        }
      }
      active = false;
      pointerId = null;
      dragging = false;
      axis = 'undecided';
    };

    const onDown = (e: PointerEvent): void => {
      if (e.pointerType === 'mouse') return;
      if (e.pointerType !== 'touch' && e.pointerType !== 'pen') return;
      if (!inBandZone(e.clientY)) return;
      const t = e.target as Element | null;
      if (
        t?.closest('button') ||
        t?.closest('a') ||
        t?.closest('[data-band-tile-index]') ||
        t?.closest('[data-unified-tile]')
      ) {
        return;
      }
      active = true;
      pointerId = e.pointerId;
      startX = lastX = e.clientX;
      startY = e.clientY;
      axis = 'undecided';
      dragging = false;
    };

    const onMove = (e: PointerEvent): void => {
      if (!active || e.pointerId !== pointerId) return;
      const dx = e.clientX - lastX;
      const totalDx = e.clientX - startX;
      const totalDy = e.clientY - startY;

      if (axis === 'undecided') {
        if (Math.hypot(totalDx, totalDy) < 10) return;
        axis = Math.abs(totalDx) >= Math.abs(totalDy) ? 'h' : 'v';
        if (axis === 'v') {
          active = false;
          pointerId = null;
          return;
        }
        const maxR = maxRevealPxRef.current;
        const s = seamPxRef.current;
        const designStrip = useUnifiedBand
          ? unifiedStripRef.current
          : designStripRef.current;
        const softwareStrip = useUnifiedBand
          ? unifiedStripRef.current
          : softwareStripRef.current;
        const state = deriveHeroWheelState(
          s,
          maxR,
          designStrip?.getScrollInfo(),
          softwareStrip?.getScrollInfo(),
        );
        if (state === 'design-browsing' || state === 'software-browsing') {
          active = false;
          pointerId = null;
          return;
        }
        dragging = true;
        try {
          root.setPointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
      }

      if (!dragging || axis !== 'h') return;
      e.preventDefault();
      lastX = e.clientX;
      const maxR = maxRevealPxRef.current;
      setSeamPx((prev) => {
        const base = prev ?? maxR / 2;
        return Math.min(maxR, Math.max(0, base - dx));
      });
    };

    root.addEventListener('pointerdown', onDown);
    root.addEventListener('pointermove', onMove, { passive: false });
    root.addEventListener('pointerup', endGesture);
    root.addEventListener('pointercancel', endGesture);
    return () => {
      root.removeEventListener('pointerdown', onDown);
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerup', endGesture);
      root.removeEventListener('pointercancel', endGesture);
    };
  }, [
    expanded,
    bandsRevealed,
    maxRevealPx,
    setSeamPx,
    useUnifiedBand,
    morphScrubbing,
  ]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = e.target as Element | null;
      if (!expanded) {
        setXHover(!!el?.closest('#x-mark'));
        return;
      }
      setXHover(false);
    },
    [expanded]
  );

  const handlePointerLeave = useCallback(() => {
    setXHover(false);
  }, []);

  /** Tile buttons handle their own navigation; only non-tile band clicks go to the grid. */
  const isSoftwareBandTileTarget = (el: Element | null): boolean =>
    !!(
      el?.closest('[data-unified-tile] button') ||
      el?.closest('[data-band-tile-index] button')
    );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = e.target as Element | null;
      if (!expanded) {
        if (el?.closest('#x-mark')) {
          e.preventDefault();
          expandFromX();
        }
        return;
      }
      if (
        el?.closest('.landing-software-band-shell') ||
        el?.closest('.landing-unified-band-root')
      ) {
        if (isSoftwareBandTileTarget(el)) return;
        navigate('/software');
      }
    },
    [expanded, expandFromX, navigate]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const target = e.target as Element | null;
      if (!expanded) {
        if (
          (e.key === 'Enter' || e.key === ' ') &&
          target?.closest('#x-mark')
        ) {
          e.preventDefault();
          expandFromX();
        }
        return;
      }
      if (e.key !== 'Enter' && e.key !== ' ') return;
      if (
        !target?.closest('.landing-software-band-shell') &&
        !target?.closest('.landing-unified-band-root')
      ) {
        return;
      }
      if (isSoftwareBandTileTarget(target)) return;
      e.preventDefault();
      navigate('/software');
    },
    [expanded, expandFromX, navigate]
  );

  useLayoutEffect(() => {
    const root = hostRef.current;
    if (!root) return;
    const smallBtn = root.querySelector('#x-mark');
    if (expanded || scrollMorph) {
      smallBtn?.removeAttribute('tabIndex');
      smallBtn?.removeAttribute('role');
      smallBtn?.removeAttribute('aria-label');
      smallBtn?.removeAttribute('aria-expanded');
    } else {
      smallBtn?.setAttribute('tabIndex', '0');
      smallBtn?.setAttribute('role', 'button');
      smallBtn?.setAttribute('aria-label', 'Expand SparXion home navigation');
      smallBtn?.setAttribute('aria-expanded', 'false');
    }
  }, [expanded, bandsRevealed, scrollMorph]);

  return (
    <section
      className={[
        'flex w-full flex-shrink-0 flex-col items-center justify-center bg-white',
        scrollMorph ? 'min-h-0 h-full py-0' : 'min-h-screen py-10',
        useUnifiedBand ? 'px-0' : 'px-3',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="SparXion landing"
    >
      <style>{heroCss}</style>
      <div
        ref={hostRef}
        className={[
          'landing-hero-css-root max-w-none',
          useUnifiedBand ? 'landing-hero-css-root--unified-band-page' : '',
          morphScrubbing ? 'landing-hero-css-root--scroll-morph' : '',
          expanded ? 'landing-hero-css-root--expanded' : '',
          expanded && (landingRestored || morphUnlocked)
            ? 'landing-hero-css-root--landing-restored'
            : '',
          expanded && bandsRevealed ? 'landing-hero-css-root--bands-revealed' : '',
          expanded && useUnifiedBand ? 'landing-hero-css-root--unified-band-active' : '',
          xHover && !expanded && !scrollMorph ? 'landing-hero-css-root--x-hover' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        <div dangerouslySetInnerHTML={{ __html: landingHeroSvg }} />
        {useUnifiedBand && designBandVisible ? (
          <div
            className="landing-unified-band-root pointer-events-auto absolute left-0 z-[22] w-full transition-opacity duration-300"
            style={{
              top: 'calc(100% * (408.8 / 1080))',
              height: `calc(100% * (${BAND_TILE_VIEWBOX_H} / 1080))`,
            }}
          >
            <UnifiedBandStrip
              ref={unifiedStripRef}
              className="h-full min-h-0 w-full"
              pageScrollMode
            />
          </div>
        ) : null}
        {!useUnifiedBand ? (
          <>
            <DesignBand
              ref={designStripRef}
              designBandVisible={designBandVisible}
              initialBandScrollLeft={bandRestoreScroll}
              onBandScrollPersist={writeLandingBandScrollPersisted}
              seamPx={seamResolved}
              maxRevealPx={maxRevealPx}
              xSeamPx={xSeamPx}
            />
            {USE_SOFTWARE_BAND_V2 ? (
              <SoftwareBandV2
                ref={softwareStripRef}
                visible={softwareBandVisible}
                seamPx={seamResolved}
                maxRevealPx={maxRevealPx}
                rightSeamPx={rightSeamPx}
                tabIndex={bandsRevealed ? 0 : undefined}
                role="link"
                ariaLabel="Software"
              />
            ) : (
              <SoftwareBand
                ref={softwareStripRef}
                visible={softwareBandVisible}
                seamPx={seamResolved}
                maxRevealPx={maxRevealPx}
                rightSeamPx={rightSeamPx}
                tabIndex={bandsRevealed ? 0 : undefined}
                role="link"
                ariaLabel="Software"
              />
            )}
          </>
        ) : null}
        {/* Discover line — “discover” shifts left as the category fades/slides in */}
        <p
          className={[
            'home-explore-line',
            'home-brand-phrase--artboard',
            designBandVisible ? 'home-explore-line--visible' : '',
            bandExploreSide ? 'home-explore-line--expanded' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-live="polite"
          aria-label={
            bandExploreSide === 'design'
              ? 'discover product design'
              : bandExploreSide === 'software'
                ? 'discover software design'
                : 'discover'
          }
        >
          <span className="home-explore-line__lead" aria-hidden="true">
            discover
          </span>
          <span className="home-explore-line__tail" aria-hidden="true">
            <span
              className="home-explore-line__category"
              key={exploreCategory || 'rest'}
            >
              {exploreCategory}
            </span>
          </span>
        </p>
        {/* Large X overlay — visual only; seam drag is band-zone pointer on the root */}
        <div
          ref={xOverlayRef}
          id="x-mark-large-overlay"
          aria-hidden
          className="landing-x-overlay absolute inset-0 z-[50]"
          dangerouslySetInnerHTML={{ __html: xMarkLargeSvg }}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </section>
  );
}
