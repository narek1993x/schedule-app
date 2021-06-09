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
      const { schedules } = this.$store.getters.loadedData;
      return schedules;
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
      this.$router.push("/schedule");
    },
  },
  created() {
    if (!this.isRetrieveCalled) {
      this.$store.dispatch("retrieveUser");
    }
  },
  updated() {
    if (this.isUserLoggedIn && !this.isDataLoaded) {
      this.handleSignInCallback();
    }
  },
};
