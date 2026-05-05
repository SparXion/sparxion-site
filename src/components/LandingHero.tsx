import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useNavigationType, NavigationType } from 'react-router-dom';
import landingSvgRaw from '../assets/brand/sparxion-graphics/Sparxion_Landing_Sketch-Scale.svg?raw';
import {
  clearLandingSession,
  consumeLandingPendingDesignTileNav,
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
import { BAND_TILE_VIEWBOX_H } from './BandTile';
import { UnifiedBandStrip } from './UnifiedBandStrip';

const HERO_WHEEL_EPS = 1e-6;
/** Treat strip as at scroll “entry” (scrollLeft ≈ max) within this many px — avoids rail ↔ browse flicker. */
const STRIP_AT_END_PX = 3;

const DEBUG_HERO_WHEEL = import.meta.env.DEV && false;

/**
 * When true, skip native `clip-path` on SVG `#hero-band-right` during unified expanded (debug only).
 * Keep `false` so the dynamic polygon tracks the large X.
 */
const TEMP_DISABLE_HERO_RIGHT_SVG_CLIP = false;

export type LandingHeroProps = {
  /** `?unified=1` — single strip + shell wedge instead of separate design/software rails. */
  useUnifiedBand?: boolean;
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

/* Band reveal + hover (Software wedge only; left half is DesignBand overlay) */
.landing-hero-css-root svg #hero-band-right {
  opacity: 0;
  transition: none;
  pointer-events: none;
  translate: var(--landing-reveal-px) 0;
  transform: scale(1);
  transform-origin: 1425px 557px;
}

/* SVG Software wedge: hidden until large X finishes growing (JS adds --bands-revealed). */
.landing-hero-css-root--expanded:not(.landing-hero-css-root--bands-revealed) svg #hero-band-right {
  opacity: 0;
  pointer-events: none;
  transition: none;
}

.landing-hero-css-root--expanded.landing-hero-css-root--bands-revealed svg #hero-band-right {
  opacity: 0;
  pointer-events: auto;
  cursor: pointer;
  transition: opacity 400ms ease;
}

.landing-hero-css-root--expanded.landing-hero-css-root--bands-revealed.landing-hero-css-root--band-right
  svg
  #hero-band-right {
  transform: scale(1.03);
}

/* Wordmark fades out on expand */
.landing-hero-css-root svg #wordmark {
  opacity: 1;
  transition: opacity 400ms ease;
  pointer-events: none;
}

.landing-hero-css-root--expanded svg #wordmark {
  opacity: 0;
}

/* Wordmark-scale X — visible idle + hover micro-pop (same hinge as Illustrator bbox center) */
.landing-hero-css-root svg #x-mark {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  cursor: pointer;
  transform: scale(1);
  transform-origin: calc(var(--landing-x-sx, 971) * 1px) calc(var(--landing-x-sy, 540) * 1px);
  transition: transform 200ms ease, opacity 400ms ease;
}

.landing-hero-css-root--x-hover:not(.landing-hero-css-root--expanded) svg #x-mark {
  transform: scale(${SMALL_X_HOVER_SCALE});
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
  const sx = bs.x + bs.width / 2;
  const sy = bs.y + bs.height / 2;
  const lx = bl.x + bl.width / 2;
  const ly = bl.y + bl.height / 2;

  root.style.setProperty('--landing-x-grow-from', String(sMin));
  root.style.setProperty('--landing-x-sx', String(sx));
  root.style.setProperty('--landing-x-sy', String(sy));
  root.style.setProperty('--landing-x-lx', String(lx));
  root.style.setProperty('--landing-x-ly', String(ly));
}

