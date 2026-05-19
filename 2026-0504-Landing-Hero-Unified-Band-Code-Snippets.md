# Landing hero, unified band, UCID — code snippets

**Created:** 2026-05-04  
**Scope:** Entry (`HomePage`), hero shell (`LandingHero`), classic vs unified bands (`DesignBand` / `SoftwareBand` / `UnifiedBandShell` / `UnifiedBandStrip`), tiles (`BandTile`, `BandStrip`), wedge math (`heroSoftwareBandClip`, `heroDesignBandClip`), assets and public images.

---

## 1. Route flag → unified mode

`src/pages/HomePage.tsx`

```tsx
const [searchParams] = useSearchParams();
const useUnifiedBand =
  searchParams.get('unified') === '1' ||
  searchParams.get('unified') === 'true';

// …
<LandingHero useUnifiedBand={useUnifiedBand} />
```

---

## 2. Landing hero — SVG source, TEMP clip flag, injected CSS

`src/components/LandingHero.tsx`

```tsx
import landingSvgRaw from '../assets/brand/sparxion-graphics/Sparxion_Landing_Sketch-Scale.svg?raw';
// …
/**
 * TEMP: disable hero SVG `#hero-band-right` clipping entirely (no static wedge, no motion-linked polygon).
 * Saves/restores native `clip-path` when entering/leaving unified expanded. Set `false` to restore clip + dynamic polygon.
 */
const TEMP_DISABLE_HERO_RIGHT_SVG_CLIP = true;
```

Large X motion / reveal (`heroCss` string, excerpt):

```css
.landing-hero-css-root svg #x-mark-large {
  --landing-x-t: 0;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  cursor: default;
  translate: var(--landing-reveal-px) 0;
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

.landing-hero-css-root--expanded svg #x-mark-large {
  visibility: visible;
  opacity: 1;
  pointer-events: none;
  animation: landingHeroXGrow ${LANDING_LARGE_X_GROW_MS}ms linear forwards;
}

/* Unified band: defs clipPath; wedge paint hidden … */
.landing-hero-css-root--unified-band-active svg #hero-clip-band-right {
  opacity: 0 !important;
  visibility: hidden !important;
  pointer-events: none !important;
}
```

BBox → CSS custom properties for the transform chain:

```tsx
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
```

---

## 3. `#hero-band-right` clip + dynamic polygon (unified expanded)

`src/components/LandingHero.tsx`

```tsx
useLayoutEffect(() => {
  const root = hostRef.current;
  if (!root) return;

  const apply = (): void => {
    const svg = root.querySelector('svg');

    const poly =
      svg?.querySelector<SVGPolygonElement>('#hero-band-right-dynamic-clip polygon') ?? null;

    const heroRight = svg?.querySelector<SVGElement>('#hero-band-right');

    root.style.removeProperty('--hero-unified-band-right-clip');

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
  // ResizeObserver + cleanup restore clip-path …
}, [useUnifiedBand, expanded, seamResolved, maxRevealPx, rightSeamPx]);
```

---

## 4. Seam sampling from `#x-mark-large` CTM (861.7 / 1033.6 sketch coords)

`src/components/LandingHero.tsx`

```tsx
const mapUserToHeroRootX = (userX: number, userY: number): number | null => {
  const ctm = xLarge.getScreenCTM();
  if (!ctm) return null;
  const pt = svg.createSVGPoint();
  pt.x = userX;
  pt.y = userY;
  const sp = pt.matrixTransform(ctm);
  const rr = root.getBoundingClientRect();
  return sp.x - rr.left;
};

const apply = (): void => {
  const leftA = mapUserToHeroRootX(861.7, 560.1);
  const rightA = mapUserToHeroRootX(1033.6, 526.9);
  if (leftA === null || rightA === null) return;
  setXSeamPx(Math.max(0, leftA));
  setRightSeamPx(Math.max(0, rightA));
};
```

---

## 5. Hero DOM: inline SVG + unified shell vs classic rails

