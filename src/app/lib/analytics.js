function cleanId(value) {
  return String(value || '').trim();
}

function googleAdsId() {
  return cleanId(
    process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID ||
      process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ||
      process.env.NEXT_PUBLIC_GOOGLE_ADS_TAG_ID
  );
}

function googleAdsConversionLabel(kind) {
  if (kind === 'contact') {
    return cleanId(process.env.NEXT_PUBLIC_GOOGLE_ADS_CONTACT_CONVERSION_LABEL);
  }

  if (kind === 'event_registration') {
    return cleanId(
      process.env.NEXT_PUBLIC_GOOGLE_ADS_EVENT_REGISTRATION_CONVERSION_LABEL ||
        process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_LABEL
    );
  }

  return cleanId(process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_LABEL);
}

function hasGoogleClickId(attribution = {}) {
  return Boolean(attribution?.gclid || attribution?.gbraid || attribution?.wbraid);
}

function attributionEventParams(attribution = {}) {
  const params = {
    utm_source: attribution?.utm_source || undefined,
    utm_medium: attribution?.utm_medium || undefined,
    utm_campaign: attribution?.utm_campaign || undefined,
  };

  if (hasGoogleClickId(attribution)) params.has_google_click_id = true;
  return params;
}

export function trackEvent(eventName, params = {}) {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
  );

  if (typeof window === 'undefined') return false;

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, cleanParams);
    return true;
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: eventName, ...cleanParams });
    return true;
  }

  return false;
}

export function trackGoogleAdsConversion(kind, params = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return false;

  const adsId = googleAdsId();
  const label = googleAdsConversionLabel(kind);
  if (!adsId || !label) return false;

  window.gtag('event', 'conversion', {
    send_to: `${adsId}/${label}`,
    ...params,
  });
  return true;
}

export function trackLeadSubmit(source, attribution = {}) {
  const tracked = trackEvent('lead_submit', {
    source,
    ...attributionEventParams(attribution),
  });

  trackGoogleAdsConversion('lead', {
    event_category: 'lead',
    event_label: source,
  });

  return tracked;
}

export function trackEventRegistration(eventSlug, attribution = {}) {
  const tracked = trackEvent('event_registration_submit', {
    event_slug: eventSlug,
    ...attributionEventParams(attribution),
  });

  trackGoogleAdsConversion('event_registration', {
    event_category: 'event_registration',
    event_label: eventSlug,
  });

  return tracked;
}

export function trackContactClick(method, location = 'unknown', attribution = {}) {
  const tracked = trackEvent('contact_click', {
    method,
    location,
    ...attributionEventParams(attribution),
  });

  trackGoogleAdsConversion('contact', {
    event_category: 'contact_click',
    event_label: `${method}:${location}`,
  });

  return tracked;
}

export function trackCtaClick(label, location = 'unknown') {
  return trackEvent('cta_click', { label, location });
}
