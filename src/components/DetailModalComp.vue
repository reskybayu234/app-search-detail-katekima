<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import { useI18n } from "vue-i18n";
import type { BerryDetail } from "../types/type";

const { t } = useI18n();

const props = defineProps<{
  berry: BerryDetail | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const closeModal = () => {
  emit("close");
};
</script>

<template>
  <div
    v-if="berry"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
  >
    <div
      class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto"
    >
      <div class="p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-gray-800">
            {{ t("detail.title") }}
          </h2>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div class="bg-gray-100 p-4 rounded-lg">
            <div class="grid grid-cols-2 gap-2">
              <div class="text-gray-600">{{ t("detail.id") }}:</div>
              <div class="font-medium">{{ berry.id }}</div>

              <div class="text-gray-600">{{ t("detail.name") }}:</div>
              <div class="font-medium capitalize">{{ berry.name }}</div>
            </div>
          </div>

          <button
            @click="closeModal"
            class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {{ t("detail.close") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
