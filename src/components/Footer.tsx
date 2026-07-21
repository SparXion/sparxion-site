import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <p className="site-footer__name">SparXion</p>
          <p className="site-footer__tagline">Spark × Action = Discovery</p>
        </div>

        <div className="site-footer__contact">
          <a href="mailto:john@sparxion.com">john@sparxion.com</a>
          <span className="site-footer__sep" aria-hidden="true">
            ·
          </span>
          <span>Cincinnati, Ohio</span>
          <span className="site-footer__sep" aria-hidden="true">
            ·
          </span>
          <Link to="/contact">Contact</Link>
        </div>

        <p className="site-footer__copy">
          © {new Date().getFullYear()} SparXion
        </p>
      </div>
    </footer>
  );
}
