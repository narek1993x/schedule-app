import { getUserHabits, addUserHabit } from "../libs/db";

export default {
  state: {
    allHabits: [],
  },
  mutations: {
    setAllHabits(state, payload) {
      state.allHabits = payload;
    },
    addHabit(state, payload) {
      state.allHabits = [...state.allHabits, payload];
    },
  },
  actions: {
    async getAllHabits({ commit, getters }) {
      commit("clearError");
      commit("setLoading", true);

      try {
        const resultHabits = await getUserHabits(getters.user.uid);

        commit("setLoading", false);
        commit("setDataIsLoaded", "habits");
        commit("setAllHabits", resultHabits);
      } catch (error) {
        commit("setLoading", false);
        commit("setError", error.message);
        throw error;
      }
    },
    async addHabit({ commit, getters }, habit) {
      commit("clearError");
      commit("setLoading", true);

      try {
        const resultHabit = await addUserHabit(getters.user.uid, habit);

        commit("addHabit", resultHabit);
        commit("setLoading", false);
      } catch (error) {
        commit("setLoading", false);
        commit("setError", error.message);
        throw error;
      }
    },
  },
  getters: {
    allHabits: (state) => state.allHabits,
  },
};
