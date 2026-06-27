import '../src/styles/index.css';

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

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'HR Lider',
  url: siteUrl,
  email: 'info@hr-lider.kz',
  areaServed: 'KZ',
  logo: `${siteUrl}/images/hr-lider-main-logo.png`,
  sameAs: []
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
