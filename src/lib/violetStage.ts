/** Story/identity pages that share the deep-violet stage with the home hero video. */
const VIOLET_STAGE_PATHS = new Set(['/journey', '/ethos', '/contact']);

export function isVioletStagePath(pathname: string): boolean {
  return VIOLET_STAGE_PATHS.has(pathname);
}
