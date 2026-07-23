import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useHomeMobileFlow } from '../lib/useHomeMobileFlow';
import { HomeDesktop } from './HomeDesktop';
import { HomeMobile } from './HomeMobile';

export function HomePage() {
  const [searchParams] = useSearchParams();
  const useUnifiedBand =
    searchParams.get('unified') === '1' || searchParams.get('unified') === 'true';
  const isMobileFlow = useHomeMobileFlow();

  useEffect(() => {
    if (!useUnifiedBand) return;
    document.documentElement.classList.add('unified-band-page');
    return () => document.documentElement.classList.remove('unified-band-page');
  }, [useUnifiedBand]);

  if (isMobileFlow) {
    return <HomeMobile useUnifiedBand={useUnifiedBand} />;
  }

  return <HomeDesktop useUnifiedBand={useUnifiedBand} />;
}
