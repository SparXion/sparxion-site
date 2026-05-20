import { portfolioImageUrl } from './portfolioUrls';

/** Public band tile image: /portfolio/{id}/band.jpg (synced from 01-MASTERS). */
export function portfolioBandImageHref(portfolioId: string): string {
  return portfolioImageUrl(portfolioId, 'band.jpg');
}