`src/components/LandingHero.tsx`

```tsx
<div
  ref={hostRef}
  className={[
    'landing-hero-css-root max-w-none',
    expanded ? 'landing-hero-css-root--expanded' : '',
    expanded && landingRestored ? 'landing-hero-css-root--landing-restored' : '',
    expanded && bandsRevealed ? 'landing-hero-css-root--bands-revealed' : '',
    useUnifiedBand && expanded ? 'landing-hero-css-root--unified-band-active' : '',
    xHover && !expanded ? 'landing-hero-css-root--x-hover' : '',
  ]
    .filter(Boolean)
    .join(' ')}
>
  <div dangerouslySetInnerHTML={{ __html: landingSvgRaw }} />
  {useUnifiedBand && designBandVisible ? (
    <UnifiedBandShell seamPx={seamResolved} maxRevealPx={maxRevealPx} rightSeamPx={rightSeamPx}>
      <UnifiedBandStrip />
    </UnifiedBandShell>
  ) : null}
  {!useUnifiedBand ? (
    <>
      <DesignBand /* … */ />
      <SoftwareBand /* … */ />
    </>
  ) : null}
</div>
```

---

## 6. Unified band HTML shell clip (wedge overlay)

`src/components/UnifiedBandShell.tsx`

```tsx
/**
 * TEMP isolate — set `false` to restore wedge clip driven by `seamPx` / `rightSeamPx`
 * (those update from the large X CTM in `LandingHero`, so the shell clip tracks X motion when ON).
 */
const TEMP_UNIFIED_SHELL_CLIP_OFF = true;

const recomputeClip = useCallback(() => {
  if (TEMP_UNIFIED_SHELL_CLIP_OFF) {
    setClip('none');
    return;
  }
  // … buildHeroSoftwareBandClipPathPx(shellRef.current, rightSeamPx)
}, [seamPx, maxRevealPx, rightSeamPx]);

return (
  <div
    className="landing-unified-band-shell pointer-events-auto absolute left-0 z-[22] w-full opacity-100 transition-opacity duration-300"
    style={{
      top: 'calc(100% * (408.8 / 1080))',
      height: `calc(100% * (${BAND_TILE_VIEWBOX_H} / 1080))`,
    }}
  >
    <div
      ref={shellRef}
      className="h-full w-full"
      style={{
        clipPath: clip,
        WebkitClipPath: clip,
      }}
    >
      {children}
    </div>
  </div>
);
```

---

## 7. Unified strip — layout constants, inline Large X path, UCID clip bypass

`src/components/UnifiedBandStrip.tsx`

```tsx
const TILE_STEP_U = 360;
const TILE_OVERLAP_U = BAND_TILE_VIEWBOX_W - TILE_STEP_U;
const STRIP_ARTBOARD_W = 12392.41;
const DIVIDER_ARTBOARD_W = 409;

const LARGE_X_VIEWBOX = `6480 251.58 694 534.42`;
const LARGE_X_PATH_D =
  'M6480,435.18l109.08,178.58-108.3,172.03h94.9l102.31-172.03-104.6-178.58h-93.4ZM6967.26,251.58h-99.38l-195.78,328.94,122.18,205.28h95.44l-128.71-205.28,206.24-328.94Z';
```

```tsx
{/* X divider */}
<div
  className="flex h-full shrink-0 items-center justify-end self-stretch overflow-hidden"
  style={{
    width: `calc(100vw * ${DIVIDER_ARTBOARD_W} / ${STRIP_ARTBOARD_W})`,
    minWidth: 40,
  }}
  aria-hidden
>
  <svg className="max-h-full min-h-0 w-full" viewBox={LARGE_X_VIEWBOX} preserveAspectRatio="xMaxYMid meet">
    <path fill="#360c5e" d={LARGE_X_PATH_D} />
  </svg>
</div>
```

