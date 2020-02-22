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
      <v-app-bar-nav-icon
        @click="drawer = !drawer"
        class="hidden-md-and-up"
      ></v-app-bar-nav-icon>

      <v-toolbar-title>
        <router-link to="/" tag="span" class="pointer">
          My Todo List
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn text v-for="link of links" :key="link.title" :to="link.url">
          <v-icon size="24" left>{{ link.icon }}</v-icon>
          {{ link.title }}
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>

    <template v-if="error">
      <v-snackbar
        :multi-line="true"
        :timeout="5000"
        color="error"
        @input="closeError"
        :value="true"
      >
        {{ error }}
        <v-btn dark text @click.native="closeError">Close</v-btn>
      </v-snackbar>
    </template>
  </v-app>
</template>

<script>
export default {
  computed: {
    error() {
      return this.$store.getters.error;
    },
    isUserLoggedIn() {
      return this.$store.getters.isUserLoggedIn;
    },
    links() {
      if (this.isUserLoggedIn) {
        return [
          { title: "Todos", icon: "mdi-format-list-checks", url: "/" },
          {
            title: "Schedule",
            icon: "mdi-calendar-outline",
            url: "/schedule"
          },
          { title: "Loguot", icon: "mdi-logout-variant", url: "/logout" }
        ];
      }
      return [
        { title: "Login", icon: "mdi-lock", url: "/login" },
        { title: "Registration", icon: "mdi-face", url: "/registration" }
      ];
    }
  },
  data() {
    return {
      drawer: false
    };
  },
  methods: {
    closeError() {
      this.$store.dispatch("clearError");
    }
  },
  beforeCreate() {
    this.$store.dispatch("authCheckState");
  },
  created() {
    if (this.isUserLoggedIn) {
      this.$store.dispatch("fetchTodos");
      this.$store.dispatch("fetchSchedules");
    }
  }
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
