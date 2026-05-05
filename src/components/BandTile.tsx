import { useId } from 'react';
import { portfolioImageUrl } from '../lib/portfolioUrls';

/** Matches band-tile.svg / Illustrator export */
export const BAND_TILE_VIEWBOX_W = 659.1;
export const BAND_TILE_VIEWBOX_H = 296;

/** Repeating middle unit — band-tile.svg */
const POLYGON_TILE = '360.4 296 .4 296 299.6 0 659.6 0';

/** Left end — flat left edge — band-cap-left.svg */
const POLYGON_CAP_LEFT = '360.4 296 .4 296 0 0 659.6 0';

/** Right end — flat right edge — band-cap-right.svg */
const POLYGON_CAP_RIGHT = '299.1 0 659.1 0 659.6 296 0 296';

/** Flat left + top (UCID adjacent to X) — avoids double clip with wedge shell. */
const POLYGON_CAP_FLAT_LEFT = '360.4 296 0 296 0 0 659.6 0';

export type BandTileVariant = 'cap-left' | 'cap-flat-left' | 'tile' | 'cap-right';

function polygonForVariant(variant: BandTileVariant): string {
  if (variant === 'cap-left') return POLYGON_CAP_LEFT;
  if (variant === 'cap-flat-left') return POLYGON_CAP_FLAT_LEFT;
  if (variant === 'cap-right') return POLYGON_CAP_RIGHT;
  return POLYGON_TILE;
}

function polygonSvgPointsToClipPathPct(pointsCsv: string, vbW: number, vbH: number): string {
  const nums = pointsCsv
    .trim()
    .split(/[\s,]+/)
    .map((t) => Number.parseFloat(t));
  const parts: string[] = [];
  for (let i = 0; i + 1 < nums.length; i += 2) {
    const x = nums[i]!;
    const y = nums[i + 1]!;
    parts.push(`${(x / vbW) * 100}% ${(y / vbH) * 100}%`);
  }
  return `polygon(${parts.join(', ')})`;
}

/** Pointer hit area matches SVG tile clip (triangle corners clickable, not rectangular bbox). */
export function bandTileInteractiveClipPath(variant: BandTileVariant): string {
  return polygonSvgPointsToClipPathPct(polygonForVariant(variant), BAND_TILE_VIEWBOX_W, BAND_TILE_VIEWBOX_H);
}

export type BandTileProps = {
  variant: BandTileVariant;
  projectId: string;
  className?: string;
  /** Accessible name (e.g. project title) */
  title: string;
  /** When set, used instead of `/portfolio/{id}/band.jpg` (e.g. software band tiles). */
  imageHref?: string;
  /** Skip SVG clip (e.g. UCID next to X under unified shell). */
  noTileClip?: boolean;
};

/**
 * One portfolio band cell: `band.jpg` (1318×592, 2× this viewBox) clipped to the parallelogram.
 * Horizontal overlap / ~360px stepping lives in `BandStrip` (later).
 */
export function BandTile({
  variant,
  projectId,
  className = '',
  title,
  imageHref: imageHrefProp,
  noTileClip = false,
}: BandTileProps) {
  const uid = useId().replace(/:/g, '');
  const clipId = `band-tile-clip-${uid}`;
  const points = polygonForVariant(variant);
  const href = imageHrefProp ?? portfolioImageUrl(projectId, 'band.jpg');

  const imageEl = (
    <image
      href={href}
      width={BAND_TILE_VIEWBOX_W}
      height={BAND_TILE_VIEWBOX_H}
      preserveAspectRatio="xMidYMid slice"
    />
  );

  return (
    <div className={['block h-full min-h-0 w-full shrink-0', className].filter(Boolean).join(' ')}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${BAND_TILE_VIEWBOX_W} ${BAND_TILE_VIEWBOX_H}`}
        className="block h-full w-full select-none"
        role="img"
        aria-label={title}
      >
        <title>{title}</title>
        {noTileClip ? (
          imageEl
        ) : (
          <>
            <defs>
              <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
                <polygon points={points} />
              </clipPath>
            </defs>
            <g clipPath={`url(#${clipId})`}>{imageEl}</g>
          </>
        )}
      </svg>
    </div>
  );
}
