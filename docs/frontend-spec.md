# HR Lider Frontend ТЗ

## 1. Цель

Сделать frontend для HR Lider: экспертного сайта для работодателей в Казахстане. Backend уже предоставляет API для публичных страниц, админки, заявок и регистраций на мероприятия.

Главный фокус сайта:

**HR Lider помогает работодателям привести кадровые процессы в порядок, обучить согласительную комиссию и снизить риски трудовых споров до того, как они станут проблемой.**

Не использовать:

- старые цифры `927 клиентов`, `93%`, `24/7`;
- старый состав команды;
- фотографии команды;
- услуги `Юридическое сопровождение работодателя` и `Бухгалтерское сопровождение`.

## 2. Публичные Страницы

### Главная `/`

Header:

- логотип HR Lider;
- Услуги;
- Мероприятия;
- Статьи;
- О компании;
- FAQ;
- Контакты;
- кнопка `Получить консультацию`.

Hero:

- H1: `Кадровый порядок и обучение для работодателей`
- Текст: `Обучаем согласительные комиссии, кадровиков и HR-специалистов, проводим HR-аудит, сопровождаем кадровое делопроизводство и помогаем компаниям подготовиться к проверкам и трудовым спорам.`
- CTA 1: `Получить консультацию`
- CTA 2: `Смотреть мероприятия`

Блок `Для кого`:

- Заголовок: `Для компаний, где кадровые ошибки стоят дорого`
- Карточки:
  - `Средний и крупный бизнес` — `Для компаний, которым важно держать кадровые документы, процедуры и обучение сотрудников в управляемом состоянии.`
  - `Компании с филиалами` — `Помогаем привести кадровые процессы к единому стандарту по подразделениям, городам и ответственным лицам.`
  - `Работодатели с активным наймом` — `Настраиваем кадровые процедуры так, чтобы прием, перевод, отпуск, командировки и увольнения оформлялись без хаоса.`
  - `Компании с трудовыми спорами` — `Помогаем подготовить документы, обучить комиссию и выстроить корректный порядок рассмотрения обращений работников.`
  - `HR-отделы и кадровики` — `Даем практические знания по трудовому законодательству, кадровым документам и работе с типовыми ситуациями.`

Блок услуг:

- Заголовок: `Услуги для кадрового порядка и обучения`
- Текст: `Можно заказать отдельное обучение, провести аудит документов или подключить постоянное кадровое сопровождение.`
- Данные брать из `GET /api/public/services`.

Блок мероприятий:

- Заголовок: `Ближайшие обучения и события`
- Текст: `Проводим обучение согласительных комиссий, кадровому делопроизводству и другим практическим темам для работодателей.`
- Данные брать из `GET /api/public/events?timing=upcoming&limit=3`.
- Пустое состояние: `Сейчас нет опубликованных мероприятий. Оставьте заявку, и мы сообщим о ближайшем наборе.`

Блок преимуществ:

- Заголовок: `Практика, документы и обучение в одной системе`
- Тезисы:
  - `Опора на ТК РК` — `Обучение и документы строятся вокруг требований трудового законодательства Казахстана.`
  - `Практический формат` — `Разбираем реальные кадровые ситуации, документы и ошибки, а не только теорию.`
  - `Фокус на согласительной комиссии` — `Помогаем работодателю не формально создать комиссию, а выстроить рабочий механизм рассмотрения споров.`
  - `Снижение кадровых рисков` — `Выявляем пробелы в документах, процедурах и ответственности до проверки или конфликта.`
  - `Online и offline` — `Обучение и сопровождение можно организовать для разных городов и филиалов.`

Блок статей:

- Заголовок: `Статьи и новости`
- Текст: `Разбираем изменения в трудовом законодательстве, кадровые ошибки, работу согласительных комиссий и практику сопровождения работодателей.`
- Данные брать из `GET /api/public/articles?limit=3`.

Команда:

- Данные брать из `GET /api/public/team`.
- Если список пустой, блок скрыть.
- Фото не проектировать.

FAQ:

- Данные брать из `GET /api/public/faqs`.

Контакты:

- Заголовок: `Получите консультацию`
- Текст: `Опишите задачу, и мы подскажем, какой формат подойдет: обучение, аудит, кадровое делопроизводство, подготовка к проверке или кадровое сопровождение.`
- Форма отправляет `POST /api/leads`.

### Услуги `/services`

- H1: `Услуги HR Lider`
- Текст: `HR Lider помогает работодателям навести порядок в кадровых процессах, обучить сотрудников и подготовить документы, которые нужны для стабильной работы бизнеса. Вы можете выбрать отдельную услугу или собрать комплексное сопровождение под задачи компании.`
- Список брать из `GET /api/public/services`.

