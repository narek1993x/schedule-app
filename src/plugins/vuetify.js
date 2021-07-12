import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#1E88E5",
        secondary: "#4CAF50",
        accent: "#8c9eff",
        error: "#DD2C00",
      },
      dark: {
        primary: "#1E88E5",
        secondary: "#e535ab",
        accent: "#161e26",
      },
    },
  },
});
