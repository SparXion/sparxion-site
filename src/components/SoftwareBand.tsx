import { forwardRef, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { softwareItems } from '../data/software';
import { navigateToSoftwareProject } from '../lib/ucidAppUrl';
import { buildHeroSoftwareBandClipPathPx } from '../lib/heroSoftwareBandClip';
import { softwareImageUrl } from '../lib/softwareUrls';
import { BandStrip, type BandStripHandle } from './BandStrip';
import { BAND_TILE_VIEWBOX_H } from './BandTile';

export type SoftwareBandProps = {
  /** Visible when hero is expanded + wedges are revealed */
  visible: boolean;
  /** Hero seam x in px (same model as DesignBand). */
  seamPx: number;
  /** Max reveal in px (hero width) */
  maxRevealPx: number;
  /**
   * Hero-root X (px) for the right wedge band-facing seam (#hero-clip-band-right ~944.6u),
   * mirror of `xSeamPx` on the left.
   */
  rightSeamPx?: number;
  className?: string;
  tabIndex?: number;
  role?: string;
  ariaLabel?: string;
};

const HERO_WEDGE_TOP_FRAC_U = `${408.8} / 1080`;

export const SoftwareBand = forwardRef<BandStripHandle, SoftwareBandProps>(function SoftwareBand(
  {
    visible,
    seamPx,
    maxRevealPx,
    rightSeamPx,
    className = '',
    tabIndex,
    role,
    ariaLabel,
  },
  ref,
) {
  const navigate = useNavigate();
  /** Clip bounds + wheel target: must receive hits in the wedge (see pointer-events note below). */
  const shellRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<BandStripHandle>(null);

  useImperativeHandle(ref, () => ({
    stepBackward: () => stripRef.current?.stepBackward(),
    stepForward: () => stripRef.current?.stepForward(),
    getScrollLeft: () => stripRef.current?.getScrollLeft() ?? 0,
    scrollHorizontalBy: (deltaPx: number) => stripRef.current?.scrollHorizontalBy(deltaPx),
    getScrollInfo: () => stripRef.current?.getScrollInfo() ?? { left: 0, max: 0 },
  }));

  const stripItems = useMemo(
    () =>
      softwareItems.map((s) => ({
        projectId: s.id,
        title: s.title,
        imageHref: softwareImageUrl(s.id, 'band.jpg'),
      })),
    [],
  );

  const [clip, setClip] = useState('none');

  const seamOutsideWedgeRange =
    seamPx >= maxRevealPx - 1e-6 ||
    (typeof rightSeamPx === 'number' && rightSeamPx <= 0);
  /** Software rail full-bleed when X has exited right (strip anchored from measured right seam). */
  const isSoftwareFullWidth = seamPx >= maxRevealPx - 1e-6;
  /**
   * When the X exits right and we go full-bleed, nest the strip start at the X seam instead of
   * pinning the first tile at the hero's left edge.
   */
  const fullBleedPadLeft =
    isSoftwareFullWidth &&
    typeof rightSeamPx === 'number' &&
    Number.isFinite(rightSeamPx) &&
    maxRevealPx > 1
      ? Math.min(maxRevealPx, Math.max(0, Math.round(rightSeamPx)))
      : 0;

  const clipReady = visible && rightSeamPx !== undefined;

  /** After clip opens to full width, force scroll metrics to settle (strip often reported max=0 until layout). */
  useLayoutEffect(() => {
    if (!isSoftwareFullWidth || !visible) return;
    let id2: number | undefined;
    const id1 = requestAnimationFrame(() => {
      stripRef.current?.scrollHorizontalBy(0);
      id2 = requestAnimationFrame(() => stripRef.current?.scrollHorizontalBy(0));
    });
    return () => {
      cancelAnimationFrame(id1);
      if (id2 !== undefined) cancelAnimationFrame(id2);
    };
  }, [isSoftwareFullWidth, visible]);

  useLayoutEffect(() => {
    console.log('[SoftwareBand] clipReady:', clipReady, '| rightSeamPx:', rightSeamPx, '| visible:', visible);
    if (seamOutsideWedgeRange || !visible || rightSeamPx === undefined) {
      setClip('none');
      return;
    }
    setClip(buildHeroSoftwareBandClipPathPx(shellRef.current, rightSeamPx));
  }, [seamOutsideWedgeRange, visible, seamPx, rightSeamPx]);

  const bandHeightFrac = `${BAND_TILE_VIEWBOX_H} / 1080`;

  return (
    <div
      ref={shellRef}
      className={[
        'landing-software-band-shell absolute left-0 z-[19] w-full transition-opacity duration-300',
        clipReady ? 'opacity-100' : 'opacity-0',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        width: '100%',
        transform: 'none',
        top: `calc(100% * (${HERO_WEDGE_TOP_FRAC_U}))`,
        height: `calc(100% * (${bandHeightFrac}))`,
        backgroundColor: '#360c5e',
        clipPath: clip,
        WebkitClipPath: clip,
        /*
         * This layer must use pointer-events:auto so the wedge receives wheels. A parent with
         * pointer-events:none passes hit-testing through to DesignBand below — wheels then never
         * hit this subtree. Modern Blink/WebKit use clip-path for hit-testing on this element so
         * the left band (underneath) still receives events outside the polygon.
         */
        pointerEvents: visible ? 'auto' : 'none',
        touchAction: 'pan-x',
        overscrollBehaviorY: 'none',
      }}
      tabIndex={visible ? tabIndex : undefined}
      role={visible ? role : undefined}
      aria-label={visible ? ariaLabel : undefined}
      aria-hidden={!visible}
    >
      {/* Same flex pattern as DesignBand (justify-start): reading order starts from the seam / UCID end. */}
      <div
        className="flex h-full min-h-0 w-full items-stretch justify-start overflow-hidden"
        style={{
          paddingLeft: fullBleedPadLeft > 0 ? `${fullBleedPadLeft}px` : undefined,
          boxSizing: 'border-box',
        }}
      >
        <BandStrip
          ref={stripRef}
          items={stripItems}
          initialScrollLeft={0}
          onSelectProject={(projectId) => navigateToSoftwareProject(projectId, navigate)}
          tileAriaLabelPrefix="Open software"
          ariaLabel="Software portfolio band"
          className="h-full min-h-0 min-w-0 flex-1"
        />
      </div>
    </div>
  );
});