```tsx
const noLeftEndcapClip = variant === 'cap-flat-left' && item.projectId === 'ucid';
const clip = noLeftEndcapClip ? 'none' : bandTileInteractiveClipPath(variant);
// …
<button style={{ clipPath: clip, WebkitClipPath: clip }} /* … */>
  <BandTile
    variant={variant}
    projectId={item.projectId}
    title={item.title}
    imageHref={item.imageHref}
    noTileClip={noLeftEndcapClip}
  />
</button>
```

Software tile image URL (UCID uses `public/software/ucid/band.jpg`):

```tsx
softwareItems.map((s) => ({
  projectId: s.id,
  title: s.title,
  imageHref: softwareImageUrl(s.id, 'band.jpg'),
}));
```

`src/lib/softwareUrls.ts`

```ts
export function softwareImageUrl(projectId: string, filename: string): string {
  const parts = filename.split('/').filter(Boolean);
  const enc = parts.map((p) => encodeURIComponent(p)).join('/');
  return `/software/${encodeURIComponent(projectId)}/${enc}`;
}
```

---

## 8. Classic software rail — wedge clip on shell

`src/components/SoftwareBand.tsx`

```tsx
const isSoftwareFullWidth = seamPx >= maxRevealPx - 1e-6;

const clip =
  !visible || isSoftwareFullWidth ? 'none' : buildHeroSoftwareBandClipPathPx(shellRef.current, rightSeamPx);

// ref={shellRef} on outer shell; inner BandStrip …
```

---

## 9. Classic design rail — left wedge clip path

`src/lib/heroDesignBandClip.ts`

```ts
const VERTICES: readonly [number, number][] = [
  [861.7, 560.1],
  [769.2, 408.8],
  [0, 408.8],
  [0, 704.9],
  [770.5, 704.9],
];

export const HERO_DESIGN_BAND_CLIP_PATH = `polygon(${VERTICES.map(([x, y]) => pct(x, y)).join(', ')})`;
```

`src/components/DesignBand.tsx` (docstring + imports; clip applied deeper in file)

```tsx
/**
 * Left-half overlay … Clipped to `#hero-clip-band-left` via `heroDesignBandClip.ts` …
 */
import { HERO_DESIGN_BAND_CLIP_PATH } from '../lib/heroDesignBandClip';
```

---

## 10. Right wedge / knee math (software + dynamic SVG polygon)

`src/lib/heroSoftwareBandClip.ts`

```ts
export const VIEWBOX_W = 1920;
export const HERO_CLIP_TOP_Y = 408.8;
export const HERO_CLIP_BOTTOM_Y = 704.9;
export const ANCHOR_RIGHT_U = 1033.6;

export const BASE_VERTS_RIGHT_U: readonly [number, number][] = [
  [1920, 408.8],
  [1107.6, 408.8],
  [1033.6, 526.9],
  [1145.2, 704.9],
  [1920, 704.9],
];

export const FULL_HERO_BAND_RIGHT_CLIP_POLYGON_POINTS = BASE_VERTS_RIGHT_U.map(
  ([xu, yu]) => `${String(xu)} ${String(yu)}`,
).join(' ');

export const HERO_SOFTWARE_BAND_CLIP_PATH =
  'polygon(1920 408.8, 1107.6 408.8, 1000 526.9, 1145.2 704.9, 1920 704.9, 1920 408.8)';

export function buildHeroSoftwareBandClipPathPx(el: Element | null, rightSeamPx: number | undefined): string {
  // maps BASE_VERTS_RIGHT_U to px polygon …
}

export function buildHeroBandRightDynamicClipPolygonPointsInUserSpace(params: {
  seamPx: number;
  maxRevealPx: number;
  heroWidthPx: number;
  rightSeamPx?: number;
}): string {
  // …
}
```

---

## 11. Band tile polygons, CSS `clip-path`, optional `noTileClip`

`src/components/BandTile.tsx`

```ts
const POLYGON_TILE = '360.4 296 .4 296 299.6 0 659.6 0';
const POLYGON_CAP_FLAT_LEFT = '360.4 296 0 296 0 0 659.6 0';
const POLYGON_CAP_FLAT_RIGHT = '299.1 0 659.1 0 659.6 296 0 296';

