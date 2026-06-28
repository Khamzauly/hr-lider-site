import { prisma } from '../lib/prisma.js';
import { buildFaqPageJsonLd } from './lib/structured-data.js';
import { HomePage } from './components/PublicPages.jsx';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'HR Lider - обучение согласительных комиссий, HR-аудит и кадровый аутсорсинг в Казахстане',
  description:
    'Обучаем членов согласительных комиссий, кадровиков и HR-специалистов. Проводим HR-аудит, проверяем кадровые документы и помогаем снизить риски трудовых споров.',
  alternates: {
    canonical: '/'
  }
};

async function getPublishedFaqs() {
  if (!process.env.DATABASE_URL) return [];

  try {
    return await prisma.fAQ.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { order: 'asc' },
      take: 20,
    });
  } catch (_error) {
    return [];
  }
}

export default async function Page() {
  const faqJsonLd = buildFaqPageJsonLd(await getPublishedFaqs());

  return (
    <>
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <HomePage />
    </>
  );
}
