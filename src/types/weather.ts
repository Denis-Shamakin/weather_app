// ─── Координаты ─────────────────────────────────────────────
export interface Coordinates {
  lat: number;
  lon: number;
}

// ─── Погодное состояние (массив в ответе API) ────────────────
export interface WeatherCondition {
  id: number;
  main: string; // например: "Clear", "Clouds", "Rain"
  description: string; // например: "clear sky"
  icon: string; // код иконки: "01d", "02n" и т.д.
}

// ─── Температуры ─────────────────────────────────────────────
export interface Temperature {
  temp: number; // текущая температура
  feels_like: number; // по ощущениям
  temp_min: number;
  temp_max: number;
}

// ─── Атмосферные условия ─────────────────────────────────────
export interface Atmosphere {
  humidity: number; // влажность %
  pressure: number; // давление hPa
  visibility?: number; // видимость м
}

// ─── Ветер ───────────────────────────────────────────────────
export interface Wind {
  speed: number; // м/с
  deg: number; // направление градусы
  gust?: number; // порывы м/с
}

// ─── Солнце ──────────────────────────────────────────────────
export interface SunInfo {
  sunrise: number; // unix timestamp
  sunset: number;
}

// ─── Полный ответ от OpenWeatherMap /weather ─────────────────
export interface WeatherApiResponse {
  coord: Coordinates;
  weather: WeatherCondition[];
  main: Temperature & Atmosphere;
  wind: Wind;
  sys: SunInfo & { country: string };
  name: string; // название города
  dt: number; // unix timestamp текущего времени
}

// ─── Внутренняя модель погоды (нормализованная) ─────────────
export interface WeatherData {
  cityName: string;
  country: string;
  coordinates: Coordinates;
  condition: WeatherCondition;
  temperature: Temperature;
  humidity: number;
  pressure: number;
  wind: Wind;
  sunrise: number;
  sunset: number;
  updatedAt: number;
}

// ─── Типы ошибок приложения ──────────────────────────────────
export enum AppErrorType {
  GEOLOCATION_DENIED = 'GEOLOCATION_DENIED',
  GEOLOCATION_UNAVAILABLE = 'GEOLOCATION_UNAVAILABLE',
  GEOLOCATION_TIMEOUT = 'GEOLOCATION_TIMEOUT',
  CITY_NOT_FOUND = 'CITY_NOT_FOUND',
  API_ERROR = 'API_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN = 'UNKNOWN',
}

export interface AppError {
  type: AppErrorType;
  message: string;
  originalError?: unknown;
}

// ─── Состояние загрузки ──────────────────────────────────────
export enum LoadingState {
  IDLE = 'IDLE',
  LOADING_GEO = 'LOADING_GEO',
  LOADING_WEATHER = 'LOADING_WEATHER',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface WeatherCard {
  id: string;
  icon: string;
  label: string;
  value: string | number;
}
