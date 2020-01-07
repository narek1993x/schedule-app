<template>
  <v-app>
    <v-navigation-drawer
      app
      temporary
      v-model="drawer"
    >
      <v-list>
        <v-list-tile
          v-for="link of links"
          :key="link.title"
          :to="link.url"
        >
          <v-list-tile-action>
            <v-icon>{{link.icon}}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title v-text="link.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar app dark color="primary">
        <v-toolbar-side-icon
            @click="drawer = !drawer"
            class="hidden-md-and-up"
        ></v-toolbar-side-icon>

        <v-toolbar-title>
            <router-link to="/" tag="span" class="pointer">My Todo List</router-link>
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-toolbar-items class="hidden-sm-and-down">
            <v-btn
                v-for="link of links"
                :key="link.title"
                :to="link.url"
                flat
            >
            <v-icon left>{{link.icon}}</v-icon>
                {{link.title}}
            </v-btn>
        </v-toolbar-items>
    </v-toolbar>

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
        {{error}}
        <v-btn
          dark
          flat
          @click.native="closeError"
        >
          Close
        </v-btn>
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
          { title: "Todos", icon: "gavel", url: "/" },
          { title: "Schedule", icon: "event", url: "/schedule" },
          { title: "Loguot", icon: "exit_to_app", url: "/logout" }
        ];
      }
      return [
        { title: "Login", icon: "lock", url: "/login" },
        { title: "Registration", icon: "face", url: "/registration" }
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

<style scoped>
.pointer {
  cursor: pointer;
}
</style>
