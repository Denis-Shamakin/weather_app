<template>
  <div class="weather-display">
    <!-- Локация и время -->
    <div class="weather-display__location">
      <h1 class="weather-display__city">{{ weather.cityName }}, {{ weather.country }}</h1>
    </div>

    <!-- Иконка + температура (центр) -->
    <div class="weather-display__hero">
      <img :src="iconUrl" :alt="weather.condition.description" class="weather-display__icon" />
      <div class="weather-display__temps">
        <span class="weather-display__temp">{{ weather.temperature.temp }}°</span>
        <span class="weather-display__feels">по ощущениям {{ weather.temperature.feels_like }}°</span>
      </div>
    </div>

    <!-- Описание погоды -->
    <p class="weather-display__description">{{ capitalizeFirst(weather.condition.description) }}</p>

    <!-- Диапазон температур -->
    <div class="weather-display__range">
      <span class="weather-display__range-min">↓ {{ weather.temperature.temp_min }}°</span>
      <span class="weather-display__range-sep">/</span>
      <span class="weather-display__range-max">↑ {{ weather.temperature.temp_max }}°</span>
    </div>

    <!-- Карточки деталей -->
    <div class="weather-display__details">
      <div v-for="card in weatherCards" :key="card.id" class="weather-display__card">
        <span class="weather-display__card-icon">{{ card.icon }}</span>
        <span class="weather-display__card-label">{{ card.label }}</span>
        <span class="weather-display__card-value">{{ card.value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type WeatherData } from '@/types/weather';
import { useWeatherComputeds } from '@/composables/useWeatherUtils';
import { useWeatherCards } from '@/composables/useWeatherCards';
import { computed } from 'vue';

const props = defineProps<{
  weather: WeatherData;
}>();

const { cards: weatherCards } = useWeatherCards(props.weather);

const weatherRef = computed(() => props.weather);
const { iconUrl } = useWeatherComputeds(weatherRef);

/**
 * Заглавная буква для описания погоды
 */
function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
</script>

<style lang="scss" scoped>
.weather-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 0 20px;
  animation: fadeIn 0.5s ease;
  width: 100%;
  max-width: 800px;

  // ─── Локация ──────────────────────────────────────────────
  &__location {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
  }

  &__pin {
    font-size: 16px;
  }

  &__city {
    font-family: 'Outfit', sans-serif;
    font-size: 28px;
    font-weight: 600;
    color: #000;
    margin: 0;
    letter-spacing: 0.2px;
  }

  // ─── Иконка + температура ──────────────────────────────────
  &__hero {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    margin: 8px 0 2px;
  }

  &__icon {
    width: 90px;
    height: 90px;
    object-fit: contain;
    filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.25));
    animation: iconFloat 3s ease-in-out infinite;
  }

  &__temps {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  &__temp {
    font-family: 'Outfit', sans-serif;
    font-size: 72px;
    font-weight: 300;
    color: #000;
    line-height: 1;
    letter-spacing: -2px;
  }

  &__feels {
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.7);
    margin-top: 2px;
  }

  // ─── Описание ─────────────────────────────────────────────
  &__description {
    font-family: 'Outfit', sans-serif;
    font-size: 20px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.9);
    margin: 0;
    // text-transform: capitalize;
    letter-spacing: 0.3px;
  }

  // ─── Диапазон температур ──────────────────────────────────
  &__range {
    display: flex;
    gap: 6px;
    align-items: center;
    margin-bottom: 8px;
  }

  &__range-min {
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.55);
  }

  &__range-sep {
    color: rgba(0, 0, 0, 0.3);
    font-size: 14px;
  }

  &__range-max {
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
  }

  // ─── Карточки деталей ─────────────────────────────────────
  &__details {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    width: 100%;
    max-width: 800px;
    margin-top: 12px;
  }

  &__card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 16px 8px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(8px);
    transition:
      background 0.2s ease,
      transform 0.2s ease;
    animation: cardSlideUp 0.4s ease both;

    &:hover {
      background: rgba(255, 255, 255, 0.18);
      transform: translateY(-2px);
    }
  }

  &__card-icon {
    font-size: 22px;
  }

  &__card-label {
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.55);
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  &__card-value {
    font-family: 'Outfit', sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: #000;
    text-align: center;
    line-height: 1.3;
  }

  // ─── Адаптивность ─────────────────────────────────────────
  @media (max-width: 480px) {
    &__city {
      font-size: 18px;
    }

    &__temp {
      font-size: 52px;
    }

    &__icon {
      width: 72px;
      height: 72px;
    }

    &__details {
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }

    &__card {
      padding: 14px 6px;
    }
  }

  @media (max-width: 320px) {
    &__details {
      grid-template-columns: 1fr;
    }

    &__hero {
      flex-direction: column;
      gap: 0;
    }

    &__temps {
      align-items: center;
    }
  }
}

// ─── Анимации ──────────────────────────────────────────────────
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes iconFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

@keyframes cardSlideUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
