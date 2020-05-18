<template>
  <v-container fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Login form</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form
              @submit.prevent
              ref="form"
              id="login-form"
              v-model="valid"
              validation
            >
              <v-text-field
                prepend-icon="mdi-account"
                name="email"
                label="Email"
                type="email"
                :rules="emailRules"
                v-model="email"
              ></v-text-field>
              <v-text-field
                prepend-icon="mdi-lock"
                name="password"
                label="Password"
                type="password"
                :counter="6"
                :rules="passwordRules"
                v-model="password"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              type="submit"
              form="login-form"
              color="primary"
              :disabled="!valid || loading"
              :loading="loading"
              @click="onSubmit"
            >
              Login
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { initializePushNotificationsService } from "../../push-notifications";

export default {
  computed: {
    loading() {
      return this.$store.getters.loading;
    }
  },
  data() {
    return {
      valid: false,
      email: "",
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+/.test(v) || "E-mail must be valid"
      ],
      password: "",
      passwordRules: [
        v => !!v || "Password is required",
        v =>
          (v && v.length >= 6) ||
          "Password must be equal or more than 6 characters"
      ]
    };
  },
  methods: {
    onSubmit() {
      if (this.$refs.form.validate()) {
        const user = {
          email: this.email,
          password: this.password
        };

        this.$store
          .dispatch("authUser", user)
          .then(() => {
            initializePushNotificationsService();
            this.$store.dispatch("fetchTodos");
            this.$store.dispatch("fetchSchedules");
            this.$router.push("/");
          })
          .catch(() => {});
      }
    }
  }
};
</script>

<style></style>
