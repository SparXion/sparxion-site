import { portfolioImageUrl } from './portfolioUrls';

/**
 * `band.jpg` sometimes lives under a legacy folder name (e.g. `hw-custom-motors`)
 * while `portfolio.ts` uses the canonical id (`custom-motors`). Used by hero bands
 * and anywhere else we need a stable band URL for a portfolio item.
 */
const BAND_FOLDER_OVERRIDE: Readonly<Record<string, string>> = {
  'custom-motors': 'hw-custom-motors',
  twinduction: 'hw-twinduction',
  'eps-glitz': 'nike-eps',
  marmot: 'apparel',
  mashie: 'apparel',
};

export function portfolioBandImageHref(portfolioId: string): string {
  const folder = BAND_FOLDER_OVERRIDE[portfolioId] ?? portfolioId;
  return portfolioImageUrl(folder, 'band.jpg');
}
