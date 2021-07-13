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
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-action>
            <v-switch :input-value="darkMode" @change="toggleDarkMode" color="secondary"></v-switch>
          </v-list-item-action>
          <v-list-item-title>{{ `Dark mode is ${darkMode ? "on" : "off"}` }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app dark :color="darkMode ? 'accent' : 'primary'">
      <v-app-bar-nav-icon @click="drawer = !drawer" class="hidden-md-and-up"></v-app-bar-nav-icon>

      <v-toolbar-title>
        <router-link to="/" custom v-slot="{ navigate }" class="pointer">
          <span @click="navigate" role="link">Schedule App</span>
        </router-link>
      </v-toolbar-title>
      <v-switch
        class="dark-mode-toggler ml-4 mr-4 hidden-sm-and-down"
        :input-value="darkMode"
        @change="toggleDarkMode"
        color="secondary"
        :label="`Dark mode is ${darkMode ? 'on' : 'off'}`"
      ></v-switch>

      <v-spacer></v-spacer>

      <v-toolbar-items class="hidden-sm-and-down mr-2">
        <v-btn text v-for="link of links" :key="link.title" :to="link.url">
          <v-icon size="24" left>{{ link.icon }}</v-icon>
          {{ link.title }}
        </v-btn>
      </v-toolbar-items>
      <MenuAvatar v-if="user" :user="user"></MenuAvatar>
    </v-app-bar>
    <v-main>
      <router-view></router-view>
    </v-main>

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
import MenuAvatar from "./components/MenuAvatar";

export default {
  mixins: [authMixin],
  components: {
    MenuAvatar,
  },
  computed: {
    error() {
      return this.$store.getters.error;
    },
    darkMode() {
      return this.$store.getters.darkMode;
    },
    links() {
      if (this.isUserLoggedIn) {
        return [
          {
            title: "Schedule",
            icon: "mdi-calendar-outline",
            url: "/schedule",
          },
          {
            title: "Habits",
            icon: "mdi-domain",
            url: "/habits",
          },
        ];
      }
      return [];
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
    toggleDarkMode(value) {
      this.$vuetify.theme.dark = value;
      this.$store.dispatch("setDarkMode", value);
    },
  },
  created() {
    this.$vuetify.theme.dark = this.darkMode;
  },
};
</script>

<style lang="scss">
html {
  overflow-y: auto !important;
}

.dark-mode-toggler {
  .v-input {
    &__slot {
      margin-bottom: 0px;
    }
  }

  .v-messages {
    display: none;
  }
}

.pointer {
  cursor: pointer;
}

.break-word {
  word-break: break-word;
}

.v-tooltip {
  &__content {
    text-transform: capitalize !important;
  }
}
</style>
