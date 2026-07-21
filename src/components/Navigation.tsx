import { Link, useLocation } from 'react-router-dom';
import { isVioletStagePath } from '../lib/violetStage';

export function Navigation() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isVioletStage = isVioletStagePath(location.pathname);

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
        isVioletStage && !isHomePage ? 'site-nav--violet' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="Primary"
    >
      <div className="site-nav__inner">
        <Link to="/" className="site-nav__logo" aria-label="SparXion home">
          {isVioletStage ? (
            <span className="site-nav__wordmark">SparXion</span>
          ) : (
            <span className="site-nav__wordmark site-nav__wordmark--ink">SparXion</span>
          )}
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
