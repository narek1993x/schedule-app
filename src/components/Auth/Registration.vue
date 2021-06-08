<template>
  <v-container fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Registration form</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn small outlined to="/"> <v-icon left> mdi-arrow-left </v-icon>Back </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent ref="form" id="registration-form" v-model="valid" validation>
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
              <v-text-field
                prepend-icon="mdi-lock"
                name="confirm-password"
                label="Confirm Password"
                type="password"
                :counter="6"
                :rules="confirmPasswordRules"
                v-model="confirmPassword"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              class="mr-2"
              type="submit"
              form="registration-form"
              color="primary"
              :disabled="!valid || loading"
              :loading="loading"
              @click="onSubmit"
            >
              Sign up
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { authMixin } from "../../mixins/auth";

export default {
  mixins: [authMixin],
  computed: {
    loading() {
      return this.$store.getters.loading;
    },
  },
  data() {
    return {
      valid: false,
      email: "",
      password: "",
      confirmPassword: "",
      emailRules: [(v) => !!v || "E-mail is required", (v) => /.+@.+/.test(v) || "E-mail must be valid"],
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) => (v && v.length >= 6) || "Password must be equal or more than 6 characters",
      ],
      confirmPasswordRules: [
        (v) => !!v || "Confirm password is required",
        (v) => v === this.password || "Confirm password must be mutch",
      ],
    };
  },
  methods: {
    onSubmit() {
      if (this.$refs.form.validate()) {
        this.signInWithEmailPassword(
          {
            email: this.email,
            password: this.password,
          },
          true,
        );
      }
    },
  },
};
</script>

<style></style>
