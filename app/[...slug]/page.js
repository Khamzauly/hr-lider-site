import SpaApp from '../SpaApp';
import { prisma } from '../../lib/prisma.js';
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildCourseJsonLd,
  buildEventJsonLd,
  buildFaqPageJsonLd,
  buildServiceJsonLd,
  stripHtml,
} from '../lib/structured-data.js';

const siteUrl = 'https://www.hr-lider.kz';

const commissionTrainingFaqs = [
  {
    question: 'Кто должен проходить обучение согласительной комиссии?',
    answer:
      'Обучение полезно членам согласительной комиссии со стороны работодателя и работников, а также HR, кадровикам и юристам, которые сопровождают индивидуальные трудовые споры.',
  },
  {
    question: 'Как часто нужно обновлять знания членов комиссии?',
    answer:
      'Знания важно обновлять регулярно, особенно после изменений в трудовом законодательстве, внутренних процедурах компании или состава согласительной комиссии.',
  },
  {
    question: 'Можно ли провести корпоративное обучение для одной компании?',
    answer:
      'Да, корпоративный формат подходит, если нужно обучить комиссию, HR-команду и руководителей на внутренних документах, вопросах и типовых ситуациях компании.',
  },
];

function isCommissionTrainingPath(path) {
  return path === 'services/obuchenie-soglasitelnoi-komissii';
}

function isCourseLike(record) {
  const text = `${record.item.title || ''} ${record.item.shortDescription || ''} ${record.item.excerpt || ''}`.toLowerCase();
  return text.includes('обуч') || text.includes('согласительн');
}

const titlesByPath = {
  services: {
    title: 'Услуги HR Lider: обучение, HR-аудит и кадровый аутсорсинг',
    description:
      'Услуги HR Lider для работодателей Казахстана: обучение согласительных комиссий, кадровое делопроизводство, HR-аудит, аутсорсинг и подготовка к проверкам.',
  },
  'services/obuchenie-soglasitelnoi-komissii': {
    title: 'Обучение согласительной комиссии в Казахстане - курс для работодателей и HR',
    description:
      'Практическое обучение членов согласительной комиссии: трудовое законодательство РК, порядок работы комиссии, документы, переговоры, кейсы и сертификат.',
  },
  'services/hr-audit': {
    title: 'HR-аудит и проверка кадровых документов в Казахстане',
    description:
      'Проверяем кадровые документы и процедуры, выявляем риски, готовим план исправлений и рекомендации для работодателя.',
  },
  'services/kadrovyj-autsorsing': {
    title: 'Кадровый аутсорсинг для компаний в Казахстане - документы, сроки, сопровождение',
    description:
      'Регулярное кадровое сопровождение: документы, сроки, шаблоны, консультации и внешний контроль кадрового порядка.',
  },
  events: {
    title: 'Мероприятия и обучение HR Lider для работодателей Казахстана',
    description:
      'Обучение согласительных комиссий, кадровиков и HR-специалистов. Открытые группы, корпоративное обучение и индивидуальные консультации.',
  },
  articles: {
    title: 'Статьи HR Lider о кадровых документах, трудовых спорах и HR-аудите',
    description:
      'Практические материалы для работодателей Казахстана: согласительная комиссия, кадровые документы, HR-аудит, трудовые споры и проверки.',
  },
  about: {
    title: 'О компании HR Lider - кадровое сопровождение и обучение работодателей',
    description:
      'HR Lider помогает работодателям Казахстана выстраивать кадровые процессы, обучать сотрудников и снижать риски по кадровым документам.',
  },
  contacts: {
    title: 'Контакты HR Lider - консультация по обучению и HR-аудиту',
    description:
      'Свяжитесь с HR Lider, чтобы получить программу обучения согласительной комиссии, заказать HR-аудит или обсудить кадровое сопровождение.',
  },
};

function pathFromParams(params) {
  const slug = params?.slug;
  return Array.isArray(slug) ? slug.join('/') : '';
}

