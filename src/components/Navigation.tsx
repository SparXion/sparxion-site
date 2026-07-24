import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SparXionNavLogo } from './SparXionNavLogo';

export function Navigation() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  /** Home: show only while the scroll cue is visible (`html.home-nav-visible`). */
  const [homeNavVisible, setHomeNavVisible] = useState(false);

  useEffect(() => {
    if (!isHomePage) {
      setHomeNavVisible(true);
      return;
    }
    const sync = () => {
      setHomeNavVisible(
        document.documentElement.classList.contains('home-nav-visible'),
      );
    };
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => obs.disconnect();
  }, [isHomePage, location.hash]);

  const navItems = [
    { label: 'Journey', path: '/journey' },
    { label: 'Resume', path: '/resume' },
    { label: 'Ethos', path: '/ethos' },
    { label: 'Contact', path: '/contact' },
  ];

  const hideHomeNav = isHomePage && !homeNavVisible;

  return (
    <nav
      className={['site-nav', isHomePage ? 'site-nav--home' : '']
        .filter(Boolean)
        .join(' ')}
      aria-label="Primary"
      aria-hidden={hideHomeNav ? true : undefined}
    >
      <div className="site-nav__inner">
        <Link
          to="/"
          className="site-nav__logo"
          aria-label="SparXion home"
          tabIndex={hideHomeNav ? -1 : undefined}
        >
          <SparXionNavLogo className="site-nav__logo-mark--ink" />
        </Link>
        <div className="site-nav__links">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              tabIndex={hideHomeNav ? -1 : undefined}
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