### Страница Услуги `/services/[slug]`

Данные брать из `GET /api/public/services/[slug]`.

Структура:

- title;
- shortDescription;
- fullDescription;
- `Кому подходит` из `audience`;
- `Что входит` из `includes`;
- `Как проходит работа` из `process`;
- `Результат` из `result`;
- CTA из `ctaLabel`.

### Мероприятия `/events`

- H1: `Мероприятия и обучение`
- Текст: `HR Lider проводит обучение для согласительных комиссий, кадровиков, HR-специалистов и руководителей. Выберите ближайшее мероприятие или оставьте заявку на корпоративное обучение.`
- Фильтры:
  - Все: `/api/public/events`
  - Онлайн: `/api/public/events?format=ONLINE`
  - Офлайн: `/api/public/events?format=OFFLINE`
  - Ближайшие: `/api/public/events?timing=upcoming`
  - Прошедшие: `/api/public/events?timing=past`

Карточка:

- title;
- startsAt;
- format;
- city или `Онлайн`;
- excerpt;
- кнопки `Подробнее`, `Регистрация`.

### Страница Мероприятия `/events/[slug]`

Данные брать из `GET /api/public/events/[slug]`.

Структура:

- title;
- startsAt / endsAt;
- format;
- city или онлайн;
- description;
- program;
- регистрационная форма, если `registrationEnabled=true`.

Форма регистрации отправляет `POST /api/events/{id}/register`.

Поля:

- name;
- phone;
- email;
- company;
- position;
- comment.

Success message:

`Спасибо! Мы получили регистрацию и свяжемся с вами для подтверждения участия.`

Если регистрация закрыта:

`Набор закрыт`

### Статьи `/articles`

- H1: `Статьи и новости`
- Текст: `Пишем о кадровом делопроизводстве, согласительных комиссиях, трудовых спорах, обучении HR-специалистов и практических изменениях, которые важны работодателям.`
- Категории:
  - `Согласительная комиссия`
  - `Кадровое делопроизводство`
  - `HR-аудит`
  - `Обучение`
  - `Трудовые споры`
  - `Новости HR Lider`
- Данные брать из `GET /api/public/articles`.
- Фильтр категории: `GET /api/public/articles?category=Согласительная комиссия`.

### Страница Статьи `/articles/[slug]`

Данные брать из `GET /api/public/articles/[slug]`.

Структура:

- title;
- excerpt;
- category;
- publishedAt;
- content;
- CTA-блок `Нужна консультация по теме?`;
- кнопка `Оставить заявку`.

### О компании `/about`

Текст:

`HR Lider помогает работодателям в Казахстане выстраивать кадровые процессы, обучать сотрудников и снижать риски, связанные с кадровыми документами и трудовыми спорами. Мы работаем с компаниями, которым важно не просто закрыть разовую задачу, а навести системный порядок в HR-документах, обучении и внутренних процедурах.`

Блок `Наш подход`:

- сначала выявляем задачу и риски;
- проверяем документы и текущий процесс;
- предлагаем понятный план действий;
- обучаем ответственных сотрудников;
- помогаем внедрить порядок в ежедневную работу.

### Контакты `/contacts`

Текст:

`Расскажите, какая задача стоит перед компанией: обучение комиссии, кадровое делопроизводство, аудит, обучение кадровиков или подготовка к проверке. Мы подскажем подходящий формат работы.`

Форма отправляет `POST /api/leads`.

## 3. Admin UI

Админка должна использовать cookie-сессию. После `POST /api/auth/login` браузер получает httpOnly cookie.

Страницы:

- `/admin/login`
- `/admin`
- `/admin/articles`
- `/admin/events`
- `/admin/registrations`
- `/admin/services`
- `/admin/faqs`
- `/admin/stats`
- `/admin/team`
- `/admin/settings`

Для всех admin endpoints нужны credentials/cookie.

## 4. API Endpoints

### Auth

`POST /api/auth/login`

Request:

```json
{
  "email": "owner@hr-lider.kz",
  "password": "password"
}
```

Response:

```json
{
  "ok": true,
  "user": { "email": "owner@hr-lider.kz" }
}
```

`POST /api/auth/logout`

Response:

```json
{ "ok": true }
```

### Public

`GET /api/public/services`

Query: `page`, `limit`.

`GET /api/public/services/{slug}`

`GET /api/public/events`

Query: `page`, `limit`, `format=ONLINE|OFFLINE`, `timing=upcoming|past`, `q`.

`GET /api/public/events/{slug}`

`GET /api/public/articles`

Query: `page`, `limit`, `category`, `q`.

