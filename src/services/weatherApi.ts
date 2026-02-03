import axios, { AxiosError, isAxiosError } from 'axios';
import { Coordinates, WeatherApiResponse, WeatherData, AppError, AppErrorType } from '@/types/weather';

// ─── Конфигурация ────────────────────────────────────────────
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const API_KEY = process.env.VUE_APP_WEATHER_API_KEY;

const weatherClient = axios.create({
  baseURL: API_BASE_URL,
  params: {
    appid: API_KEY,
    units: 'metric',
    lang: 'ru',
  },
  timeout: 10_000, // 10 секунд таймаут
});

// ─── Нормализация ответа API → внутренняя модель ─────────────
function normalizeWeatherData(response: WeatherApiResponse): WeatherData {
  return {
    cityName: response.name,
    country: response.sys.country,
    coordinates: response.coord,
    condition: response.weather[0],
    temperature: {
      temp: Math.round(response.main.temp),
      feels_like: Math.round(response.main.feels_like),
      temp_min: Math.round(response.main.temp_min),
      temp_max: Math.round(response.main.temp_max),
    },
    humidity: response.main.humidity,
    pressure: response.main.pressure,
    wind: response.wind,
    sunrise: response.sys.sunrise,
    sunset: response.sys.sunset,
    updatedAt: response.dt,
  };
}

// ─── Маппинг ошибок Axios → AppError ─────────────────────────
function mapAxiosError(error: unknown): AppError {
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError;

    // Нет ответа — сетевая ошибка
    if (!axiosError.response) {
      return {
        type: AppErrorType.NETWORK_ERROR,
        message: 'Нет соединения с интернетом. Проверьте подключение и попробуйте снова.',
        originalError: error,
      };
    }

    // 401 — некорректный API ключ
    if (axiosError.response.status === 401) {
      return {
        type: AppErrorType.API_ERROR,
        message: 'Некорректный API ключ. Проверьте .env файл.',
        originalError: error,
      };
    }

    // 404 — город не найден
    if (axiosError.response.status === 404) {
      return {
        type: AppErrorType.CITY_NOT_FOUND,
        message: 'Город не найден. Проверьте название и попробуйте снова.',
        originalError: error,
      };
    }

    // 429 — лимит запросов
    if (axiosError.response.status === 429) {
      return {
        type: AppErrorType.API_ERROR,
        message: 'Превышён лимит запросов. Попробуйте через несколько минут.',
        originalError: error,
      };
    }

    return {
      type: AppErrorType.API_ERROR,
      message: `Ошибка сервера: ${axiosError.response.status}`,
      originalError: error,
    };
  }

  return {
    type: AppErrorType.UNKNOWN,
    message: 'Произошла неизвестная ошибка.',
    originalError: error,
  };
}

// ─── Публичные методы сервиса ─────────────────────────────────

/**
 * Получить погоду по координатам (геолокация)
 */
export async function fetchWeatherByCoordinates(coords: Coordinates): Promise<WeatherData> {
  try {
    const response = await weatherClient.get<WeatherApiResponse>('/weather', {
      params: {
        lat: coords.lat,
        lon: coords.lon,
      },
    });
    return normalizeWeatherData(response.data);
  } catch (error) {
    throw mapAxiosError(error);
  }
}

/**
 * Получить погоду по названию города
 */
export async function fetchWeatherByCity(cityName: string): Promise<WeatherData> {
  const trimmed = cityName.trim();
  if (!trimmed) {
    throw {
      type: AppErrorType.API_ERROR,
      message: 'Введите название города.',
    } as AppError;
  }

  try {
    const response = await weatherClient.get<WeatherApiResponse>('/weather', {
      params: {
        q: trimmed,
      },
    });
    return normalizeWeatherData(response.data);
  } catch (error) {
    throw mapAxiosError(error);
  }
}
