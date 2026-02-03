<template>
  <div class="spinner-wrap">
    <div class="spinner">
      <div class="spinner__ring"></div>
      <div class="spinner__ring"></div>
      <div class="spinner__ring"></div>
    </div>
    <p class="spinner__label">{{ label }}</p>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ label?: string }>(), {
  label: 'Загрузка...',
});
</script>

<style lang="scss" scoped>
.spinner-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 60px 0;
}

.spinner {
  position: relative;
  width: 52px;
  height: 52px;

  &__ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 3px solid transparent;
    border-top-color: rgba(0, 0, 0, 0.9);
    animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;

    &:nth-child(2) {
      inset: 6px;
      border-top-color: rgba(0, 0, 0, 0.6);
      animation-delay: -0.2s;
    }

    &:nth-child(3) {
      inset: 12px;
      border-top-color: rgba(0, 0, 0, 0.3);
      animation-delay: -0.4s;
    }
  }
}

.spinner__label {
  font-family: 'Outfit', sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.8);
  letter-spacing: 0.5px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
