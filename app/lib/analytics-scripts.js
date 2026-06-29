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
