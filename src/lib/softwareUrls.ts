/**
 * Public URL for synced software images (Portfolio/02-MASTERS → public/software-assets/).
 * Uses `/software-assets/` not `/software/` so Netlify does not serve index.html for image
 * requests that would match the SPA route `/software/:id`.
 */
export function softwareImageUrl(projectId: string, filename: string): string {
  const parts = filename.split('/').filter(Boolean);
  const enc = parts.map((p) => encodeURIComponent(p)).join('/');
  return `/software-assets/${encodeURIComponent(projectId)}/${enc}`;
}
