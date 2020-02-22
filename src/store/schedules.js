import * as firebase from "firebase";
import { setScheduleEventProps } from "../helpers/utlis";

export default {
  state: {
    scheduleEvents: []
  },
  mutations: {
    setScheduleEvents: (state, payload) => {
      state.scheduleEvents = payload.map(event => ({
        ...setScheduleEventProps(event)
      }));
    },
    addScheduleEvent: (state, payload) => {
      const newScheduleEvent = {
        ...setScheduleEventProps(payload)
      };

      state.scheduleEvents = [...state.scheduleEvents, newScheduleEvent];
    },
    editScheduleEvent: (state, payload) => {
      const scheduleIndex = state.scheduleEvents.findIndex(
        s => s.id === payload.id
      );

      state.scheduleEvents = [
        ...state.scheduleEvents.slice(0, scheduleIndex),
        {
          ...state.scheduleEvents[scheduleIndex],
          ...setScheduleEventProps(payload)
        },
        ...state.scheduleEvents.slice(scheduleIndex + 1)
      ];
    },
    removeScheduleEvent: (state, scheduleId) => {
      const scheduleIndex = state.scheduleEvents.findIndex(
        s => s.id === scheduleId
      );
      state.scheduleEvents = [
        ...state.scheduleEvents.slice(0, scheduleIndex),
        ...state.scheduleEvents.slice(scheduleIndex + 1)
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
          .ref("scheduleEvents")
          .once("value");
        const scheduleEvents = fbVal.val();
        const user = getters.user;

        const resultScheduleEvents = [];
        for (let key in scheduleEvents) {
          if (user && scheduleEvents[key].ownerId === user.id) {
            resultScheduleEvents.push({
              ...scheduleEvents[key],
              id: key
            });
          }
        }

        commit("setLoading", false);
        commit("setScheduleEvents", resultScheduleEvents);
      } catch (error) {
        commit("setLoading", false);
        commit("setError", error.message);
        throw error;
      }
    },
    async addScheduleEvent({ commit }, newScheduleEvent) {
      commit("clearError");
      commit("setLoading", true);

      try {
        const scheduleEvent = await firebase
          .database()
          .ref("scheduleEvents")
          .push(newScheduleEvent);

        commit("addScheduleEvent", {
          ...newScheduleEvent,
          id: scheduleEvent.key
        });

        commit("setLoading", false);
      } catch (error) {
        commit("setLoading", false);
        commit("setError", error.message);
        throw error;
      }
    },
    async editScheduleEvent({ commit }, newScheduleEvent) {
      if (newScheduleEvent && !newScheduleEvent.id) return;

      commit("clearError");
      commit("setLoading", true);

      try {
        await firebase
          .database()
          .ref("scheduleEvents")
          .child(newScheduleEvent.id)
          .update(newScheduleEvent);

        commit("editScheduleEvent", newScheduleEvent);

        commit("setLoading", false);
      } catch (error) {
        commit("setLoading", false);
        commit("setError", error.message);
        throw error;
      }
    },
    async removeScheduleEvent({ commit }, scheduleId) {
      commit("clearError");
      commit("setLoading", true);
      try {
        await firebase
          .database()
          .ref("scheduleEvents")
          .child(scheduleId)
          .remove();

        commit("removeScheduleEvent", scheduleId);
        commit("setLoading", false);
      } catch (error) {
        commit("setLoading", false);
        commit("setError", error.message);
        throw error;
      }
    }
  },
  getters: {
    scheduleEvents: state => state.scheduleEvents
  }
};