export function bandTileInteractiveClipPath(variant: BandTileVariant): string {
  return polygonSvgPointsToClipPathPct(polygonForVariant(variant), BAND_TILE_VIEWBOX_W, BAND_TILE_VIEWBOX_H);
}
```

```tsx
const imageEl = (
  <image
    href={href}
    width={BAND_TILE_VIEWBOX_W}
    height={BAND_TILE_VIEWBOX_H}
    preserveAspectRatio="xMidYMid slice"
  />
);

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
```

---

## 12. Classic `BandStrip` — same UCID bypass + scroll chrome

`src/components/BandStrip.tsx`

```tsx
const noLeftEndcapClip = variant === 'cap-flat-left' && item.projectId === 'ucid';
const tileClipPath = noLeftEndcapClip ? 'none' : bandTileInteractiveClipPath(variant);

<button
  style={{
    clipPath: tileClipPath,
    WebkitClipPath: tileClipPath,
  }}
  className="… hover:scale-[1.03] …"
>
  <BandTile /* … */ noTileClip={noLeftEndcapClip} />
</button>
```

Outer scroll / overflow:

```tsx
<div role="region" className={`band-strip-root min-h-0 overflow-hidden ${className}`.trim()}>
  <div
    ref={scrollElRef}
    className="band-strip-scroll h-full min-h-0 overflow-x-auto overflow-y-hidden"
    style={{ containerType: 'size', touchAction: 'pan-x', /* … */ }}
  >
```

---

## 13. Inline landing sketch asset (large X paths live here)

Path: `src/assets/brand/sparxion-graphics/Sparxion_Landing_Sketch-Scale.svg`  
Imported in `LandingHero.tsx` as `?raw` and injected next to the React overlays.

Excerpt (IDs `#x-mark`, `#x-mark-large`; viewBox `0 0 1920 1080`):

```xml
<g id="x-mark" focusable="true">
  <path class="st0" d="M933,514.6l17.1,28-17,26.9h14.9l16-26.9-16.4-28h-14.6ZM1009.3,485.9h-15.6l-30.6,51.5,19.1,32.1h14.9l-20.1-32.1,32.3-51.5h0Z"/>
</g>
<g id="x-mark-large">
  <path class="st0" d="M752.6,381.5l109.1,178.6-108.3,172h94.9l102.3-172-104.6-178.6h-93.4Z"/>
  <path class="st0" d="M1239.8,197.9h-99.4l-195.8,328.9,122.2,205.3h95.4l-128.7-205.3,206.2-328.9h0Z"/>
</g>
```

*(Your repo’s full SVG may also contain `#hero-band-right` / clip defs if present in a longer export; the snippets above reflect the current checked-in structure.)*

---

## File index (quick navigation)

| Area | Path |
|------|------|
| `?unified=1` | `src/pages/HomePage.tsx` |
| Hero, wheel, seams, SVG clip TEMP | `src/components/LandingHero.tsx` |
| Unified shell wedge | `src/components/UnifiedBandShell.tsx` |
| Unified scroll strip + divider X + tiles | `src/components/UnifiedBandStrip.tsx` |
| Classic strips | `src/components/BandStrip.tsx`, `src/components/DesignBand.tsx`, `src/components/SoftwareBand.tsx` |
| Tile geometry + SVG clip | `src/components/BandTile.tsx` |
| Right wedge constants + builders | `src/lib/heroSoftwareBandClip.ts` |
| Left wedge polygon | `src/lib/heroDesignBandClip.ts` |
| Software tile URLs | `src/lib/softwareUrls.ts` |
| Landing sketch | `src/assets/brand/sparxion-graphics/Sparxion_Landing_Sketch-Scale.svg` |
| UCID raster (example) | `public/software/ucid/band.jpg` |
