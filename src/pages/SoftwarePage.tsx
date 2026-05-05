import { SoftwareGrid } from '../components/SoftwareGrid';

export function SoftwarePage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-[1600px] mx-auto px-medium py-large">
        <header className="mb-large max-w-3xl">
          <h1 className="text-h1 text-black mb-small">Software</h1>
          <p className="text-body text-medium-gray">
            Shipped apps, extensions, and tools — from grant-funded education products to commercial
            releases. Status reflects how far each project is from public access.
          </p>
        </header>
        <SoftwareGrid />
      </div>
    </div>
  );
}
