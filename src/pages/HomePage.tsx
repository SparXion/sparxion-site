import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { LandingHero } from '../components/LandingHero';
import { UNIFIED_BAND_PAGE_WIDTH_CSS } from '../lib/unifiedBandLayout';

export function HomePage() {
  const [searchParams] = useSearchParams();
  const useUnifiedBand =
    searchParams.get('unified') === '1' || searchParams.get('unified') === 'true';

  useEffect(() => {
    if (!useUnifiedBand) return;
    document.documentElement.classList.add('unified-band-page');
    return () => document.documentElement.classList.remove('unified-band-page');
  }, [useUnifiedBand]);

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        backgroundColor: 'hsl(0, 0%, 100%)',
        position: 'relative',
        width: useUnifiedBand ? UNIFIED_BAND_PAGE_WIDTH_CSS : '100%',
        minHeight: useUnifiedBand ? '100vh' : undefined,
        overflowX: 'visible',
        overflowY: 'visible',
        boxSizing: 'border-box',
      }}
    >
      <LandingHero useUnifiedBand={useUnifiedBand} />

      <div style={{ 
        position: 'relative',
        bottom: 'auto',
        paddingBottom: '50px',
        left: '50%', 
        transform: 'translateX(-50%)', 
        zIndex: 10, 
        width: '100%', 
        maxWidth: '1200px',
        textAlign: 'center',
        paddingLeft: '20px',
        paddingRight: '20px',
        boxSizing: 'border-box'
      }}>
        {/* Tagline */}
        <p className="text-body mb-medium" style={{ color: '#000000' }}>
          delivering delight at human scale
        </p>
        
        {/* Primary CTAs - External Apps & Contact */}
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          justifyContent: 'center', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          marginBottom: '30px' 
        }}>
          <Link 
            to="/ucid" 
            className="btn text-body px-xlarge py-medium inline-block bg-white border-bold border-black hover:bg-black hover:text-white transition-standard"
          >
            Explore UCID App →
          </Link>
          <a 
            href="https://aitunerapp.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="btn text-body px-xlarge py-medium inline-block bg-white border-bold border-black hover:bg-black hover:text-white transition-standard"
          >
            AI Tuner App →
          </a>
          <Link 
            to="/contact"
            className="btn text-body px-xlarge py-medium inline-block bg-white border-bold border-black hover:bg-black hover:text-white transition-standard"
          >
            Contact →
          </Link>
        </div>

        {/* Internal Site Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '30px', 
          justifyContent: 'center', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          paddingTop: '30px', 
          borderTop: '1px solid #e0e0e0' 
        }}>
          <Link 
            to="/journey"
            className="text-body text-medium-gray hover:text-black transition-standard"
          >
            John's Journey
          </Link>
          <span className="text-medium-gray">•</span>
          <Link 
            to="/portfolio"
            className="text-body text-medium-gray hover:text-black transition-standard"
          >
            Portfolio
          </Link>
          <span className="text-medium-gray">•</span>
          <Link 
            to="/software"
            className="text-body text-medium-gray hover:text-black transition-standard"
          >
            Software
          </Link>
          <span className="text-medium-gray">•</span>
          <Link 
            to="/ethos"
            className="text-body text-medium-gray hover:text-black transition-standard"
          >
            Ethos
          </Link>
        </div>
      </div>
    </div>
  );
}
