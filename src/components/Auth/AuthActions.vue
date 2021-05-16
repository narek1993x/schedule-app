<template>
  <v-card-actions class="auth-actions">
    <v-btn class="ma-2" color="info" dark @click="onEmail">
      <v-icon left medium>mdi-email</v-icon>Continue with Email
    </v-btn>
    <v-btn
      class="ma-2"
      :dark="!isGithubLoading"
      :disabled="isGithubLoading"
      :loading="isGithubLoading"
      @click="
        onGithub();
        setClickedProvider('github');
      "
    >
      <v-icon left medium>mdi-github</v-icon>Continue with GitHub</v-btn
    >
    <v-btn
      class="ma-2"
      color="red"
      :dark="!isGoogleLoading"
      :disabled="isGoogleLoading"
      :loading="isGoogleLoading"
      @click="
        onGoogle();
        setClickedProvider('google');
      "
    >
      <v-icon left medium>mdi-google</v-icon>Continue with Google
    </v-btn>
  </v-card-actions>
</template>

<script>
export default {
  props: ["loading", "onEmail", "onGithub", "onGoogle"],
  computed: {
    isGithubLoading() {
      return this.isShowLoading("github");
    },
    isGoogleLoading() {
      return this.isShowLoading("google");
    },
  },
  data() {
    return {
      clickedProvider: "",
    };
  },
  methods: {
    setClickedProvider(provider) {
      this.clickedProvider = provider;
    },
    isShowLoading(provider) {
      return this.clickedProvider === provider && this.loading;
    },
  },
};
</script>

<style lang="scss">
.auth-actions {
  display: flex;
  flex-direction: column;
  align-items: center;

  .v-btn {
    width: 300px;

    &__content {
      text-transform: none;
    }
  }
}

@media (max-width: 767px) {
  .login-actions {
    .v-btn {
      width: calc(100% - 16px);
    }
  }
}
</style>
