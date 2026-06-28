export function trackEvent(eventName, params = {}) {
  if (typeof window === 'undefined') return false;

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
    return true;
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: eventName, ...params });
    return true;
  }

  return false;
}

export function trackLeadSubmit(source) {
  return trackEvent('lead_submit', { source });
}

export function trackEventRegistration(eventSlug) {
  return trackEvent('event_registration_submit', { event_slug: eventSlug });
}

export function trackContactClick(method, location = 'unknown') {
  return trackEvent('contact_click', { method, location });
}
