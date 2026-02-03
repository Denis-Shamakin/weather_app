<template>
  <div class="error-banner">
    <div class="error-banner__icon"><component :is="errorIcon" :size="40" /></div>
    <p class="error-banner__message">{{ error.message }}</p>
    <div v-if="showRetry" class="error-banner__actions">
      <button class="error-banner__btn" @click="$emit('retry')">
        <RefreshCw class="error-banner__btn-icon" :size="18" />
        Попробовать снова
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { type AppError, AppErrorType } from '@/types/weather';
import { MapPin, Globe, Search, WifiOff, AlertTriangle, XCircle, RefreshCw } from 'lucide-vue-next';

const props = defineProps<{
  error: AppError;
}>();

defineEmits<{
  (e: 'retry'): void;
}>();

// Иконка по типу ошибки
const errorIcon = computed(() => {
  switch (props.error.type) {
    case AppErrorType.GEOLOCATION_DENIED:
      return MapPin;
    case AppErrorType.GEOLOCATION_UNAVAILABLE:
    case AppErrorType.GEOLOCATION_TIMEOUT:
      return Globe;
    case AppErrorType.CITY_NOT_FOUND:
      return Search;
    case AppErrorType.NETWORK_ERROR:
      return WifiOff;
    case AppErrorType.API_ERROR:
      return AlertTriangle;
    default:
      return XCircle;
  }
});

// Показать кнопку "повтора" только для ошибок где это логично
const showRetry = computed<boolean>(() => {
  return [
    AppErrorType.NETWORK_ERROR,
    AppErrorType.API_ERROR,
    AppErrorType.GEOLOCATION_TIMEOUT,
    AppErrorType.GEOLOCATION_UNAVAILABLE,
  ].includes(props.error.type);
});
</script>

<style lang="scss" scoped>
.error-banner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px 24px;

  &__icon {
    font-size: 40px;
    animation: pulse 2s ease-in-out infinite;
  }

  &__message {
    font-family: 'Outfit', sans-serif;
    font-size: 16px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.85);
    text-align: center;
    max-width: 280px;
    line-height: 1.5;
  }

  &__actions {
    margin-top: 8px;
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 22px;
    border: 1.5px solid rgba(0, 0, 0, 0.45);
    border-radius: 24px;
    background: rgba(0, 0, 0, 0.1);
    color: #000;
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition:
      background 0.2s ease,
      border-color 0.2s ease,
      transform 0.1s ease;
    backdrop-filter: blur(4px);

    &:hover {
      background: rgba(0, 0, 0, 0.2);
      border-color: rgba(0, 0, 0, 0.7);
    }

    &:active {
      transform: scale(0.96);
    }
  }

  &__btn-icon {
    font-size: 18px;
    display: inline-block;
    animation: spin 1.5s linear infinite;
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.12);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
