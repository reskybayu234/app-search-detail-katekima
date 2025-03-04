import { createI18n } from 'vue-i18n';
import en from './locales/en';
import id from './locales/id';

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    id
  }
});

export default i18n;