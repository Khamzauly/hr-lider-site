import Script from 'next/script';
import {
  buildGoogleAnalyticsScripts,
  buildMicrosoftClarityScript,
} from './lib/analytics-scripts.js';

export default function AnalyticsScripts() {
  const gaScripts = buildGoogleAnalyticsScripts(
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || process.env.NEXT_PUBLIC_GA_ID,
    process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID ||
      process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ||
      process.env.NEXT_PUBLIC_GOOGLE_ADS_TAG_ID
  );
  const clarityScript = buildMicrosoftClarityScript(
    process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || process.env.NEXT_PUBLIC_MICROSOFT_CLARITY_ID
  );

  if (!gaScripts && !clarityScript) return null;

  return (
    <>
      {gaScripts && (
        <>
          <Script src={gaScripts.src} strategy="afterInteractive" />
          <Script
            id="ga4-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: gaScripts.inline }}
          />
        </>
      )}
      {clarityScript && (
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: clarityScript }}
        />
      )}
    </>
  );
}
