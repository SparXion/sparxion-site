import { Link } from 'react-router-dom';

export function UCIDPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-[1600px] mx-auto px-medium py-xlarge">
        <div className="text-center mb-xlarge">
          <h1 className="text-h1 mb-large">UCID App</h1>
          <p className="text-body text-medium-gray mb-large max-w-2xl mx-auto">
            Full-stack career exploration app for industrial design students.
            Connecting students with careers, companies, and opportunities.
          </p>
          <a
            href="https://ucid-app.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn text-body px-xlarge py-medium inline-block bg-black text-white hover:bg-dark-gray transition-standard"
          >
            Launch UCID App →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-large mt-xlarge">
          <div className="border border-gray p-large rounded-card">
            <h2 className="text-h2 mb-small">Tech Stack</h2>
            <ul className="text-body text-medium-gray space-y-tiny">
              <li>React/TypeScript frontend</li>
              <li>Node.js backend</li>
              <li>Prisma ORM</li>
              <li>Docker deployment</li>
            </ul>
          </div>
          
          <div className="border border-gray p-large rounded-card">
            <h2 className="text-h2 mb-small">Impact</h2>
            <p className="text-body text-medium-gray">
              Helping industrial design students discover career paths and connect with opportunities.
            </p>
          </div>
        </div>

        <div className="mt-xlarge text-center">
          <Link 
            to="/journey" 
            className="text-body text-medium-gray hover:text-black transition-standard"
          >
            ← Back to Journey
          </Link>
        </div>
      </div>
    </div>
  );
}
