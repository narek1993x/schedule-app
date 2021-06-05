<template>
  <v-menu v-model="show" :close-on-content-click="false" :activator="eventActivator" :offset-x="!isMobile">
    <v-card color="grey lighten-4" :width="isMobile ? '320px' : '448px'" :height="isMobile ? '326px' : '457px'" flat>
      <v-toolbar :color="event.color" dark>
        <v-spacer />
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="onOpenEventeModal(event)">
              <v-icon :size="20">mdi-pencil</v-icon>
            </v-btn>
          </template>
          <span>Edit event</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="onOpenDeleteModal(event.id)">
              <v-icon :size="20">mdi-delete</v-icon>
            </v-btn>
          </template>
          <span>Delete event</span>
        </v-tooltip>

        <v-tooltip v-if="event.permanent" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="onOpenCopyModal(event)">
              <v-icon :size="20">mdi-content-duplicate</v-icon>
            </v-btn>
          </template>
          <span>Duplicate event</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="onReminderToggle(event)">
              <v-icon :size="20">
                {{ event.reminder ? "mdi-bell" : "mdi-bell-off" }}
              </v-icon>
            </v-btn>
          </template>
          <span>
            {{ event.reminder ? "Reminder is on" : "Reminder is off" }}
          </span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="onClose">
              <v-icon :size="20">mdi-close</v-icon>
            </v-btn>
          </template>
          <span>Close</span>
        </v-tooltip>
      </v-toolbar>

      <v-card-text>
        <div class="headline text--primary pb-5">
          {{ event.name }}
        </div>
        <div class="text--primary">{{ event.content }}</div>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script>
import { isMobile } from "../../helpers/utils";

export default {
  props: [
    "show",
    "event",
    "eventActivator",
    "onClose",
    "onOpenEventeModal",
    "onOpenDeleteModal",
    "onOpenCopyModal",
    "onReminderToggle",
  ],
  data: () => {
    return {
      isMobile: isMobile(),
    };
  },
};
</script>

<style></style>
