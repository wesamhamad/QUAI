/**
 * Screens the DGA file lists as roadmap, not delivered. The two that were
 * here (peer tutoring, the mobile app) have been removed from the bundle
 * (2026-09-16); the mechanism stays for the next one, so a roadmap screen
 * can leave the menu and open on a notice rather than on sample data.
 */
export const ROADMAP_PATHS: readonly string[] = [];

export function isRoadmap(path: string): boolean {
  return ROADMAP_PATHS.some(p => path === p || path.startsWith(p + '/'));
}

export function roadmapPreviewRequested(): boolean {
  try {
    return new URLSearchParams(window.location.search).get('preview') === '1';
  } catch {
    return false;
  }
}
