import type { CSSProperties } from 'react';
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import {
  BandTile,
  bandTileInteractiveClipPath,
  BAND_TILE_VIEWBOX_H,
  BAND_TILE_VIEWBOX_W,
  type BandTileProps,
} from './BandTile';

/** Horizontal advance along the baseline (Illustrator strip), SVG user units */
const TILE_STEP_U = 360;

/** Overlap between adjacent tiles: viewBox width minus step */
const TILE_OVERLAP_U = BAND_TILE_VIEWBOX_W - TILE_STEP_U;

export type BandStripHandle = {
  /** One station toward earlier projects (reveals tiles to the left of the viewport). */
  stepBackward: () => void;
  /** One station toward entry (reveals tiles to the right — returns toward initial right-aligned anchor). */
  stepForward: () => void;
  /** Current horizontal scroll offset (for session restore). */
  getScrollLeft: () => number;
  /** Horizontal scroll adjustment in CSS pixels. */
  scrollHorizontalBy: (deltaPx: number) => void;
  /** Current scrollLeft + max scrollLeft (for reveal gating). */
  getScrollInfo: () => { left: number; max: number };
};

/** One band cell: same props as `BandTile` plus optional routing/key overrides. */
export type BandStripTileItem = Omit<BandTileProps, 'variant'> & {
  /** Stable key when two tiles share the same `projectId` (e.g. two Nike ACG band variants). */
  reactKey?: string;
  /** When set, design band navigates here instead of `/portfolio/{projectId}`. */
  navigatePath?: string;
};

export type BandStripProps = {
  items: BandStripTileItem[];
  /** Fires when user activates a tile (click / keyboard). */
  onSelectProject: (projectId: string, navigatePath?: string) => void;
  /** Prefix for each tile button `aria-label` (default: design band copy). */
  tileAriaLabelPrefix?: string;
  /** Region label for assistive tech */
  ariaLabel?: string;
  /** Optional max tile width (e.g. `clamp(...)`) — when omitted, tiles fill strip height × 659.1/296 to match hero wedge. */
  tileWidthClamp?: string;
  className?: string;
  /**
   * When set, first layout clamps to this pixel offset instead of “entry-right” anchor.
   * Used when restoring `/` via browser Back (see `landingSession`).
   */
  initialScrollLeft?: number;
  /** Debounced-ish notification when user scrolls the strip */
  onScrollPositionChange?: (scrollLeft: number) => void;
};

function resolveVariants(n: number): BandTileProps['variant'][] {
  if (n <= 0) return [];
  if (n === 1) return ['tile'];
  return Array.from({ length: n }, (_, i) =>
    i === 0 ? 'cap-left' : i === n - 1 ? 'cap-right' : 'tile',
  );
}

/** Scrollport is horizontal-only; vertical movement exposed the debug strip background. */
const BAND_STRIP_SCROLLPORT_BG = 'transparent' as const;

/**
 * Horizontal overlapped strip of `BandTile`s (~360 px step in artboard units; overlap = 659.1 − 360).
 * Initial scroll snaps to **right** (first paint shows the trailing / right-hand projects — “entry”).
 * Stepping uses measured tile width × STEP / viewBoxWidth so stations track layout.
 *
 * No visible scrollbar (`index.css` + `.band-strip-scroll`). The scrollport uses `overflow-y: hidden`
 * and `scrollTop = 0` so trackpad vertical drift does not expose the strip background.
 */
