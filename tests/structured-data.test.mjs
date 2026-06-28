import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildCourseJsonLd,
  buildEventJsonLd,
  buildFaqPageJsonLd,
  buildOrganizationJsonLd,
  buildServiceJsonLd,
  stripHtml,
} from '../app/lib/structured-data.js';

const siteUrl = 'https://www.hr-lider.kz';

test('stripHtml removes tags and normalizes whitespace', () => {
  assert.equal(stripHtml('<p>Первый&nbsp;текст</p><ul><li>Пункт</li></ul>'), 'Первый текст Пункт');
});

test('buildOrganizationJsonLd describes HR Lider and website search target', () => {
  const graph = buildOrganizationJsonLd(siteUrl);

  assert.equal(graph['@context'], 'https://schema.org');
  assert.deepEqual(graph['@graph'][0]['@type'], ['Organization', 'ProfessionalService', 'LocalBusiness']);
  assert.equal(graph['@graph'][0].url, siteUrl);
  assert.match(graph['@graph'][0].telephone, /^\+7\d{10}$/);
  assert.equal(graph['@graph'][0].contactPoint.telephone, graph['@graph'][0].telephone);
  assert.equal(graph['@graph'][0].address.addressCountry, 'KZ');
  assert.equal(graph['@graph'][1]['@type'], 'WebSite');
});

test('buildBreadcrumbJsonLd builds route breadcrumbs', () => {
  const data = buildBreadcrumbJsonLd(siteUrl, '/services/hr-audit');

  assert.equal(data['@type'], 'BreadcrumbList');
  assert.deepEqual(
    data.itemListElement.map((item) => item.name),
    ['Главная', 'Услуги', 'HR-аудит']
  );
  assert.equal(data.itemListElement.at(-1).item, `${siteUrl}/services/hr-audit`);
});

test('buildServiceJsonLd maps service fields to Service schema', () => {
  const data = buildServiceJsonLd(siteUrl, {
    title: 'HR-аудит',
    slug: 'hr-audit',
    shortDescription: 'Проверка кадровых документов',
    fullDescription: '<p>Находим риски</p>',
  });

  assert.equal(data['@type'], 'Service');
  assert.equal(data.name, 'HR-аудит');
  assert.equal(data.url, `${siteUrl}/services/hr-audit`);
  assert.equal(data.provider.name, 'HR Lider');
});

test('buildArticleJsonLd maps article fields to BlogPosting schema', () => {
  const data = buildArticleJsonLd(siteUrl, {
    title: 'Зачем обучать комиссию',
    slug: 'zachem-obuchat',
    excerpt: 'Кратко о пользе',
    content: '<p>Материал</p>',
    category: 'Согласительная комиссия',
    publishedAt: '2026-06-28T00:00:00.000Z',
    updatedAt: '2026-06-29T00:00:00.000Z',
  });

  assert.equal(data['@type'], 'BlogPosting');
  assert.equal(data.headline, 'Зачем обучать комиссию');
  assert.equal(data.articleSection, 'Согласительная комиссия');
  assert.equal(data.mainEntityOfPage, `${siteUrl}/articles/zachem-obuchat`);
});

test('buildEventJsonLd maps event fields to Event schema', () => {
  const data = buildEventJsonLd(siteUrl, {
    title: 'Обучение комиссии',
    slug: 'obuchenie-komissii',
    excerpt: 'Практический курс',
    description: '<p>Описание</p>',
    startsAt: '2026-07-10T05:00:00.000Z',
    endsAt: '2026-07-10T09:00:00.000Z',
    format: 'ONLINE',
    registrationEnabled: true,
  });

  assert.equal(data['@type'], 'Event');
  assert.equal(data.eventAttendanceMode, 'https://schema.org/OnlineEventAttendanceMode');
  assert.equal(data.offers.availability, 'https://schema.org/InStock');
  assert.equal(data.url, `${siteUrl}/events/obuchenie-komissii`);
});

test('buildFaqPageJsonLd maps FAQ items to FAQPage schema', () => {
  const data = buildFaqPageJsonLd([
    { question: 'Кто обучается?', answer: '<p>Члены комиссии</p>' },
    { question: '', answer: 'ignored' },
  ]);

  assert.equal(data['@type'], 'FAQPage');
  assert.equal(data.mainEntity.length, 1);
  assert.equal(data.mainEntity[0]['@type'], 'Question');
  assert.equal(data.mainEntity[0].acceptedAnswer.text, 'Члены комиссии');
});

test('buildCourseJsonLd maps training service to Course schema', () => {
  const data = buildCourseJsonLd(
    siteUrl,
    {
      title: 'Обучение согласительной комиссии',
      shortDescription: 'Курс для членов комиссии',
    },
    '/services/obuchenie-soglasitelnoi-komissii'
  );

  assert.equal(data['@type'], 'Course');
  assert.equal(data.name, 'Обучение согласительной комиссии');
  assert.equal(data.provider.name, 'HR Lider');
  assert.equal(data.url, `${siteUrl}/services/obuchenie-soglasitelnoi-komissii`);
});
