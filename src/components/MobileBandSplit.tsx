import { useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import xMarkLargeSvg from '../assets/brand/sparxion-graphics/graphics-svg/x-mark-large.svg?raw';
import { DESIGN_BAND_PROJECT_IDS } from '../data/designBandProjectIds';
import { getPortfolioItemById } from '../data/portfolio';
import { softwareItems } from '../data/software';
import {
  readLandingBandScrollPersisted,
  writeLandingBandScrollPersisted,
  writeLandingPendingDesignTileNav,
  writeLandingPendingSoftwareTileNav,
} from '../lib/landingSession';
import { portfolioBandImageHref } from '../lib/portfolioBandImageHref';
import { navigateToSoftwareProject } from '../lib/ucidAppUrl';
import { softwareImageUrl } from '../lib/softwareUrls';
import { BandStrip, type BandStripHandle } from './BandStrip';

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

/** Crop the 1920×1080 plate so the mark fills its box (same paths as hero). */
const X_MARK_SPLIT_SVG = xMarkLargeSvg.replace(
  /viewBox="0 0 1920 1080"/,
  'viewBox="740 185 520 560"',
);

export type MobileBandSplitProps = {
  /** 0 = bands stacked at mid-screen (hero-band scale); 1 = top/bottom halves. */
  progress: number;
};

/**
 * Mobile-only post-morph stage: continuing scroll separates product ↑ and software ↓
 * around a centered X, growing each band into its half of the viewport.
 */
export function MobileBandSplit({ progress }: MobileBandSplitProps) {
  const navigate = useNavigate();
  const p = clamp01(progress);
  /** Front-load growth / separation so full size arrives in fewer strokes. */
  const ease = 1 - (1 - p) ** 2.6;
  const productStripRef = useRef<BandStripHandle>(null);
  const softwareStripRef = useRef<BandStripHandle>(null);
  const restoreScrollLeft = useMemo(() => readLandingBandScrollPersisted(), []);

  const designItems = useMemo(
    () =>
      DESIGN_BAND_PROJECT_IDS.map((id) => {
        const project = getPortfolioItemById(id);
        return {
          reactKey: id,
          projectId: id,
          title: project?.title ?? id,
          imageHref: portfolioBandImageHref(id),
        };
      }),
    [],
  );

  const softwareStripItems = useMemo(
    () =>
      softwareItems.map((s) => ({
        projectId: s.id,
        title: s.title,
        imageHref: softwareImageUrl(s.id, 'band.jpg'),
      })),
    [],
  );

  /*
   * Vertical centers: open a clear mid gap for the hero-scale X, then park
   * rails in each half. Band height eases to full size early in the scroll.
   */
  const productTop = `calc(${40 - 15 * ease}%)`;
  const softwareTop = `calc(${60 + 15 * ease}%)`;
  const bandHeight = `calc(${12 + 10 * ease}dvh)`;
  const bandWidth = `calc(${94 + 4 * ease}vw)`;
  const labelOpacity = 0.35 + 0.65 * ease;

  return (
    <div
      className="mobile-band-split"
      style={{ ['--split' as string]: String(ease) }}
      aria-label="Explore product and software work"
    >
      <div
        className="mobile-band-split__rail mobile-band-split__rail--product"
        style={{
          top: productTop,
          width: bandWidth,
          height: bandHeight,
        }}
      >
        <p className="mobile-band-split__label" style={{ opacity: labelOpacity }}>
          discover product design
        </p>
        <div className="mobile-band-split__strip">
          <BandStrip
            ref={productStripRef}
            ariaLabel="Product design band"
            items={designItems}
            initialScrollLeft={restoreScrollLeft}
            onSelectProject={(projectId) => {
              writeLandingPendingDesignTileNav();
              writeLandingBandScrollPersisted(
                productStripRef.current?.getScrollLeft() ?? 0,
              );
              navigate(`/portfolio/${encodeURIComponent(projectId)}`);
            }}
          />
        </div>
      </div>

      <div className="mobile-band-split__x" aria-hidden>
        <div
          className="mobile-band-split__x-mark"
          dangerouslySetInnerHTML={{ __html: X_MARK_SPLIT_SVG }}
        />
      </div>

      <div
        className="mobile-band-split__rail mobile-band-split__rail--software"
        style={{
          top: softwareTop,
          width: bandWidth,
          height: bandHeight,
        }}
      >
        <div className="mobile-band-split__strip">
          <BandStrip
            ref={softwareStripRef}
            ariaLabel="Software design band"
            items={softwareStripItems}
            initialScrollLeft={restoreScrollLeft}
            tileAriaLabelPrefix="Open software"
            onSelectProject={(projectId) => {
              writeLandingPendingSoftwareTileNav();
              writeLandingBandScrollPersisted(
                softwareStripRef.current?.getScrollLeft() ?? 0,
              );
              navigateToSoftwareProject(projectId, navigate);
            }}
          />
        </div>
        <p className="mobile-band-split__label" style={{ opacity: labelOpacity }}>
          discover software design
        </p>
      </div>
    </div>
  );
}
