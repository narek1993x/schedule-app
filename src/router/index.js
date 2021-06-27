import Vue from "vue";
import VueRouter from "vue-router";
import Login from "@/components/Auth/Login";
import Logout from "@/components/Auth/Logout";
import Registration from "@/components/Auth/Registration";
import Landing from "@/components/Landing";
import { store } from "../store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Landing",
    component: Landing,
  },
  {
    path: "/schedule",
    name: "Schedule",
    component: () => import("../components/Schedule/Schedule"),
  },
  {
    path: "/habits",
    name: "Habits",
    component: () => import("../components/Habits/Habits"),
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/logout",
    name: "Logout",
    component: Logout,
  },
  {
    path: "/registration",
    name: "Registration",
    component: Registration,
  },
  {
    path: "*",
    redirect: "/",
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const isUserLoggedIn = store.getters.isUserLoggedIn;

  if (to.name === "Schedule" && !isUserLoggedIn) {
    next({ name: "Login" });
  } else if (isUserLoggedIn && (to.name === "Login" || to.name === "Registration")) {
    next({ name: "Landing" });
  } else {
    next();
  }
});

export default router;
