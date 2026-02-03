<template>
  <div class="app" :style="appBackground">
    <!-- Декоративные фоновые сферы -->
    <div class="app__bg-orb app__bg-orb--1"></div>
    <div class="app__bg-orb app__bg-orb--2"></div>
    <div class="app__bg-orb app__bg-orb--3"></div>

    <!-- Контент -->
    <main class="app__content">
      <!-- Заголовок -->
      <header class="app__header">
        <h1 class="app__title">☀️ Weather</h1>
      </header>

      <!-- Поиск -->
      <section class="app__search">
        <SearchBar
          :model-value="searchQuery"
          :geo-loading="isGeolocating"
          @update:model-value="searchQuery = $event"
          @search="searchByCity"
          @geolocate="getCurrentLocationWeather"
        />
      </section>

      <!-- Основная область -->
      <section class="app__body">
        <!-- Загрузка -->
        <LoadingSpinner v-if="isLoading" :label="loadingLabel" />

        <!-- Ошибка -->
        <ErrorBanner v-else-if="appError" :error="appError" @retry="retryGeolocation" />

        <!-- Погода -->
        <WeatherDisplay v-else-if="weather" :weather="weather" />

        <!-- Начальный экран (если всё сбросилось) -->
        <div v-else class="app__empty">
          <p class="app__empty-text">Введите город для поиска погоды</p>
        </div>
      </section>

      <!-- Футер -->
      <footer class="app__footer">
        <p class="app__footer-text">
          Данные от
          <a href="https://openweathermap.org" target="_blank" rel="noopener noreferrer" class="app__footer-link"
            >OpenWeatherMap</a
          >
        </p>
      </footer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { LoadingState } from '@/types/weather';
import { useWeather } from '@/composables/useWeather';
import { useWeatherComputeds } from '@/composables/useWeatherUtils';

import SearchBar from '@/components/SearchBar.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import ErrorBanner from '@/components/ErrorBanner.vue';
import WeatherDisplay from '@/components/WeatherDisplay.vue';

// ─── Composable: погода ──────────────────────────────────────
const { weather, loadingState, appError, searchQuery, isLoading, initWeather, searchByCity, retryGeolocation } =
  useWeather();

// ─── Computed: фон приложения ─────────────────────────────────
const { backgroundStyle } = useWeatherComputeds(weather);

// ─── Дополнительное состояние для геолокации ──────────────────
const isGeolocating = ref<boolean>(false);

const appBackground = computed(() => {
  // Если погода загружена — используем тему из данных
  if (weather.value) {
    return backgroundStyle.value;
  }
  // Иначе нейтральный синий градиент
  return {
    background: 'linear-gradient(135deg, #1e3a5f 0%, #2e6b9e 50%, #5a9bbf 100%)',
  };
});

// ─── Computed: лейбл загрузки ─────────────────────────────────
const loadingLabel = computed<string>(() => {
  switch (loadingState.value) {
    case LoadingState.LOADING_GEO:
      return 'Определяем местоположение...';
    case LoadingState.LOADING_WEATHER:
      return 'Загружаем погоду...';
    default:
      return 'Загрузка...';
  }
});

// ─── Функция для ручного запуска геолокации ───────────────────
async function getCurrentLocationWeather(): Promise<void> {
  isGeolocating.value = true;
  try {
    await retryGeolocation();
  } finally {
    isGeolocating.value = false;
  }
}

// ─── Инициализация ───────────────────────────────────────────
onMounted(() => {
  initWeather();
});
</script>

<style lang="scss" scoped>
.app {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  transition: background 0.8s ease;

  // ─── Декоративные сферы (фон) ───────────────────────────────
  &__bg-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
    z-index: 0;
    opacity: 0.35;
    transition: background 0.8s ease;
  }

  &__bg-orb--1 {
    width: 360px;
    height: 360px;
    top: -120px;
    left: -100px;
    background: rgba(0, 0, 0, 0.3);
    animation: orbDrift1 12s ease-in-out infinite;
  }

  &__bg-orb--2 {
    width: 280px;
    height: 280px;
    bottom: -80px;
    right: -60px;
    background: rgba(0, 0, 0, 0.2);
    animation: orbDrift2 15s ease-in-out infinite;
  }

  &__bg-orb--3 {
    width: 200px;
    height: 200px;
    top: 40%;
    left: 60%;
    background: rgba(0, 0, 0, 0.15);
    animation: orbDrift3 10s ease-in-out infinite;
  }

  // ─── Контент ──────────────────────────────────────────────
  &__content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    padding: 40px 20px 30px;
  }

  // ─── Заголовок ────────────────────────────────────────────
  &__header {
    margin-bottom: 28px;
  }

  &__title {
    font-family: 'Outfit', sans-serif;
    font-size: 28px;
    font-weight: 700;
    color: #000;
    margin: 0;
    letter-spacing: -0.5px;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  }

  // ─── Поиск ────────────────────────────────────────────────
  &__search {
    width: 100%;
    max-width: 420px;
    margin-bottom: 36px;
  }

  // ─── Тело ─────────────────────────────────────────────────
  &__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    max-width: 800px;
  }

  // ─── Пустое состояние ─────────────────────────────────────
  &__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    padding: 60px 0;
  }

  &__empty-text {
    font-family: 'Outfit', sans-serif;
    font-size: 16px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.6);
    text-align: center;
  }

  // ─── Футер ────────────────────────────────────────────────
  &__footer {
    margin-top: auto;
    padding-top: 24px;
  }

  &__footer-text {
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.4);
    margin: 0;
    text-align: center;
  }

  &__footer-link {
    color: rgba(0, 0, 0, 0.65);
    text-decoration: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.3);

    &:hover {
      color: #000;
      border-bottom-color: rgba(0, 0, 0, 0.7);
    }
  }

  // ─── Адаптивность ─────────────────────────────────────────
  @media (max-width: 480px) {
    &__content {
      padding: 28px 16px 24px;
    }

    &__title {
      font-size: 24px;
    }

    &__header {
      margin-bottom: 20px;
    }

    &__search {
      margin-bottom: 28px;
    }
  }
}

// ─── Анимации орбит ───────────────────────────────────────────
@keyframes orbDrift1 {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(40px, 30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 50px) scale(0.95);
  }
}

@keyframes orbDrift2 {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(-50px, -40px) scale(1.15);
  }
}

@keyframes orbDrift3 {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-30px, 40px) scale(1.1);
  }
}
</style>
