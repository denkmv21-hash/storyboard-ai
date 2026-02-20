# 🗄️ Настройка Supabase — Пошаговая инструкция

## Шаг 1: Создание аккаунта

1. Перейдите на https://supabase.com
2. Нажмите **"Start your project"** или **"Sign In"**
3. Войдите через GitHub (рекомендуется) или email

---

## Шаг 2: Создание нового проекта

1. В Dashboard нажмите **"New project"**
2. Заполните форму:

```
Organization: [Ваша организация или Personal]
Project name: storyboard-ai
Database password: [Придумайте сложный пароль - сохраните его!]
Region: [Выберите ближайший к вам]
  - East US (Virginia) - для США
  - West Europe (Frankfurt) - для Европы
  - Asia (Singapore) - для Азии
```

3. Нажмите **"Create new project"**
4. ⏳ Дождитесь создания (2-5 минут)

---

## Шаг 3: Получение ключей API

После создания проекта:

1. Перейдите в **Settings** (шестерёнка внизу слева)
2. Выберите **API**
3. Скопируйте 3 значения:

```
Project URL
https://xxxxxxxxxxxxx.supabase.co

anon public
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjAwMDAwMDAwLCJleHAiOjE5MTUzNjAwMDB9.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

service_role
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eCIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MTkxNTM2MDAwMH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

⚠️ **ВАЖНО**: `service_role` ключ даёт полный доступ к базе данных! Никогда не публикуйте его в открытом доступе!

---

## Шаг 4: Настройка переменных окружения

Откройте файл `.env.local` в корне проекта и заполните:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Шаг 5: Выполнение миграции базы данных

### Вариант A: Через SQL Editor (рекомендуется)

1. В панели управления проектом выберите **SQL Editor** (в левом меню)
2. Нажмите **"New query"**
3. Откройте файл `apps/api/supabase/schema.sql` в вашем проекте
4. Скопируйте **всё содержимое** файла
5. Вставьте в SQL Editor
6. Нажмите **"Run"** (или Ctrl+Enter / Cmd+Enter)
7. ✅ Должно появиться сообщение "Success. No rows returned"

### Вариант B: Через файл

Если у вас установлен Supabase CLI:

```bash
# Установите CLI
npm install -g supabase

# Логин
supabase login

# Линк проекта
supabase link --project-ref xxxxxxxxxxxxxxx

# Примените миграцию
supabase db push apps/api/supabase/schema.sql
```

---

## Шаг 6: Проверка миграции

После выполнения SQL скрипта проверьте:

### 1. Таблицы созданы

Перейдите в **Table Editor** и убедитесь, что есть таблицы:

- ✅ users
- ✅ subscriptions
- ✅ projects
- ✅ scenes
- ✅ scripts
- ✅ generation_jobs
- ✅ credit_transactions

### 2. Storage buckets созданы

Перейдите в **Storage** и проверьте бакеты:

- ✅ scripts (private)
- ✅ images (public)
- ✅ exports (public)

### 3. RLS политики активны

Перейдите в **Authentication → Policies** и проверьте:

- ✅ Для каждой таблицы есть политики
- ✅ RLS включён (Enabled)

---

## Шаг 7: Настройка аутентификации

### Email подтверждение (опционально)

1. Перейдите в **Authentication → Providers**
2. Найдите **Email**
3. Если хотите отключить подтверждение email:
   - Отключите **"Confirm email"**
   - Пользователи смогут входить сразу после регистрации

### Социальные провайдеры (опционально)

Для входа через Google/GitHub:

1. **Authentication → Providers**
2. Выберите провайдер (Google, GitHub, etc.)
3. Следуйте инструкциям по настройке OAuth
4. Включите провайдер

---

## Шаг 8: Тестирование подключения

### Создайте тестового пользователя

1. Перейдите в **Authentication → Users**
2. Нажмите **"Add user"**
3. Введите:
   - Email: `test@example.com`
   - Password: `test123456`
   - Auto Confirm User: ✅ (включите)
4. Нажмите **"Add user"**

### Проверьте в базе данных

1. Перейдите в **Table Editor → users**
2. Должен появиться новый пользователь с:
   - `email`: test@example.com
   - `credits`: 10
   - `subscription_tier`: free

---

## Шаг 9: Локальное тестирование

Запустите проект и проверьте регистрацию:

```bash
# Запустите API
cd apps/api && npm run dev

# В другом терминале запустите frontend
cd apps/web && npm run dev
```

1. Откройте http://localhost:3000
2. Нажмите **"Sign Up"**
3. Введите:
   - Email: `newuser@example.com`
   - Password: `password123`
   - Name: `Test User`
4. Нажмите **"Sign Up"**
5. ✅ Должна произойти авторизация
6. Проверьте Table Editor → users (новый пользователь должен быть)

---

## 🔧 Возможные проблемы и решения

### Ошибка: "Invalid API key"

**Причина**: Неправильные ключи в `.env.local`

**Решение**:
1. Проверьте, что используете правильный ключ:
   - `NEXT_PUBLIC_SUPABASE_URL` — Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon public
   - `SUPABASE_SERVICE_ROLE_KEY` — service_role
2. Перезапустите dev-сервер
3. Очистите кэш браузера

### Ошибка: "relation does not exist"

**Причина**: Миграция не выполнена

**Решение**:
1. Откройте SQL Editor
2. Выполните `apps/api/supabase/schema.sql`
3. Проверьте Table Editor (таблицы должны быть)

### Ошибка CORS

**Причина**: Неправильный CORS origin

**Решение**:
1. В Supabase Dashboard: **Settings → API**
2. Добавьте URL в **Site URL**: `http://localhost:3000`
3. Добавьте URL в **Redirect URLs**: `http://localhost:3000/auth/callback`

### Пользователь создаётся, но нет в таблице `users`

**Причина**: Триггер `create_user_record` не работает

**Решение**:
1. Проверьте, что триггер существует:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   ```
2. Если нет, выполните этот SQL:
   ```sql
   CREATE OR REPLACE FUNCTION create_user_record()
   RETURNS TRIGGER AS $$
   BEGIN
       INSERT INTO users (id, email, name, credits, subscription_tier)
       VALUES (
           NEW.id,
           NEW.email,
           NEW.raw_user_meta_data->>'name',
           10,
           'free'
       );
       RETURN NEW;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;

   CREATE TRIGGER on_auth_user_created
       AFTER INSERT ON auth.users
       FOR EACH ROW EXECUTE FUNCTION create_user_record();
   ```

---

## ✅ Чек-лист готовности

- [ ] Проект Supabase создан
- [ ] Ключи API скопированы
- [ ] `.env.local` заполнен
- [ ] Миграция выполнена (SQL скрипт)
- [ ] Таблицы созданы (9 таблиц)
- [ ] Storage buckets созданы (3 бакета)
- [ ] RLS политики активны
- [ ] Тестовый пользователь создан
- [ ] Локальная регистрация работает

---

## 📞 Поддержка

- Документация: https://supabase.com/docs
- Discord: https://discord.supabase.com
- GitHub Issues: https://github.com/supabase/supabase/issues

---

**После завершения** переходите к следующему шагу: развёртывание на Vercel + Render

*Последнее обновление: 20 февраля 2026*