export const BandStrip = forwardRef<BandStripHandle, BandStripProps>(function BandStrip(
  {
    items,
    onSelectProject,
    tileAriaLabelPrefix = 'Open portfolio',
    ariaLabel = 'Project band',
    tileWidthClamp,
    initialScrollLeft,
    onScrollPositionChange,
    className = '',
  },
  ref,
) {
  const scrollElRef = useRef<HTMLDivElement>(null);
  const motionReduceRef = useRef(false);
  const hasAppliedInitialScrollRef = useRef(false);
  /** Cancelled on dependency change so an older rAF can't apply "entry right" after `initialScrollLeft` updates (e.g. landing restore). */
  const scrollLayoutRafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionReduceRef.current = mq.matches;
    const on = (): void => {
      motionReduceRef.current = mq.matches;
    };
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  useEffect(() => {
    const el = scrollElRef.current;
    if (!el || !onScrollPositionChange) return;
    let t: ReturnType<typeof setTimeout> | undefined;
    const flush = (): void => {
      onScrollPositionChange(el.scrollLeft);
    };
    const onScroll = (): void => {
      if (el.scrollTop !== 0) el.scrollTop = 0;
      if (t !== undefined) clearTimeout(t);
      t = window.setTimeout(() => {
        flush();
        t = undefined;
      }, 120);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (t !== undefined) clearTimeout(t);
      el.removeEventListener('scroll', onScroll);
    };
  }, [onScrollPositionChange]);

  useLayoutEffect(() => {
    hasAppliedInitialScrollRef.current = false;
  }, [items.length, initialScrollLeft]);

  const variants = useMemo(() => resolveVariants(items.length), [items.length]);

  const stationPxRef = useRef<number[]>([]);

  /** Left scroll offsets for stations: i × stepPx, stepPx = renderedTileWidth × (360 / 659.1). */
  const recomputeStations = useCallback(() => {
    const track = scrollElRef.current?.querySelector<HTMLElement>('[data-band-strip-track]');
    const first = track?.querySelector<HTMLElement>('[data-band-tile-index]');
    const n = items.length;
    if (!first || n === 0) {
      stationPxRef.current = [];
      return;
    }
    const tileW = first.getBoundingClientRect().width;
    if (!(tileW > 1e-6)) {
      stationPxRef.current = [];
      return;
    }
    const stepPx = (tileW * TILE_STEP_U) / BAND_TILE_VIEWBOX_W;
    stationPxRef.current = Array.from({ length: n }, (_, i) => i * stepPx);
  }, [items.length]);

  const applyScrollLayout = useCallback(() => {
    const el = scrollElRef.current;
    const track = el?.querySelector<HTMLElement>('[data-band-strip-track]');
    if (!el || !track || items.length === 0) return;
    recomputeStations();
    const max = Math.max(0, el.scrollWidth - el.clientWidth);
    track.style.marginLeft = max > 0 ? '' : 'auto';
    el.scrollTop = 0;

    if (!hasAppliedInitialScrollRef.current) {
      if (
        typeof initialScrollLeft === 'number' &&
        Number.isFinite(initialScrollLeft)
      ) {
        el.scrollLeft = Math.min(Math.max(0, initialScrollLeft), max);
      } else {
        el.scrollLeft = max;
      }
      hasAppliedInitialScrollRef.current = true;
      return;
    }
    el.scrollLeft = Math.min(Math.max(0, el.scrollLeft), max);
    el.scrollTop = 0;
  }, [items.length, recomputeStations, initialScrollLeft]);

  useLayoutEffect(() => {
    if (!scrollElRef.current || items.length === 0) return;
    if (scrollLayoutRafRef.current !== undefined) {
      cancelAnimationFrame(scrollLayoutRafRef.current);
      scrollLayoutRafRef.current = undefined;
    }
    scrollLayoutRafRef.current = requestAnimationFrame(() => {
      scrollLayoutRafRef.current = undefined;
      applyScrollLayout();
    });
    return () => {
      if (scrollLayoutRafRef.current !== undefined) {
        cancelAnimationFrame(scrollLayoutRafRef.current);
        scrollLayoutRafRef.current = undefined;
      }
    };
  }, [items.length, applyScrollLayout]);

  useLayoutEffect(() => {
    const el = scrollElRef.current;
    if (!el) return;
    const obs = new ResizeObserver(() => {
      applyScrollLayout();
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [items.length, applyScrollLayout]);

  const clampScrollLeft = useCallback(() => {
    const el = scrollElRef.current;
    if (!el) return { left: 0, max: 0 };
    const max = Math.max(0, el.scrollWidth - el.clientWidth);
    return {
      left: Math.min(Math.max(0, el.scrollLeft), max),
      max,
    };
  }, []);

  const scrollHorizontalBy = useCallback((deltaPx: number) => {
    const el = scrollElRef.current;
    if (!el || !Number.isFinite(deltaPx)) return;
    const max = Math.max(0, el.scrollWidth - el.clientWidth);
    el.scrollLeft = Math.min(Math.max(0, el.scrollLeft + deltaPx), max);
  }, []);

  const nearestStationIndex = useCallback(() => {
    const stops = stationPxRef.current;
    if (stops.length === 0) return 0;
    const { left } = clampScrollLeft();
    let best = 0;
    let bestD = Infinity;
    for (let i = 0; i < stops.length; i++) {
      const d = Math.abs(stops[i]! - left);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    }
    return best;
  }, [clampScrollLeft]);

  const scrollToStation = useCallback((idx: number) => {
    const el = scrollElRef.current;
    const stops = stationPxRef.current;
    if (!el || stops.length === 0) return;
    const clampedIdx = Math.max(0, Math.min(stops.length - 1, idx));
    const target = stops[clampedIdx]!;
    el.scrollTo({
      left: target,
      behavior: motionReduceRef.current ? 'auto' : 'smooth',
    });
  }, []);

  const stepBackward = useCallback(() => {
    recomputeStations();
    if (stationPxRef.current.length === 0) return;
    const cur = nearestStationIndex();
    scrollToStation(cur - 1);
  }, [nearestStationIndex, recomputeStations, scrollToStation]);

  const stepForward = useCallback(() => {
    recomputeStations();
    if (stationPxRef.current.length === 0) return;
    const cur = nearestStationIndex();
    scrollToStation(cur + 1);
  }, [nearestStationIndex, recomputeStations, scrollToStation]);

  useImperativeHandle(
    ref,
    () => ({
      stepBackward,
      stepForward,
      getScrollLeft: () => scrollElRef.current?.scrollLeft ?? 0,
      scrollHorizontalBy,
      getScrollInfo: () => {
        const el = scrollElRef.current;
        if (!el) return { left: 0, max: 0 };
        const max = Math.max(0, el.scrollWidth - el.clientWidth);
        return { left: el.scrollLeft, max };
      },
    }),
    [stepBackward, stepForward, scrollHorizontalBy],
  );

  const overlapMarginPx = `-100cqh * ${String(TILE_OVERLAP_U)} / ${String(BAND_TILE_VIEWBOX_H)}`;

  return (
    <div role="region" aria-label={ariaLabel} className={`band-strip-root min-h-0 overflow-hidden ${className}`.trim()}>
      <div
        ref={scrollElRef}
        className="band-strip-scroll h-full min-h-0 overflow-x-auto overflow-y-hidden"
        style={{
          containerType: 'size',
          backgroundColor: BAND_STRIP_SCROLLPORT_BG,
          touchAction: 'pan-x',
          overscrollBehaviorY: 'none',
          overscrollBehaviorX: 'contain',
        }}
      >
        <div data-band-strip-track className="flex h-full min-h-0 flex-row flex-nowrap items-stretch">
          {items.map((item, i) => {
            const variant = variants[i] ?? 'tile';
            const overlapStyle =
              i > 0 ? ({ marginLeft: `calc(${overlapMarginPx})` } as CSSProperties) : {};

            const widthCapStyle =
              tileWidthClamp !== undefined && tileWidthClamp !== ''
                ? ({
                    maxWidth: tileWidthClamp,
                  } as CSSProperties)
                : {};

            const tileClipPath = bandTileInteractiveClipPath(variant);

            return (
              <div
                key={`${item.reactKey ?? item.projectId}-${String(i)}`}
                data-band-tile-index={i}
                className="h-full min-h-0 shrink-0"
                style={
                  {
                    height: '100%',
                    aspectRatio: `${BAND_TILE_VIEWBOX_W} / ${BAND_TILE_VIEWBOX_H}`,
                    width: 'auto',
                    ...widthCapStyle,
                    ...overlapStyle,
                  } as CSSProperties
                }
              >
                <button
                  type="button"
                  tabIndex={0}
                  aria-label={`${tileAriaLabelPrefix}: ${item.title}`}
                  onClick={() => onSelectProject(item.projectId, item.navigatePath)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectProject(item.projectId, item.navigatePath);
                    }
                  }}
                  style={{
                    clipPath: tileClipPath,
                    WebkitClipPath: tileClipPath,
                  }}
                  className="group block size-full rounded-none border-0 bg-transparent p-0 outline-none ring-0 transition-transform duration-[200ms] ease-out hover:z-10 hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-purple-950"
                >
                  <BandTile
                    variant={variant}
                    projectId={item.projectId}
                    title={item.title}
                    imageHref={item.imageHref}
                    className={item.className ?? ''}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});
