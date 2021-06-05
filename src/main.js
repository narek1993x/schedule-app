import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "./store";
import Loading from "@/components/Loading";
import Modal from "@/components/Modal";
import vuetify from "./plugins/vuetify";
import "./registerServiceWorker";

Vue.config.productionTip = false;

Vue.component("Loading", Loading);
Vue.component("Modal", Modal);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
