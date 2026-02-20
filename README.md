# 🎬 Storyboard AI

SaaS-сервис для генерации раскадровок из сценариев с помощью AI.

## 📋 О проекте

Storyboard AI превращает сценарии (FDX, PDF, TXT) в профессиональные раскадровки с помощью искусственного интеллекта.

### Ключевые возможности

- 📄 **Загрузка сценариев** — FDX, PDF, TXT → JSON-сцены
- 🤖 **AI-генерация изображений** — SDXL через Replicate
- 🎭 **Сохранение персонажей** — Character Consistency через IP-Adapter
- 🎬 **Редактирование** — Ракурсы, стили, композиция
- 📤 **Экспорт** — PDF, PNG, MP4
- 💳 **Подписки** — Stripe + кредитная система

## 🏗️ Архитектура

```
storyboard-ai/
├── apps/
│   ├── api/          # Node.js + Express API
│   ├── web/          # Next.js 14 frontend
│   └── workers/      # Python + FastAPI AI workers
├── packages/
│   └── shared/       # Общие типы и утилиты
└── .kilocode/        # Документация проекта
```

## 🚀 Быстрый старт

### Требования

- Node.js 20+
- Python 3.11+
- Redis 7+
- Supabase аккаунт

### 1. Клонирование

```bash
git clone <repository>
cd storyboard-ai
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Настройка переменных окружения

```bash
# Скопируйте .env.example в .env.local
cp .env.example .env.local

# Заполните значениями:
# - SUPABASE_URL и SUPABASE_KEY
# - REPLICATE_API_KEY
# - OPENAI_API_KEY
# - STRIPE_* (для платежей)
# - REDIS_URL
```

### 4. Запуск Redis

```bash
# Docker
docker run -d -p 6379:6379 redis:7-alpine

# Или локально
redis-server
```

### 5. Настройка Supabase

```bash
# Выполните SQL миграцию в Supabase Dashboard
# Файл: apps/api/supabase/schema.sql
```

### 6. Запуск разработки

```bash
# Все сервисы одновременно
npm run dev

# Или по отдельности:

# Frontend (порт 3000)
cd apps/web && npm run dev

# API (порт 4000)
cd apps/api && npm run dev

# AI Workers (порт 8000)
cd apps/workers && npm run dev
```

## 📁 Структура проекта

### Frontend (`apps/web`)

- Next.js 14 App Router
- TypeScript + Tailwind CSS
- Zustand для state management
- shadcn/ui компоненты

```
apps/web/
├── src/
│   ├── app/          # Next.js pages
│   ├── components/   # React компоненты
│   ├── stores/       # Zustand stores
│   └── lib/          # Утилиты и API client
```

### API (`apps/api`)

- Express.js сервер
- Supabase Auth + Postgres
- Zod валидация
- BullMQ очереди

```
apps/api/
├── src/
│   ├── routes/       # API endpoints
│   ├── middleware/   # Auth, logging, errors
│   ├── lib/          # Supabase client
│   └── utils/        # Logger, errors
└── supabase/
    └── schema.sql    # Database schema
```

### AI Workers (`apps/workers`)

- FastAPI + Python
- Replicate API (SDXL)
- OpenAI GPT-4o-mini
- Redis очереди

```
apps/workers/
├── src/
│   ├── routers/      # API endpoints
│   ├── services/     # AI services
│   ├── config.py     # Settings
│   └── worker.py     # Background worker
```

## 💳 Тарифные планы

| План | Цена | Кредиты | Проекты | Сцены |
|------|------|---------|---------|-------|
| Free | $0 | 10/мес | 3 | 30 |
| Basic | $9.99 | 100/мес | 10 | 100 |
| Pro | $29.99 | 500/мес | ∞ | 500 |
| Enterprise | $99.99 | 2000/мес | ∞ | ∞ |

## 🔧 Технологии

### Frontend
- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI:** shadcn/ui + Radix
- **State:** Zustand
- **HTTP:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express
- **Database:** Supabase (Postgres)
- **Auth:** Supabase Auth
- **Validation:** Zod
- **Queues:** BullMQ + Redis

### AI Workers
- **Language:** Python 3.11
- **Framework:** FastAPI
- **Image Gen:** Replicate (SDXL)
- **LLM:** OpenAI GPT-4o-mini
- **Queues:** Redis + RQ

### Инфраструктура
- **Frontend:** Vercel
- **Backend:** Render/Railway
- **AI:** Modal (GPU)
- **Database:** Supabase
- **Cache:** Redis Cloud

## 📝 API Endpoints

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

## 🔒 Безопасность

- ✅ Supabase Auth (JWT)
- ✅ Row Level Security (RLS)
- ✅ Валидация входных данных (Zod)
- ✅ Rate limiting
- ✅ CORS
- ✅ Helmet.js security headers

## 🧪 Тестирование

```bash
# Frontend тесты
cd apps/web && npm test

# API тесты
cd apps/api && npm test

# Workers тесты
cd apps/workers && pytest
```

## 📦 Деплой

### Frontend (Vercel)

```bash
cd apps/web
vercel deploy
```

### API (Render)

```bash
cd apps/api
npm run build
# Deploy на Render с командой: node dist/index.js
```

### Workers (Modal)

```python
# modal deploy apps/workers/src/main.py
```

## 🤝 Contributing

1. Fork репозиторий
2. Создай ветку (`git checkout -b feature/amazing`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing`)
5. Pull Request

## 📄 License

MIT

## 📞 Контакты

- Email: support@storyboardai.com
- Docs: https://docs.storyboardai.com

---

**Made with ❤️ by Storyboard AI Team**
