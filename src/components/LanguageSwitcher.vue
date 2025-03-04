<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

const changeLocale = (newLocale: string) => {
  locale.value = newLocale;
  localStorage.setItem('locale', newLocale);
};
</script>

<template>
  <div class="flex items-center space-x-2">
    <span class="text-sm text-gray-600">{{ t('language.select') }}:</span>
    <div class="flex space-x-2">
      <button
        @click="changeLocale('en')"
        :class="[
          'px-3 py-1 text-sm rounded-md transition-colors',
          locale === 'en' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        ]"
      >
        {{ t('language.en') }}
      </button>
      <button
        @click="changeLocale('id')"
        :class="[
          'px-3 py-1 text-sm rounded-md transition-colors',
          locale === 'id' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        ]"
      >
        {{ t('language.id') }}
      </button>
    </div>
  </div>
</template>