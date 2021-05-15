import firebase from "../firebase";
import { User, FirebaseDeviceToken } from "../storage";
import { removeTokenFromServer } from "../services/api-requests";

function formatUser(user) {
  // const token = await user.getIdToken();
  return {
    id: user.uid,
    email: user.email,
    name: user.displayName,
    photoUrl: user.photoURL,
  };
}

function handleUser(rawUser) {
  const user = formatUser(rawUser);
  User.set(user);

  return user;
}

export default {
  state: {
    user: User.get(),
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    removeUser(state) {
      state.user = null;
    },
  },
  actions: {
    async authUser({ commit }, { email, password, isSignup = false }) {
      const method = isSignup ? "createUserWithEmailAndPassword" : "signInWithEmailAndPassword";

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
      return firebase.auth().onIdTokenChanged((rawUser) => {
        const retrievedUser = handleUser(rawUser);
        commit("setUser", retrievedUser);
      });
    },
    async signOut({ commit }) {
      try {
        await firebase
          .auth()
          .signOut()
          .then(() => {
            const { id } = User.get();
            removeTokenFromServer(id);

            User.remove();
            FirebaseDeviceToken.remove();
            commit("removeUser");
          });
      } catch (error) {
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
  },
};
