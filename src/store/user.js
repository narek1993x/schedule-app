import * as firebase from "firebase";
import { UserToken, FirebaseDeviceToken } from "../storage";
import { removeTokenFromServer } from "../services/api-requests";

class User {
  constructor(id) {
    this.id = id;
  }
}

export default {
  state: {
    user: null
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    removeUser(state) {
      state.user = null;
    }
  },
  actions: {
    async authUser({ commit }, { email, password, isSignup = false }) {
      const method = isSignup
        ? "createUserWithEmailAndPassword"
        : "signInWithEmailAndPassword";
      // Set expiration date to one month
      const expirationDate = 30 * 24 * 60 * 60;

      commit("clearError");
      commit("setLoading", true);
      try {
        const {
          user: { uid }
        } = await firebase.auth()[method](email, password);
        const user = new User(uid);
        UserToken.set(user, expirationDate);

        commit("setUser", user);
        commit("setLoading", false);
      } catch (err) {
        commit("setLoading", false);
        commit("setError", err.message);
        throw err;
      }
    },
    authCheckState({ commit }) {
      const token = UserToken.get();

      if (token) {
        commit("setUser", token);
      }
    },
    removeUser({ commit }) {
      const token = UserToken.get();
      removeTokenFromServer(token);

      UserToken.remove();
      FirebaseDeviceToken.remove();
      commit("removeUser");
    }
  },
  getters: {
    user(state) {
      return state.user;
    },
    isUserLoggedIn(state) {
      return state.user !== null;
    }
  }
};
