import type { CSSProperties } from 'react';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import { STRIP_ARTBOARD_W_U as STRIP_ARTBOARD_W } from '../lib/unifiedBandLayout';
import {
  NavigationType,
  useNavigate,
  useNavigationType,
} from 'react-router-dom';
import { portfolioItems } from '../data/portfolio';
import { softwareItems } from '../data/software';
import { portfolioBandImageHref } from '../lib/portfolioBandImageHref';
import { navigateToSoftwareProject } from '../lib/ucidAppUrl';
import { softwareImageUrl } from '../lib/softwareUrls';
import type { BandStripHandle } from './BandStrip';
import {
  BandTile,
  bandTileInteractiveClipPath,
  BAND_TILE_VIEWBOX_H,
  BAND_TILE_VIEWBOX_W,
} from './BandTile';

/** Same stepping as `BandStrip` (Illustrator strip units). */
const TILE_STEP_U = 360;
const TILE_OVERLAP_U = BAND_TILE_VIEWBOX_W - TILE_STEP_U;

/** Illustrator span reserved for Large_X column (~6480–6889). */
const DIVIDER_ARTBOARD_W = 409;

/** Large_X path — user-space coords from positioning SVG. */
const LARGE_X_VIEWBOX = `6480 251.58 694 534.42`;
const LARGE_X_PATH_D =
  'M6480,435.18l109.08,178.58-108.3,172.03h94.9l102.31-172.03-104.6-178.58h-93.4ZM6967.26,251.58h-99.38l-195.78,328.94,122.18,205.28h95.44l-128.71-205.28,206.24-328.94Z';

const UNIFIED_BAND_SCROLL_KEY = 'unified-band-scroll';
const SCROLL_PERSIST_DEBOUNCE_MS = 120;

function readPersistedScrollLeft(): number | undefined {
  try {
    const s = sessionStorage.getItem(UNIFIED_BAND_SCROLL_KEY);
    if (s === null) return undefined;
    const n = Number(s);
    return Number.isFinite(n) ? n : undefined;
  } catch {
    return undefined;
  }
}

function writePersistedScrollLeft(scrollLeft: number): void {
  try {
    sessionStorage.setItem(UNIFIED_BAND_SCROLL_KEY, String(Math.round(scrollLeft)));
  } catch {
    /* private mode */
  }
}

function designVariant(index: number, count: number): 'cap-left' | 'tile' {
  if (count <= 0) return 'tile';
  if (index === 0) return 'cap-left';
  return 'tile';
}

function softwareVariant(index: number, count: number): 'tile' | 'cap-right' {
  if (count <= 0) return 'tile';
  if (index === count - 1) return 'cap-right';
  return 'tile';
}

/**
 * Single horizontal strip: design tiles | X divider | software tiles.
 * Exposes `BandStripHandle` so `LandingHero` wheel routing matches classic dual rails.
 */
export type UnifiedBandStripProps = {
  className?: string;
  /**
   * When true, strip is as wide as the home canvas; horizontal scroll is the **window** (document),
   * not this element — matches a 1920-wide viewport panning over a flat positioning JPG.
   */
  pageScrollMode?: boolean;
};

