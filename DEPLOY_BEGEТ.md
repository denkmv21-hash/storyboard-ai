# 🚀 Развёртывание на VPS Beget — Пошаговая инструкция

## 📋 Требования

- VPS тариф от Beget (минимум 2 GB RAM, 2 CPU)
- Домен (опционально, но рекомендуется)
- SSH доступ к серверу
- Базовые знания Linux

---

## 📦 Этап 1: Заказ и настройка VPS на Beget

### Шаг 1.1: Заказ виртуального сервера

1. Войдите в аккаунт на https://beget.com
2. Перейдите в раздел **"VPS"**
3. Нажмите **"Заказать VPS"**
4. Выберите конфигурацию:

```
Рекомендуемая конфигурация для Storyboard AI:

✅ CPU: 2 ядра
✅ RAM: 2 GB (минимум)
✅ SSD: 20 GB
✅ ОС: Ubuntu 22.04 LTS
✅ Root-доступ: включён
```

5. Оплатите тариф (≈350-500 руб/мес)
6. Дождитесь активации (5-15 минут)

### Шаг 1.2: Получение данных для подключения

После активации VPS вы получите:

```
IP-адрес сервера: xxx.xxx.xxx.xxx
Логин: root
Пароль: ******** (придёт на email)
```

---

## 🔐 Этап 2: Подключение к серверу по SSH

### Шаг 2.1: Подключение с Windows

**Вариант A: PowerShell**
```powershell
ssh root@xxx.xxx.xxx.xxx
```

**Вариант B: PuTTY**
1. Скачайте PuTTY: https://www.putty.org
2. В поле "Host Name": `xxx.xxx.xxx.xxx`
3. Port: `22`
4. Нажмите "Open"
5. Введите логин: `root`
6. Введите пароль

**Вариант C: Termius (рекомендуется)**
1. Установите Termius: https://termius.com
2. Добавьте новый хост
3. Введите IP, логин, пароль
4. Подключитесь

### Шаг 2.2: Смена пароля (обязательно!)

```bash
passwd
```

Введите новый пароль (минимум 12 символов).

### Шаг 2.3: Обновление системы

```bash
apt update && apt upgrade -y
```

---

## 🛠️ Этап 3: Установка необходимого ПО

### Шаг 3.1: Установка Node.js 20.x

```bash
# Скачайте скрипт установки
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -

# Установите Node.js
apt install -y nodejs

# Проверьте версию
node -v  # Должно быть v20.x.x
npm -v   # Должно быть 10.x.x
```

### Шаг 3.2: Установка Python 3.11

```bash
# Обновите репозитории
apt update

# Установите Python и зависимости
apt install -y python3.11 python3.11-venv python3.11-dev python3-pip

# Проверьте версию
python3.11 --version  # Должно быть 3.11.x
```

### Шаг 3.3: Установка Redis

```bash
# Установите Redis
apt install -y redis-server

# Включите автозапуск
systemctl enable redis
systemctl start redis

# Проверьте статус
systemctl status redis

# Проверьте подключение
redis-cli ping  # Должно вернуть: PONG
```

### Шаг 3.4: Установка Git

```bash
apt install -y git
git --version
```

### Шаг 3.5: Установка Nginx

```bash
apt install -y nginx
systemctl enable nginx
systemctl start nginx
systemctl status nginx
```

### Шаг 3.6: Установка Certbot (для SSL)

```bash
apt install -y certbot python3-certbot-nginx
```

---

## 📁 Этап 4: Настройка проекта на сервере

### Шаг 4.1: Создание пользователя для приложения

```bash
# Создайте пользователя
adduser storyboard

# Переключитесь на пользователя
su - storyboard
```

### Шаг 4.2: Клонирование репозитория

```bash
# Убедитесь, что код на GitHub
# Затем клонируйте
cd /home/storyboard
git clone https://github.com/ваш-username/storyboard-ai.git
cd storyboard-ai
```

### Шаг 4.3: Установка зависимостей

```bash
# Установите зависимости корневого проекта
npm install

# Установите зависимости API
cd apps/api
npm install
npm run build
cd ../..

# Установите зависимости Web
cd apps/web
npm install
npm run build
cd ../..
```

### Шаг 4.4: Настройка Python workers

```bash
# Перейдите в директорию workers
cd apps/workers

# Создайте виртуальное окружение
python3.11 -m venv venv

# Активируйте окружение
source venv/bin/activate

# Установите зависимости
pip install -r pyproject.toml

# Деактивируйте окружение
deactivate

cd ../..
```

---

## 🔧 Этап 5: Настройка переменных окружения

### Шаг 5.1: Создание .env.local

```bash
cd /home/storyboard/storyboard-ai
nano .env.local
```

### Шаг 5.2: Заполните файл

