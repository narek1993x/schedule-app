import { getUserHabits, addUserHabit, updateUserHabit, removeUserHabit } from "../libs/db";

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
    editHabit(state, payload) {
      const habitIndex = state.allHabits.findIndex((h) => h.id === payload.id);
      state.allHabits = [...state.allHabits.slice(0, habitIndex), payload, ...state.allHabits.slice(habitIndex + 1)];
    },
    removeHabit(state, habitId) {
      const habitIndex = state.allHabits.findIndex((s) => s.id === habitId);
      state.allHabits = [...state.allHabits.slice(0, habitIndex), ...state.allHabits.slice(habitIndex + 1)];
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
    async editHabit({ commit, getters }, habit) {
      commit("clearError");
      commit("setLoading", true);

      try {
        await updateUserHabit(getters.user.uid, habit);

        commit("editHabit", habit);
        commit("setLoading", false);
      } catch (error) {
        commit("setLoading", false);
        commit("setError", error.message);
        throw error;
      }
    },
    async removeHabit({ commit, getters }, habitId) {
      commit("clearError");
      commit("setLoading", true);

      try {
        await removeUserHabit(getters.user.uid, habitId);

        commit("removeHabit", habitId);
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
