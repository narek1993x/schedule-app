<template>
  <v-row class="mt-10 mr-1 ml-1">
    <v-col cols="12" class="d-flex justify-center">
      <v-card
        dark
        shaped
        color="primary"
        outlined
        elevation="2"
        width="100%"
        max-width="600"
        height="400"
        class="d-flex flex-column align-center justify-center pa-4"
      >
        <template v-if="isUserLoggedIn">
          <v-card-title class="break-word">Please continue your work on schedule page</v-card-title>
          <v-card-actions class="d-flex flex-wrap">
            <v-btn to="/schedule" color="blue">
              <v-icon left medium>mdi-calendar-outline</v-icon>
              Schedule
            </v-btn>
          </v-card-actions>
        </template>
        <template v-else>
          <v-card-title class="break-word">Please authorize to continue!</v-card-title>
          <v-card-actions class="d-flex flex-wrap">
            <v-btn to="/login" color="blue">
              <v-icon left medium>mdi-lock</v-icon>
              Login
            </v-btn>
            <v-btn to="/registration" color="blue">
              <v-icon left medium>mdi-face</v-icon>
              Registrate
            </v-btn>
          </v-card-actions>
        </template>
      </v-card>
    </v-col>
  </v-row>
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