async function getPublishedRecord(path) {
  const [section, slug] = path.split('/');
  if (!slug) return null;

  try {
    if (section === 'services') {
      const item = await prisma.service.findFirst({
        where: { slug, status: 'PUBLISHED' },
      });
      return item ? { type: 'service', item } : null;
    }

    if (section === 'articles') {
      const item = await prisma.article.findFirst({
        where: { slug, status: 'PUBLISHED' },
      });
      return item ? { type: 'article', item } : null;
    }

    if (section === 'events') {
      const item = await prisma.event.findFirst({
        where: { slug, status: 'PUBLISHED' },
      });
      return item ? { type: 'event', item } : null;
    }
  } catch (error) {
    return null;
  }

  return null;
}

function descriptionFromRecord(record) {
  const item = record.item;

  if (record.type === 'service') {
    return stripHtml(item.shortDescription || item.fullDescription).slice(0, 300);
  }

  if (record.type === 'article') {
    return stripHtml(item.excerpt || item.content).slice(0, 300);
  }

  if (record.type === 'event') {
    return stripHtml(item.excerpt || item.description).slice(0, 300);
  }

  return undefined;
}

function baseRecordTitle(record) {
  const suffix = ' - HR Lider';
  const title = String(record.item.title || '').trim();
  return title.endsWith(suffix) ? title.slice(0, -suffix.length) : title;
}

function titleFromRecord(record) {
  const title = baseRecordTitle(record);
  if (record.type === 'event') return `${title} - мероприятие HR Lider`;
  return `${title} - HR Lider`;
}

function jsonLdFromRecord(record, path) {
  if (record.type === 'service') {
    const items = [buildServiceJsonLd(siteUrl, record.item)];
    if (isCourseLike(record)) {
      items.push(buildCourseJsonLd(siteUrl, record.item, `/${path}`));
    }
    return items;
  }

  if (record.type === 'article') return [buildArticleJsonLd(siteUrl, record.item)];

  if (record.type === 'event') {
    const items = [buildEventJsonLd(siteUrl, record.item)];
    if (isCourseLike(record)) {
      items.push(buildCourseJsonLd(siteUrl, record.item, `/${path}`));
    }
    return items;
  }

  return [];
}

async function buildPageJsonLd(path) {
  const data = [buildBreadcrumbJsonLd(siteUrl, `/${path}`)];
  const record = await getPublishedRecord(path);

  if (record) {
    data.push(...jsonLdFromRecord(record, path));
  }

  if (isCommissionTrainingPath(path)) {
    const faqJsonLd = buildFaqPageJsonLd(commissionTrainingFaqs);
    if (faqJsonLd) data.push(faqJsonLd);
  }

  return data;
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const path = pathFromParams(resolvedParams);
  const record = await getPublishedRecord(path);

  if (record) {
    return {
      title: { absolute: titleFromRecord(record) },
      description: descriptionFromRecord(record),
      alternates: { canonical: `/${path}` },
      openGraph: {
        title: titleFromRecord(record),
        description: descriptionFromRecord(record),
        url: `${siteUrl}/${path}`,
        siteName: 'HR Lider',
        locale: 'ru_KZ',
        type: record.type === 'article' ? 'article' : 'website',
      },
    };
  }

  const item = titlesByPath[path];

  if (item) {
    return {
      ...item,
      alternates: { canonical: `/${path}` },
    };
  }

  if (path.startsWith('events/')) {
    return {
      title: 'Обучение и мероприятия HR Lider',
      description:
        'Программа обучения HR Lider для работодателей, кадровиков, HR-специалистов и членов согласительных комиссий.',
      alternates: { canonical: `/${path}` },
    };
  }

  if (path.startsWith('articles/')) {
    return {
      title: 'Материал HR Lider о кадровом порядке и трудовых спорах',
      description:
        'Экспертный материал HR Lider для работодателей Казахстана о кадровых документах, согласительной комиссии, HR-аудите и трудовых рисках.',
      alternates: { canonical: `/${path}` },
    };
  }

  return {
    title: 'HR Lider',
    description:
      'HR Lider: обучение согласительных комиссий, HR-аудит и кадровое сопровождение работодателей в Казахстане.',
    alternates: { canonical: `/${path}` },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function SpaRoute({ params }) {
  const resolvedParams = await params;
  const path = pathFromParams(resolvedParams);
  const jsonLd = await buildPageJsonLd(path);

  return (
    <>
      {jsonLd.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
      <SpaApp />
    </>
  );
}
