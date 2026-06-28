# Deployment: Vercel + Neon + Vercel Blob

## 1. Neon Postgres

1. Создать проект в Neon.
2. Скопировать connection string вида:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/DB?sslmode=require"
```

3. Добавить `DATABASE_URL` в Vercel Environment Variables.

## 2. Vercel Blob

1. В Vercel открыть проект.
2. Storage -> Blob -> Create.
3. Подключить Blob store к проекту.
4. Vercel добавит `BLOB_READ_WRITE_TOKEN`.

Файлы загружаются через:

```text
POST /api/admin/files
```

## 3. Required Environment Variables

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="long-random-production-secret"
ADMIN_EMAIL="owner@hr-lider.kz"
ADMIN_PASSWORD="strong-password"
TG_TOKEN=""
CHAT_ID=""
BLOB_READ_WRITE_TOKEN=""
NEXT_PUBLIC_SITE_URL="https://your-domain.kz"
NEXT_PUBLIC_GA_MEASUREMENT_ID="" # optional, GA4 Measurement ID, e.g. G-XXXXXXXXXX
```

## 4. Build Settings

Framework preset: `Next.js`

Build command:

```bash
npm run build
```

Install command:

```bash
npm install
```

## 5. Database Setup

После первого деплоя выполнить локально или через Vercel CLI:

```bash
npm run db:push
npm run db:seed
```

Для production лучше запускать `db:seed` только один раз, чтобы не плодить FAQ-дубликаты за пределами уже предусмотренных seed-данных.
