import { defineStore } from "pinia";
import axios from "axios";
import type {
  BerriesResponse,
  BerryListItem,
  BerryDetail,
} from "../types/type";

export const useBerryStore = defineStore("berry", {
  state: () => ({
    berries: [] as BerryListItem[],
    totalCount: 0,
    currentPage: 1,
    itemsPerPage: 10,
    searchQuery: "",
    selectedBerry: null as BerryDetail | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    filteredBerries: (state) => {
      if (!state.searchQuery) return state.berries;

      return state.berries.filter((berry) =>
        berry.name.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    },

    paginatedBerries: (state) => {
      const filtered = state.filteredBerries;
      const start = (state.currentPage - 1) * state.itemsPerPage;
      const end = start + state.itemsPerPage;

      return filtered.slice(start, end);
    },

    totalPages: (state) => {
      return Math.ceil(state.filteredBerries.length / state.itemsPerPage);
    },
  },

  actions: {
    async fetchBerries() {
      try {
        this.loading = true;
        this.error = null;

        const response = await axios.get<BerriesResponse>(
          "https://pokeapi.co/api/v2/berry/?limit=100"
        );

        // Sort berries by name in ascending order
        this.berries = [...response.data.results].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        this.totalCount = response.data.count;

        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.error = "Failed to fetch berries";
        console.error("Error fetching berries:", error);
      }
    },

    async fetchBerryDetail(name: string) {
      try {
        this.loading = true;
        this.error = null;

        const response = await axios.get<BerryDetail>(
          `https://pokeapi.co/api/v2/berry/${name}`
        );
        this.selectedBerry = response.data;

        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.error = "Failed to fetch berry details";
        console.error("Error fetching berry details:", error);
      }
    },

    setItemsPerPage(value: number) {
      this.itemsPerPage = value;
      this.currentPage = 1;
    },

    setCurrentPage(page: number) {
      this.currentPage = page;
    },

    setSearchQuery(query: string) {
      this.searchQuery = query;
      this.currentPage = 1;
    },

    clearSelectedBerry() {
      this.selectedBerry = null;
    },
  },

  persist: {
    storage: localStorage,
    paths: ["currentPage", "itemsPerPage", "searchQuery"],
  },
});
