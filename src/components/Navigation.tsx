import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SparXionNavLogo } from './SparXionNavLogo';

export function Navigation() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  /** Home: transparent over the video, solid white once the video leaves the viewport. */
  const [overHero, setOverHero] = useState(true);
  /** Hide chrome while the scroll-morph / band stage owns the screen. */
  const [inBandStage, setInBandStage] = useState(false);

  useEffect(() => {
    if (!isHomePage) {
      setOverHero(false);
      setInBandStage(false);
      return;
    }
    const hero = document.querySelector('.home-hero');
    if (!hero) {
      setOverHero(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setOverHero(Boolean(entry?.isIntersecting)),
      { root: null, threshold: 0.12 },
    );
    io.observe(hero);
    return () => io.disconnect();
  }, [isHomePage, location.hash]);

  useEffect(() => {
    if (!isHomePage) {
      setInBandStage(false);
      return;
    }
    const morph = document.querySelector('.home-morph');
    if (!morph) {
      setInBandStage(false);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        setInBandStage(
          Boolean(entry?.isIntersecting && entry.intersectionRatio >= 0.35),
        );
      },
      { root: null, threshold: [0, 0.35, 0.6, 1] },
    );
    io.observe(morph);
    return () => io.disconnect();
  }, [isHomePage, location.hash]);

  const navItems = [
    { label: 'Journey', path: '/journey' },
    { label: 'Ethos', path: '/ethos' },
    { label: 'Contact', path: '/contact' },
  ];

  const hideForBand = isHomePage && inBandStage;

  return (
    <nav
      className={[
        'site-nav',
        isHomePage ? 'site-nav--home' : '',
        isHomePage && !overHero ? 'site-nav--home-scrolled' : '',
        hideForBand ? 'site-nav--band-hidden' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="Primary"
      aria-hidden={hideForBand ? true : undefined}
    >
      <div className="site-nav__inner">
        <Link
          to="/"
          className="site-nav__logo"
          aria-label="SparXion home"
          tabIndex={hideForBand ? -1 : undefined}
        >
          <SparXionNavLogo className="site-nav__logo-mark--ink" />
        </Link>
        <div className="site-nav__links">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              tabIndex={hideForBand ? -1 : undefined}
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
