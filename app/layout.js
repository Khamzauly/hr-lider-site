import '../src/styles/index.css';
import AnalyticsScripts from './AnalyticsScripts';
import { buildOrganizationJsonLd } from './lib/structured-data.js';

const siteUrl = 'https://www.hr-lider.kz';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'HR Lider - обучение согласительных комиссий, HR-аудит и кадровый аутсорсинг в Казахстане',
    template: '%s - HR Lider'
  },
  description:
    'Обучение согласительных комиссий, HR-аудит, кадровое делопроизводство и кадровый аутсорсинг для работодателей в Казахстане.',
  alternates: {
    canonical: '/'
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' }
    ],
    apple: [{ url: '/apple-touch-icon.png', type: 'image/png', sizes: '180x180' }],
    other: [
      { rel: 'icon', url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { rel: 'icon', url: '/icon-512.png', type: 'image/png', sizes: '512x512' }
    ]
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'HR Lider',
    title: 'HR Lider - обучение согласительных комиссий и кадровый порядок',
    description:
      'Обучаем членов согласительных комиссий, кадровиков и HR-специалистов. Проводим HR-аудит и помогаем снизить риски трудовых споров.',
    locale: 'ru_KZ'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1
    }
  },
  keywords: [
    'обучение согласительной комиссии',
    'согласительная комиссия Казахстан',
    'HR аудит Казахстан',
    'кадровый аутсорсинг Казахстан',
    'кадровое делопроизводство'
  ]
};

const organizationJsonLd = buildOrganizationJsonLd(siteUrl);

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <AnalyticsScripts />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
