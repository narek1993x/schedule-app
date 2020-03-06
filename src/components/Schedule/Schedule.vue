<template>
  <v-container fluid class="Container">
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
        :dark="darkMode"
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
    <v-sheet class="CalendarSheet">
      <v-calendar
        ref="calendar"
        color="secondary"
        v-model="focus"
        :type="type"
        :max-days="maxDays"
        :now="today"
        :dark="darkMode"
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
        <v-card color="grey lighten-4" min-width="350px" flat>
          <v-toolbar :color="selectedScheduleEvent.color" dark>
            <v-btn icon @click="handleOpenScheduleModal(selectedScheduleEvent)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-toolbar-title
              v-html="selectedScheduleEvent.name"
            ></v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn
              v-if="selectedScheduleEvent.permanent"
              icon
              @click="handleOpenCopyModal(selectedScheduleEvent)"
            >
              <v-icon>mdi-content-duplicate</v-icon>
            </v-btn>
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
      <modal
        :width="400"
        :dark="darkMode"
        :visible="showConfirmModal"
        :onClose="handleCloseConfirmModal"
      >
        <v-card>
          <v-card-title class="headline">Delete Event</v-card-title>
          <v-card-text>
            Are you sure you want to permanently delete this event?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="handleCloseConfirmModal">
              Cancel
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              :disabled="loading"
              @click="handleDeleteEvent"
            >
              Confirm
            </v-btn>
          </v-card-actions>
        </v-card>
      </modal>
      <modal
        :width="500"
        :dark="darkMode"
        :visible="showCopyModal"
        :onClose="handleCloseCopyModal"
      >
        <v-card>
          <v-card-title class="headline">Duplicate Event</v-card-title>
          <v-card-text>
            <v-form ref="copyform" v-model="copyformValid" lazy-validation>
              <v-select
                multiple
                chips
                clearable
                :item-disabled="handleDisableWeekItems"
                v-model="selectedDuplicateWeeks"
                :items="duplicateWeeks"
                :rules="weekRules"
                label="Select weeks to duplicate event*"
              ></v-select>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="handleCloseCopyModal">
              Cancel
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              :disabled="!copyformValid || loading"
              @click="handleDuplicateEvent"
            >
              Duplicate
            </v-btn>
          </v-card-actions>
        </v-card>
      </modal>
    </v-sheet>
  </v-container>
</template>

<script>
import moment from "moment";
import ScheduleCreateEditModal from "./ScheduleCreateEditModal.vue";
import Modal from "../Modal.vue";
import { isMobile, handleScheduleEventTime } from "../../helpers/utlis";
import { DarkMode } from "../../storage";

const weekdaysDefault = [1, 2, 3, 4, 5, 6, 0];
const dark = !!DarkMode.get();

export default {
  data: () => ({
    dark,
    isMobile: isMobile(),
    focus: moment().format("YYYY-MM-DD"),
    today: moment().format("YYYY-MM-DD hh:mm:ss"),
    selectedScheduleEvent: {},
    selectedElement: null,
    selectedOpen: false,
    start: null,
    end: null,
    type: isMobile() ? "day" : "week",
    typeOptions: [
      { text: "Day", value: "day" },
      { text: "4 Day", value: "4day" },
      { text: "Week", value: "week" },
      { text: "Month", value: "month" }
    ],
    mode: "column",
    weekdays: weekdaysDefault,
    weekdaysOptions: [
      { text: "Sunday - Saturday", value: [0, 1, 2, 3, 4, 5, 6] },
      { text: "Mon, Wed, Fri", value: [1, 3, 5] },
      { text: "Mon - Fri", value: [1, 2, 3, 4, 5] },
      { text: "Mon - Sun", value: weekdaysDefault }
    ],
    selectedDuplicateWeeks: [],
    duplicateWeeks: [
      { text: "Monday", value: "monday" },
      { text: "Tuesday", value: "tuesday" },
      { text: "Wednesday", value: "wednesday" },
      { text: "Thursday", value: "thursday" },
      { text: "Friday", value: "friday" },
      { text: "Saturday", value: "saturday" },
      { text: "Sunday", value: "sunday" }
    ],
    weekRules: [v => !!v.length || "Weeks are required"],
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
    showCopyModal: false,
    deleteScheduleEventId: null,
    scheduleEvent: null,
    copyScheduleEvent: null,
    duplicateScheduleEventWeeks: [],
    copyformValid: true
  }),
  watch: {
    dark: function(newDark) {
      DarkMode.set(newDark);
    }
  },
  computed: {
    darkMode() {
      return this.dark;
    },
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
    modal: Modal
  },
  methods: {
    handleCloseCopyModal() {
      this.copyScheduleEvent = null;
      this.showCopyModal = false;
      this.$refs.copyform.reset();
      this.duplicateScheduleEventWeeks = [];
    },
    handleOpenCopyModal(event) {
      this.selectedOpen = false;
      this.showCopyModal = true;
      this.copyScheduleEvent = event;
      this.handleDuplicateScheduleEventWeeks();
    },
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
    handleDuplicateEvent() {
      const copyScheduleEvent = this.copyScheduleEvent;
      const selectedDuplicateWeeks = this.selectedDuplicateWeeks;

      if (this.$refs.copyform.validate()) {
        const scheduleEvents = selectedDuplicateWeeks.map(week => ({
          ...copyScheduleEvent,
          week
        }));
        this.$store.dispatch("addDuplicateScheduleEvents", scheduleEvents);
        this.handleCloseCopyModal();
      }
    },
    handleDeleteEvent() {
      this.$store.dispatch("removeScheduleEvent", this.deleteScheduleEventId);
      this.handleCloseConfirmModal();
    },
    handleDisableWeekItems(item) {
      return this.duplicateScheduleEventWeeks.includes(item.value);
    },
    handleDuplicateScheduleEventWeeks() {
      const duplicateScheduleEventWeeks = [];

      const { content, name, start, end } = this.copyScheduleEvent;

      this.scheduleEvents.forEach(event => {
        if (
          event.content === content &&
          event.name === name &&
          handleScheduleEventTime(event.start) ===
            handleScheduleEventTime(start) &&
          handleScheduleEventTime(event.end) === handleScheduleEventTime(end)
        ) {
          duplicateScheduleEventWeeks.push(event.week);
        }
      });

      this.duplicateScheduleEventWeeks = duplicateScheduleEventWeeks;
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

      this.$store.commit("setStartEndDates", {
        start: start.date,
        end: end.date
      });
    },
    nth(d) {
      return d > 3 && d < 21
        ? "th"
        : ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][d % 10];
    }
  }
};
</script>

<style lang="scss">
.Container {
  padding: 0px !important;
}
.CalendarSheet {
  height: calc(100vh - 118px) !important;
}
.v-calendar-daily__interval:first-child {
  & .v-calendar-daily__interval-text {
    top: -3px !important;
  }
}
@media (max-width: 767px) {
  .ToolbarTitle {
    font-size: 16px;
  }

  .CalendarSheet {
    height: calc(100vh - 110px) !important;
  }
}
</style>
