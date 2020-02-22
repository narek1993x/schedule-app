import Vue from "vue";
import VueRouter from "vue-router";
import Todos from "@/components/Todos";
import Login from "@/components/Auth/Login";
import Logout from "@/components/Auth/Logout";
import Registration from "@/components/Auth/Registration";
import AuthGuard from "./auth-guard";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "todos",
    component: Todos
  },
  {
    path: "/schedule",
    name: "schedule",
    // route level code-splitting
    // this generates a separate chunk (schedule.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "schedule" */ "../components/Schedule/Schedule"
      ),
    beforeEnter: AuthGuard
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/logout",
    name: "logout",
    component: Logout
  },
  {
    path: "/registration",
    name: "reg",
    component: Registration
  },
  {
    path: "*",
    redirect: "/"
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
