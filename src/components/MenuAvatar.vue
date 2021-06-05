<template>
  <div class="text-center">
    <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" :nudge-top="-7" offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-avatar color="secondary" v-bind="attrs" v-on="on" :size="isMobile ? 38 : 48">
          <img v-if="user && user.photoUrl" :src="user.photoUrl" />
          <v-icon v-else dark>
            mdi-account-circle
          </v-icon>
        </v-avatar>
      </template>

      <v-card>
        <v-list>
          <v-list-item text v-for="link of links" :key="link.title" :to="link.url">
            <v-btn text :to="link.url" width="100%" style="justify-content: flex-start;">
              <v-icon size="24" left>{{ link.icon }}</v-icon>
              {{ link.title }}
            </v-btn>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import { isMobile } from "../helpers/utils";

export default {
  props: ["user"],
  data: () => ({
    menu: false,
    isMobile: isMobile(),
    links: [{ title: "Loguot", icon: "mdi-logout-variant", url: "/logout" }],
  }),
};
</script>

<style></style>
