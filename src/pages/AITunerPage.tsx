export function AITunerPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1600px] mx-auto px-medium py-xlarge">
        <div className="text-center mb-xlarge">
          <h1 className="text-h1 mb-large">AI Tuner</h1>
          <p className="text-body text-medium-gray mb-large max-w-2xl mx-auto">
            Visual AI response customization tool. Compare and tune AI model outputs
            to deliver delight at human scale.
          </p>
          <a
            href="https://aitunerapp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn text-body px-xlarge py-medium inline-block bg-black text-white hover:bg-dark-gray transition-standard"
          >
            Launch AI Tuner →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-large mt-xlarge">
          <div className="border border-gray p-large rounded-card">
            <h2 className="text-h2 mb-small">Features</h2>
            <ul className="text-body text-medium-gray space-y-tiny">
              <li>Compare multiple AI models</li>
              <li>Visual customization interface</li>
              <li>Real-time response tuning</li>
              <li>Export and share configurations</li>
            </ul>
          </div>
          
          <div className="border border-gray p-large rounded-card">
            <h2 className="text-h2 mb-small">Impact</h2>
            <p className="text-body text-medium-gray">
              Empowering users to shape AI responses to their needs, making AI tools
              more intuitive and human-scaled.
            </p>
          </div>
        </div>

        <div className="mt-xlarge text-center">
          <a 
            href="/journey"
            className="text-body text-medium-gray hover:text-black transition-standard"
          >
            ← Back to Journey
          </a>
        </div>
      </div>
    </div>
  );
}