export function LandingHero({ useUnifiedBand = false }: LandingHeroProps) {
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

  useLayoutEffect(() => {
    if (navigationType === NavigationType.Push || navigationType === NavigationType.Replace) {
      clearLandingSession();
      return;
    }
    if (navigationType !== NavigationType.Pop) return;
    if (!consumeLandingPendingDesignTileNav()) return;
    if (!readLandingExpandedPersisted()) return;
    setExpanded(true);
    setLandingRestored(true);
    setBandRestoreScroll(readLandingBandScrollPersisted());
  }, [navigationType]);

  useEffect(() => {
    writeLandingExpandedPersisted(expanded);
  }, [expanded]);

  const [xHover, setXHover] = useState(false);
  const [bandRightHover, setBandRightHover] = useState(false);
  const [bandsRevealed, setBandsRevealed] = useState(false);
  const designBandVisible = expanded && bandsRevealed;
  const softwareBandVisible = expanded && bandsRevealed;
  const hostRef = useRef<HTMLDivElement>(null);
  const designStripRef = useRef<BandStripHandle>(null);
  const softwareStripRef = useRef<BandStripHandle>(null);
  const unifiedStripRef = useRef<BandStripHandle>(null);
  const heroRightSvgClipSavedRef = useRef<string | null>(null);
  /** Wheel/router reads last laid-out seam (always a number; synced from `seamResolved`). */
  const seamPxRef = useRef(0);
  const maxRevealPxRef = useRef(maxRevealPx);
  const [xSeamPx, setXSeamPx] = useState<number | undefined>(undefined);
  const [rightSeamPx, setRightSeamPx] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    seamPxRef.current = seamResolved;
  }, [seamResolved]);

  useLayoutEffect(() => {
    maxRevealPxRef.current = maxRevealPx;
  }, [maxRevealPx]);

  useLayoutEffect(() => {
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
  }, [expanded, landingRestored]);

  useEffect(() => {
    if (!expanded) return;
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (landingRestored || reduceMotion) return;
    const id = window.setTimeout(() => setBandsRevealed(true), LANDING_LARGE_X_GROW_MS);
    return () => clearTimeout(id);
  }, [expanded, landingRestored]);

  useLayoutEffect(() => {
    const w = maxRevealPx;
    /** Legacy translate magnitude: revealPx = W − 2·seamPx (center 0, design +W, software −W). */
    const legacyRevealPx = w > 0 ? w - 2 * seamResolved : 0;
    hostRef.current?.style.setProperty('--landing-reveal-px', `${Math.round(legacyRevealPx)}px`);
  }, [seamResolved, maxRevealPx]);

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
  }, [expanded]);

  useLayoutEffect(() => {
    const root = hostRef.current;
    if (!root) return;
    if (!expanded || !bandsRevealed) {
      setXSeamPx(undefined);
      setRightSeamPx(undefined);
      return;
    }
    const svg = root.querySelector('svg');
    const xLarge = svg?.querySelector<SVGGElement>('#x-mark-large');
    if (!xLarge || !svg) return;
    const rr = root.getBoundingClientRect();
    const xr = xLarge.getBoundingClientRect();
    const viewBoxW = 1920;
    const svgRect = svg.getBoundingClientRect();
    const svgScale = svgRect.width > 1e-6 ? svgRect.width / viewBoxW : 0;
    const bboxLeftU = xLarge.getBBox().x;

    // Left wedge inner seam (apex u=861.7) — hero-root X position in px.
    const apexLeftU = 861.7;
    const seamLeft = (xr.left - rr.left) + (apexLeftU - bboxLeftU) * svgScale;
    setXSeamPx(Math.max(0, seamLeft));

    // Right wedge inner seam (inward knee ~1033.6 per `#hero-clip-band-right`) — same bbox anchor as left.
    const anchorRightU = 1033.6;
    const seamRight = (xr.left - rr.left) + (anchorRightU - bboxLeftU) * svgScale;
    setRightSeamPx(Math.max(0, seamRight));

    const xLargeEl = svg?.querySelector<SVGGElement>('#x-mark-large');
    if (xLargeEl) {
      const onAnimEnd = (): void => {
        const rr2 = root.getBoundingClientRect();
        const xr2 = xLargeEl.getBoundingClientRect();
        const svgRect2 = svg.getBoundingClientRect();
        const svgScale2 = svgRect2.width > 1e-6 ? svgRect2.width / viewBoxW : 0;
        const bboxLeftU2 = xLargeEl.getBBox().x;
        const seamRight2 = (xr2.left - rr2.left) + (anchorRightU - bboxLeftU2) * svgScale2;
        setRightSeamPx(Math.max(0, seamRight2));
      };
      xLargeEl.addEventListener('animationend', onAnimEnd, { once: true });
      return () => xLargeEl.removeEventListener('animationend', onAnimEnd);
    }
  }, [expanded, bandsRevealed, seamResolved, maxRevealPx]);

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
   */
  useEffect(() => {
    const root = hostRef.current;
    if (!root) return;
    if (!expanded || !bandsRevealed || !(maxRevealPx > 0)) return;

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
  }, [expanded, bandsRevealed, maxRevealPx, setSeamPx, useUnifiedBand]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = e.target as Element | null;
      if (!expanded) {
        setXHover(!!el?.closest('#x-mark'));
        setBandRightHover(false);
        return;
      }
      setBandRightHover(
        !!(
          el?.closest('.landing-software-band-shell') ||
          el?.closest('.landing-unified-band-root')
        ),
      );
      setXHover(false);
    },
    [expanded]
  );

  const handlePointerLeave = useCallback(() => {
    setXHover(false);
    setBandRightHover(false);
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = e.target as Element | null;
      if (!expanded) {
        if (el?.closest('#x-mark')) {
          e.preventDefault();
          setExpanded(true);
        }
        return;
      }
      if (
        el?.closest('.landing-software-band-shell') ||
        el?.closest('.landing-unified-band-root')
      ) {
        navigate('/software');
      }
    },
    [expanded, navigate]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const target = e.target as Element | null;
      if (!expanded) {
        if ((e.key === 'Enter' || e.key === ' ') && target?.closest('#x-mark')) {
          e.preventDefault();
          setExpanded(true);
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
      e.preventDefault();
      navigate('/software');
    },
    [expanded, navigate]
  );

  useLayoutEffect(() => {
    const root = hostRef.current;
    if (!root) return;
    const smallBtn = root.querySelector('#x-mark');
    if (expanded) {
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
  }, [expanded, bandsRevealed]);

  return (
    <section
      className={[
        'flex min-h-screen w-full flex-shrink-0 flex-col items-center justify-center bg-white py-10',
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
          expanded ? 'landing-hero-css-root--expanded' : '',
          expanded && landingRestored ? 'landing-hero-css-root--landing-restored' : '',
          expanded && bandsRevealed ? 'landing-hero-css-root--bands-revealed' : '',
          expanded && useUnifiedBand ? 'landing-hero-css-root--unified-band-active' : '',
          xHover && !expanded ? 'landing-hero-css-root--x-hover' : '',
          bandRightHover ? 'landing-hero-css-root--band-right' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        <div dangerouslySetInnerHTML={{ __html: landingSvgRaw }} />
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
          </>
        ) : null}
      </div>
    </section>
  );
}
