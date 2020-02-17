import * as firebase from "firebase";
import { setEventProps } from "../helpers/utlis";

export default {
  state: {
    schedules: []
  },
  mutations: {
    setSchedules: (state, payload) => {
      state.schedules = payload.map(event => ({
        ...setEventProps(event)
      }));
    },
    addSchedule: (state, payload) => {
      const newSchedule = {
        ...setEventProps(payload)
      };

      state.schedules = [...state.schedules, newSchedule];
    },
    editSchedule: (state, payload) => {
      const scheduleIndex = state.schedules.findIndex(s => s.id === payload.id);

      state.schedules = [
        ...state.schedules.slice(0, scheduleIndex),
        { ...state.schedules[scheduleIndex], ...payload },
        ...state.schedules.slice(scheduleIndex + 1)
      ];
    }
  },
  actions: {
    async fetchSchedules({ commit, getters }) {
      commit("clearError");
      commit("setLoading", true);

      try {
        const fbVal = await firebase
          .database()
          .ref("events")
          .once("value");
        const schedules = fbVal.val();
        const user = getters.user;

        const resultSchedules = [];
        for (let key in schedules) {
          if (user && schedules[key].ownerId === user.id) {
            resultSchedules.push({
              ...schedules[key],
              id: key
            });
          }
        }

        commit("setLoading", false);
        commit("setSchedules", resultSchedules);
      } catch (error) {
        commit("setLoading", false);
        commit("setError", error.message);
        throw error;
      }
    },
    async addSchedule({ commit }, newSchedule) {
      commit("clearError");
      commit("setLoading", true);

      try {
        const schedule = await firebase
          .database()
          .ref("events")
          .push(newSchedule);

        commit("addSchedule", {
          ...newSchedule,
          id: schedule.key
        });

        commit("setLoading", false);
      } catch (error) {
        commit("setLoading", false);
        commit("setError", error.message);
        throw error;
      }
    },
    async editSchedule({ commit }, newSchedule) {
      if (newSchedule && !newSchedule.id) return;

      commit("clearError");
      commit("setLoading", true);

      try {
        await firebase
          .database()
          .ref("events")
          .child(newSchedule.id)
          .update(newSchedule);

        commit("editSchedule", newSchedule);

        commit("setLoading", false);
      } catch (error) {
        commit("setLoading", false);
        commit("setError", error.message);
        throw error;
      }
    }
  },
  getters: {
    schedules: state => state.schedules
  }
};
