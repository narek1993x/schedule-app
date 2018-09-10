import Vue from 'vue';
import Vuex from 'vuex';
import shared from './shared';
import todos from './todos';

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    todos,
    shared
  }
});
