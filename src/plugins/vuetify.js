import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        error: "#DD2C00",
        primary: "#009688"
      }
    }
  }
});
