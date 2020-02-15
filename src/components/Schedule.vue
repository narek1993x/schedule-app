<template>
  <div>
    <v-sheet
      tile
      height="54"
      color="grey lighten-3"
      class="d-flex align-center"
    >
      <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-switch
        v-model="dark"
        class="mr-2"
        :label="`${dark ? 'Dark' : 'Light'} Mode`"
      ></v-switch>
      <v-select
        v-model="type"
        :items="typeOptions"
        dense
        outlined
        hide-details
        class="ma-2"
        label="type"
      ></v-select>
      <!-- <v-select
        v-model="mode"
        :items="modeOptions"
        dense
        outlined
        hide-details
        label="event-overlap-mode"
        class="ma-2"
      ></v-select>-->
      <v-select
        v-model="weekdays"
        :items="weekdaysOptions"
        dense
        outlined
        hide-details
        label="weekdays"
        class="ma-2"
      ></v-select>
      <schedule-modal></schedule-modal>
      <v-spacer></v-spacer>
      <v-btn icon class="ma-2" @click="$refs.calendar.next()">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-sheet>
    <v-sheet height="800">
      <v-calendar
        ref="calendar"
        color="secondary"
        v-if="this.schedules.length > 0"
        v-model="start"
        :type="type"
        :start="start"
        :end="end"
        :min-weeks="minWeeks"
        :max-days="maxDays"
        :now="now"
        :dark="dark"
        :weekdays="weekdays"
        :short-months="shortMonths"
        :short-weekdays="shortWeekdays"
        :short-intervals="false"
        :show-interval-label="showIntervalLabel"
        :events="events"
        :event-overlap-mode="mode"
        :event-overlap-threshold="45"
        :event-color="getEventColor"
        @click:event="showEvent"
        @click:more="viewDay"
        @click:date="viewDay"
        @change="getEvents"
      ></v-calendar>
      <v-menu
        v-model="selectedOpen"
        :close-on-content-click="false"
        :activator="selectedElement"
        offset-x
      >
        <v-card color="grey lighten-4" min-width="350px" flat>
          <v-toolbar :color="selectedEvent.color" dark>
            <v-btn icon>
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon>
              <v-icon>mdi-heart</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <span v-html="selectedEvent.content"></span>
          </v-card-text>
          <v-card-actions>
            <v-btn text color="secondary" @click="selectedOpen = false">
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-sheet>
  </div>
</template>

<script>
import moment from "moment";
import ScheduleModal from "./ScheduleModal.vue";

const weekdaysDefault = [1, 2, 3, 4, 5, 6, 0];

export default {
  data: () => ({
    titleStart: "",
    titleEnd: "",
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    dark: true,
    startMenu: false,
    start: moment().format("YYYY-MM-DD"),
    end: moment()
      .add("days", 6)
      .format("YYYY-MM-DD"),
    endMenu: false,
    nowMenu: false,
    minWeeks: 1,
    now: null,
    events: [],
    colors: [
      "blue",
      "indigo",
      "deep-purple",
      "cyan",
      "green",
      "orange",
      "grey darken-1"
    ],
    names: [
      "Meeting",
      "Holiday",
      "PTO",
      "Travel",
      "Event",
      "Birthday",
      "Conference",
      "Party"
    ],
    type: "week",
    typeOptions: [
      { text: "Day", value: "day" },
      { text: "4 Day", value: "4day" },
      { text: "Week", value: "week" },
      { text: "Month", value: "month" },
      { text: "Custom Daily", value: "custom-daily" },
      { text: "Custom Weekly", value: "custom-weekly" }
    ],
    mode: "column",
    modeOptions: [
      { text: "Stack", value: "stack" },
      { text: "Column", value: "column" }
    ],
    weekdays: weekdaysDefault,
    weekdaysOptions: [
      { text: "Sunday - Saturday", value: [0, 1, 2, 3, 4, 5, 6] },
      { text: "Mon, Wed, Fri", value: [1, 3, 5] },
      { text: "Mon - Fri", value: [1, 2, 3, 4, 5] },
      { text: "Mon - Sun", value: weekdaysDefault }
    ],
    maxDays: 7,
    maxDaysOptions: [
      { text: "7 days", value: 7 },
      { text: "5 days", value: 5 },
      { text: "4 days", value: 4 },
      { text: "3 days", value: 3 }
    ],
    styleInterval: "default",
    styleIntervalOptions: [
      { text: "Default", value: "default" },
      { text: "Workday", value: "workday" },
      { text: "Past", value: "past" }
    ],
    shortIntervals: false,
    shortMonths: false,
    shortWeekdays: false
  }),
  computed: {
    loading() {
      return this.$store.getters.loading;
    },
    schedules() {
      return this.$store.getters.schedules;
    },
    title() {
      const { titleStart, titleEnd } = this;
      if (!titleStart || !titleEnd) {
        return "";
      }

      const startMonth = this.monthFormatter(titleStart);
      const endMonth = this.monthFormatter(titleEnd);
      const suffixMonth = startMonth === endMonth ? "" : endMonth;

      const startYear = titleStart.year;
      const endYear = titleEnd.year;
      const suffixYear = startYear === endYear ? "" : endYear;

      const startDay = titleStart.day + this.nth(titleStart.day);
      const endDay = titleEnd.day + this.nth(titleEnd.day);

      switch (this.type) {
        case "month":
          return `${startMonth} ${startYear}`;
        case "week":
        case "4day":
          return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`;
        case "day":
          return `${startMonth} ${startDay} ${startYear}`;
      }
      return "";
    },
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: "UTC",
        month: "long"
      });
    }
  },
  components: {
    "schedule-modal": ScheduleModal
  },
  methods: {
    viewDay({ date }) {
      this.start = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    showIntervalLabel(interval) {
      return interval.minute === 0;
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => (this.selectedOpen = true), 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    getEvents({ start, end }) {
      this.titleStart = start;
      this.titleEnd = end;
      this.events = this.schedules;
    },
    nth(d) {
      return d > 3 && d < 21
        ? "th"
        : ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][d % 10];
    }
  }
};
</script>

<style>
@media (max-width: 767px) {
}
</style>
