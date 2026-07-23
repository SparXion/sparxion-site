import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import xMarkLargeSvg from '../assets/brand/sparxion-graphics/graphics-svg/x-mark-large.svg?raw';
import { DESIGN_BAND_PROJECT_IDS } from '../data/designBandProjectIds';
import { getPortfolioItemById } from '../data/portfolio';
import { softwareItems } from '../data/software';
import {
  writeLandingBandScrollPersisted,
  writeLandingPendingDesignTileNav,
  writeLandingPendingSoftwareTileNav,
} from '../lib/landingSession';
import { portfolioBandImageHref } from '../lib/portfolioBandImageHref';
import { navigateToSoftwareProject } from '../lib/ucidAppUrl';
import { softwareImageUrl } from '../lib/softwareUrls';
import { BandStrip } from './BandStrip';

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

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
   * Vertical centers: slight gap at start → top-half / bottom-half mid.
   * Band height: compact strip → taller rails as they separate.
   */
  const productTop = `calc(${42 - 17 * p}%)`;
  const softwareTop = `calc(${58 + 17 * p}%)`;
  const bandHeight = `calc(${11 + 11 * p}dvh)`;
  const bandWidth = `calc(${92 + 6 * p}vw)`;
  const xScale = 0.38 + 0.1 * (1 - p);
  const gapOpacity = 0.25 + 0.75 * p;

  return (
    <div
      className="mobile-band-split"
      style={{ ['--split' as string]: String(p) }}
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
        <p className="mobile-band-split__label" style={{ opacity: gapOpacity }}>
          Product
        </p>
        <div className="mobile-band-split__strip">
          <BandStrip
            ariaLabel="Product design band"
            items={designItems}
            onSelectProject={(projectId) => {
              writeLandingPendingDesignTileNav();
              writeLandingBandScrollPersisted(0);
              navigate(`/portfolio/${encodeURIComponent(projectId)}`);
            }}
          />
        </div>
      </div>

      <div
        className="mobile-band-split__x"
        style={{
          transform: `translate(-50%, -50%) scale(${xScale})`,
          opacity: 0.55 + 0.45 * p,
        }}
        aria-hidden
        dangerouslySetInnerHTML={{ __html: xMarkLargeSvg }}
      />

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
            ariaLabel="Software design band"
            items={softwareStripItems}
            tileAriaLabelPrefix="Open software"
            onSelectProject={(projectId) => {
              writeLandingPendingSoftwareTileNav();
              navigateToSoftwareProject(projectId, navigate);
            }}
          />
        </div>
        <p className="mobile-band-split__label" style={{ opacity: gapOpacity }}>
          Software
        </p>
      </div>
    </div>
  );
}
