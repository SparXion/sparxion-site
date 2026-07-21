import { Link } from 'react-router-dom';

const cascade = [
  {
    title: 'Spark',
    body: 'Notice what others skip. Ask the question that unlocks the brief.',
  },
  {
    title: 'Action',
    body: 'Make, test, reduce, ship. Curiosity without motion is just opinion.',
  },
  {
    title: 'Discovery',
    body: 'The insight that makes the next move obvious — the reason the work moves forward.',
  },
] as const;

export function EthosPage() {
  return (
    <div className="violet-stage ethos-page">
      <div className="violet-stage__inner ethos-page__inner">
        <p className="violet-stage__eyebrow">Ethos</p>
        <h1 className="violet-stage__title ethos-page__equation">
          Spark × Action = Discovery
        </h1>

        <p className="violet-stage__lede">
          Solutions don't arrive fully formed. They come from curiosity meeting
          action — and staying with the problem until something true unlocks.
        </p>

        <ol className="ethos-page__cascade">
          {cascade.map((step) => (
            <li key={step.title} className="ethos-page__step">
              <h2 className="ethos-page__step-title">{step.title}.</h2>
              <p className="ethos-page__step-body">{step.body}</p>
            </li>
          ))}
        </ol>

        <p className="ethos-page__close">
          Bring me the problem. I'll find the spark, take the action, and leave
          you with discovery you can use.
        </p>

        <Link to="/contact" className="violet-stage__cta">
          Get in touch
        </Link>
      </div>
    </div>
  );
}
