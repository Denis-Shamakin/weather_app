# ☀️ Weather App

Приложение для отображения текущей погоды, написанное на **Vue 3** (Composition API) + **TypeScript** + **Webpack 5**.

---

## Стек технологий

| Технология | Назначение |
|---|---|
| Vue 3 (Composition API) | UI фреймворк |
| TypeScript | Полная статическая типизация |
| Webpack 5 | Сборка проекта |
| Axios | HTTP запросы к OpenWeatherMap |
| SCSS | Стилизация компонентов |

---

## Структура проекта

```
weather-app/
├── public/
│   └── index.html              # HTML шаблон
├── src/
│   ├── assets/
│   │   └── global.scss         # Глобальные стили
│   ├── components/
│   │   ├── ErrorBanner.vue     # Компонент ошибок
│   │   ├── LoadingSpinner.vue  # Индикатор загрузки
│   │   ├── SearchBar.vue       # Поиск города
│   │   └── WeatherDisplay.vue  # Отображение погоды
│   ├── composables/
│   │   ├── useGeolocation.ts   # Геолокация пользователя
│   │   ├── useWeather.ts       # Управление состоянием погоды
|   |   ├── useWeatherCards.ts  # Дополнительная информация о погоде
│   │   └── useWeatherUtils.ts  # Утилиты
│   ├── services/
│   │   └── weatherApi.ts       # Сервис API запросов
│   ├── types/
│   │   └── weather.ts          # TypeScript типы
│   ├── App.vue                 # Корневой компонент
│   ├── main.ts                 # Точка входа
│   └── shims-vue.d.ts          # Типизация .vue файлов
├── .env                        # API ключ (не коммитится)
├── .env.example                # Шаблон .env
├── .gitignore
├── package.json
├── tsconfig.json
└── webpack.config.js
```

---

## Быстрый старт

### 1. Клонировать проект

```bash
git clone <url>
cd weather-app
```

### 2. Установить зависимости

```bash
npm install
```

### 3. Настроить API ключ

Скопируйте `.env.example` в `.env` и вставьте ваш ключ:

```bash
cp .env.example .env
```

Получите бесплатный ключ на [openweathermap.org](https://openweathermap.org/api) после регистрации.

Отредактируйте `.env`:
```
VUE_APP_WEATHER_API_KEY=ваш_ключ_здесь
```

### 4. Запустить dev-сервер

```bash
npm run dev
```

Приложение откроется на `http://localhost:3000`

### 5. Продакшн сборка

```bash
npm run build
```

Готовые файлы появятся в папке `dist/`.

---

### 5. Запуск статического сервера для dist

```bash
npm run serve
```

## Функционал

- ✅ Автоматическое определение геолокации при загрузке
- ✅ Отображение: температура, иконка, описание, влажность, ветер, давление
- ✅ Поиск города по названию
- ✅ Обработка ошибок: геолокация, API, сетевые ошибки
- ✅ Индикатор загрузки
- ✅ Адаптивный интерфейс (мобильные + десктоп)
- ✅ API ключ в `.env`, не зашит в код
- ✅ Полная TypeScript типизация
- ✅ Composition API во всех компонентах
- ✅ Динамическая тема фона по погоде

---

## API

Используется [OpenWeatherMap Current Weather](https://openweathermap.org/api/current-weather):

```
GET https://api.openweathermap.org/data/2.5/weather
  ?lat={lat}&lon={lon}&appid={key}&units=metric&lang=ru
  ?q={city}&appid={key}&units=metric&lang=ru
```

---

## Лицензия

Проект создан как тестовое задание. OpenWeatherMap API — бесплатный тарифный план.
