export function buildGoogleAnalyticsScripts(measurementId) {
  const id = String(measurementId || '').trim();
  if (!id) return null;

  return {
    src: `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`,
    inline: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}');
`.trim(),
  };
}
