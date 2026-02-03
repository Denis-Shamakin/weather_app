<template>
  <div class="search-bar">
    <div class="search-bar__inner">
      <button
        class="search-bar__btn"
        :class="{ 'search-bar__geo-btn--active': showGeoLoader }"
        :disabled="showGeoLoader"
        aria-label="Определить местоположение"
        @click="onGeoClick"
      >
        <MapPinIcon :size="18" />
      </button>
      <input
        ref="inputRef"
        :value="query"
        class="search-bar__input"
        type="text"
        placeholder="Введите название города..."
        autocomplete="off"
        autocorrect="off"
        spellcheck="false"
        @keydown.enter="onSubmit"
        @input="onInput"
      />
      <button
        class="search-bar__btn"
        :class="{ 'search-bar__btn--active': query.trim().length > 0 }"
        :disabled="!query.trim()"
        aria-label="Найти погоду"
        @click="onSubmit"
      >
        <Search :size="18" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { MapPinIcon, Search } from 'lucide-vue-next';

const props = defineProps<{
  modelValue: string;
  geoLoading?: boolean;
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'search'): void;
  (e: 'geolocate'): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const query = ref<string>(props.modelValue);
const showGeoLoader = ref<boolean>(false);

// Синхронизация: когда родитель сбрасывает modelValue (например после поиска)
watch(
  () => props.modelValue,
  (newVal) => {
    query.value = newVal;
  }
);

watch(
  () => props.geoLoading,
  (newVal) => {
    showGeoLoader.value = newVal || false;
  }
);

function onInput(event: Event): void {
  const value = (event.target as HTMLInputElement).value;
  query.value = value;
  emits('update:modelValue', value);
}

function onSubmit(): void {
  if (query.value.trim()) {
    emits('search');
  }
}

function onGeoClick(): void {
  showGeoLoader.value = true;
  emits('geolocate');
}

// Expose для внешнего focus
defineExpose({ focus: () => inputRef.value?.focus() });
</script>

<style lang="scss" scoped>
.search-bar {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;

  &__inner {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 6px 6px 6px;
    border-radius: 40px;
    background: rgba(0, 0, 0, 0.12);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1.5px solid rgba(0, 0, 0, 0.25);
    transition:
      border-color 0.25s ease,
      background 0.25s ease;

    &:focus-within {
      border-color: rgba(0, 0, 0, 0.6);
      background: rgba(0, 0, 0, 0.18);
    }
  }

  &__icon {
    font-size: 18px;
    flex-shrink: 0;
    opacity: 0.7;
  }

  &__input {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    color: #000;
    font-family: 'Outfit', sans-serif;
    font-size: 15px;
    font-weight: 400;
    line-height: 40px;

    &::placeholder {
      color: rgba(0, 0, 0, 0.5);
    }

    // Убрать стили autofill в хромиум
    &:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 30px transparent inset !important;
      -webkit-text-fill-color: #fff !important;
    }
  }

  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    border: none;
    background: rgba(0, 0, 0, 0.15);
    color: rgba(0, 0, 0, 0.5);
    cursor: pointer;
    transition:
      background 0.2s ease,
      color 0.2s ease,
      transform 0.15s ease;
    flex-shrink: 0;

    &:disabled {
      cursor: not-allowed;
    }

    &--active {
      background: rgba(0, 0, 0, 0.3);
      color: #000;

      &:hover {
        background: rgba(0, 0, 0, 0.45);
        transform: scale(1.05);
      }

      &:active {
        transform: scale(0.95);
      }
    }
  }

  &__btn-arrow {
    font-size: 20px;
    transition: transform 0.2s ease;
  }

  // Адаптивность
  @media (max-width: 480px) {
    &__inner {
      padding: 5px 5px 5px 5px;
    }

    &__input {
      font-size: 14px;
    }
  }
}
</style>
