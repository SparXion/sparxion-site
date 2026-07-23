/**
 * Persistence for returning from portfolio/software tiles → landing (browser Back)
 * with the hero band stage intact (vertical scroll + strip offset + expanded).
 *
 * SPA note: Do not use `PerformanceNavigationTiming.type === 'back_forward'` — single-page
 * navigations stay `navigate`. Restore is keyed off React Router `NavigationType.Pop`
 * plus one-shot flags set when opening a tile from a band.
 */

export const LANDING_SESSION_EXPANDED_KEY = 'sparxion:landing:heroExpanded';
export const LANDING_SESSION_BAND_SCROLL_KEY = 'sparxion:landing:designBandScroll';
/** Set immediately before programmatic navigation to a tile; consumed on POP to `/`. */
export const LANDING_SESSION_PENDING_DESIGN_TILE_NAV_KEY = 'sparxion:landing:pendingDesignTileNav';
export const LANDING_SESSION_PENDING_SOFTWARE_TILE_NAV_KEY = 'sparxion:landing:pendingSoftwareTileNav';
/** Vertical window scroll when leaving home for a tile — restored on Back. */
export const LANDING_SESSION_HOME_SCROLL_Y_KEY = 'sparxion:landing:homeScrollY';

function getWindowScrollTop(): number {
  const se = document.scrollingElement;
  if (se && se.scrollTop > 0) return se.scrollTop;
  return Math.max(
    window.scrollY,
    document.documentElement.scrollTop,
    document.body.scrollTop,
  );
}

export function clearLandingSession(): void {
  try {
    sessionStorage.removeItem(LANDING_SESSION_EXPANDED_KEY);
    sessionStorage.removeItem(LANDING_SESSION_BAND_SCROLL_KEY);
    sessionStorage.removeItem(LANDING_SESSION_PENDING_DESIGN_TILE_NAV_KEY);
    sessionStorage.removeItem(LANDING_SESSION_PENDING_SOFTWARE_TILE_NAV_KEY);
    sessionStorage.removeItem(LANDING_SESSION_HOME_SCROLL_Y_KEY);
  } catch {
    /* private mode etc. */
  }
}

export function readLandingExpandedPersisted(): boolean {
  try {
    return sessionStorage.getItem(LANDING_SESSION_EXPANDED_KEY) === '1';
  } catch {
    return false;
  }
}

export function readLandingBandScrollPersisted(): number | undefined {
  try {
    const s = sessionStorage.getItem(LANDING_SESSION_BAND_SCROLL_KEY);
    if (s === null) return undefined;
    const n = Number(s);
    return Number.isFinite(n) ? n : undefined;
  } catch {
    return undefined;
  }
}

export function writeLandingExpandedPersisted(expanded: boolean): void {
  try {
    if (expanded) sessionStorage.setItem(LANDING_SESSION_EXPANDED_KEY, '1');
    else sessionStorage.removeItem(LANDING_SESSION_EXPANDED_KEY);
  } catch {
    /* ignore */
  }
}

export function writeLandingBandScrollPersisted(scrollLeft: number): void {
  try {
    sessionStorage.setItem(LANDING_SESSION_BAND_SCROLL_KEY, String(Math.round(scrollLeft)));
  } catch {
    /* ignore */
  }
}

/** Snapshot vertical home scroll before navigating to a tile. */
export function writeLandingHomeScrollY(scrollY?: number): void {
  try {
    const y = typeof scrollY === 'number' && Number.isFinite(scrollY) ? scrollY : getWindowScrollTop();
    sessionStorage.setItem(LANDING_SESSION_HOME_SCROLL_Y_KEY, String(Math.round(y)));
  } catch {
    /* ignore */
  }
}

export function readLandingHomeScrollY(): number | undefined {
  try {
    const s = sessionStorage.getItem(LANDING_SESSION_HOME_SCROLL_Y_KEY);
    if (s === null) return undefined;
    const n = Number(s);
    return Number.isFinite(n) ? n : undefined;
  } catch {
    return undefined;
  }
}

export function clearLandingHomeScrollY(): void {
  try {
    sessionStorage.removeItem(LANDING_SESSION_HOME_SCROLL_Y_KEY);
  } catch {
    /* ignore */
  }
}

export function writeLandingPendingDesignTileNav(): void {
  try {
    writeLandingHomeScrollY();
    writeLandingExpandedPersisted(true);
    sessionStorage.setItem(LANDING_SESSION_PENDING_DESIGN_TILE_NAV_KEY, '1');
  } catch {
    /* ignore */
  }
}

/** Read and clear pending design-tile navigation; call once when handling POP to `/`. */
export function consumeLandingPendingDesignTileNav(): boolean {
  try {
    const key = LANDING_SESSION_PENDING_DESIGN_TILE_NAV_KEY;
    const ok = sessionStorage.getItem(key) === '1';
    sessionStorage.removeItem(key);
    return ok;
  } catch {
    return false;
  }
}

export function writeLandingPendingSoftwareTileNav(): void {
  try {
    writeLandingHomeScrollY();
    writeLandingExpandedPersisted(true);
    sessionStorage.setItem(LANDING_SESSION_PENDING_SOFTWARE_TILE_NAV_KEY, '1');
  } catch {
    /* ignore */
  }
}

export function consumeLandingPendingSoftwareTileNav(): boolean {
  try {
    const key = LANDING_SESSION_PENDING_SOFTWARE_TILE_NAV_KEY;
    const ok = sessionStorage.getItem(key) === '1';
    sessionStorage.removeItem(key);
    return ok;
  } catch {
    return false;
  }
}
