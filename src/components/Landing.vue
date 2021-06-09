<template>
  <v-container fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card outlined elevation="12" class="d-flex flex-column align-center justify-center pa-4">
          <template v-if="isUserLoggedIn">
            <v-card-title class="break-word">Please continue your work on schedule page!</v-card-title>
            <v-card-actions class="d-flex flex-wrap">
              <v-btn to="/schedule" outlined color="primary" large>
                <v-icon left medium>mdi-calendar-outline</v-icon>
                Schedule
              </v-btn>
            </v-card-actions>
          </template>
          <template v-else>
            <v-card-title class="break-word">Please authorize to continue!</v-card-title>
            <v-card-actions class="d-flex flex-wrap">
              <v-btn to="/login" outlined color="primary" large>
                <v-icon left medium>mdi-lock</v-icon>
                Login
              </v-btn>
              <v-btn to="/registration" outlined color="primary" large>
                <v-icon left medium>mdi-face</v-icon>
                Registration
              </v-btn>
            </v-card-actions>
          </template>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  computed: {
    isUserLoggedIn() {
      return this.$store.getters.isUserLoggedIn;
    },
  },
};
</script>

<style></style>
