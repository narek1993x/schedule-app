import { DarkMode } from "../storage";

export default {
  state: {
    loading: false,
    error: null,
    loadedData: {
      schedules: false,
      habits: false,
    },
    darkMode: false || !!DarkMode.get(),
  },
  mutations: {
    setDataIsLoaded(state, payload) {
      state.loadedData[payload] = true;
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
    setError(state, payload) {
      state.error = payload;
    },
    setDarkMode(state, payload) {
      state.darkMode = payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  actions: {
    clearError({ commit }) {
      commit("clearError");
    },
    setDarkMode({ commit }, toggle) {
      DarkMode.set(toggle);
      commit("setDarkMode", toggle);
    },
  },
  getters: {
    loading(state) {
      return state.loading;
    },
    error(state) {
      return state.error;
    },
    loadedData(state) {
      return state.loadedData;
    },
    darkMode(state) {
      return state.darkMode;
    },
  },
};
