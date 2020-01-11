import * as firebase from "firebase";

export default {
  state: {
    schedules: [
      { title: "Monday", key: "monday", color: "red accent-2", content: "" },
      { title: "Tuesday", key: "tuesday", color: "#FF8F00", content: "" },
      { title: "Wednesday", key: "wednesday", color: "#F9A825", content: "" },
      { title: "Thursday", key: "thursday", color: "green darken-2", content: "" },
      { title: "Friday", key: "friday", color: "#3598a7", content: "" },
      { title: "Saturday", key: "saturday", color: "indigo accent-2", content: "" },
      { title: "Sunday", key: "sunday", color: "deep-purple accent-2", content: "" }
    ]
  },
  mutations: {
    setSchedules: (state, payload) => {
      state.schedules = state.schedules.map((schedule) => {
        const payloadSchedule = payload.find(r => r.key === schedule.key);
        if (payloadSchedule) {
          return { ...schedule, ...payloadSchedule};
        }

        return schedule;
      })
    },
    editSchedule: (state, payload) => {
      const scheduleIndex = state.schedules.findIndex(s => s.key === payload.key);

      state.schedules = [
        ...state.schedules.slice(0, scheduleIndex),
        {...state.schedules[scheduleIndex], ...payload},
        ...state.schedules.slice(scheduleIndex + 1)
      ]
    }
  },
  actions: {
    async fetchSchedules({ commit, getters }) {
      commit("clearError");
      commit("setLoading", true);

      try {
        const fbVal = await firebase
          .database()
          .ref("schedules")
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
    schedules: (state) => state.schedules
  }
};
