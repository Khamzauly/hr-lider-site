import { prisma } from './prisma.js';
import { fail, ok, parseListParams, readJson } from './http.js';
import { checkAdmin, unauthorized } from './auth.js';
import {
  cleanOptionalString,
  cleanString,
  normalizeFormat,
  normalizeRegistrationStatus,
  normalizeStatus,
  slugify
} from './validation.js';

export const modelMap = {
  articles: prisma.article,
  events: prisma.event,
  faqs: prisma.fAQ,
  services: prisma.service,
  stats: prisma.siteStat,
  team: prisma.teamMember,
  registrations: prisma.eventRegistration
};

export function articleData(body) {
  const title = cleanString(body.title, 180);
  return {
    title,
    slug: cleanString(body.slug, 140) || slugify(title),
    excerpt: cleanString(body.excerpt, 500),
    content: cleanString(body.content, 30000),
    category: cleanString(body.category, 80),
    status: normalizeStatus(body.status),
    publishedAt: body.publishedAt ? new Date(body.publishedAt) : null
  };
}

export function eventData(body) {
  const title = cleanString(body.title, 180);
  return {
    title,
    slug: cleanString(body.slug, 140) || slugify(title),
    excerpt: cleanString(body.excerpt, 500),
    description: cleanString(body.description, 12000),
    program: cleanString(body.program, 12000),
    format: normalizeFormat(body.format),
    city: cleanOptionalString(body.city, 120),
    onlineUrl: cleanOptionalString(body.onlineUrl, 500),
    privateNote: cleanOptionalString(body.privateNote, 1000),
    startsAt: body.startsAt ? new Date(body.startsAt) : new Date(),
    endsAt: body.endsAt ? new Date(body.endsAt) : null,
    seatsLimit: body.seatsLimit ? Number(body.seatsLimit) : null,
    status: normalizeStatus(body.status),
    registrationEnabled: body.registrationEnabled !== false
  };
}

export function faqData(body) {
  return {
    question: cleanString(body.question, 500),
    answer: cleanString(body.answer, 3000),
    order: Number(body.order || 0),
    status: normalizeStatus(body.status)
  };
}

export function serviceData(body) {
  const title = cleanString(body.title, 180);
  return {
    title,
    slug: cleanString(body.slug, 140) || slugify(title),
    shortDescription: cleanString(body.shortDescription, 700),
    fullDescription: cleanString(body.fullDescription, 15000),
    audience: cleanOptionalString(body.audience, 8000),
    includes: cleanOptionalString(body.includes, 8000),
    process: cleanOptionalString(body.process, 8000),
    result: cleanOptionalString(body.result, 5000),
    ctaLabel: cleanString(body.ctaLabel, 80) || 'Получить консультацию',
    order: Number(body.order || 0),
    status: normalizeStatus(body.status)
  };
}

export function statData(body) {
  return {
    label: cleanString(body.label, 120),
    value: cleanString(body.value, 60),
    description: cleanOptionalString(body.description, 300),
    order: Number(body.order || 0),
    status: normalizeStatus(body.status)
  };
}

export function teamData(body) {
  return {
    name: cleanString(body.name, 180),
    role: cleanString(body.role, 180),
    description: cleanString(body.description, 3000),
    experienceText: cleanOptionalString(body.experienceText, 200),
    order: Number(body.order || 0),
    status: normalizeStatus(body.status)
  };
}

export function registrationData(body) {
  return {
    status: normalizeRegistrationStatus(body.status)
  };
}

export const serializers = {
  articles: articleData,
  events: eventData,
  faqs: faqData,
  services: serviceData,
  stats: statData,
  team: teamData,
  registrations: registrationData
};

export async function adminList(resource, req, options = {}) {
  if (!checkAdmin()) return unauthorized();
  const model = modelMap[resource];
  const params = parseListParams(req);
  const where = options.where?.(params) || {};
  const [items, total] = await Promise.all([
    model.findMany({
      where,
      skip: params.skip,
      take: params.limit,
      orderBy: options.orderBy || { createdAt: 'desc' },
      include: options.include
    }),
    model.count({ where })
  ]);
  return ok({ items, total, page: params.page, limit: params.limit });
}

export async function adminCreate(resource, req) {
  if (!checkAdmin()) return unauthorized();
  try {
    const body = await readJson(req);
    const data = serializers[resource](body);
    const item = await modelMap[resource].create({ data });
    return ok({ item });
  } catch (error) {
    return fail(error.message, 400);
  }
}

export async function adminGet(resource, id, options = {}) {
  if (!checkAdmin()) return unauthorized();
  const item = await modelMap[resource].findUnique({
    where: { id },
    include: options.include
  });
  if (!item) return fail('Not found', 404);
  return ok({ item });
}

export async function adminUpdate(resource, id, req) {
  if (!checkAdmin()) return unauthorized();
  try {
    const body = await readJson(req);
    const data = serializers[resource](body);
    const item = await modelMap[resource].update({ where: { id }, data });
    return ok({ item });
  } catch (error) {
    return fail(error.message, 400);
  }
}

export async function adminDelete(resource, id) {
  if (!checkAdmin()) return unauthorized();
  await modelMap[resource].delete({ where: { id } });
  return ok();
}

export async function publicList(resource, req, options = {}) {
  const model = modelMap[resource];
  const params = parseListParams(req);
  const where = {
    status: 'PUBLISHED',
    ...(options.where?.(params) || {})
  };
  const [items, total] = await Promise.all([
    model.findMany({
      where,
      skip: params.skip,
      take: params.limit,
      orderBy: options.orderBy || { order: 'asc' }
    }),
    model.count({ where })
  ]);
  return ok({ items, total, page: params.page, limit: params.limit });
}

export async function publicBySlug(resource, slug) {
  const item = await modelMap[resource].findFirst({
    where: { slug, status: 'PUBLISHED' }
  });
  if (!item) return fail('Not found', 404);
  return ok({ item });
}
