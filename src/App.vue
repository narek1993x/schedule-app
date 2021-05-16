<template>
  <v-app>
    <v-navigation-drawer app temporary v-model="drawer">
      <v-list>
        <v-list-item v-for="link of links" :key="link.title" :to="link.url">
          <v-list-item-action>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title v-text="link.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app dark color="primary">
      <v-app-bar-nav-icon @click="drawer = !drawer" class="hidden-md-and-up"></v-app-bar-nav-icon>

      <v-toolbar-title>
        <router-link to="/" tag="span" class="pointer">
          Schedule App
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-items class="hidden-sm-and-down mr-2">
        <v-btn text v-for="link of links" :key="link.title" :to="link.url">
          <v-icon size="24" left>{{ link.icon }}</v-icon>
          {{ link.title }}
        </v-btn>
      </v-toolbar-items>
      <avatar v-if="user" :user="user"></avatar>
    </v-app-bar>
    <v-content>
      <router-view></router-view>
    </v-content>

    <template v-if="error">
      <v-snackbar :multi-line="true" :timeout="5000" color="error" @input="closeError" :value="true">
        {{ error }}
        <v-btn dark text @click.native="closeError">Close</v-btn>
      </v-snackbar>
    </template>
  </v-app>
</template>

<script>
import { authMixin } from "./mixins/auth";
import Avatar from "./components/Avatar";

export default {
  mixins: [authMixin],
  components: {
    avatar: Avatar,
  },
  computed: {
    error() {
      return this.$store.getters.error;
    },
    links() {
      if (this.isUserLoggedIn) {
        return [
          {
            title: "Schedule",
            icon: "mdi-calendar-outline",
            url: "/",
          },
          { title: "Todos", icon: "mdi-format-list-checks", url: "/todos" },
        ];
      }
      return [
        { title: "Todos", icon: "mdi-format-list-checks", url: "/todos" },
        { title: "Login", icon: "mdi-lock", url: "/login" },
        { title: "Registration", icon: "mdi-face", url: "/registration" },
      ];
    },
  },
  data() {
    return {
      drawer: false,
    };
  },
  methods: {
    closeError() {
      this.$store.dispatch("clearError");
    },
  },
};
</script>

<style>
html {
  overflow-y: auto !important;
}
.pointer {
  cursor: pointer;
}
</style>
