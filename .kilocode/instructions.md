# 🎬 Storyboard AI — Kilo Code Instructions

## ⚠️ ВАЖНО: ПЕРЕД НАЧАЛОМ РАБОТЫ

**Обязательно прочитай эти файлы в начале каждой сессии:**

1. **`.kilocode/PROJECT_DOCUMENTATION.md`** — основная информация о проекте, выполненные задачи, архитектура
2. **`DANIMAK ANIMATION STUDIO.md`** (в корне) — информация о компании DANIMAK

### 🔑 Контекст проекта:
- **Основной проект:** DANIMAK ANIMATION STUDIO — сайт анимационной студии (danimak-studio.ru)
- **Дополнительный сервис:** Storyboard AI — AI-сервис для генерации раскадровок (встроен как часть экосистемы)
- **Локация:** Пятигорск, Ставропольский край
- **Год основания:** 2020
- **Дизайн:** Современный, с градиентами, анимациями, адаптивный
- **Языки:** 🇷🇺 Русский (основной) + 🇬🇧 Английский

---

## О проекте
Мы создаём SaaS-сервис для генерации раскадровок из сценариев с помощью AI.
Ключевые фичи:
- Загрузка сценария (FDX, PDF, TXT) → JSON-сцены
- AI-генерация изображений с сохранением персонажей (Character Consistency)
- Редактирование ракурсов и стилей
- Экспорт в PDF/PNG/MP4
- Подписки + кредитная система (Stripe)

## Технологический стек
| Слой | Технологии |
|------|-----------|
| Frontend | Next.js 14 App Router, TypeScript, Tailwind, shadcn/ui, Zustand |
| Backend API | Node.js + Express, Supabase (Auth + Postgres + Storage) |
| AI Workers | Python + FastAPI, Replicate API, OpenAI GPT-4o-mini |
| Очереди | BullMQ + Redis |
| Платежи | Stripe (вебхуки + подписки) |
| Деплой | Vercel (фронт), Render/Railway (бэк), Modal (GPU) |

## Структура проекта

```
storyboard-ai/
├── apps/
│   ├── api/                    # Backend API (Express)
│   │   ├── src/
│   │   │   ├── index.ts        # Entry point
│   │   │   ├── routes/         # API endpoints
│   │   │   ├── middleware/     # Auth, logging, errors
│   │   │   ├── lib/            # Supabase client
│   │   │   ├── utils/          # Logger, errors
│   │   │   └── services/       # Business logic
│   │   ├── supabase/
│   │   │   └── schema.sql      # Database schema
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── Dockerfile
│   │
│   ├── web/                    # Frontend (Next.js)
│   │   ├── src/
│   │   │   ├── app/            # Next.js pages
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── login/
│   │   │   │   ├── signup/
│   │   │   │   ├── dashboard/
│   │   │   │   └── projects/
│   │   │   ├── components/     # React components
│   │   │   ├── stores/         # Zustand stores
│   │   │   └── lib/            # Utils, API client
│   │   ├── package.json
│   │   └── next.config.ts
│   │
│   └── workers/                # AI Workers (Python)
│       ├── src/
│       │   ├── main.py         # FastAPI app
│       │   ├── config.py       # Settings
│       │   ├── worker.py       # Background worker
│       │   ├── routers/        # API endpoints
│       │   └── services/       # AI services
│       ├── pyproject.toml
│       └── Dockerfile
│
├── packages/
│   └── shared/                 # Shared types
│       ├── src/
│       │   └── index.ts        # Zod schemas
│       └── package.json
│
├── .kilocode/                  # Project docs
│   ├── instructions.md
│   ├── patterns.md
│   ├── prompts.md
│   └── checklist.md
│
├── package.json                # Turborepo root
├── turbo.json                  # Turborepo config
├── .env.example
├── .gitignore
├── README.md
└── DEVELOPMENT.md
```

