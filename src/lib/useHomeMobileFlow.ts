import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const MOBILE_MQ = '(max-width: 720px), (pointer: coarse)';

function readMobilePreference(search: URLSearchParams): boolean | null {
  if (search.get('mobile') === '1' || search.get('mobile') === 'true') return true;
  if (search.get('desktop') === '1' || search.get('desktop') === 'true') return false;
  return null;
}

/** Home uses a simplified smash → choose side → band flow on phones / coarse pointers. */
export function useHomeMobileFlow(): boolean {
  const [searchParams] = useSearchParams();
  const forced = readMobilePreference(searchParams);
  const [matches, setMatches] = useState(() => {
    if (forced != null) return forced;
    if (typeof window === 'undefined') return false;
    return window.matchMedia(MOBILE_MQ).matches;
  });

  useEffect(() => {
    if (forced != null) {
      setMatches(forced);
      return;
    }
    const mq = window.matchMedia(MOBILE_MQ);
    const sync = () => setMatches(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, [forced]);

  return matches;
}
