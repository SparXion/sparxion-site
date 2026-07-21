import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SparXionNavLogo } from './SparXionNavLogo';

export function Navigation() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  /** Home: transparent over the video, solid white once the video leaves the viewport. */
  const [overHero, setOverHero] = useState(true);

  useEffect(() => {
    if (!isHomePage) {
      setOverHero(false);
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
        isHomePage && !overHero ? 'site-nav--home-scrolled' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="Primary"
    >
      <div className="site-nav__inner">
        <Link to="/" className="site-nav__logo" aria-label="SparXion home">
          <SparXionNavLogo className="site-nav__logo-mark--ink" />
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