```env
# ===========================================
# SUPABASE
# ===========================================
NEXT_PUBLIC_SUPABASE_URL=https://ваш-проект.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш-anon-ключ
SUPABASE_SERVICE_ROLE_KEY=ваш-service-role-ключ

# ===========================================
# AI SERVICES
# ===========================================
REPLICATE_API_KEY=r8_ваш-ключ
OPENAI_API_KEY=sk-ваш-ключ

# ===========================================
# STRIPE (для платежей)
# ===========================================
STRIPE_SECRET_KEY=sk_test_ваш-ключ
STRIPE_PUBLISHABLE_KEY=pk_test_ваш-ключ
STRIPE_WEBHOOK_SECRET=whsec_ваш-секрет

# ===========================================
# REDIS
# ===========================================
REDIS_URL=redis://localhost:6379

# ===========================================
# APPLICATION
# ===========================================
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://ваш-домен.ru
NEXT_PUBLIC_API_URL=https://api.ваш-домен.ru

API_PORT=4000
API_URL=http://localhost:4000
WORKERS_URL=http://localhost:8000
JWT_SECRET=случайная-строка-минимум-64-символа-для-продакшена

# ===========================================
# LIMITS
# ===========================================
MAX_FILE_SIZE_MB=10
MAX_SCENES_PER_PROJECT=100
MAX_CONCURRENT_GENERATIONS=3

# ===========================================
# DEBUG
# ===========================================
DEBUG_AI=false
LOG_LEVEL=info
```

**Сохраните**: Ctrl+O, Enter, Ctrl+X

### Шаг 5.3: Генерация JWT_SECRET

```bash
# Сгенерируйте случайную строку
openssl rand -base64 48
```

Скопируйте вывод и вставьте в `JWT_SECRET`.

---

## 🚀 Этап 6: Настройка systemd сервисов

### Шаг 6.1: Сервис для API

```bash
nano /etc/systemd/system/storyboard-api.service
```

Вставьте содержимое:

```ini
[Unit]
Description=Storyboard AI API
After=network.target redis.service

[Service]
Type=simple
User=storyboard
WorkingDirectory=/home/storyboard/storyboard-ai/apps/api
ExecStart=/usr/bin/node dist/index.js
Restart=on-failure
RestartSec=10
Environment=NODE_ENV=production
EnvironmentFile=/home/storyboard/storyboard-ai/.env.local

# Security
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

**Сохраните**: Ctrl+O, Enter, Ctrl+X

### Шаг 6.2: Сервис для Web (Next.js)

```bash
nano /etc/systemd/system/storyboard-web.service
```

Вставьте содержимое:

```ini
[Unit]
Description=Storyboard AI Web Frontend
After=network.target storyboard-api.service

[Service]
Type=simple
User=storyboard
WorkingDirectory=/home/storyboard/storyboard-ai/apps/web
ExecStart=/usr/bin/npm run start
Restart=on-failure
RestartSec=10
Environment=NODE_ENV=production
EnvironmentFile=/home/storyboard/storyboard-ai/.env.local

# Security
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

**Сохраните**: Ctrl+O, Enter, Ctrl+X

### Шаг 6.3: Сервис для AI Workers

```bash
nano /etc/systemd/system/storyboard-workers.service
```

Вставьте содержимое:

```ini
[Unit]
Description=Storyboard AI Workers
After=network.target redis.service

[Service]
Type=simple
User=storyboard
WorkingDirectory=/home/storyboard/storyboard-ai/apps/workers
ExecStart=/home/storyboard/storyboard-ai/apps/workers/venv/bin/python -m uvicorn src.main:app --host 0.0.0.0 --port 8000
Restart=on-failure
RestartSec=10
EnvironmentFile=/home/storyboard/storyboard-ai/.env.local

# Security
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

**Сохраните**: Ctrl+O, Enter, Ctrl+X

### Шаг 6.4: Запуск сервисов

```bash
# Перезагрузите systemd
systemctl daemon-reload

# Включите автозапуск
systemctl enable storyboard-api
systemctl enable storyboard-web
systemctl enable storyboard-workers

# Запустите сервисы
systemctl start storyboard-api
systemctl start storyboard-web
systemctl start storyboard-workers

