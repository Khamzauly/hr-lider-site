const COMPANY_NAME = 'HR Lider';
const DEFAULT_DESCRIPTION =
  'Обучение согласительных комиссий, HR-аудит, кадровое делопроизводство и кадровый аутсорсинг для работодателей в Казахстане.';

const breadcrumbNames = {
  services: 'Услуги',
  events: 'Мероприятия',
  articles: 'Статьи',
  about: 'О компании',
  contacts: 'Контакты',
  'hr-audit': 'HR-аудит',
  'obuchenie-soglasitelnoi-komissii': 'Обучение согласительной комиссии',
  'kadrovyj-autsorsing': 'Кадровый аутсорсинг',
};

export function stripHtml(value = '') {
  return String(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function absoluteUrl(siteUrl, path = '') {
  return `${siteUrl.replace(/\/$/, '')}/${String(path).replace(/^\//, '')}`.replace(/\/$/, '') || siteUrl;
}

function cleanText(...values) {
  return stripHtml(values.filter(Boolean).join(' ')) || DEFAULT_DESCRIPTION;
}

function publisher(siteUrl) {
  return {
    '@type': 'Organization',
    name: COMPANY_NAME,
    url: siteUrl,
    logo: `${siteUrl}/images/hr-lider-main-logo.png`,
  };
}

export function buildOrganizationJsonLd(siteUrl) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: COMPANY_NAME,
        url: siteUrl,
        email: 'info@hr-lider.kz',
        areaServed: 'KZ',
        logo: `${siteUrl}/images/hr-lider-main-logo.png`,
      },
      {
        '@type': 'WebSite',
        name: COMPANY_NAME,
        url: siteUrl,
        inLanguage: 'ru-KZ',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}/articles?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };
}

export function buildBreadcrumbJsonLd(siteUrl, path = '/') {
  const segments = String(path).split('/').filter(Boolean);
  const itemListElement = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Главная',
      item: siteUrl,
    },
  ];

  segments.forEach((segment, index) => {
    const route = segments.slice(0, index + 1).join('/');
    const fallbackName = segment
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

    itemListElement.push({
      '@type': 'ListItem',
      position: index + 2,
      name: breadcrumbNames[segment] || fallbackName,
      item: absoluteUrl(siteUrl, route),
    });
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  };
}

export function buildServiceJsonLd(siteUrl, service) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: cleanText(service.shortDescription, service.fullDescription),
    serviceType: service.title,
    areaServed: {
      '@type': 'Country',
      name: 'Kazakhstan',
    },
    provider: publisher(siteUrl),
    url: absoluteUrl(siteUrl, `/services/${service.slug}`),
  };
}

export function buildArticleJsonLd(siteUrl, article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: cleanText(article.excerpt, article.content).slice(0, 500),
    articleSection: article.category,
    inLanguage: 'ru-KZ',
    datePublished: article.publishedAt || article.createdAt,
    dateModified: article.updatedAt || article.publishedAt || article.createdAt,
    author: publisher(siteUrl),
    publisher: publisher(siteUrl),
    mainEntityOfPage: absoluteUrl(siteUrl, `/articles/${article.slug}`),
  };
}

export function buildEventJsonLd(siteUrl, event) {
  const isOnline = event.format === 'ONLINE';

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: cleanText(event.excerpt, event.description),
    startDate: event.startsAt,
    endDate: event.endsAt || event.startsAt,
    eventAttendanceMode: isOnline
      ? 'https://schema.org/OnlineEventAttendanceMode'
      : 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: isOnline
      ? {
          '@type': 'VirtualLocation',
          url: event.onlineUrl || siteUrl,
        }
      : {
          '@type': 'Place',
          name: event.city || 'Казахстан',
          address: event.city || 'Казахстан',
        },
    organizer: publisher(siteUrl),
    offers: {
      '@type': 'Offer',
      url: absoluteUrl(siteUrl, `/events/${event.slug}`),
      availability: event.registrationEnabled
        ? 'https://schema.org/InStock'
        : 'https://schema.org/SoldOut',
    },
    url: absoluteUrl(siteUrl, `/events/${event.slug}`),
  };
}
