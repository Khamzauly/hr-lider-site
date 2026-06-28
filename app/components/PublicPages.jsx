import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '../../lib/prisma.js';
import { stripHtml } from '../lib/structured-data.js';
import LeadFormClient, { EventRegistrationForm, TrackedContactLink } from './ConversionActions.jsx';

const DEFAULT_PHONE = '+7 701 432 21 11';
const SECONDARY_PHONE = '+7 707 281 70 60';
const DEFAULT_EMAIL = 'info@hr-lider.kz';
const DEFAULT_WHATSAPP = '+7 701 432 21 11';
const PUBLIC_LINKS = [
  ['/', 'Главная'],
  ['/services', 'Услуги'],
  ['/events', 'Мероприятия'],
  ['/articles', 'Статьи'],
  ['/about', 'О компании'],
  ['/contacts', 'Контакты'],
];

const recommendedServices = [
  {
    title: 'Обучение согласительной комиссии',
    href: '/services/obuchenie-soglasitelnoi-komissii',
    description: 'Курс для членов комиссии, HR и кадровиков по трудовым спорам и документам.',
  },
  {
    title: 'HR-аудит',
    href: '/services/hr-audit',
    description: 'Проверка кадровых документов, процедур и рисков перед спором или проверкой.',
  },
  {
    title: 'Кадровый аутсорсинг',
    href: '/services/kadrovyj-autsorsing',
    description: 'Регулярное сопровождение кадровых документов, сроков и процессов.',
  },
];

function hasDb() {
  return Boolean(process.env.DATABASE_URL);
}

async function safeQuery(query, fallback) {
  if (!hasDb()) return fallback;

  try {
    return await query();
  } catch (_error) {
    return fallback;
  }
}

export async function getSiteSettings() {
  const settings = await safeQuery(
    () => prisma.siteSettings.findUnique({ where: { id: 'main' } }),
    null,
  );

  return {
    phone: settings?.phone || DEFAULT_PHONE,
    secondaryPhone: SECONDARY_PHONE,
    email: settings?.email || DEFAULT_EMAIL,
    whatsapp: settings?.whatsapp || DEFAULT_WHATSAPP,
  };
}

async function getServices(take) {
  return safeQuery(
    () => prisma.service.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { order: 'asc' },
      ...(take ? { take } : {}),
    }),
    [],
  );
}

async function getService(slug) {
  return safeQuery(
    () => prisma.service.findFirst({ where: { slug, status: 'PUBLISHED' } }),
    null,
  );
}

async function getArticles(take) {
  return safeQuery(
    () => prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      ...(take ? { take } : {}),
    }),
    [],
  );
}

async function getArticle(slug) {
  return safeQuery(
    () => prisma.article.findFirst({ where: { slug, status: 'PUBLISHED' } }),
    null,
  );
}

async function getEvents(take, upcomingOnly = false) {
  return safeQuery(
    () => prisma.event.findMany({
      where: {
        status: 'PUBLISHED',
        ...(upcomingOnly ? { startsAt: { gte: new Date() } } : {}),
      },
      orderBy: { startsAt: 'asc' },
      ...(take ? { take } : {}),
    }),
    [],
  );
}

async function getEvent(slug) {
  return safeQuery(
    () => prisma.event.findFirst({ where: { slug, status: 'PUBLISHED' } }),
    null,
  );
}

async function getFaqs(take = 10) {
  return safeQuery(
    () => prisma.fAQ.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { order: 'asc' },
      take,
    }),
    [],
  );
}

async function getStats() {
  return safeQuery(
    () => prisma.siteStat.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { order: 'asc' },
    }),
    [],
  );
}

async function getTeam() {
  return safeQuery(
    () => prisma.teamMember.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { order: 'asc' },
    }),
    [],
  );
}

function onlyDigits(value = '') {
  return String(value).replace(/\D/g, '');
}

