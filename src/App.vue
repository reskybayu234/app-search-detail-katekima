<script setup lang="ts">
import BerryTable from "./components/TableComp.vue";
import LanguageSwitcher from "./components/LanguageSwitcher.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">{{ t("app.title") }}</h1>
          <p class="text-gray-600 mt-1">{{ t("app.subtitle") }}</p>
        </div>
        <LanguageSwitcher class="mt-4 md:mt-0" />
      </div>

      <BerryTable />
    </div>
  </div>
</template>
