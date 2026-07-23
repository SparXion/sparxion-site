import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HomeDesktop } from './HomeDesktop';

/**
 * Home entry. Mobile uses the same smash → scroll → LandingHero path as desktop
 * (the button-only stage swap was removed — scroll to the band is the product).
 */
export function HomePage() {
  const [searchParams] = useSearchParams();
  const useUnifiedBand =
    searchParams.get('unified') === '1' || searchParams.get('unified') === 'true';

  useEffect(() => {
    if (!useUnifiedBand) return;
    document.documentElement.classList.add('unified-band-page');
    return () => document.documentElement.classList.remove('unified-band-page');
  }, [useUnifiedBand]);

  return <HomeDesktop useUnifiedBand={useUnifiedBand} />;
}
