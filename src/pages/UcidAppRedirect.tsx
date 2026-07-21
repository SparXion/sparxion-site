import { useEffect } from 'react';
import { UCID_APP_URL } from '../lib/ucidAppUrl';

/** Sends visitors to the live UCID app (ucidapp.netlify.app). */
export function UcidAppRedirect() {
  useEffect(() => {
    window.location.replace(UCID_APP_URL);
  }, []);

  return (
    <div className="min-h-[40vh] flex items-center justify-center px-medium">
      <p className="text-body text-medium-gray">
        Opening UCID App…{' '}
        <a href={UCID_APP_URL} className="text-black underline">
          Continue here
        </a>
      </p>
    </div>
  );
}
