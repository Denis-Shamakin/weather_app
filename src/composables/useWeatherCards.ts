import { computed } from 'vue';
import { type WeatherData, type WeatherCard } from '@/types/weather';

export function useWeatherCards(weather: WeatherData) {
  const cards = computed<WeatherCard[]>(() => {
    const baseCards: WeatherCard[] = [
      {
        id: 'humidity',
        icon: '💧',
        label: 'Влажность',
        value: `${weather.humidity}%`,
      },
      {
        id: 'wind',
        icon: '💨',
        label: 'Ветер',
        value: `${weather.wind.speed.toFixed(1)} м/с`,
      },
    ];
    return baseCards;
  });

  return { cards };
}