`GET /api/public/articles/{slug}`

`GET /api/public/faqs`

`GET /api/public/stats`

`GET /api/public/team`

`GET /api/public/settings`

### Leads

`POST /api/leads`

Request:

```json
{
  "name": "Иван",
  "phone": "+77010000000",
  "company": "ТОО Компания",
  "comment": "Нужно обучение комиссии",
  "source": "contact"
}
```

Response:

```json
{
  "ok": true,
  "item": {
    "id": "string",
    "name": "Иван",
    "phone": "+77010000000"
  }
}
```

### Event Registration

`POST /api/events/{id}/register`

Request:

```json
{
  "name": "Иван",
  "phone": "+77010000000",
  "email": "ivan@example.com",
  "company": "ТОО Компания",
  "position": "HR manager",
  "comment": "Хочу получить программу"
}
```

Response:

```json
{
  "ok": true,
  "message": "Спасибо! Мы получили регистрацию и свяжемся с вами для подтверждения участия.",
  "item": {
    "id": "string",
    "eventId": "string",
    "name": "Иван"
  }
}
```

### Admin CRUD

Общий формат списка:

```json
{
  "ok": true,
  "items": [],
  "total": 0,
  "page": 1,
  "limit": 20
}
```

Общий формат одного объекта:

```json
{
  "ok": true,
  "item": {}
}
```

Endpoints:

- `GET /api/admin/articles`
- `POST /api/admin/articles`
- `GET /api/admin/articles/{id}`
- `PUT /api/admin/articles/{id}`
- `DELETE /api/admin/articles/{id}`
- `GET /api/admin/events`
- `POST /api/admin/events`
- `GET /api/admin/events/{id}`
- `PUT /api/admin/events/{id}`
- `DELETE /api/admin/events/{id}`
- `GET /api/admin/registrations`
- `GET /api/admin/registrations/{id}`
- `PUT /api/admin/registrations/{id}`
- `DELETE /api/admin/registrations/{id}`
- `GET /api/admin/services`
- `POST /api/admin/services`
- `GET /api/admin/services/{id}`
- `PUT /api/admin/services/{id}`
- `DELETE /api/admin/services/{id}`
- `GET /api/admin/faqs`
- `POST /api/admin/faqs`
- `GET /api/admin/faqs/{id}`
- `PUT /api/admin/faqs/{id}`
- `DELETE /api/admin/faqs/{id}`
- `GET /api/admin/stats`
- `POST /api/admin/stats`
- `GET /api/admin/stats/{id}`
- `PUT /api/admin/stats/{id}`
- `DELETE /api/admin/stats/{id}`
- `GET /api/admin/team`
- `POST /api/admin/team`
- `GET /api/admin/team/{id}`
- `PUT /api/admin/team/{id}`
- `DELETE /api/admin/team/{id}`
- `GET /api/admin/settings`
- `PUT /api/admin/settings`
- `POST /api/admin/files`

`POST /api/admin/files` принимает `multipart/form-data`:

- `file`: файл;
- `folder`: опционально, например `articles`, `events`, `documents`.

Файл сохраняется в Vercel Blob. В ответе использовать `item.url` как публичный URL файла.

## 5. Data Shapes

### Service

```json
{
  "id": "string",
  "title": "Обучение согласительной комиссии",
  "slug": "obuchenie-soglasitelnoi-komissii",
  "shortDescription": "string",
  "fullDescription": "string",
  "audience": "string",
  "includes": "string",
  "process": "string",
  "result": "string",
  "ctaLabel": "Записаться на обучение",
  "order": 1,
  "status": "PUBLISHED"
}
```

### Event

```json
{
  "id": "string",
  "title": "string",
  "slug": "string",
  "excerpt": "string",
  "description": "string",
  "program": "string",
  "format": "ONLINE",
  "city": "Алматы",
  "startsAt": "2026-05-20T10:00:00.000Z",
  "endsAt": "2026-05-20T16:00:00.000Z",
  "seatsLimit": 30,
  "status": "PUBLISHED",
  "registrationEnabled": true
}
```

### Article

```json
{
  "id": "string",
  "title": "string",
  "slug": "string",
  "excerpt": "string",
  "content": "string",
  "category": "Согласительная комиссия",
  "status": "PUBLISHED",
  "publishedAt": "2026-04-24T00:00:00.000Z"
}
```

## 6. UI States

- Loading state for all lists.
- Empty state for events, articles, stats, team.
- Error state for failed forms.
- Disabled registration button when `registrationEnabled=false`.
- Hide stats if no published stats.
- Hide team if no published team members.
- Do not render image upload or photo fields for team.
