export function ContactPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-[1600px] mx-auto px-medium py-xlarge">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-h1 mb-large">Contact</h1>
          <p className="text-body text-medium-gray mb-xlarge">
            Let's connect. Whether you're interested in collaboration, have questions,
            or want to explore how we can work together.
          </p>

          <div className="space-y-large">
            <div>
              <h2 className="text-h2 mb-small">Email</h2>
              <a 
                href="mailto:john@sparxion.com"
                className="text-body text-black hover:text-dark-gray transition-standard"
              >
                john@sparxion.com
              </a>
            </div>

            <div>
              <h2 className="text-h2 mb-small">Location</h2>
              <p className="text-body text-medium-gray">Cincinnati, Ohio</p>
            </div>

            <div>
              <h2 className="text-h2 mb-small">Connect</h2>
              <div className="flex gap-medium mt-small">
                <a
                  href="https://ucid-app.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body text-medium-gray hover:text-black transition-standard"
                >
                  UCID App
                </a>
                <span className="text-medium-gray">•</span>
                <a
                  href="https://aitunerapp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body text-medium-gray hover:text-black transition-standard"
                >
                  AI Tuner
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
