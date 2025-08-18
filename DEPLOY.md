# 🚀 Деплой на Render

## 📋 Предварительные требования

1. **Аккаунт на Render** - [render.com](https://render.com)
2. **GitHub репозиторий** с вашим проектом
3. **Telegram Bot Token** от [@BotFather](https://t.me/botfather)
4. **Ваш Telegram ID** (можно узнать у [@userinfobot](https://t.me/userinfobot))

## 🔧 Подготовка проекта

### 1. Обновите package.json
Убедитесь, что в `package.json` есть правильные скрипты:

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/bot.js",
    "dev": "ts-node src/bot.ts"
  }
}
```

### 2. Проверьте tsconfig.json
Убедитесь, что `outDir` установлен в `dist`:

```json
{
  "compilerOptions": {
    "outDir": "dist"
  }
}
```

## 🌐 Деплой на Render

### Шаг 1: Подключение репозитория

1. Войдите в [Render Dashboard](https://dashboard.render.com)
2. Нажмите **"New +"** → **"Web Service"**
3. Подключите ваш GitHub репозиторий
4. Выберите репозиторий `TG-bot`

### Шаг 2: Настройка сервиса

**Основные настройки:**
- **Name**: `tg-bot` (или любое другое имя)
- **Environment**: `Node`
- **Region**: Выберите ближайший к вам регион
- **Branch**: `main` (или ваша основная ветка)
- **Root Directory**: оставьте пустым

**Build & Deploy:**
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### Шаг 3: Переменные окружения

Добавьте следующие переменные в разделе **Environment Variables**:

| Key | Value | Описание |
|-----|-------|----------|
| `BOT_TOKEN` | `ваш_токен_бота` | Токен от @BotFather |
| `ADMIN_ID` | `ваш_telegram_id` | Ваш Telegram ID (число) |
| `NODE_ENV` | `production` | Окружение |

**Важно:** Не включайте токен в код! Используйте переменные окружения.

### Шаг 4: Запуск деплоя

1. Нажмите **"Create Web Service"**
2. Render автоматически начнет сборку и деплой
3. Дождитесь завершения (обычно 2-5 минут)

## 🔍 Проверка деплоя

### Логи
- В Render Dashboard перейдите в **Logs**
- Проверьте, что нет ошибок компиляции
- Убедитесь, что бот запустился

### Тестирование
1. Найдите вашего бота в Telegram
2. Отправьте команду `/start`
3. Проверьте работу админ-панели `/admin`

## 🚨 Возможные проблемы

### Ошибка "Build failed"
- Проверьте логи сборки
- Убедитесь, что все зависимости указаны в `package.json`
- Проверьте синтаксис TypeScript

### Бот не отвечает
- Проверьте переменные окружения
- Убедитесь, что `BOT_TOKEN` правильный
- Проверьте логи выполнения

### Ошибка "Module not found"
- Убедитесь, что `node_modules` не в `.gitignore`
- Проверьте, что все зависимости установлены