function phoneHref(phone) {
  const digits = onlyDigits(phone);
  if (!digits) return `tel:${onlyDigits(DEFAULT_PHONE)}`;
  return `tel:+${digits.startsWith('7') ? digits : `7${digits}`}`;
}

function whatsappHref(value) {
  const raw = String(value || DEFAULT_WHATSAPP).trim();
  if (/^https?:\/\//.test(raw)) return raw;
  const digits = onlyDigits(raw || DEFAULT_WHATSAPP);
  const phone = digits.startsWith('7') ? digits : `7${digits}`;
  return `https://wa.me/${phone}?text=${encodeURIComponent('Здравствуйте! Хочу получить консультацию HR Lider')}`;
}

function plain(value, limit) {
  const text = stripHtml(value || '');
  return limit ? text.slice(0, limit) : text;
}

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

function formatTimeRange(event) {
  if (!event?.startsAt || !event?.endsAt) return '';
  const start = new Date(event.startsAt);
  const end = new Date(event.endsAt);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return '';
  const formatter = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' });
  return `${formatter.format(start)} - ${formatter.format(end)}`;
}

function Section({ eyebrow, title, description, children, className = '', headingLevel = 'h2' }) {
  const TitleTag = headingLevel;
  return (
    <section className={`py-16 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(eyebrow || title || description) && (
          <div className="mb-10 max-w-3xl">
            {eyebrow && <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">{eyebrow}</p>}
            {title && <TitleTag className="text-3xl font-bold tracking-tight text-gray-950">{title}</TitleTag>}
            {description && <p className="mt-4 text-lg text-gray-600">{description}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

function PublicShell({ children }) {
  return (
    <div className="min-h-screen bg-white text-gray-950">
      <header className="border-b bg-white/95">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <Link href="/" className="text-2xl font-bold text-blue-700">
            HR Lider
          </Link>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-gray-700">
            {PUBLIC_LINKS.slice(1).map(([href, label]) => (
              <Link key={href} href={href} className="transition hover:text-blue-700">
                {label}
              </Link>
            ))}
            <Link href="/contacts" className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700">
              Получить консультацию
            </Link>
          </nav>
        </div>
      </header>
      {children}
      <footer className="border-t bg-gray-950 py-10 text-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <div className="text-xl font-bold">HR Lider</div>
            <p className="mt-3 text-sm text-gray-300">
              Обучение согласительных комиссий, HR-аудит, кадровое делопроизводство и сопровождение работодателей в Казахстане.
            </p>
          </div>
          <div>
            <div className="font-semibold">Разделы</div>
            <div className="mt-3 flex flex-col gap-2 text-sm text-gray-300">
              {PUBLIC_LINKS.slice(1).map(([href, label]) => (
                <Link key={href} href={href} className="hover:text-white">
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <div className="font-semibold">Связаться</div>
            <div className="mt-3 flex flex-col gap-2 text-sm text-gray-300">
              <a href={phoneHref(DEFAULT_PHONE)} className="hover:text-white">+7 701 432 21 11</a>
              <a href={phoneHref(SECONDARY_PHONE)} className="hover:text-white">+7 707 281 70 60</a>
              <a href="mailto:info@hr-lider.kz" className="hover:text-white">info@hr-lider.kz</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ContactActions({ settings, location = 'site', className = '' }) {
  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:flex-wrap ${className}`}>
      <TrackedContactLink
        href={whatsappHref(settings.whatsapp)}
        method="whatsapp"
        location={location}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center justify-center rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
      >
        Написать в WhatsApp
      </TrackedContactLink>
      <TrackedContactLink
        href={phoneHref(settings.phone)}
        method="phone"
        location={location}
        className="inline-flex items-center justify-center rounded-lg border-2 border-blue-600 px-6 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
      >
        Позвонить {settings.phone}
      </TrackedContactLink>
      <TrackedContactLink
        href={`mailto:${settings.email}`}
        method="email"
        location={location}
        className="inline-flex items-center justify-center rounded-lg border px-6 py-3 font-semibold text-gray-800 transition hover:bg-gray-50"
      >
        {settings.email}
      </TrackedContactLink>
    </div>
  );
}

function LeadSection({ title = 'Получить консультацию', description, source, settings }) {
  return (
    <section id="consultation" className="bg-blue-50 py-16">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-700">Заявка</p>
          <h2 className="text-3xl font-bold text-gray-950">{title}</h2>
          <p className="mt-4 text-lg text-gray-700">
            {description || 'Расскажите задачу: обучение комиссии, HR-аудит, кадровое сопровождение или подготовка к проверке. Мы подскажем формат и следующий шаг.'}
          </p>
          <ContactActions settings={settings} location={`${source}_lead_section`} className="mt-8" />
        </div>
        <LeadFormClient source={source} />
      </div>
    </section>
  );
}

function HtmlBlock({ html, className = '' }) {
  if (!html) return null;
  return (
    <div className={`prose max-w-none ${className}`} dangerouslySetInnerHTML={{ __html: html }} />
  );
}

function ServiceCards({ services }) {
  if (!services.length) return null;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <Link key={service.id} href={`/services/${service.slug}`} className="rounded-xl border bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
          <h3 className="text-xl font-semibold text-gray-950">{service.title}</h3>
          <p className="mt-3 text-gray-600">{plain(service.shortDescription, 220)}</p>
          <span className="mt-5 inline-block font-semibold text-blue-700">{service.ctaLabel || 'Подробнее'} →</span>
        </Link>
      ))}
    </div>
  );
}

