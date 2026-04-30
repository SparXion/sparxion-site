/** Public URL for an image under /portfolio/{projectId}/{filename} */
export function portfolioImageUrl(projectId: string, filename: string): string {
  const parts = filename.split('/').filter(Boolean);
  const enc = parts.map((p) => encodeURIComponent(p)).join('/');
  return `/portfolio/${projectId}/${enc}`;
}
