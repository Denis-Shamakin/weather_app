import { ref, type Ref } from 'vue';
import { type Coordinates, type AppError, AppErrorType } from '@/types/weather';

export interface UseGeolocationReturn {
  coordinates: Ref<Coordinates | null>;
  geoError: Ref<AppError | null>;
  isGeoLoading: Ref<boolean>;
  detectLocation: () => Promise<Coordinates | null>;
}

/**
 * Composable: определение геолокации пользователя через Geolocation API
 */
export function useGeolocation(): UseGeolocationReturn {
  const coordinates = ref<Coordinates | null>(null);
  const geoError = ref<AppError | null>(null);
  const isGeoLoading = ref<boolean>(false);

  /**
   * Запрос геолокации. Возвращает координаты или null (в случае ошибки).
   */
  async function detectLocation(): Promise<Coordinates | null> {
    // Проверка поддержки Geolocation API
    if (!navigator.geolocation) {
      geoError.value = {
        type: AppErrorType.GEOLOCATION_UNAVAILABLE,
        message: 'Геолокация не поддерживается вашим браузером.',
      };
      return null;
    }

    isGeoLoading.value = true;
    geoError.value = null;

    return new Promise<Coordinates | null>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        // ─── Успех ───────────────────────────────────────
        (position) => {
          const coords: Coordinates = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          coordinates.value = coords;
          isGeoLoading.value = false;
          resolve(coords);
        },
        // ─── Ошибки геолокации ────────────────────────────
        (error) => {
          isGeoLoading.value = false;

          switch (error.code) {
            case GeolocationPositionError.PERMISSION_DENIED:
              geoError.value = {
                type: AppErrorType.GEOLOCATION_DENIED,
                message: 'Доступ к геолокации запрещен. Введите название города вручную.',
                originalError: error,
              };
              break;
            case GeolocationPositionError.POSITION_UNAVAILABLE:
              geoError.value = {
                type: AppErrorType.GEOLOCATION_UNAVAILABLE,
                message: 'Не удалось определить местоположение. Введите город вручную.',
                originalError: error,
              };
              break;
            case GeolocationPositionError.TIMEOUT:
              geoError.value = {
                type: AppErrorType.GEOLOCATION_TIMEOUT,
                message: 'Таймаут определения геолокации. Введите город вручную.',
                originalError: error,
              };
              break;
            default:
              geoError.value = {
                type: AppErrorType.GEOLOCATION_UNAVAILABLE,
                message: 'Неизвестная ошибка геолокации.',
                originalError: error,
              };
          }

          resolve(null);
        },
        // ─── Параметры ────────────────────────────────────
        {
          timeout: 8_000,
          enableHighAccuracy: false,
        }
      );
    });
  }

  return {
    coordinates,
    geoError,
    isGeoLoading,
    detectLocation,
  };
}
