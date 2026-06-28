import Script from 'next/script';
import { buildGoogleAnalyticsScripts } from './lib/analytics-scripts.js';

export default function AnalyticsScripts() {
  const scripts = buildGoogleAnalyticsScripts(
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || process.env.NEXT_PUBLIC_GA_ID
  );

  if (!scripts) return null;

  return (
    <>
      <Script src={scripts.src} strategy="afterInteractive" />
      <Script
        id="ga4-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: scripts.inline }}
      />
    </>
  );
}