# Проверьте статус
systemctl status storyboard-api
systemctl status storyboard-web
systemctl status storyboard-workers
```

---

## 🌐 Этап 7: Настройка Nginx

### Шаг 7.1: Конфигурация для API

```bash
nano /etc/nginx/sites-available/api.ваш-домен.ru
```

Вставьте содержимое:

```nginx
server {
    listen 80;
    server_name api.ваш-домен.ru;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Сохраните**: Ctrl+O, Enter, Ctrl+X

### Шаг 7.2: Конфигурация для Web

```bash
nano /etc/nginx/sites-available/ваш-домен.ru
```

Вставьте содержимое:

```nginx
server {
    listen 80;
    server_name ваш-домен.ru www.ваш-домен.ru;

    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 60m;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

**Сохраните**: Ctrl+O, Enter, Ctrl+X

### Шаг 7.3: Включение конфигураций

```bash
# Создайте символические ссылки
ln -s /etc/nginx/sites-available/api.ваш-домен.ru /etc/nginx/sites-enabled/
ln -s /etc/nginx/sites-available/ваш-домен.ru /etc/nginx/sites-enabled/

# Удалите дефолтную конфигурацию
rm /etc/nginx/sites-enabled/default

# Проверьте конфигурацию
nginx -t

# Перезапустите Nginx
systemctl restart nginx
```

---

## 🔒 Этап 8: Настройка SSL (HTTPS)

### Шаг 8.1: Получение сертификатов

```bash
# Для основного домена
certbot --nginx -d ваш-домен.ru -d www.ваш-домен.ru

# Для API поддомена
certbot --nginx -d api.ваш-домен.ru
```

### Шаг 8.2: Автоматическое обновление

Certbot автоматически настроит cron для обновления сертификатов.

Проверьте:
```bash
certbot renew --dry-run
```

---

## 🛡️ Этап 9: Настройка фаервола

### Шаг 9.1: Установка UFW

```bash
apt install -y ufw
```

### Шаг 9.2: Настройка правил

```bash
# Разрешите SSH
ufw allow OpenSSH

# Разрешите HTTP/HTTPS
ufw allow 'Nginx Full'

# Включите фаервол
ufw enable

# Проверьте статус
ufw status
```

---

## ✅ Этап 10: Проверка работы

### Шаг 10.1: Проверка сервисов

```bash
# Все сервисы должны быть active (running)
systemctl status storyboard-api
systemctl status storyboard-web
systemctl status storyboard-workers
systemctl status nginx
systemctl status redis
```

### Шаг 10.2: Проверка endpoints

```bash
# API health check
curl http://localhost:4000/health

# Web frontend
curl http://localhost:3000
```

### Шаг 10.3: Проверка через браузер

Откройте в браузере:
- https://ваш-домен.ru
- https://api.ваш-домен.ru/health

---

## 📊 Мониторинг и логи

### Просмотр логов сервисов

```bash
# API логи
journalctl -u storyboard-api -f

# Web логи
journalctl -u storyboard-web -f

# Workers логи
journalctl -u storyboard-workers -f

# Nginx логи
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Перезапуск сервисов

```bash
# Перезапустить конкретный сервис
systemctl restart storyboard-api

# Перезапустить все
systemctl restart storyboard-api storyboard-web storyboard-workers
```

---

## 🔄 Обновление проекта

```bash
# Перейдите в директорию проекта
cd /home/storyboard/storyboard-ai

# Переключитесь на пользователя storyboard
su - storyboard

# Потяните изменения
git pull

# Пересоберите
npm run build

# Перезапустите сервисы
exit  # выйти из пользователя storyboard
systemctl restart storyboard-api
systemctl restart storyboard-web
systemctl restart storyboard-workers
```

---

## ⚠️ Решение проблем

### Сервис не запускается

```bash
# Проверьте логи
journalctl -u storyboard-api -f

# Проверьте переменные окружения
cat /home/storyboard/storyboard-ai/.env.local
```

### Ошибка "Cannot find module"

```bash
# Переустановите зависимости
cd /home/storyboard/storyboard-ai/apps/api
rm -rf node_modules
npm install
npm run build
systemctl restart storyboard-api
```

### Ошибка подключения к Redis

```bash
# Проверьте статус Redis
systemctl status redis

# Перезапустите Redis
systemctl restart redis
```

### Nginx возвращает 502 Bad Gateway

```bash
# Проверьте, что сервисы запущены
systemctl status storyboard-api
systemctl status storyboard-web

# Проверьте логи Nginx
tail -f /var/log/nginx/error.log
```

---

## 💰 Стоимость на Beget

| Тариф | CPU | RAM | SSD | Цена/мес |
|-------|-----|-----|-----|----------|
| VPS 1 | 1 ядро | 1 GB | 15 GB | ≈250 руб |
| VPS 2 | 2 ядра | 2 GB | 25 GB | ≈450 руб ✅ |
| VPS 3 | 3 ядра | 3 GB | 35 GB | ≈650 руб |

**Рекомендуется**: VPS 2 (2 ядра, 2 GB RAM)

---

## 📞 Поддержка Beget

- Техподдержка: https://beget.com/support
- База знаний: https://beget.com/kb
- Telegram: @beget_com

---

## ✅ Финальный чек-лист

- [ ] VPS заказан и активирован
- [ ] Подключение по SSH работает
- [ ] Node.js 20.x установлен
- [ ] Python 3.11 установлен
- [ ] Redis установлен и запущен
- [ ] Nginx установлен и настроен
- [ ] Проект склонирован
- [ ] Зависимости установлены
- [ ] .env.local заполнен
- [ ] Systemd сервисы созданы и запущены
- [ ] Nginx конфигурации настроены
- [ ] SSL сертификаты получены
- [ ] Фаервол настроен
- [ ] Сайт открывается по HTTPS
- [ ] API health check работает

---

**После завершения**: протестируйте регистрацию и генерацию изображений!

*Последнее обновление: 20 февраля 2026*
