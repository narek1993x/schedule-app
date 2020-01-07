import * as firebase from "firebase";

export default {
  state: {
    schedules: [
      { title: "Monday", key: "monday", color: "blue", content: "" },
      { title: "Tuesday", key: "tuesday", color: "light-blue", content: "" },
      { title: "Wednesday", key: "wednesday", color: "cyan", content: "" },
      { title: "Thursday", key: "thursday", color: "teal", content: "" },
      { title: "Friday", key: "friday", color: "green", content: "" },
      { title: "Saturday", key: "saturday", color: "light-green", content: "" },
      { title: "Sunday", key: "sunday", color: "lime", content: "" }
    ]
  },
  mutations: {
    setSchedules: (state, payload) => {
      state.schedules = state.schedules.map((s, index) => {
        const payloadSchedule = payload[index];
        if (payloadSchedule && payloadSchedule.key === s.key) {
          return payloadSchedule;
        }

        return s;
      })
    },
    editSchedule: (state, payload) => {
      const scheduleIndex = state.schedules.findIndex(s => s.key === payload.key);

      state.schedules = [
        ...state.schedules.slice(0, scheduleIndex),
        payload,
        ...state.schedules.slice(scheduleIndex + 1)
      ]
    }
  },
  actions: {
    async fetchSchedules({ commit }) {
      commit("clearError");
      commit("setLoading", true);

      try {
        const fbVal = await firebase
          .database()
          .ref("schedules")
          .once("value");
        const schedules = fbVal.val();

        const resultSchedules = [];
        for (let key in schedules) {
          resultSchedules.push({
            ...schedules[key],
            id: key
          });
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
            .ref("schedules")
            .child(newSchedule.id)
            .update({ content: newSchedule.content });

          commit("editSchedule", newSchedule);
        } else {
          const schedule = await firebase
            .database()
            .ref("schedules")
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