export const UnifiedBandStrip = forwardRef<BandStripHandle, UnifiedBandStripProps>(
  function UnifiedBandStrip({ className = '', pageScrollMode = false }, ref) {
    const navigate = useNavigate();
    const navigationType = useNavigationType();
    const scrollRef = useRef<HTMLDivElement>(null);
    const appliedInitialScrollRef = useRef(false);
    const persistTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
      undefined,
    );
    const motionReduceRef = useRef(false);

    useEffect(() => {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      motionReduceRef.current = mq.matches;
      const on = (): void => {
        motionReduceRef.current = mq.matches;
      };
      mq.addEventListener('change', on);
      return () => mq.removeEventListener('change', on);
    }, []);

    const designTiles = useMemo(
      () =>
        portfolioItems.map((p) => ({
          projectId: p.id,
          title: p.title,
          imageHref: portfolioBandImageHref(p.id),
        })),
      [],
    );

    const softwareTiles = useMemo(
      () =>
        softwareItems.map((s) => ({
          projectId: s.id,
          title: s.title,
          imageHref: softwareImageUrl(s.id, 'band.jpg'),
        })),
      [],
    );

    const layout = useMemo(() => {
      if (pageScrollMode) {
        return {
          overlapMargin: `calc(-100% * ${String(TILE_OVERLAP_U)} / ${String(STRIP_ARTBOARD_W)})`,
          stripNaturalWidth: '100%',
          tileColWidth: `calc(100% * ${String(BAND_TILE_VIEWBOX_W)} / ${String(STRIP_ARTBOARD_W)})`,
          dividerColWidth: `calc(100% * ${String(DIVIDER_ARTBOARD_W)} / ${String(STRIP_ARTBOARD_W)})`,
        };
      }
      return {
        overlapMargin: `calc(-100cqh * ${String(TILE_OVERLAP_U)} / ${String(BAND_TILE_VIEWBOX_H)})`,
        stripNaturalWidth: `calc(100cqh * ${String(STRIP_ARTBOARD_W)} / ${String(BAND_TILE_VIEWBOX_H)})`,
        tileColWidth: `calc(100cqh * ${String(BAND_TILE_VIEWBOX_W)} / ${String(BAND_TILE_VIEWBOX_H)})`,
        dividerColWidth: `calc(100cqh * ${String(DIVIDER_ARTBOARD_W)} / ${String(BAND_TILE_VIEWBOX_H)})`,
      };
    }, [pageScrollMode]);

    const applyCenterOrRestoreScroll = useCallback(() => {
      if (pageScrollMode) {
        const doc = document.documentElement;
        const maxLeft = Math.max(0, doc.scrollWidth - window.innerWidth);
        const persisted = readPersistedScrollLeft();

        if (
          navigationType === NavigationType.Pop &&
          typeof persisted === 'number' &&
          persisted >= 0
        ) {
          window.scrollTo({ left: Math.min(persisted, maxLeft), top: 0, behavior: 'auto' });
          appliedInitialScrollRef.current = true;
          return;
        }

        if (!appliedInitialScrollRef.current && maxLeft > 0) {
          const centerLeft = Math.max(0, doc.scrollWidth / 2 - window.innerWidth / 2);
          window.scrollTo({
            left: Math.min(centerLeft, maxLeft),
            top: 0,
            behavior: 'auto',
          });
          appliedInitialScrollRef.current = true;
        }
        return;
      }

      const el = scrollRef.current;
      if (!el || el.scrollWidth <= 0) return;

      const maxLeft = Math.max(0, el.scrollWidth - el.clientWidth);
      const persisted = readPersistedScrollLeft();

      if (
        navigationType === NavigationType.Pop &&
        typeof persisted === 'number' &&
        persisted >= 0
      ) {
        el.scrollLeft = Math.min(persisted, maxLeft);
        appliedInitialScrollRef.current = true;
        return;
      }

      if (!appliedInitialScrollRef.current) {
        const centerLeft = Math.max(0, el.scrollWidth / 2 - el.clientWidth / 2);
        el.scrollLeft = Math.min(centerLeft, maxLeft);
        appliedInitialScrollRef.current = true;
      }
    }, [navigationType, pageScrollMode]);

    useLayoutEffect(() => {
      appliedInitialScrollRef.current = false;
    }, [designTiles.length, softwareTiles.length]);

    useLayoutEffect(() => {
      applyCenterOrRestoreScroll();

      if (pageScrollMode) {
        const onResize = (): void => {
          requestAnimationFrame(() => {
            if (!appliedInitialScrollRef.current) {
              applyCenterOrRestoreScroll();
            }
          });
        };
        const ro = new ResizeObserver(() => onResize());
        ro.observe(document.documentElement);
        window.addEventListener('resize', onResize);
        return () => {
          ro.disconnect();
          window.removeEventListener('resize', onResize);
        };
      }

      const el = scrollRef.current;
      if (!el) return;

      const ro = new ResizeObserver(() => {
        requestAnimationFrame(() => {
          if (!appliedInitialScrollRef.current) {
            applyCenterOrRestoreScroll();
          }
        });
      });
      ro.observe(el);
      const inner = el.firstElementChild;
      if (inner) ro.observe(inner);

      return () => ro.disconnect();
    }, [applyCenterOrRestoreScroll, designTiles.length, softwareTiles.length, pageScrollMode]);

    useEffect(() => {
      const flush = (scrollLeft: number): void => {
        if (persistTimerRef.current !== undefined) {
          clearTimeout(persistTimerRef.current);
        }
        persistTimerRef.current = window.setTimeout(() => {
          persistTimerRef.current = undefined;
          writePersistedScrollLeft(scrollLeft);
        }, SCROLL_PERSIST_DEBOUNCE_MS);
      };

      if (pageScrollMode) {
        const onScroll = (): void => {
          flush(window.scrollX);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
          window.removeEventListener('scroll', onScroll);
          if (persistTimerRef.current !== undefined) {
            clearTimeout(persistTimerRef.current);
          }
        };
      }

      const el = scrollRef.current;
      if (!el) return;

      const onScroll = (): void => {
        if (el.scrollTop !== 0) el.scrollTop = 0;
        flush(el.scrollLeft);
      };

      el.addEventListener('scroll', onScroll, { passive: true });
      return () => {
        el.removeEventListener('scroll', onScroll);
        if (persistTimerRef.current !== undefined) {
          clearTimeout(persistTimerRef.current);
        }
      };
    }, [pageScrollMode]);

    const stepPxFromFirstTile = useCallback((): number => {
      const root = scrollRef.current;
      const first = root?.querySelector<HTMLElement>('[data-unified-tile]');
      if (!first) return 48;
      const w = first.getBoundingClientRect().width;
      if (!(w > 1e-6)) return 48;
      return (w * TILE_STEP_U) / BAND_TILE_VIEWBOX_W;
    }, []);

    const scrollHorizontalBy = useCallback(
      (deltaPx: number) => {
        if (!Number.isFinite(deltaPx)) return;
        if (pageScrollMode) {
          const doc = document.documentElement;
          const max = Math.max(0, doc.scrollWidth - window.innerWidth);
          const next = Math.min(Math.max(0, window.scrollX + deltaPx), max);
          window.scrollTo({ left: next, top: 0, behavior: 'auto' });
          return;
        }
        const el = scrollRef.current;
        if (!el) return;
        const max = Math.max(0, el.scrollWidth - el.clientWidth);
        el.scrollLeft = Math.min(Math.max(0, el.scrollLeft + deltaPx), max);
      },
      [pageScrollMode],
    );

    const stepByStations = useCallback(
      (dir: -1 | 1) => {
        const step = stepPxFromFirstTile();
        if (pageScrollMode) {
          const doc = document.documentElement;
          const max = Math.max(0, doc.scrollWidth - window.innerWidth);
          const target = Math.min(Math.max(0, window.scrollX + dir * step), max);
          window.scrollTo({
            left: target,
            top: 0,
            behavior: motionReduceRef.current ? 'auto' : 'smooth',
          });
          return;
        }
        const el = scrollRef.current;
        if (!el) return;
        const max = Math.max(0, el.scrollWidth - el.clientWidth);
        const target = Math.min(Math.max(0, el.scrollLeft + dir * step), max);
        el.scrollTo({
          left: target,
          behavior: motionReduceRef.current ? 'auto' : 'smooth',
        });
      },
      [pageScrollMode, stepPxFromFirstTile],
    );

    useImperativeHandle(
      ref,
      () => ({
        stepBackward: () => stepByStations(-1),
        stepForward: () => stepByStations(1),
        getScrollLeft: () =>
          pageScrollMode ? window.scrollX : (scrollRef.current?.scrollLeft ?? 0),
        scrollHorizontalBy,
        getScrollInfo: () => {
          if (pageScrollMode) {
            const doc = document.documentElement;
            const max = Math.max(0, doc.scrollWidth - window.innerWidth);
            return { left: window.scrollX, max };
          }
          const el = scrollRef.current;
          if (!el) return { left: 0, max: 0 };
          const max = Math.max(0, el.scrollWidth - el.clientWidth);
          return { left: el.scrollLeft, max };
        },
      }),
      [pageScrollMode, scrollHorizontalBy, stepByStations],
    );

    const onKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        const t = e.target as HTMLElement | null;
        if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) {
          return;
        }
        e.preventDefault();
        const step = stepPxFromFirstTile();
        const delta = e.key === 'ArrowLeft' ? -step : step;
        if (pageScrollMode) {
          const doc = document.documentElement;
          const max = Math.max(0, doc.scrollWidth - window.innerWidth);
          window.scrollTo({
            left: Math.min(Math.max(0, window.scrollX + delta), max),
            top: 0,
            behavior: 'auto',
          });
          return;
        }
        const el = scrollRef.current;
        if (!el) return;
        const max = Math.max(0, el.scrollWidth - el.clientWidth);
        el.scrollLeft = Math.min(Math.max(0, el.scrollLeft + delta), max);
      },
      [pageScrollMode, stepPxFromFirstTile],
    );

    const onSelectDesign = useCallback(
      (projectId: string) => {
        navigate(`/portfolio/${encodeURIComponent(projectId)}`);
      },
      [navigate],
    );

    const onSelectSoftware = useCallback(
      (projectId: string) => {
        navigateToSoftwareProject(projectId, navigate);
      },
      [navigate],
    );

    return (
      <div
        ref={scrollRef}
        role="region"
        aria-label="Portfolio band"
        tabIndex={0}
        onKeyDown={onKeyDown}
        className={[
          pageScrollMode
            ? 'min-h-0 w-full overflow-x-visible overflow-y-visible outline-none'
            : 'band-strip-scroll min-h-0 w-full overflow-x-auto overflow-y-hidden outline-none',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        style={{
          overscrollBehaviorX: 'contain',
          overscrollBehaviorY: 'none',
          ...(pageScrollMode ? {} : { containerType: 'size' as const }),
          touchAction: pageScrollMode ? 'auto' : 'pan-x',
        }}
      >
        <div
          className="flex h-full min-h-0 shrink-0 flex-row flex-nowrap items-stretch"
          style={{ width: layout.stripNaturalWidth }}
        >
          <div className="flex h-full min-h-0 flex-row flex-nowrap items-stretch">
            {designTiles.map((item, i) => {
              const variant = designVariant(i, designTiles.length);
              const overlapStyle =
                i > 0
                  ? ({ marginLeft: layout.overlapMargin } as CSSProperties)
                  : {};
              const clip = bandTileInteractiveClipPath(variant);
              return (
                <div
                  key={`d-${item.projectId}`}
                  data-unified-tile
                  className="h-full min-h-0 shrink-0"
                  style={
                    {
                      height: '100%',
                      width: layout.tileColWidth,
                      ...overlapStyle,
                    } as CSSProperties
                  }
                >
                  <button
                    type="button"
                    aria-label={`Open portfolio: ${item.title}`}
                    onClick={() => onSelectDesign(item.projectId)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectDesign(item.projectId);
                      }
                    }}
                    style={{
                      clipPath: clip,
                      WebkitClipPath: clip,
                    }}
                    className="group block size-full rounded-none border-0 bg-transparent p-0 outline-none ring-0 transition-transform duration-[200ms] ease-out hover:z-10 hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-purple-950"
                  >
                    <BandTile
                      variant={variant}
                      projectId={item.projectId}
                      title={item.title}
                      imageHref={item.imageHref}
                      className=""
                    />
                  </button>
                </div>
              );
            })}
          </div>

          <div
            className="flex h-full shrink-0 items-center justify-center self-stretch overflow-hidden"
            style={{
              width: layout.dividerColWidth,
              minWidth: pageScrollMode ? 40 : 'min(40px, 100cqh)',
            }}
            aria-hidden
          >
            <svg
              className="max-h-full min-h-0 w-full"
              viewBox={LARGE_X_VIEWBOX}
              preserveAspectRatio="xMidYMid meet"
            >
              <path fill="#360c5e" d={LARGE_X_PATH_D} />
            </svg>
          </div>

          <div className="flex h-full min-h-0 flex-row flex-nowrap items-stretch">
            {softwareTiles.map((item, i) => {
              const baseVariant = softwareVariant(i, softwareTiles.length);
              const isFirst = i === 0;
              const variant = baseVariant;
              const clip = isFirst ? 'none' : bandTileInteractiveClipPath(variant);
              const noTileClip = isFirst;
              const overlapStyle =
                i > 0
                  ? ({ marginLeft: layout.overlapMargin } as CSSProperties)
                  : {};
              return (
                <div
                  key={`s-${item.projectId}`}
                  data-unified-tile
                  className="h-full min-h-0 shrink-0"
                  style={
                    {
                      height: '100%',
                      width: layout.tileColWidth,
                      ...overlapStyle,
                    } as CSSProperties
                  }
                >
                  <button
                    type="button"
                    aria-label={`Open software: ${item.title}`}
                    onClick={() => onSelectSoftware(item.projectId)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectSoftware(item.projectId);
                      }
                    }}
                    style={{
                      clipPath: clip,
                      WebkitClipPath: clip,
                    }}
                    className="group block size-full rounded-none border-0 bg-transparent p-0 outline-none ring-0 transition-transform duration-[200ms] ease-out hover:z-10 hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-purple-950"
                  >
                    <BandTile
                      variant={variant}
                      projectId={item.projectId}
                      title={item.title}
                      imageHref={item.imageHref}
                      className=""
                      noTileClip={noTileClip}
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
