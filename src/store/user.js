import firebase from "../libs/firebase";
import { createUser } from "../libs/db";
import { User, FirebaseDeviceToken } from "../storage";
import { removeTokenFromServer } from "../libs/subscription";

function formatUser(user) {
  // const token = await user.getIdToken();
  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    photoUrl: user.photoURL,
  };
}

function handleUser(rawUser) {
  const user = formatUser(rawUser);

  createUser(user.uid, user);
  User.set(user);

  return user;
}

export default {
  state: {
    user: User.get(),
    userUnsubscribeCb: null,
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    removeUser(state) {
      state.user = null;
    },
    setUserUnsubscribeCb(state, payload) {
      state.userUnsubscribeCb = payload;
    },
  },
  actions: {
    async authUser({ commit }, { email, password, method }) {
      commit("clearError");
      commit("setLoading", true);
      try {
        const response = await firebase.auth()[method](email, password);
        const user = handleUser(response.user);

        commit("setUser", user);
        commit("setLoading", false);
      } catch (err) {
        commit("setLoading", false);
        commit("setError", err.message);
        throw err;
      }
    },
    async signInWithProvider({ commit }, provider) {
      commit("clearError");
      commit("setLoading", true);
      try {
        const response = await firebase.auth().signInWithPopup(new firebase.auth[provider]());
        const user = handleUser(response.user);

        commit("setUser", user);
        commit("setLoading", false);
      } catch (err) {
        commit("setLoading", false);
        commit("setError", err.message);
        throw err;
      }
    },
    retrieveUser({ commit }) {
      const userUnsubscribeCb = firebase.auth().onIdTokenChanged((rawUser) => {
        if (!rawUser) return;

        const retrievedUser = handleUser(rawUser);
        commit("setUser", retrievedUser);
      });

      commit("setUserUnsubscribeCb", userUnsubscribeCb);
    },
    async signOut({ commit, getters: { userUnsubscribeCb } }) {
      commit("setLoading", true);
      try {
        const { uid } = User.get();

        userUnsubscribeCb && userUnsubscribeCb();
        removeTokenFromServer(uid);
        await firebase.auth().signOut();

        User.remove();
        FirebaseDeviceToken.remove();
        commit("removeUser");
        commit("setLoading", false);
      } catch (error) {
        commit("setLoading", false);
        commit("setError", err.message);
        throw err;
      }
    },
  },
  getters: {
    user(state) {
      return state.user;
    },
    isUserLoggedIn(state) {
      return state.user !== null;
    },
    isRetrieveCalled(state) {
      return !!state.userUnsubscribeCb;
    },
    userUnsubscribeCb(state) {
      return state.userUnsubscribeCb;
    },
  },
};
