export default {
  state: {
    loading: false,
    error: null,
    loadedData: {
      schedules: false,
      habits: false,
    },
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
    clearError(state) {
      state.error = null;
    },
  },
  actions: {
    clearError({ commit }) {
      commit("clearError");
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
  },
};
