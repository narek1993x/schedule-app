import { initializePushNotificationsService } from "../push-notifications";

const authMethods = {
  github: "GithubAuthProvider",
  google: "GoogleAuthProvider",
  signIn: "signInWithEmailAndPassword",
  signUp: "createUserWithEmailAndPassword",
};

export const authMixin = {
  computed: {
    user() {
      return this.$store.getters.user;
    },
    isUserLoggedIn() {
      return this.$store.getters.isUserLoggedIn;
    },
    isRetrieveCalled() {
      return this.$store.getters.isRetrieveCalled;
    },
    isDataLoaded() {
      const { schedules, habits } = this.$store.getters.loadedData;
      return schedules && habits;
    },
    loading() {
      return this.$store.getters.loading;
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
    handleSignInCallback() {
      initializePushNotificationsService();
      this.$store.dispatch("getAllEvents");
      this.$store.dispatch("getAllHabits");

      const schedulePath = "/schedule";
      const habitsPath = "/habits";
      const currentPath = this.$router.history.current.path;

      if (currentPath !== schedulePath && currentPath !== habitsPath) {
        this.$router.push(schedulePath);
      }
    },
  },
  created() {
    if (!this.isRetrieveCalled) {
      this.$store.dispatch("retrieveUser");
    }
  },
  updated() {
    if (this.isUserLoggedIn && !this.isDataLoaded && !this.loading) {
      this.handleSignInCallback();
    }
  },
};
