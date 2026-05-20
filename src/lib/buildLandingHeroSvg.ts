/**
 * Composes the landing hero sketch from replaceable layer files under `graphics-svg/`.
 * Edit one SVG, save, and refresh — no monolithic Illustrator export required.
 *
 * Layer order (back → front): hero-band-right, wordmark, tagline, x-mark, x-mark-large
 */
import heroBandRightRaw from '../assets/brand/sparxion-graphics/graphics-svg/hero-band-right.svg?raw';
import wordmarkRaw from '../assets/brand/sparxion-graphics/graphics-svg/wordmark.svg?raw';
import taglineRaw from '../assets/brand/sparxion-graphics/graphics-svg/tagline.svg?raw';
import xMarkRaw from '../assets/brand/sparxion-graphics/graphics-svg/x-mark.svg?raw';
import heroXMarkLargeRaw from '../assets/brand/sparxion-graphics/graphics-svg/hero-x-mark-large.svg?raw';
import {
  extractHeroBandRightClipDef,
  extractSvgLayerBody,
  normalizeHeroFillClass,
} from './extractSvgLayer';

const HERO_VIEWBOX = '0 0 1920 1080';

function wrapGroup(id: string, inner: string, attrs = ''): string {
  return `<g id="${id}"${attrs ? ` ${attrs}` : ''}>${inner}</g>`;
}

function stripElementId(markup: string, id: string): string {
  return markup.replace(new RegExp(`\\sid="${id}"`, 'i'), '');
}

function layerWordmark(): string {
  const body = normalizeHeroFillClass(extractSvgLayerBody(wordmarkRaw));
  const inner = stripElementId(body, 'wordmark');
  return wrapGroup('wordmark', inner);
}

function layerTagline(): string {
  const body = normalizeHeroFillClass(extractSvgLayerBody(taglineRaw));
  const inner = stripElementId(body, 'tagline').replace(/\sid="tagline-2"/i, '');
  return wrapGroup('tagline', inner);
}

function layerXMark(): string {
  const body = normalizeHeroFillClass(extractSvgLayerBody(xMarkRaw));
  const inner = body
    .replace(/\sid="x-mark-2"/i, '')
    .replace(/\sdata-name="x-mark"/i, '');
  return wrapGroup('x-mark', inner, 'focusable="true"');
}

function layerHeroBandRight(): string {
  return normalizeHeroFillClass(extractSvgLayerBody(heroBandRightRaw));
}

function layerXMarkLarge(): string {
  return normalizeHeroFillClass(extractSvgLayerBody(heroXMarkLargeRaw));
}

/** Full hero `<svg>` string for `LandingHero` (`viewBox` 1920×1080, stable element ids). */
export function buildLandingHeroSvg(): string {
  const clipDef = extractHeroBandRightClipDef(heroBandRightRaw);
  const layers = [
    layerHeroBandRight(),
    layerWordmark(),
    layerTagline(),
    layerXMark(),
    layerXMarkLarge(),
  ];

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${HERO_VIEWBOX}">
  <defs>
    <style>
      .st0 {
        fill: #360c5e;
      }
    </style>
    ${clipDef}
  </defs>
  ${layers.join('\n  ')}
</svg>`;
}
