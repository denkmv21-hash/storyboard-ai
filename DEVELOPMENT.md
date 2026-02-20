# Storyboard AI — Local Development

## Минимальные требования

1. **Установите переменные окружения**

Скопируйте `.env.example` в `.env.local` и заполните:

```env
# Обязательно для локальной разработки
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Для AI генерации
REPLICATE_API_KEY=r8_your-key
OPENAI_API_KEY=sk-your-key

# Redis (локальный)
REDIS_URL=redis://localhost:6379

# Приложение
NEXT_PUBLIC_APP_URL=http://localhost:3000
API_URL=http://localhost:4000
WORKERS_URL=http://localhost:8000
JWT_SECRET=your-secret-key-min-32-characters
```

2. **Запустите Redis**

```bash
# Docker (рекомендуется)
docker run -d -p 6379:6379 --name storyboard-redis redis:7-alpine

# Или через Homebrew (macOS)
brew install redis
redis-server

# Или через Chocolatey (Windows)
choco install redis-64
redis-server
```

3. **Настройте Supabase**

a. Создайте проект на https://supabase.com

b. Выполните SQL миграцию:
   - Зайдите в Supabase Dashboard → SQL Editor
   - Скопируйте содержимое `apps/api/supabase/schema.sql`
   - Выполните скрипт

c. Скопируйте URL и ключи в `.env.local`

4. **Установите зависимости**

```bash
npm install
```

5. **Запустите все сервисы**

```bash
# Корневая директория
npm run dev
```

Или по отдельности:

```bash
# Terminal 1 - Frontend (3000)
cd apps/web && npm run dev

# Terminal 2 - API (4000)
cd apps/api && npm run dev

# Terminal 3 - Workers (8000)
cd apps/workers
python -m uvicorn src.main:app --reload
```

## Проверка

- Frontend: http://localhost:3000
- API Health: http://localhost:4000/health
- Workers Health: http://localhost:8000

## Тестовый аккаунт

После настройки Supabase:

1. Зарегистрируйтесь через http://localhost:3000/signup
2. Проверьте таблицу `users` в Supabase
3. Новые пользователи получают 10 бесплатных кредитов

## Частые проблемы

### Redis не подключается

```bash
# Проверьте что Redis запущен
redis-cli ping
# Должен вернуть: PONG
```

### Supabase ошибка авторизации

- Проверьте что `SUPABASE_URL` и ключи верные
- Убедитесь что миграция выполнена
- Проверьте RLS политики в Supabase

### AI генерация не работает

- Проверьте `REPLICATE_API_KEY` в `.env.local`
- Убедитесь что worker запущен
- Проверьте логи workers в консоли

## Production сборка

```bash
# Build всех сервисов
npm run build

# API
cd apps/api && npm run build

# Frontend
cd apps/web && npm run build
```
