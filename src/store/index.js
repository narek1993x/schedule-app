import Vue from "vue";
import Vuex from "vuex";
import shared from "./shared";
import todos from "./todos";
import user from "./user";
import schedules from "./schedules";

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    todos,
    shared,
    user,
    schedules
  }
});
