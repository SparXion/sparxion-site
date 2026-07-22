/**
 * Map landing-hero viewBox X seams to CSS px on the hero root.
 * Uses the live SVG CTM so letterboxing / max-height scale matches the painted X.
 */

/** Design-band apex (band-facing left crotch of large X), viewBox u. */
export const APEX_LEFT_U = 861.7;

/**
 * Software seam sample — right of the X crotch (~944.6) so tiles don't paint into the
 * open letterform gaps (UCID was visible through the X before the mark cleared).
 * 1014.8 matches the top of `#hero-clip-band-right`'s X-facing edge.
 */
export const SOFTWARE_SEAM_U = 1014.8;

/** Overlap design slightly under the X so no hairline gap shows at the left crotch. */
export const X_SEAM_LEFT_TUCK_U = -6;

export type HeroXSeamPx = {
  /** Root-relative px for design apex. */
  xSeamPx: number;
  /** Root-relative px for software band-facing anchor. */
  rightSeamPx: number;
  /** Horizontal user→px scale from the X's screen CTM. */
  xScale: number;
};

/**
 * Prefer the overlay X (what the user sees above the bands); fall back to SVG `#x-mark-large`.
 */
export function measureHeroXSeamPx(
  root: HTMLElement,
  _anchorRightU: number,
): HeroXSeamPx | null {
  const svg =
    root.querySelector<SVGSVGElement>('#x-mark-large-overlay svg') ??
    root.querySelector<SVGSVGElement>(':scope > svg, svg');
  if (!svg) return null;

  const mark =
    svg.querySelector<SVGGraphicsElement>('#x-mark-large-2') ??
    svg.querySelector<SVGGraphicsElement>('#x-mark-large') ??
    null;
  if (!mark) return null;

  const ctm = mark.getScreenCTM();
  if (!ctm || !Number.isFinite(ctm.a) || Math.abs(ctm.a) < 1e-8) return null;

  const rootLeft = root.getBoundingClientRect().left;
  const xScale = Math.abs(ctm.a);

  const toRootX = (u: number, v: number): number => {
    const pt = svg.createSVGPoint();
    pt.x = u;
    pt.y = v;
    return pt.matrixTransform(ctm).x - rootLeft;
  };

  // Mid-band Y keeps the sample on the stroke, not the X tips.
  const midY = 560.1;
  const xSeamPx = Math.max(0, toRootX(APEX_LEFT_U - X_SEAM_LEFT_TUCK_U, midY));
  const rightSeamPx = Math.max(0, toRootX(SOFTWARE_SEAM_U, midY));

  return { xSeamPx, rightSeamPx, xScale };
}

/** CSS px scale of the hero sketch SVG inside `root` (falls back to shell width). */
export function heroSvgXScale(root: Element | null, shellWidthPx: number, viewBoxW = 1920): number {
  const svg = root?.querySelector?.('svg') ?? null;
  if (svg) {
    const w = svg.getBoundingClientRect().width;
    if (w > 1) return w / viewBoxW;
  }
  return shellWidthPx / viewBoxW;
}
