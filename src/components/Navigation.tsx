import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { isVioletStagePath } from '../lib/violetStage';
import { SparXionNavLogo } from './SparXionNavLogo';

export function Navigation() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isVioletStage = isVioletStagePath(location.pathname);
  /** Home: transparent over the video, solid violet once the video leaves the viewport. */
  const [overVioletHero, setOverVioletHero] = useState(true);

  useEffect(() => {
    if (!isHomePage) {
      setOverVioletHero(false);
      return;
    }
    const hero = document.querySelector('.home-hero');
    if (!hero) {
      setOverVioletHero(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setOverVioletHero(Boolean(entry?.isIntersecting)),
      { root: null, threshold: 0.12 },
    );
    io.observe(hero);
    return () => io.disconnect();
  }, [isHomePage, location.hash]);

  /** Light brand logo on home + Journey / Ethos / Contact — never ink on those surfaces. */
  const useLightLogo = isHomePage || isVioletStage;

  const navItems = [
    { label: "John's Journey", path: '/journey' },
    { label: 'Ethos', path: '/ethos' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <nav
      className={[
        'site-nav',
        isHomePage ? 'site-nav--home' : '',
        isHomePage && !overVioletHero ? 'site-nav--home-scrolled' : '',
        isVioletStage && !isHomePage ? 'site-nav--violet' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="Primary"
    >
      <div className="site-nav__inner">
        <Link to="/" className="site-nav__logo" aria-label="SparXion home">
          <SparXionNavLogo
            className={useLightLogo ? 'site-nav__logo-mark--light' : 'site-nav__logo-mark--ink'}
          />
        </Link>
        <div className="site-nav__links">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={
                location.pathname === item.path ||
                location.pathname.startsWith(`${item.path}/`)
                  ? 'site-nav__link site-nav__link--active'
                  : 'site-nav__link'
              }
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
