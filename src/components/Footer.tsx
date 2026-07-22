export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner site-footer__inner--minimal">
        <p className="site-footer__copy">
          © {new Date().getFullYear()} SparXion
        </p>
      </div>
    </footer>
  );
}
