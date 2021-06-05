<template>
  <div class="text-center">
    <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" :nudge-top="-9" offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="ma-3" icon v-bind="attrs" v-on="on">
          <v-icon size="36">mdi-cog</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-list>
          <v-list-item>
            <v-list-item-action>
              <v-switch :input-value="dark" @change="onSettingsChange($event, 'dark')" color="secondary"></v-switch>
            </v-list-item-action>
            <v-list-item-title>Enable dark mode</v-list-item-title>
          </v-list-item>

          <v-list-item v-if="isMobile">
            <v-list-item-action>
              <v-btn outlined class="mr-2" color="grey darken-2" @click="onSettingsChange('', 'focus')">
                Today
              </v-btn>
            </v-list-item-action>
          </v-list-item>

          <v-list-item>
            <v-list-item-action>
              <v-select
                @change="onSettingsChange($event, 'type')"
                :value="type"
                :items="typeOptions"
                dense
                outlined
                hide-details
                label="type"
                class="TypeSelect mr-2"
              ></v-select>
            </v-list-item-action>
          </v-list-item>

          <v-list-item>
            <v-list-item-action>
              <v-select
                @change="onSettingsChange($event, 'weekdays')"
                :value="weekdays"
                :items="weekdaysOptions"
                dense
                outlined
                hide-details
                label="weekdays"
                class="WeekdaysSelect mr-2"
              ></v-select>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
export default {
  props: ["isMobile", "dark", "type", "weekdays", "onSettingsChange"],
  data: (instance) => ({
    menu: false,
    typeOptions: [
      { text: "Day", value: "day" },
      { text: "4 Day", value: "4day" },
      { text: "Week", value: "week" },
      { text: "Month", value: "month" },
    ],
    weekdaysOptions: [
      { text: "Sunday - Saturday", value: [0, 1, 2, 3, 4, 5, 6] },
      { text: "Mon, Wed, Fri", value: [1, 3, 5] },
      { text: "Mon - Fri", value: [1, 2, 3, 4, 5] },
      { text: "Mon - Sun", value: instance.weekdays },
    ],
  }),
};
</script>

<style></style>
