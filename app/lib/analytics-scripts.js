function cleanId(value) {
  return String(value || '').trim();
}

function uniqueIds(values) {
  return [...new Set(values.map(cleanId).filter(Boolean))];
}

export function buildGoogleAnalyticsScripts(measurementId, googleAdsId) {
  const ids = uniqueIds([measurementId, googleAdsId]);
  if (!ids.length) return null;

  const configLines = ids.map((id) => `gtag('config', '${id}');`).join('\n');

  return {
    src: `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ids[0])}`,
    inline: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
${configLines}
`.trim(),
  };
}

export function buildMicrosoftClarityScript(projectId) {
  const id = String(projectId || '').trim();
  if (!id) return null;

  if (!/^[a-z0-9]{5,64}$/i.test(id)) {
    return null;
  }

  return `
(function(c,l,a,r,i,t,y){
  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", ${JSON.stringify(id)});
`.trim();
}
