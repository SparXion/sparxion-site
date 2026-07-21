export const UCID_APP_URL = 'https://ucidapp.netlify.app';

export function openUcidApp(): void {
  window.location.assign(UCID_APP_URL);
}

export function isUcidProjectId(projectId: string): boolean {
  return projectId === 'ucid';
}

export function navigateToSoftwareProject(
  projectId: string,
  navigate: (path: string) => void,
): void {
  if (isUcidProjectId(projectId)) {
    openUcidApp();
    return;
  }
  navigate(`/software/${encodeURIComponent(projectId)}`);
}

export function softwareProjectHref(projectId: string): string {
  if (isUcidProjectId(projectId)) {
    return UCID_APP_URL;
  }
  return `/software/${projectId}`;
}
