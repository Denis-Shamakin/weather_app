import { createApp } from 'vue';
import App from './App.vue';
import './assets/global.scss';

// Создаем экземпляр приложения
const app = createApp(App);

// Монтируем приложение
app.mount('#app');
