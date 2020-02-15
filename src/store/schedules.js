import * as firebase from "firebase";
import moment from "moment";
import { colors, rnd, capitalize } from "../helpers/utlis";

export default {
  state: {
    schedules: []
  },
  mutations: {
    setSchedules: (state, payload) => {
      state.schedules = payload.map(item => ({
        ...item,
        color: colors[rnd(0, colors.length - 1)],
        ...(item.week
          ? {
              start: `${moment()
                .day(capitalize(item.week))
                .format("YYYY-M-DD")} ${item.start}`,
              end: `${moment()
                .day(capitalize(item.week))
                .format("YYYY-M-DD")} ${item.end}`
            }
          : {})
      }));
    },
    editSchedule: (state, payload) => {
      const scheduleIndex = state.schedules.findIndex(
        s => s.week === payload.week
      );

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
    async editSchedule({ commit }, newSchedule) {
      commit("clearError");
      commit("setLoading", true);

      try {
        if (newSchedule && newSchedule.id) {
          await firebase
            .database()
            .ref("events")
            .child(newSchedule.id)
            .update({ content: newSchedule.content });

          commit("editSchedule", newSchedule);
        } else {
          const schedule = await firebase
            .database()
            .ref("events")
            .push(newSchedule);

          commit("editSchedule", {
            ...newSchedule,
            id: schedule.key
          });
        }

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
