import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "./store";
import Loading from "@/components/Loading";
import vuetify from "./plugins/vuetify";

import "./registerServiceWorker";

Vue.config.productionTip = false;

Vue.component("app-loading", Loading);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
