const siteUrl = 'https://www.hr-lider.kz';

const staticRoutes = [
  '',
  '/services',
  '/services/obuchenie-soglasitelnoi-komissii',
  '/services/hr-audit',
  '/services/kadrovyj-autsorsing',
  '/services/kadrovoe-deloproizvodstvo',
  '/services/obuchenie-kadrovomu-deloproizvodstvu',
  '/services/soprovozhdenie-soglasitelnoi-komissii',
  '/services/podgotovka-k-proverkam',
  '/services/razrabotka-kadrovyh-dokumentov',
  '/events',
  '/articles',
  '/articles/zachem-obuchat-soglasitelnuyu-komissiyu',
  '/about',
  '/contacts'
];

export default function sitemap() {
  const now = new Date();

  return staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route.includes('obuchenie-soglasitelnoi-komissii') ? 0.95 : 0.7
  }));
}
