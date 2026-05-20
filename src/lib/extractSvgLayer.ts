/** Strip outer `<svg>` wrapper and per-file `<defs>` / Illustrator metadata for hero composition. */
export function extractSvgLayerBody(raw: string): string {
  const match = raw.match(/<svg[^>]*>([\s\S]*)<\/svg>/i);
  if (!match) return '';
  return match[1]
    .replace(/<\?xml[^?]*\?>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<defs>[\s\S]*?<\/defs>/gi, '')
    .replace(/<metadata>[\s\S]*?<\/metadata>/gi, '')
    .trim();
}

/** Pull `<clipPath id="hero-band-right-dynamic-clip">` from a layer file into the hero root `<defs>`. */
export function extractHeroBandRightClipDef(raw: string): string {
  const match = raw.match(
    /<clipPath\s+id="hero-band-right-dynamic-clip"[\s\S]*?<\/clipPath>/i,
  );
  return match?.[0] ?? '';
}

export function normalizeHeroFillClass(markup: string): string {
  return markup.replace(/\bcls-1\b/g, 'st0');
}
