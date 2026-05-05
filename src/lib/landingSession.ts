/**
 * Persistence for returning from portfolio → landing (browser Back) with design band state intact.
 *
 * SPA note: Do not use `PerformanceNavigationTiming.type === 'back_forward'` — single-page navigations
 * stay `navigate`. Restore is keyed off React Router `NavigationType.Pop` plus a one-shot flag
 * set when opening `/portfolio/:id` from the design band (see `DesignBand`).
 */

export const LANDING_SESSION_EXPANDED_KEY = 'sparxion:landing:heroExpanded';
export const LANDING_SESSION_BAND_SCROLL_KEY = 'sparxion:landing:designBandScroll';
/** Set immediately before programmatic navigation to `/portfolio/:id` from the design band; consumed on POP to `/`. */
export const LANDING_SESSION_PENDING_DESIGN_TILE_NAV_KEY = 'sparxion:landing:pendingDesignTileNav';

export function clearLandingSession(): void {
  try {
    sessionStorage.removeItem(LANDING_SESSION_EXPANDED_KEY);
    sessionStorage.removeItem(LANDING_SESSION_BAND_SCROLL_KEY);
    sessionStorage.removeItem(LANDING_SESSION_PENDING_DESIGN_TILE_NAV_KEY);
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

export function writeLandingPendingDesignTileNav(): void {
  try {
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
