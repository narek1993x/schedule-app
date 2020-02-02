import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#161e26",
        secondary: "#e535ab",
        accent: "#8c9eff",
        error: "#DD2C00"
      }
    }
  }
});
