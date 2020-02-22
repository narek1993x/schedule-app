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
      <v-toolbar-title class="ToolbarTitle">{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-switch
        v-if="!isMobile"
        v-model="dark"
        class="mr-2"
        :label="`${dark ? 'Dark' : 'Light'} Mode`"
      ></v-switch>
      <v-select
        v-if="!isMobile"
        v-model="type"
        :items="typeOptions"
        dense
        outlined
        hide-details
        class="ma-2"
        label="type"
      ></v-select>
      <!-- <v-select
        v-if="!isMobile"
        v-model="mode"
        :items="modeOptions"
        dense
        outlined
        hide-details
        label="event-overlap-mode"
        class="ma-2"
      ></v-select> -->
      <v-select
        v-if="!isMobile"
        v-model="weekdays"
        :items="weekdaysOptions"
        dense
        outlined
        hide-details
        label="weekdays"
        class="ma-2"
      ></v-select>
      <v-btn
        color="primary"
        :small="isMobile"
        @click.stop="showCreateEditModal = true"
      >
        Add
        <v-icon right dark>mdi-plus</v-icon>
      </v-btn>
      <schedule-create-edit-modal
        :onClose="handleCloseScheduleModal"
        :visible="showCreateEditModal"
        :scheduleEvent="scheduleEvent"
      ></schedule-create-edit-modal>
      <v-spacer></v-spacer>
      <v-btn icon class="ma-2" @click="$refs.calendar.next()">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-sheet>
    <app-loading :loading="loading"></app-loading>
    <v-sheet height="800">
      <v-calendar
        ref="calendar"
        color="secondary"
        v-model="focus"
        :type="type"
        :max-days="maxDays"
        :now="today"
        :dark="dark"
        :weekdays="weekdays"
        :short-months="shortMonths"
        :short-weekdays="shortWeekdays"
        :short-intervals="shortIntervals"
        :show-interval-label="showIntervalLabel"
        :first-interval="7"
        :interval-count="17"
        :interval-height="120"
        :events="scheduleEvents"
        :event-overlap-mode="mode"
        :event-overlap-threshold="45"
        :event-color="getEventColor"
        @click:event="showEvent"
        @click:more="viewDay"
        @click:date="viewDay"
        @change="updateRange"
      ></v-calendar>
      <v-menu
        v-model="selectedOpen"
        :close-on-content-click="false"
        :activator="selectedElement"
        :offset-x="!isMobile"
      >
        <v-card
          color="grey lighten-4"
          :min-width="isMobile ? '250px' : '350px'"
          flat
        >
          <v-toolbar :color="selectedScheduleEvent.color" dark>
            <v-btn icon @click="handleOpenScheduleModal(selectedScheduleEvent)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-toolbar-title
              v-html="selectedScheduleEvent.name"
            ></v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn
              icon
              @click="handleOpenConfirmModal(selectedScheduleEvent.id)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <span v-html="selectedScheduleEvent.content"></span>
          </v-card-text>
          <v-card-actions>
            <v-btn text color="secondary" @click="selectedOpen = false">
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
      <confirm-modal
        :visible="showConfirmModal"
        :onConfirm="handleDeleteEvent"
        :onClose="handleCloseConfirmModal"
        title="Delete Event"
        content="Are you sure you want to permanently delete this event?"
        :width="400"
      ></confirm-modal>
    </v-sheet>
  </div>
</template>

<script>
import moment from "moment";
import ScheduleCreateEditModal from "./ScheduleCreateEditModal.vue";
import ConfirmModal from "../ConfirmModal.vue";
import { isMobile } from "../../helpers/utlis";

const weekdaysDefault = [1, 2, 3, 4, 5, 6, 0];

export default {
  data: () => ({
    isMobile: isMobile(),
    focus: moment().format("YYYY-MM-DD"),
    today: moment().format("YYYY-MM-DD hh:mm:ss"),
    selectedScheduleEvent: {},
    selectedElement: null,
    selectedOpen: false,
    dark: true,
    start: null,
    end: null,
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
    type: isMobile() ? "day" : "week",
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
    shortIntervals: true,
    shortMonths: false,
    shortWeekdays: false,
    showCreateEditModal: false,
    showConfirmModal: false,
    deleteScheduleEventId: null,
    scheduleEvent: null
  }),
  computed: {
    loading() {
      return this.$store.getters.loading;
    },
    scheduleEvents() {
      return this.$store.getters.scheduleEvents;
    },
    title() {
      const { start, end } = this;
      if (!start || !end) {
        return "";
      }

      const startMonth = this.monthFormatter(start);
      const endMonth = this.monthFormatter(end);
      const suffixMonth = startMonth === endMonth ? "" : endMonth;

      const startYear = start.year;
      const endYear = end.year;
      const suffixYear = startYear === endYear ? "" : endYear;

      const startDay = start.day + this.nth(start.day);
      const endDay = end.day + this.nth(end.day);

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
    "schedule-create-edit-modal": ScheduleCreateEditModal,
    "confirm-modal": ConfirmModal
  },
  methods: {
    handleCloseConfirmModal() {
      this.deleteScheduleEventId = null;
      this.showConfirmModal = false;
    },
    handleOpenConfirmModal(eventId) {
      this.selectedOpen = false;
      this.showConfirmModal = true;
      this.deleteScheduleEventId = eventId;
    },
    handleCloseScheduleModal() {
      this.showCreateEditModal = false;
      this.scheduleEvent = null;
    },
    handleOpenScheduleModal(event) {
      this.selectedOpen = false;
      this.showCreateEditModal = true;
      this.scheduleEvent = event;
    },
    handleDeleteEvent() {
      this.$store.dispatch("removeScheduleEvent", this.deleteScheduleEventId);
    },
    viewDay({ date }) {
      this.focus = date;
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
        this.selectedScheduleEvent = event;
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
    updateRange({ start, end }) {
      this.start = start;
      this.end = end;
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
.v-calendar-daily__interval:first-child > .v-calendar-daily__interval-text {
  top: -3px !important;
}
@media (max-width: 767px) {
  .ToolbarTitle {
    font-size: 16px;
  }
}
</style>
