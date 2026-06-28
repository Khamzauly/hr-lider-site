import { prisma } from '../lib/prisma.js';

const siteUrl = 'https://www.hr-lider.kz';

const fallbackRoutes = [
  '',
  '/services',
  '/services/obuchenie-soglasitelnoi-komissii',
  '/services/kadrovoe-deloproizvodstvo',
  '/services/hr-audit',
  '/services/kadrovyj-autsorsing',
  '/services/obuchenie-kadrovomu-deloproizvodstvu',
  '/services/soprovozhdenie-soglasitelnoi-komissii',
  '/services/podgotovka-k-proverkam',
  '/services/razrabotka-kadrovyh-dokumentov',
  '/events',
  '/events/obuchenie-soglasitelnoy-komissii-dlya-rabotodateley',
  '/events/kadrovoe-deloproizvodstvo-kak-podgotovitsya-k-proverke',
  '/articles',
  '/articles/oshibki-rabotodateley-pri-sozdanii-soglasitelnoy-komissii',
  '/articles/kogda-kompanii-nuzhen-kadrovyy-autsorsing',
  '/articles/chto-delat-rabotodatelyu-pri-trudovom-spore-s-sotrudnikom',
  '/articles/kadrovoe-deloproizvodstvo-chto-dolzhno-byt-v-poryadke-do-proverki',
  '/articles/hr-audit-kakie-kadrovye-riski-chasche-vsego-nahodyat-v-kompaniyah',
  '/articles/kak-rabotaet-soglasitelnaya-komissiya-v-kompanii',
  '/articles/zachem-rabotodatelyu-obuchat-soglasitelnuyu-komissiyu',
  '/about',
  '/contacts'
];

function normalizeRoute(route) {
  if (!route || route === '/') return '';
  return `/${String(route).replace(/^\/+/, '').replace(/\/+$/, '')}`;
}

function priorityForRoute(route) {
  if (route === '') return 1;
  if (route.includes('obuchenie-soglasitelnoi-komissii')) return 0.95;
  if (route === '/services' || route === '/contacts') return 0.85;
  if (route.startsWith('/services/')) return 0.8;
  if (route === '/articles' || route === '/events') return 0.75;
  return 0.7;
}

function changeFrequencyForRoute(route) {
  if (route === '') return 'weekly';
  if (route === '/articles' || route === '/events') return 'weekly';
  if (route.startsWith('/articles/') || route.startsWith('/events/')) return 'monthly';
  return 'monthly';
}

function addRoute(routes, route, lastModified) {
  const normalizedRoute = normalizeRoute(route);
  routes.set(normalizedRoute, {
    url: `${siteUrl}${normalizedRoute}`,
    lastModified,
    changeFrequency: changeFrequencyForRoute(normalizedRoute),
    priority: priorityForRoute(normalizedRoute)
  });
}

async function getPublishedRoutesFromDb() {
  if (!process.env.DATABASE_URL) return [];

  try {
    const [services, articles, events] = await Promise.all([
      prisma.service.findMany({
        where: { status: 'PUBLISHED' },
        select: { slug: true, updatedAt: true }
      }),
      prisma.article.findMany({
        where: { status: 'PUBLISHED' },
        select: { slug: true, updatedAt: true, publishedAt: true }
      }),
      prisma.event.findMany({
        where: { status: 'PUBLISHED' },
        select: { slug: true, updatedAt: true }
      })
    ]);

    return [
      ...services.map((item) => ({ route: `/services/${item.slug}`, lastModified: item.updatedAt })),
      ...articles.map((item) => ({ route: `/articles/${item.slug}`, lastModified: item.updatedAt || item.publishedAt })),
      ...events.map((item) => ({ route: `/events/${item.slug}`, lastModified: item.updatedAt }))
    ];
  } catch (_error) {
    return [];
  }
}

export default async function sitemap() {
  const now = new Date();
  const routes = new Map();

  fallbackRoutes.forEach((route) => addRoute(routes, route, now));

  const dynamicRoutes = await getPublishedRoutesFromDb();
  dynamicRoutes.forEach(({ route, lastModified }) => addRoute(routes, route, lastModified || now));

  return Array.from(routes.values()).sort((a, b) => a.url.localeCompare(b.url));
}