## Правила кода
1. **TypeScript строго** — никаких `any`, используй интерфейсы
2. **Server Components по умолчанию** — Client только когда нужен интерактив
3. **Zod для валидации** — все входные данные валидируй схемами
4. **Обработка ошибок** — try/catch с логированием, пользовательские сообщения
5. **Функции < 50 строк** — если больше, выноси в отдельные файлы
6. **Комментарии на русском** — для документации, на английском для TODO

## AI-взаимодействие
- Всегда проверяй сгенерированный код перед коммитом
- Логируй промпты к LLM в dev-режиме
- Используй feature flags для экспериментальных функций
- Приоритет: работает → безопасно → быстро → красиво

## Безопасность
- Все API: проверка сессии через Supabase Auth
- Файлы: валидация типа (MIME) и размера (<10MB)
- AI-промпты: санитизация от injection
- Stripe: всегда проверяй signature на вебхуках

## Database Schema

### Основные таблицы

```sql
users
├── id (UUID, PK)
├── email (TEXT)
├── name (TEXT)
├── credits (INT)
├── subscription_tier (ENUM)
└── created_at, updated_at

projects
├── id (UUID, PK)
├── user_id (UUID, FK)
├── title (VARCHAR)
├── description (TEXT)
├── thumbnail_url (TEXT)
├── status (ENUM)
└── created_at, updated_at

scenes
├── id (UUID, PK)
├── project_id (UUID, FK)
├── scene_number (INT)
├── title (VARCHAR)
├── description (TEXT)
├── image_url (TEXT)
├── style (VARCHAR)
├── camera_angle (VARCHAR)
├── status (ENUM)
└── created_at, updated_at

generation_jobs
├── id (UUID, PK)
├── scene_id (UUID, FK)
├── user_id (UUID, FK)
├── status (ENUM)
├── prompt (TEXT)
├── image_url (TEXT)
└── created_at, completed_at

subscriptions
├── id (UUID, PK)
├── user_id (UUID, FK)
├── stripe_subscription_id (TEXT)
├── tier (ENUM)
├── status (ENUM)
└── current_period_end

credit_transactions
├── id (UUID, PK)
├── user_id (UUID, FK)
├── amount (INT)
├── type (ENUM)
├── balance_after (INT)
└── created_at
```

## API Endpoints

### Auth
- `POST /api/auth/signup` — Регистрация
- `POST /api/auth/login` — Вход
- `POST /api/auth/logout` — Выход
- `GET /api/auth/me` — Текущий пользователь

### Projects
- `GET /api/projects` — Список проектов
- `POST /api/projects` — Создать проект
- `GET /api/projects/:id` — Детали проекта
- `PUT /api/projects/:id` — Обновить проект
- `DELETE /api/projects/:id` — Удалить проект

### Scenes
- `GET /api/scenes/project/:projectId` — Сцены проекта
- `POST /api/scenes` — Создать сцену
- `PUT /api/scenes/:id` — Обновить сцену
- `DELETE /api/scenes/:id` — Удалить сцену

### Generation
- `POST /api/generation/image` — Генерировать изображение
- `GET /api/generation/:jobId` — Статус генерации
- `POST /api/generation/:jobId/regenerate` — Перегенерировать

### Scripts
- `POST /api/scripts/upload` — Загрузить сценарий
- `POST /api/scripts/:id/parse` — Парсить сценарий

### Subscriptions
- `GET /api/subscriptions/me` — Текущая подписка
- `POST /api/subscriptions/checkout` — Создать checkout сессию
- `POST /api/subscriptions/webhook` — Stripe webhook

## Environment Variables

```env
# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI
REPLICATE_API_KEY=
OPENAI_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Redis
REDIS_URL=redis://localhost:6379

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
API_URL=http://localhost:4000
JWT_SECRET=
```

## Команды разработки

```bash
# Установка зависимостей
npm install

# Запуск всех сервисов
npm run dev

# Запуск по отдельности
cd apps/web && npm run dev      # Frontend :3000
cd apps/api && npm run dev      # Backend :4000
cd apps/workers && npm run dev  # Workers :8000

# Build
npm run build

# Тесты
npm test

# Docker
docker-compose up -d
```

## Чеклист перед коммитом

Смотри `.kilocode/checklist.md`
