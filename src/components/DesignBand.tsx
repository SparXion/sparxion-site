import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { HERO_DESIGN_BAND_CLIP_PATH } from '../lib/heroDesignBandClip';
import {
  writeLandingBandScrollPersisted,
  writeLandingPendingDesignTileNav,
} from '../lib/landingSession';
import { BandStrip, type BandStripHandle } from './BandStrip';
import { BAND_TILE_VIEWBOX_H } from './BandTile';
import { getPortfolioItemById } from '../data/portfolio';
import { portfolioBandImageHref } from '../lib/portfolioBandImageHref';
import { portfolioImageUrl } from '../lib/portfolioUrls';

/** Top of hero wedge strip in Sparxion_Landing_Sketch-Scale.svg viewBox (`#hero-clip-band-left` top Y). */
const HERO_WEDGE_TOP_FRAC_U = `${408.8} / 1080`;

/** Curated order (left of Large X). `routeId` drives `/portfolio/:id` and `portfolio.ts` titles. */
type DesignBandRow = {
  reactKey: string;
  routeId: string;
  /** When set, `band.jpg` is read from this folder under `public/portfolio/` instead of `routeId`. */
  bandSourceId?: string;
};

const DESIGN_BAND_ROWS: readonly DesignBandRow[] = [
  { reactKey: 'custom-motors', routeId: 'custom-motors' },
  { reactKey: 'twinduction', routeId: 'twinduction' },
  { reactKey: 'hw-crashers', routeId: 'hw-crashers' },
  { reactKey: 'hw-tri-n-stop-me', routeId: 'hw-tri-n-stop-me' },
  { reactKey: 'hw-art', routeId: 'hw-art' },
  { reactKey: 'nike-acg-cascade', routeId: 'nike-acg', bandSourceId: 'nike-cascade' },
  { reactKey: 'nike-acg', routeId: 'nike-acg' },
  { reactKey: 'eps-glitz', routeId: 'eps-glitz' },
  { reactKey: 'nike-zion', routeId: 'nike-zion' },
  { reactKey: 'paw-patrol', routeId: 'paw-patrol' },
  { reactKey: 'gi-joe', routeId: 'gi-joe' },
  { reactKey: 'valaverse', routeId: 'valaverse' },
  { reactKey: 'power-rangers', routeId: 'power-rangers' },
  { reactKey: 'star-wars', routeId: 'star-wars' },
  { reactKey: 'marmot', routeId: 'marmot' },
  { reactKey: 'mwls', routeId: 'mwls' },
  { reactKey: 'naughty-connie', routeId: 'naughty-connie' },
  { reactKey: 'concept-art', routeId: 'concept-art' },
  { reactKey: 'drgn-fli', routeId: 'drgn-fli' },
];

export type DesignBandProps = {
  /** When true, overlay is interactive and opaque; otherwise hidden + inert */
  designBandVisible: boolean;
  className?: string;
  /** Restored horizontal scroll offset (browser Back from `/portfolio/:id`) */
  initialBandScrollLeft?: number;
  /** Persist band scroll while the strip moves (debounced inside `BandStrip`) */
  onBandScrollPersist?: (scrollLeft: number) => void;
  /** Hero seam x in px: 0 = design full-bleed, W/2 = centered, W = software full-bleed. */
  seamPx: number;
  /** Max reveal in px (hero width) */
  maxRevealPx: number;
  /**
   * Screen-space seam position (px) relative to the hero root:
   * the x position where the trapezoid's apex (u=861.7) should land.
   */
  xSeamPx?: number;
};

/**
 * Left-half overlay: strip matches hero wedge vertically—top-aligned to `#hero-clip-band-left`
 * (not SVG center y=540), height `BAND_TILE_VIEWBOX_H / 1080`. Parent matches hero SVG box.
 *
 * Clipped to `#hero-clip-band-left` via `heroDesignBandClip.ts` so the strip does not overlap the large X.
 *
 * Wheel/reveal is handled by the hero-level router in `LandingHero`.
 */
