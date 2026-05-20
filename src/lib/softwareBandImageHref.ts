import { softwareImageUrl } from './softwareUrls';

const bandModules = import.meta.glob<string>('../assets/software-bands/*/band.jpg', {
  eager: true,
  query: '?url',
  import: 'default',
});

const bandUrlById: Record<string, string> = {};
for (const [path, url] of Object.entries(bandModules)) {
  const match = path.match(/software-bands\/([^/]+)\/band\.jpg$/);
  if (match) bandUrlById[match[1]] = url;
}

/** Band tile / grid thumbnail — bundled via Vite so Netlify serves real JPEGs under /assets/. */
export function softwareBandImageHref(softwareId: string): string {
  return bandUrlById[softwareId] ?? softwareImageUrl(softwareId, 'band.jpg');
}
