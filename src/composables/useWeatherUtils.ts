import { computed, type Ref, type ComputedRef } from 'vue';
import { type WeatherData } from '@/types/weather';

/**
 * Форматировать unix timestamp в HH:MM (по часовому поясу пользователя)
 */
export function formatTime(unixTimestamp: number): string {
  const date = new Date(unixTimestamp * 1000);
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/**
 * Иконка OpenWeatherMap (40px, retina) по коду
 * https://openweathermap.org/weather-conditions#icon-list
 */
export function getWeatherIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

// ─── Палитра фона по main условию погоды ─────────────────────
// Тёплые цвета для солнца, синие для дождя, тёмные для грозы и т.д.
interface GradientTheme {
  primary: string;
  secondary: string;
  accent: string;
}

const WEATHER_THEMES: Record<string, GradientTheme> = {
  Clear: {
    primary: '#f7971e',
    secondary: '#ffd200',
    accent: '#fff7a1',
  },
  Clouds: {
    primary: '#6d8b9c',
    secondary: '#a8c8d8',
    accent: '#dce9f0',
  },
  Atmosphere: {
    primary: '#8e9eab',
    secondary: '#b8c8d4',
    accent: '#e0e8ec',
  },
  Drizzle: {
    primary: '#4a7fa5',
    secondary: '#7ab0d4',
    accent: '#b8d8ee',
  },
  Rain: {
    primary: '#2c5f8a',
    secondary: '#4a90b8',
    accent: '#7cb8dc',
  },
  Snow: {
    primary: '#c5d5e8',
    secondary: '#dfe9f3',
    accent: '#f0f4f8',
  },
  Thunderstorm: {
    primary: '#1a1a2e',
    secondary: '#3d3d6b',
    accent: '#7b7bb5',
  },
};

const DEFAULT_THEME: GradientTheme = {
  primary: '#4a90b8',
  secondary: '#7cb8dc',
  accent: '#b8d8ee',
};

/**
 * Получить тему по main-коду погоды
 */
export function getWeatherTheme(mainCondition: string): GradientTheme {
  return WEATHER_THEMES[mainCondition] ?? DEFAULT_THEME;
}

// ─── Reactive computed утилиты для компонентов ─────────────────

export function useWeatherComputeds(weather: Ref<WeatherData | null> | ComputedRef<WeatherData | null>) {
  const theme = computed<GradientTheme>(() => {
    if (!weather.value) return DEFAULT_THEME;
    return getWeatherTheme(weather.value.condition.main);
  });

  const sunriseFormatted = computed<string>(() => {
    if (!weather.value) return '—';
    return formatTime(weather.value.sunrise);
  });

  const sunsetFormatted = computed<string>(() => {
    if (!weather.value) return '—';
    return formatTime(weather.value.sunset);
  });

  const iconUrl = computed<string>(() => {
    if (!weather.value) return '';
    return getWeatherIconUrl(weather.value.condition.icon);
  });

  const backgroundStyle = computed<Record<string, string>>(() => ({
    background: `linear-gradient(135deg, ${theme.value.primary} 0%, ${theme.value.secondary} 50%, ${theme.value.accent} 100%)`,
  }));

  return {
    theme,
    sunriseFormatted,
    sunsetFormatted,
    iconUrl,
    backgroundStyle,
  };
}