function ArticleCards({ articles }) {
  if (!articles.length) return null;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {articles.map((article) => (
        <Link key={article.id} href={`/articles/${article.slug}`} className="rounded-xl border bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
          <div className="text-sm font-semibold text-blue-700">{article.category}</div>
          <h3 className="mt-2 text-xl font-semibold text-gray-950">{article.title}</h3>
          <p className="mt-3 text-gray-600">{plain(article.excerpt, 220)}</p>
          <span className="mt-5 inline-block font-semibold text-blue-700">Читать →</span>
        </Link>
      ))}
    </div>
  );
}

function EventCards({ events }) {
  if (!events.length) {
    return (
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-8 text-center">
        <h3 className="text-2xl font-semibold">Ближайшая открытая дата формируется</h3>
        <p className="mt-3 text-gray-700">
          Оставьте заявку, предложим дату открытой группы или проведём корпоративное обучение для вашей компании.
        </p>
        <Link href="/contacts" className="mt-6 inline-flex rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
          Оставить заявку
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {events.map((event) => (
        <Link key={event.id} href={`/events/${event.slug}`} className="rounded-xl border bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
          <div className="text-sm font-semibold text-blue-700">{formatDate(event.startsAt)}</div>
          <h3 className="mt-2 text-xl font-semibold text-gray-950">{event.title}</h3>
          <p className="mt-3 text-gray-600">{plain(event.excerpt || event.description, 220)}</p>
          <div className="mt-4 text-sm text-gray-500">{event.format === 'ONLINE' ? 'Онлайн' : event.city || 'Офлайн'}</div>
          <span className="mt-5 inline-block font-semibold text-blue-700">Подробнее →</span>
        </Link>
      ))}
    </div>
  );
}

function FaqList({ faqs }) {
  if (!faqs.length) return null;

  return (
    <div className="space-y-4">
      {faqs.map((faq) => (
        <details key={faq.id} className="rounded-xl border bg-white p-5">
          <summary className="cursor-pointer font-semibold text-gray-950">{faq.question}</summary>
          <p className="mt-3 text-gray-700">{plain(faq.answer)}</p>
        </details>
      ))}
    </div>
  );
}

export async function HomePage() {
  const [settings, services, events, articles, faqs, stats, team] = await Promise.all([
    getSiteSettings(),
    getServices(6),
    getEvents(3, true),
    getArticles(3),
    getFaqs(8),
    getStats(),
    getTeam(),
  ]);

  return (
    <PublicShell>
      <main>
        <section className="bg-gradient-to-b from-blue-50 to-white py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-700">HR Lider Казахстан</p>
              <h1 className="text-4xl font-bold tracking-tight text-gray-950 md:text-5xl">
                Обучение согласительных комиссий и кадровый порядок для работодателей Казахстана
              </h1>
              <p className="mt-6 text-xl text-gray-700">
                Обучаем членов согласительных комиссий, кадровиков и HR-специалистов. Проводим HR-аудит, проверяем кадровые документы, помогаем снизить риски трудовых споров и проверок.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link href="/services/obuchenie-soglasitelnoi-komissii" className="inline-flex justify-center rounded-lg bg-blue-600 px-7 py-3 font-semibold text-white hover:bg-blue-700">
                  Получить программу обучения
                </Link>
                <Link href="/services/hr-audit" className="inline-flex justify-center rounded-lg border-2 border-blue-600 px-7 py-3 font-semibold text-blue-700 hover:bg-blue-50">
                  Заказать HR-аудит
                </Link>
              </div>
              <ContactActions settings={settings} location="home_hero" className="mt-5" />
            </div>
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold">Когда HR Lider полезен</h2>
              <ul className="mt-5 space-y-3 text-gray-700">
                <li>✓ Нужно обучить согласительную комиссию и подтвердить знания участников.</li>
                <li>✓ В кадровых документах есть риск ошибок перед проверкой или спором.</li>
                <li>✓ HR-отделу нужен внешний аудит, порядок и понятный план исправлений.</li>
                <li>✓ Компания хочет передать часть кадрового делопроизводства на сопровождение.</li>
              </ul>
            </div>
          </div>
        </section>

        {stats.length > 0 && (
          <Section className="py-10">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.id} className="rounded-xl border bg-white p-6 text-center">
                  <div className="text-3xl font-bold text-blue-700">{stat.value}</div>
                  <div className="mt-2 font-semibold">{stat.label}</div>
                  {stat.description && <p className="mt-2 text-sm text-gray-600">{stat.description}</p>}
                </div>
              ))}
            </div>
          </Section>
        )}

        <Section
          className="bg-gray-50"
          title="Услуги для кадрового порядка и обучения"
          description="Можно заказать отдельное обучение, провести аудит документов или подключить постоянное кадровое сопровождение."
        >
          <ServiceCards services={services} />
        </Section>

        <Section
          title="Ближайшие обучения и события"
          description="Проводим обучение согласительных комиссий, кадровому делопроизводству и другим практическим темам для работодателей."
        >
          <EventCards events={events} />
        </Section>

        <Section
          className="bg-gray-50"
          title="Материалы для работодателей"
          description="Практические статьи о согласительной комиссии, кадровых документах, HR-аудите, трудовых спорах и подготовке к проверкам."
        >
          <ArticleCards articles={articles} />
        </Section>

        {team.length > 0 && (
          <Section title="Эксперты HR Lider">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {team.map((member) => (
                <div key={member.id} className="rounded-xl border bg-white p-6">
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <div className="mt-1 text-blue-700">{member.role}</div>
                  {member.experienceText && <div className="mt-2 text-sm text-gray-500">{member.experienceText}</div>}
                  <p className="mt-3 text-gray-700">{plain(member.description)}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        <Section title="Частые вопросы" className="bg-white">
          <FaqList faqs={faqs} />
        </Section>

        <LeadSection source="home" settings={settings} />
      </main>
    </PublicShell>
  );
}

export async function ServicesPage() {
  const [settings, services] = await Promise.all([getSiteSettings(), getServices()]);

  return (
    <PublicShell>
      <main>
        <Section
          eyebrow="Услуги"
          title="Услуги HR Lider: обучение, HR-аудит и кадровый аутсорсинг"
          description="Помогаем работодателям Казахстана выстроить кадровый порядок: обучение согласительных комиссий, кадровое делопроизводство, HR-аудит, подготовка к проверкам и сопровождение."
          headingLevel="h1"
        >
          <ServiceCards services={services} />
        </Section>
        <LeadSection source="services" settings={settings} title="Подобрать услугу под задачу компании" />
      </main>
    </PublicShell>
  );
}

export async function ServiceDetailPage({ slug }) {
  const [settings, service, services] = await Promise.all([getSiteSettings(), getService(slug), getServices(6)]);
  if (!service) notFound();
  const isCommissionTraining = service.slug === 'obuchenie-soglasitelnoi-komissii';

  return (
    <PublicShell>
      <main>
        <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <Link href="/services" className="mb-6 inline-flex font-semibold text-blue-700 hover:text-blue-900">← Назад к услугам</Link>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-700">Услуга HR Lider</p>
          <h1 className="text-4xl font-bold tracking-tight text-gray-950">{service.title}</h1>
          <p className="mt-5 text-xl text-gray-700">{plain(service.shortDescription)}</p>
          <ContactActions settings={settings} location={`service_${service.slug}_top`} className="mt-8" />

          <HtmlBlock html={service.fullDescription} className="mt-10" />

          {service.audience && (
            <section className="mt-10">
              <h2 className="text-2xl font-semibold">Кому подходит</h2>
              <HtmlBlock html={service.audience} className="mt-4" />
            </section>
          )}

          {service.includes && (
            <section className="mt-10">
              <h2 className="text-2xl font-semibold">Что входит</h2>
              <HtmlBlock html={service.includes} className="mt-4" />
            </section>
          )}

          {service.process && (
            <section className="mt-10">
              <h2 className="text-2xl font-semibold">Как проходит работа</h2>
              <HtmlBlock html={service.process} className="mt-4" />
            </section>
          )}

          {service.result && (
            <section className="mt-10">
              <h2 className="text-2xl font-semibold">Результат</h2>
              <HtmlBlock html={service.result} className="mt-4" />
            </section>
          )}

          {isCommissionTraining && (
            <section className="mt-10 rounded-xl border border-blue-200 bg-blue-50 p-6">
              <h2 className="text-2xl font-semibold">Обучение согласительной комиссии: что получает компания</h2>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {[
                  'Программа по трудовому законодательству РК и работе комиссии',
                  'Практические кейсы по индивидуальным трудовым спорам',
                  'Разбор документов: положение, протокол, решение, уведомления',
                  'Сертификат или подтверждение прохождения обучения',
                ].map((item) => (
                  <div key={item} className="rounded-lg bg-white p-4">✓ {item}</div>
                ))}
              </div>
            </section>
          )}
        </article>

        <Section className="bg-gray-50" title="Другие услуги HR Lider">
          <ServiceCards services={services.filter((item) => item.slug !== service.slug).slice(0, 3)} />
        </Section>
        <LeadSection source={`service_${service.slug}`} settings={settings} title={service.ctaLabel || 'Заказать услугу'} />
      </main>
    </PublicShell>
  );
}

export async function ArticlesPage() {
  const [settings, articles] = await Promise.all([getSiteSettings(), getArticles()]);

  return (
    <PublicShell>
      <main>
        <Section
          eyebrow="Статьи"
          title="Статьи HR Lider о кадровых документах, трудовых спорах и HR-аудите"
          description="Практические материалы для работодателей Казахстана: согласительная комиссия, кадровые документы, HR-аудит, трудовые споры и проверки."
          headingLevel="h1"
        >
          <ArticleCards articles={articles} />
        </Section>
        <LeadSection source="articles" settings={settings} title="Нужна консультация по кадровому вопросу?" />
      </main>
    </PublicShell>
  );
}

export async function ArticleDetailPage({ slug }) {
  const [settings, article] = await Promise.all([getSiteSettings(), getArticle(slug)]);
  if (!article) notFound();

  return (
    <PublicShell>
      <main>
        <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <Link href="/articles" className="mb-6 inline-flex font-semibold text-blue-700 hover:text-blue-900">← Назад к статьям</Link>
          <div className="text-sm font-semibold text-blue-700">{article.category}</div>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-950">{article.title}</h1>
          {article.publishedAt && <div className="mt-4 text-gray-500">{formatDate(article.publishedAt)}</div>}
          <p className="mt-6 text-xl text-gray-700">{plain(article.excerpt)}</p>
          <HtmlBlock html={article.content} className="mt-10" />

          <section className="mt-12 rounded-xl border bg-gray-50 p-6">
            <h2 className="text-2xl font-semibold">Услуги по теме статьи</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {recommendedServices.map((service) => (
                <Link key={service.href} href={service.href} className="rounded-lg border bg-white p-4 hover:shadow-md">
                  <div className="font-semibold text-blue-700">{service.title}</div>
                  <p className="mt-2 text-sm text-gray-600">{service.description}</p>
                </Link>
              ))}
            </div>
          </section>
        </article>
        <LeadSection source={`article_${article.slug}`} settings={settings} title="Нужна консультация по теме?" />
      </main>
    </PublicShell>
  );
}

export async function EventsPage() {
  const [settings, events] = await Promise.all([getSiteSettings(), getEvents()]);

  return (
    <PublicShell>
      <main>
        <Section
          eyebrow="Мероприятия"
          title="Мероприятия и обучение HR Lider для работодателей Казахстана"
          description="Открытые и корпоративные обучения для членов согласительных комиссий, кадровиков, HR-специалистов и руководителей."
          headingLevel="h1"
        >
          <EventCards events={events} />
        </Section>
        <LeadSection source="events" settings={settings} title="Подобрать дату или корпоративный формат" />
      </main>
    </PublicShell>
  );
}

export async function EventDetailPage({ slug }) {
  const [settings, event] = await Promise.all([getSiteSettings(), getEvent(slug)]);
  if (!event) notFound();

  return (
    <PublicShell>
      <main>
        <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <Link href="/events" className="mb-6 inline-flex font-semibold text-blue-700 hover:text-blue-900">← Назад к мероприятиям</Link>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-700">Обучение HR Lider</p>
          <h1 className="text-4xl font-bold tracking-tight text-gray-950">{event.title}</h1>
          <div className="mt-6 flex flex-wrap gap-4 text-gray-700">
            <span>Дата: {formatDate(event.startsAt)}</span>
            {formatTimeRange(event) && <span>Время: {formatTimeRange(event)}</span>}
            <span>Формат: {event.format === 'ONLINE' ? 'Онлайн' : event.city || 'Офлайн'}</span>
          </div>
          <p className="mt-6 text-xl text-gray-700">{plain(event.excerpt || event.description)}</p>
          <HtmlBlock html={event.description} className="mt-10" />
          {event.program && (
            <section className="mt-10">
              <h2 className="text-2xl font-semibold">Программа</h2>
              <HtmlBlock html={event.program} className="mt-4" />
            </section>
          )}

          <section id="registration" className="mt-12 rounded-xl bg-gray-50 p-8">
            {event.registrationEnabled ? (
              <>
                <h2 className="mb-6 text-center text-2xl font-semibold">Регистрация</h2>
                <EventRegistrationForm eventId={event.id} eventSlug={event.slug} />
              </>
            ) : (
              <div className="text-center">
                <h2 className="text-2xl font-semibold">Набор закрыт</h2>
                <p className="mt-3 text-gray-600">Регистрация на это мероприятие завершена.</p>
              </div>
            )}
          </section>
        </article>
        <LeadSection source={`event_${event.slug}`} settings={settings} title="Остались вопросы по мероприятию?" />
      </main>
    </PublicShell>
  );
}

export async function AboutPage() {
  const [settings, team, stats] = await Promise.all([getSiteSettings(), getTeam(), getStats()]);

  return (
    <PublicShell>
      <main>
        <Section
          eyebrow="О компании"
          title="HR Lider помогает работодателям выстраивать кадровые процессы и снижать трудовые риски"
          description="Мы работаем с компаниями, которым важно не просто закрыть разовую задачу, а навести системный порядок в HR-документах, обучении и внутренних процедурах."
          headingLevel="h1"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {['Сначала выявляем задачу и риски', 'Проверяем документы и текущий процесс', 'Предлагаем понятный план действий', 'Обучаем ответственных сотрудников', 'Помогаем внедрить порядок в ежедневную работу'].map((item) => (
              <div key={item} className="rounded-xl border bg-white p-5">✓ {item}</div>
            ))}
          </div>
        </Section>

        {stats.length > 0 && (
          <Section className="bg-gray-50" title="HR Lider в цифрах">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.id} className="rounded-xl border bg-white p-6 text-center">
                  <div className="text-3xl font-bold text-blue-700">{stat.value}</div>
                  <div className="mt-2 font-semibold">{stat.label}</div>
                  {stat.description && <p className="mt-2 text-sm text-gray-600">{stat.description}</p>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {team.length > 0 && (
          <Section title="Команда и эксперты">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {team.map((member) => (
                <div key={member.id} className="rounded-xl border bg-white p-6">
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <div className="mt-1 text-blue-700">{member.role}</div>
                  {member.experienceText && <div className="mt-2 text-sm text-gray-500">{member.experienceText}</div>}
                  <p className="mt-3 text-gray-700">{plain(member.description)}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        <LeadSection source="about" settings={settings} />
      </main>
    </PublicShell>
  );
}

export async function ContactsPage() {
  const settings = await getSiteSettings();

  return (
    <PublicShell>
      <main>
        <Section
          eyebrow="Контакты"
          title="Контакты HR Lider"
          description="Расскажите, какая задача стоит перед компанией: обучение комиссии, кадровое делопроизводство, аудит, обучение кадровиков или подготовка к проверке."
          headingLevel="h1"
        >
          <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
            <div className="rounded-xl bg-gray-50 p-6">
              <h2 className="text-2xl font-semibold">Связаться с нами</h2>
              <div className="mt-5 flex flex-col gap-3 text-lg">
                <TrackedContactLink href={phoneHref(settings.phone)} method="phone" location="contacts" className="text-blue-700 hover:text-blue-900">
                  {settings.phone}
                </TrackedContactLink>
                <TrackedContactLink href={phoneHref(settings.secondaryPhone)} method="phone" location="contacts" className="text-blue-700 hover:text-blue-900">
                  {settings.secondaryPhone}
                </TrackedContactLink>
                <TrackedContactLink href={whatsappHref(settings.whatsapp)} method="whatsapp" location="contacts" target="_blank" rel="noreferrer" className="text-green-700 hover:text-green-900">
                  WhatsApp HR Lider
                </TrackedContactLink>
                <TrackedContactLink href={`mailto:${settings.email}`} method="email" location="contacts" className="text-blue-700 hover:text-blue-900">
                  {settings.email}
                </TrackedContactLink>
              </div>
              <p className="mt-6 text-gray-700">
                Можно написать коротко: тема задачи, город, количество участников или документов, которые нужно проверить. Мы вернемся с подходящим форматом.
              </p>
            </div>
            <LeadFormClient source="contact" />
          </div>
        </Section>
      </main>
    </PublicShell>
  );
}

export async function PublicRoutePage({ path }) {
  if (path === 'services') return <ServicesPage />;
  if (path === 'events') return <EventsPage />;
  if (path === 'articles') return <ArticlesPage />;
  if (path === 'about') return <AboutPage />;
  if (path === 'contacts') return <ContactsPage />;

  const [section, slug] = String(path || '').split('/');
  if (section === 'services' && slug) return <ServiceDetailPage slug={slug} />;
  if (section === 'events' && slug) return <EventDetailPage slug={slug} />;
  if (section === 'articles' && slug) return <ArticleDetailPage slug={slug} />;

  notFound();
}
