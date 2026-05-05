import { ProcessPhase } from '../types/domain';

export function EthosPage() {
  const processPhases: ProcessPhase[] = ['Discovery', 'Synthesis', 'Production', 'Delight'];
  
  const ethosStatement = {
    tagline: "Delight delivered at human scale.",
    supportingParagraphs: [
      "Every project begins with a spark—an initial creative idea, insight, or human need.",
      "Through disciplined action—synthesis and production—that spark becomes a delivered instrument of delight.",
      "The outcome is measurable: users feel more capable, joyful, empowered, or more themselves.",
    ]
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-[1600px] mx-auto px-medium py-xlarge">
        <h1 className="text-h1 mb-large">Ethos</h1>
        
        <div className="mb-xlarge">
          <h2 className="text-h2 mb-medium">{ethosStatement.tagline}</h2>
          {ethosStatement.supportingParagraphs.map((para, idx) => (
            <p key={idx} className="text-body mb-small text-medium-gray">
              {para}
            </p>
          ))}
        </div>

        <div className="border-t border-gray pt-xlarge">
          <h2 className="text-h2 mb-large">Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-medium">
            {processPhases.map((phase) => (
              <div key={phase} className="border border-gray p-medium rounded-card">
                <h3 className="text-h3 mb-small">{phase}</h3>
                <p className="text-small text-medium-gray">
                  {/* Phase description will go here */}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
