import { store } from "../store";

export default function(to, from, next) {
  setTimeout(() => {
    if (store.getters.isUserLoggedIn) {
      next();
    } else {
      next("/");
    }
  }, 0);
}
