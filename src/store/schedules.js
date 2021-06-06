import { getUserEvents, addUserEvents, updateUserEvents, removeUserEvent } from "../libs/db";
import { setEventDates } from "../helpers/utils";

export default {
  state: {
    events: [],
    startEndDates: {},
  },
  mutations: {
    setStartEndDates: (state, payload) => {
      state.startEndDates = payload;
      state.events = state.events.map((event) => ({
        ...setEventDates(event, payload),
      }));
    },
    setEvents: (state, payload) => {
      state.events = payload.map((event) => ({
        ...setEventDates(event, state.startEndDates),
      }));
    },
    addEvents: (state, payload) => {
      const newEvent = payload.map((event) => ({
        ...setEventDates(event, state.startEndDates),
      }));

      state.events = [...state.events, ...newEvent];
    },
    editEvent: (state, payload) => {
      const eventIndex = state.events.findIndex((s) => s.id === payload.id);

      state.events = [
        ...state.events.slice(0, eventIndex),
        {
          ...state.events[eventIndex],
          ...setEventDates(payload, state.startEndDates),
        },
        ...state.events.slice(eventIndex + 1),
      ];
    },
    removeEvent: (state, eventId) => {
      const eventIndex = state.events.findIndex((s) => s.id === eventId);
      state.events = [...state.events.slice(0, eventIndex), ...state.events.slice(eventIndex + 1)];
    },
  },
  actions: {
    async getAllEvents({ commit, getters }) {
      commit("clearError");
      commit("setLoading", true);

      try {
        const resultEvents = await getUserEvents(getters.user.uid);

        commit("setLoading", false);
        commit("setDataIsLoaded", "schedules");
        commit("setEvents", resultEvents);
      } catch (error) {
        commit("setLoading", false);
        commit("setError", error.message);
        throw error;
      }
    },
    async addEvents({ commit, getters }, events) {
      commit("clearError");
      commit("setLoading", true);

      try {
        const resultEvents = await addUserEvents(getters.user.uid, events);

        commit("addEvents", resultEvents);
        commit("setLoading", false);
      } catch (error) {
        commit("setLoading", false);
        commit("setError", error.message);
        throw error;
      }
    },
    async editEvents({ commit, getters }, events) {
      commit("clearError");
      commit("setLoading", true);

      try {
        const newScheduleEvents = events.filter((e) => !e.id);
        const oldScheduleEvents = events.filter((e) => e.id);

        if (newScheduleEvents.length) {
          const resultEvents = await addUserEvents(getters.user.uid, newScheduleEvents);
          commit("addEvents", resultEvents);
        }

        if (oldScheduleEvents.length) {
          await updateUserEvents(getters.user.uid, oldScheduleEvents);

          oldScheduleEvents.forEach((event) => {
            commit("editEvent", event);
          });
        }

        commit("setLoading", false);
      } catch (error) {
        commit("setLoading", false);
        commit("setError", error.message);
        throw error;
      }
    },
    async removeEvent({ commit, getters }, eventId) {
      commit("clearError");
      commit("setLoading", true);
      try {
        await removeUserEvent(getters.user.uid, eventId);

        commit("removeEvent", eventId);
        commit("setLoading", false);
      } catch (error) {
        commit("setLoading", false);
        commit("setError", error.message);
        throw error;
      }
    },
  },
  getters: {
    events: (state) => state.events,
    startEndDates: (start) => start.startEndDates,
  },
};
