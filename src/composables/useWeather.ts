import { ref, type Ref } from 'vue';
import { type WeatherData, type AppError, type Coordinates, LoadingState, AppErrorType } from '@/types/weather';
import { fetchWeatherByCoordinates, fetchWeatherByCity } from '@/services/weatherApi';
import { useGeolocation } from '@/composables/useGeolocation';

export interface UseWeatherReturn {
  weather: Ref<WeatherData | null>;
  loadingState: Ref<LoadingState>;
  appError: Ref<AppError | null>;
  searchQuery: Ref<string>;
  isLoading: Ref<boolean>;

  initWeather: () => Promise<void>;
  searchByCity: () => Promise<void>;
  retryGeolocation: () => Promise<void>;
}

/**
 * Composable: управление состоянием погоды
 */
export function useWeather(): UseWeatherReturn {
  const weather = ref<WeatherData | null>(null);
  const loadingState = ref<LoadingState>(LoadingState.IDLE);
  const appError = ref<AppError | null>(null);
  const searchQuery = ref<string>('');
  const isLoading = ref<boolean>(false);

  const { detectLocation, geoError } = useGeolocation();

  // ─── Вспомогательная: установить ошибку ─────────────────────
  function setError(error: AppError): void {
    appError.value = error;
    loadingState.value = LoadingState.ERROR;
    isLoading.value = false;
  }

  // ─── Инициализация: геолокация → погода ──────────────────────
  async function initWeather(): Promise<void> {
    loadingState.value = LoadingState.LOADING_GEO;
    isLoading.value = true;
    appError.value = null;

    const coords = await detectLocation();

    // Геолокация не получена — показываем ошибку (но можно ввести город)
    if (!coords) {
      if (geoError.value) {
        setError(geoError.value);
      } else {
        setError({
          type: AppErrorType.GEOLOCATION_UNAVAILABLE,
          message: 'Не удалось определить местоположение. Введите город вручную.',
        });
      }
      return;
    }

    // Координаты есть — загружаем погоду
    await loadWeatherByCoords(coords);
  }

  // ─── Загрузка погоды по координатам ───────────────────────────
  async function loadWeatherByCoords(coords: Coordinates): Promise<void> {
    loadingState.value = LoadingState.LOADING_WEATHER;
    isLoading.value = true;
    appError.value = null;

    try {
      weather.value = await fetchWeatherByCoordinates(coords);
      loadingState.value = LoadingState.SUCCESS;
    } catch (error) {
      setError(error as AppError);
    } finally {
      isLoading.value = false;
    }
  }

  // ─── Поиск по названию города ─────────────────────────────────
  async function searchByCity(): Promise<void> {
    if (!searchQuery.value.trim()) return;

    loadingState.value = LoadingState.LOADING_WEATHER;
    isLoading.value = true;
    appError.value = null;

    try {
      weather.value = await fetchWeatherByCity(searchQuery.value);
      loadingState.value = LoadingState.SUCCESS;
      searchQuery.value = ''; // сброс поля после успешного поиска
    } catch (error) {
      setError(error as AppError);
    } finally {
      isLoading.value = false;
    }
  }

  // ─── Повторная попытка геолокации ─────────────────────────────
  async function retryGeolocation(): Promise<void> {
    await initWeather();
  }

  return {
    weather,
    loadingState,
    appError,
    searchQuery,
    isLoading,
    initWeather,
    searchByCity,
    retryGeolocation,
  };
}
