/** Public URL for an image under /software/{projectId}/{filename} (sync from Portfolio/02-MASTERS). */
export function softwareImageUrl(projectId: string, filename: string): string {
  const parts = filename.split('/').filter(Boolean);
  const enc = parts.map((p) => encodeURIComponent(p)).join('/');
  return `/software/${encodeURIComponent(projectId)}/${enc}`;
}
