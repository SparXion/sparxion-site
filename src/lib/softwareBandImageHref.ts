import { softwareImageUrl } from './softwareUrls';

/** Public band tile / grid thumbnail: /software-assets/{id}/band.jpg (synced from 02-MASTERS). */
export function softwareBandImageHref(softwareId: string): string {
  return softwareImageUrl(softwareId, 'band.jpg');
}
