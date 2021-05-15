import { initializePushNotificationsService } from "../push-notifications";

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
    signInWithEmailPassword(user) {
      this.$store.dispatch("authUser", user).then(this.handleSignInCallback);
    },
    signInWithGitHub() {
      this.$store.dispatch("signInWithProvider", "GithubAuthProvider").then(this.handleSignInCallback);
    },
    signInWithGoogle() {
      this.$store.dispatch("signInWithProvider", "GoogleAuthProvider").then(this.handleSignInCallback);
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
