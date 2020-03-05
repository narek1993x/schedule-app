import { scheduleEventsRef } from "../firebase";
import { setScheduleEventProps } from "../helpers/utlis";

export default {
  state: {
    scheduleEvents: [],
    startEndDates: {}
  },
  mutations: {
    setStartEndDates: (state, payload) => {
      state.startEndDates = payload;
      state.scheduleEvents = state.scheduleEvents.map(event => ({
        ...setScheduleEventProps(event, payload)
      }));
    },
    setScheduleEvents: (state, payload) => {
      state.scheduleEvents = payload.map(event => ({
        ...setScheduleEventProps(event, state.startEndDates)
      }));
    },
    addScheduleEvent: (state, payload) => {
      const newScheduleEvent = {
        ...setScheduleEventProps(payload, state.startEndDates)
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
          ...setScheduleEventProps(payload, state.startEndDates)
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
        const fbVal = await scheduleEventsRef
          .child(getters.user.id)
          .once("value");
        const scheduleEvents = fbVal.val();

        const resultScheduleEvents = [];
        for (let key in scheduleEvents) {
          resultScheduleEvents.push({
            ...scheduleEvents[key],
            id: key
          });
        }

        commit("setLoading", false);
        commit("setScheduleEvents", resultScheduleEvents);
      } catch (error) {
        commit("setLoading", false);
        commit("setError", error.message);
        throw error;
      }
    },
    async addDuplicateScheduleEvents({ commit, getters }, scheduleEvents) {
      commit("clearError");
      commit("setLoading", true);

      try {
        const newScheduleEvents = await Promise.all(
          scheduleEvents.map(scheduleEvent =>
            scheduleEventsRef.child(getters.user.id).push(scheduleEvent)
          )
        );

        scheduleEvents.forEach((scheduleEvent, index) => {
          commit("addScheduleEvent", {
            ...scheduleEvent,
            id: newScheduleEvents[index].key
          });
        });

        commit("setLoading", false);
      } catch (error) {
        commit("setLoading", false);
        commit("setError", error.message);
        throw error;
      }
    },
    async addScheduleEvent({ commit, getters }, newScheduleEvent) {
      commit("clearError");
      commit("setLoading", true);

      try {
        const scheduleEvent = await scheduleEventsRef
          .child(getters.user.id)
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
    async editScheduleEvent({ commit, getters }, newScheduleEvent) {
      if (newScheduleEvent && !newScheduleEvent.id) return;

      commit("clearError");
      commit("setLoading", true);

      try {
        await scheduleEventsRef
          .child(getters.user.id)
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
    async removeScheduleEvent({ commit, getters }, scheduleId) {
      commit("clearError");
      commit("setLoading", true);
      try {
        await scheduleEventsRef
          .child(getters.user.id)
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
    scheduleEvents: state => state.scheduleEvents,
    startEndDates: start => start.startEndDates
  }
};
