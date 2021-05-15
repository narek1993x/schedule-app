import { initializePushNotificationsService } from "../push-notifications";

const authMethods = {
  github: "GithubAuthProvider",
  google: "GoogleAuthProvider",
  signIn: "signInWithEmailAndPassword",
  signUp: "createUserWithEmailAndPassword",
};

export const authMixin = {
  computed: {
    isUserLoggedIn() {
      return this.$store.getters.isUserLoggedIn;
    },
    isDataLoaded() {
      const { todos, schedules } = this.$store.getters.loadedData;
      return todos && schedules;
    },
  },
  methods: {
    signInWithEmailPassword(user, isSignUp = false) {
      user.method = isSignUp ? authMethods.signUp : authMethods.signIn;
      this.$store.dispatch("authUser", user).then(this.handleSignInCallback);
    },
    signInWithGitHub() {
      this.$store.dispatch("signInWithProvider", authMethods.github).then(this.handleSignInCallback);
    },
    signInWithGoogle() {
      this.$store.dispatch("signInWithProvider", authMethods.google).then(this.handleSignInCallback);
    },
    signOut() {
      this.$store.dispatch("signOut").then(() => {
        this.$router.push("/");
      });
    },
    handleSignInCallback(isRedirect = true) {
      initializePushNotificationsService();
      this.$store.dispatch("fetchTodos");
      this.$store.dispatch("fetchSchedules");

      if (isRedirect) {
        this.$router.push("/");
      }
    },
  },
  beforeCreate() {
    if (!this.isUserLoggedIn) {
      this.$store.dispatch("retrieveUser");
    }
  },
  created() {
    if (this.isUserLoggedIn && !this.isDataLoaded) {
      this.handleSignInCallback(false);
    }
  },
};
