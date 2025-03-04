<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useBerryStore } from "../store/store";
import { useI18n } from "vue-i18n";
import BerryDetailModal from "./DetailModalComp.vue";

const { t } = useI18n();
const berryStore = useBerryStore();

const perPageOptions = [10, 30, 50];
const showDetailModal = ref(false);

onMounted(() => {
  berryStore.fetchBerries();
});

const handleDetailClick = (berryName: string) => {
  berryStore.fetchBerryDetail(berryName);
  showDetailModal.value = true;
};

const closeDetailModal = () => {
  showDetailModal.value = false;
  berryStore.clearSelectedBerry();
};

const handlePageChange = (page: number) => {
  berryStore.setCurrentPage(page);
};

const handleItemsPerPageChange = (event: Event) => {
  const value = parseInt((event.target as HTMLSelectElement).value);
  berryStore.setItemsPerPage(value);
};

const handleSearchInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  berryStore.setSearchQuery(value);
};

const pageNumbers = computed(() => {
  const totalPages = berryStore.totalPages;
  const currentPage = berryStore.currentPage;

  let pages = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);

    let startPage = Math.max(2, currentPage - 2);
    let endPage = Math.min(totalPages - 1, currentPage + 2);

    if (currentPage <= 4) {
      endPage = 5;
    }

    if (currentPage >= totalPages - 3) {
      startPage = totalPages - 4;
    }

    if (startPage > 2) {
      pages.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) {
      pages.push("...");
    }

    pages.push(totalPages);
  }

  return pages;
});
</script>

<template>
  <div class="w-full max-w-6xl mx-auto p-4">
    <div class="flex flex-col md:flex-row justify-between mb-4 gap-4">
      <div class="w-full md:w-1/2">
        <input
          type="text"
          :placeholder="t('table.search')"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          :value="berryStore.searchQuery"
          @input="handleSearchInput"
        />
      </div>

      <div class="flex items-center">
        <label class="mr-2">{{ t("table.itemsPerPage") }}:</label>
        <select
          class="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          :value="berryStore.itemsPerPage"
          @change="handleItemsPerPageChange"
        >
          <option
            v-for="option in perPageOptions"
            :key="option"
            :value="option"
          >
            {{ option }}
          </option>
        </select>
      </div>
    </div>
    <div class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16"
            >
              {{ t("table.no") }}
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {{ t("table.name") }}
            </th>
            <th
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24"
            >
              {{ t("table.actions") }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <template v-if="berryStore.loading && !berryStore.berries.length">
            <tr>
              <td
                colspan="3"
                class="px-6 py-4 text-center text-sm text-gray-500"
              >
                {{ t("table.loading") }}
              </td>
            </tr>
          </template>
          <template v-else-if="berryStore.paginatedBerries.length === 0">
            <tr>
              <td
                colspan="3"
                class="px-6 py-4 text-center text-sm text-gray-500"
              >
                {{ t("table.noData") }}
              </td>
            </tr>
          </template>
          <template v-else>
            <tr
              v-for="(berry, index) in berryStore.paginatedBerries"
              :key="berry.name"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{
                  (berryStore.currentPage - 1) * berryStore.itemsPerPage +
                  index +
                  1
                }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize"
              >
                {{ berry.name }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
                <button
                  @click="handleDetailClick(berry.name)"
                  class="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-md transition-colors"
                >
                  {{ t("table.detail") }}
                </button>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div class="flex items-center justify-between mt-4">
      <div class="flex items-center">
        <span class="text-sm text-gray-700">
          {{ t("table.page") }} {{ berryStore.currentPage }}
          {{ t("table.of") }} {{ berryStore.totalPages }}
        </span>
      </div>

      <div class="flex space-x-1">
        <button
          v-for="page in pageNumbers"
          :key="typeof page === 'number' ? page : `ellipsis-${page}`"
          @click="typeof page === 'number' ? handlePageChange(page) : null"
          :disabled="typeof page !== 'number'"
          :class="[
            'px-3 py-1 rounded-md text-sm',
            typeof page !== 'number'
              ? 'text-gray-500'
              : page === berryStore.currentPage
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
          ]"
        >
          {{ page }}
        </button>
      </div>
    </div>

    <!-- Berry Detail Modal -->
    <BerryDetailModal
      v-if="showDetailModal"
      :berry="berryStore.selectedBerry"
      @close="closeDetailModal"
    />
  </div>
</template>