export const DesignBand = forwardRef<BandStripHandle, DesignBandProps>(function DesignBand(
  {
    designBandVisible,
    initialBandScrollLeft,
    onBandScrollPersist,
    seamPx,
    maxRevealPx,
    xSeamPx,
    className = '',
  },
  ref,
) {
  const navigate = useNavigate();
  const stripRef = useRef<BandStripHandle>(null);
  const wheelHostRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    stepBackward: () => stripRef.current?.stepBackward(),
    stepForward: () => stripRef.current?.stepForward(),
    getScrollLeft: () => stripRef.current?.getScrollLeft() ?? 0,
    scrollHorizontalBy: (deltaPx: number) => stripRef.current?.scrollHorizontalBy(deltaPx),
    getScrollInfo: () => stripRef.current?.getScrollInfo() ?? { left: 0, max: 0 },
  }));

  const VIEWBOX_W = 1920;
  const HERO_CLIP_TOP_Y = 408.8;
  const HERO_CLIP_BOTTOM_Y = 704.9;
  const HERO_CLIP_H = HERO_CLIP_BOTTOM_Y - HERO_CLIP_TOP_Y;
  const BASE_VERTS_U: readonly [number, number][] = [
    [861.7, 560.1],
    [769.2, 408.8],
    [0, 408.8],
    [0, 704.9],
    [770.5, 704.9],
  ];

  const getClipPathPx = (): string => {
    const el = wheelHostRef.current;
    if (!el) return HERO_DESIGN_BAND_CLIP_PATH;
    const r = el.getBoundingClientRect();
    const w = Math.max(1, r.width);
    const h = Math.max(1, r.height);
    const xScale = w / VIEWBOX_W;
    const yScale = h / HERO_CLIP_H;

    const apexU = 861.7;
    const seamPx = typeof xSeamPx === 'number' && Number.isFinite(xSeamPx) ? xSeamPx : apexU * xScale;

    const pts = BASE_VERTS_U.map(([xu, yu]) => {
      const xPx = xu <= 1e-6 ? 0 : seamPx + (xu - apexU) * xScale;
      const yPx = (yu - HERO_CLIP_TOP_Y) * yScale;
      return `${xPx.toFixed(2)}px ${yPx.toFixed(2)}px`;
    }).join(', ');
    return `polygon(${pts})`;
  };

  const stripItems = useMemo(
    () =>
      DESIGN_BAND_ROWS.map((row) => {
        const p = getPortfolioItemById(row.routeId);
        const imageHref = row.bandSourceId
          ? portfolioImageUrl(row.bandSourceId, 'band.jpg')
          : portfolioBandImageHref(row.routeId);
        return {
          reactKey: row.reactKey,
          projectId: row.routeId,
          title: p?.title ?? row.routeId,
          imageHref,
        };
      }),
    [],
  );

  const onSelectProject = (projectId: string, navigatePath?: string): void => {
    writeLandingPendingDesignTileNav();
    writeLandingBandScrollPersisted(stripRef.current?.getScrollLeft() ?? 0);
    navigate(navigatePath ?? `/portfolio/${encodeURIComponent(projectId)}`);
  };

  // 296 / 1080 — band row height vs full hero frame (Landing sketch scale)
  const bandHeightFrac = `${BAND_TILE_VIEWBOX_H} / 1080`;
  const t =
    maxRevealPx > 1e-6 ? 1 - (2 * seamPx) / maxRevealPx : 0;
  const isFullWidth = t >= 1;

  return (
    <div
      ref={wheelHostRef}
      className={[
        'landing-design-band-shell absolute left-0 z-[20] transition-opacity duration-300',
        designBandVisible ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        // Keep the container pinned left; use a px-based clip-path so angles don't distort.
        width: '100%',
        transform: 'none',
        top: `calc(100% * (${HERO_WEDGE_TOP_FRAC_U}))`,
        height: `calc(100% * (${bandHeightFrac}))`,
        clipPath: isFullWidth ? 'none' : getClipPathPx(),
        WebkitClipPath: isFullWidth ? 'none' : getClipPathPx(),
        touchAction: 'pan-x',
        overscrollBehaviorY: 'none',
      }}
      aria-hidden={!designBandVisible}
    >
      <div className="flex h-full min-h-0 w-full items-stretch justify-start overflow-hidden">
        <BandStrip
          ref={stripRef}
          items={stripItems}
          onSelectProject={onSelectProject}
          ariaLabel="Design portfolio band"
          initialScrollLeft={initialBandScrollLeft}
          onScrollPositionChange={onBandScrollPersist}
          className="h-full min-h-0 min-w-0 flex-1"
        />
      </div>
    </div>
  );
});
