export function ContactPage() {
  return (
    <div className="violet-stage contact-page">
      <div className="violet-stage__inner contact-page__inner">
        <p className="violet-stage__eyebrow">Say hello</p>
        <h1 className="violet-stage__title contact-page__title">Let's connect.</h1>
        <p className="violet-stage__lede">
          Whether you're exploring collaboration, have a question, or want to
          talk through an idea — I'd love to hear from you.
        </p>

        <div className="contact-page__primary">
          <a href="mailto:john@sparxion.com" className="contact-page__email">
            john@sparxion.com
          </a>
          <p className="contact-page__hint">
            Best way to reach me — usually reply within a day or two.
          </p>
        </div>

        <dl className="contact-page__details">
          <div>
            <dt>Location</dt>
            <dd>Cincinnati, Ohio</dd>
          </div>
          <div>
            <dt>LinkedIn</dt>
            <dd>
              <a
                href="https://www.linkedin.com/in/john-violette"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-page__link"
              >
                linkedin.com/in/john-violette
              </a>
            </dd>
          </div>
          <div>
            <dt>Open to</dt>
            <dd>
              Design partnerships, product and AI tool collaborations, and
              conversations about building instruments of discovery.
            </dd>
          </div>
        </dl>

        <div className="contact-page__apps">
          <p className="contact-page__apps-label">Also exploring the products?</p>
          <div className="contact-page__apps-row">
            <a
              href="https://ucidapp.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              UCID App
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="https://aitunerapp.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              AI Tuner
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
