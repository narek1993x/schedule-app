<template>
  <v-container fluid class="Container">
    <v-sheet tile height="54" color="grey lighten-3" class="d-flex justify-space-between align-center">
      <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <schedule-settings
        :dark="dark"
        :type="type"
        :weekdays="weekdays"
        :onSettingsChange="handleSettingsChange"
      ></schedule-settings>
      <v-spacer></v-spacer>
      <v-menu v-model="calendarOpen" :close-on-content-click="false" :offset-x="!isMobile">
        <v-toolbar-title slot="activator" class="ToolbarTitle mr-2" @click="calendarOpen = true">
          {{ title }}
        </v-toolbar-title>
        <v-date-picker v-model="focus" reactive show-current :full-width="isMobile" type="date"></v-date-picker>
      </v-menu>
      <v-spacer></v-spacer>
      <v-btn color="primary" :small="isMobile" @click.stop="showCreateEditModal = true">
        Add
        <v-icon :size="18" right dark>mdi-plus</v-icon>
      </v-btn>
      <schedule-create-edit-modal
        v-if="showCreateEditModal"
        :dark="dark"
        :onClose="handleCloseScheduleModal"
        :visible="showCreateEditModal"
        :scheduleEvent="scheduleEvent"
      ></schedule-create-edit-modal>
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
        :max-days="7"
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
      >
        <template #day-body="{ date }">
          <div
            class="v-current-time"
            :class="{
              hide: date !== new Date().toISOString().substr(0, 10),
            }"
            :style="{ top: nowY }"
          ></div>
        </template>
      </v-calendar>
      <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" :offset-x="!isMobile">
        <v-card
          color="grey lighten-4"
          :width="isMobile ? '320px' : '448px'"
          :height="isMobile ? '326px' : '457px'"
          flat
        >
          <v-toolbar :color="selectedScheduleEvent.color" dark>
            <v-spacer />
            <v-btn icon @click="handleOpenScheduleModal(selectedScheduleEvent)">
              <v-icon :size="20">mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon @click="handleOpenConfirmModal(selectedScheduleEvent.id)">
              <v-icon :size="20">mdi-delete</v-icon>
            </v-btn>
            <v-btn v-if="selectedScheduleEvent.permanent" icon @click="handleOpenCopyModal(selectedScheduleEvent)">
              <v-icon :size="20">mdi-content-duplicate</v-icon>
            </v-btn>

            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on" @click="handleReminderToggle(selectedScheduleEvent)">
                  <v-icon :size="20">
                    {{ selectedScheduleEvent.reminder ? "mdi-bell" : "mdi-bell-off" }}
                  </v-icon>
                </v-btn>
              </template>
              <span>
                {{ selectedScheduleEvent.reminder ? "Turned on" : "Turned off" }}
              </span>
            </v-tooltip>
            <v-btn icon @click="selectedOpen = false">
              <v-icon :size="20">mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <div class="headline text--primary pb-5">
              {{ selectedScheduleEvent.name }}
            </div>
            <div class="text--primary">{{ selectedScheduleEvent.content }}</div>
          </v-card-text>
        </v-card>
      </v-menu>
      <modal :width="400" :dark="dark" :visible="showConfirmModal" :onClose="handleCloseConfirmModal">
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
            <v-btn color="blue darken-1" text :disabled="loading" @click="handleDeleteEvent">
              Confirm
            </v-btn>
          </v-card-actions>
        </v-card>
      </modal>
      <modal :width="500" :dark="dark" :visible="showCopyModal" :onClose="handleCloseCopyModal">
        <v-card>
          <v-card-title class="headline">Duplicate Event</v-card-title>
          <v-card-text>
            <v-form @submit.prevent ref="copyform" v-model="copyformValid" lazy-validation>
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
            <v-btn color="blue darken-1" text :disabled="!copyformValid || loading" @click="handleDuplicateEvent">
              Duplicate
            </v-btn>
          </v-card-actions>
        </v-card>
      </modal>
    </v-sheet>
  </v-container>
</template>

<script>
import ScheduleCreateEditModal from "./ScheduleCreateEditModal.vue";
import ScheduleSettings from "./ScheduleSettings";
import Modal from "../Modal.vue";
import { isMobile, handleScheduleEventTime } from "../../helpers/utils";
import { DarkMode } from "../../storage";

const weekdaysDefault = [1, 2, 3, 4, 5, 6, 0];

export default {
  components: {
    "schedule-create-edit-modal": ScheduleCreateEditModal,
    "schedule-settings": ScheduleSettings,
    modal: Modal,
  },
  data: () => ({
    dark: !!DarkMode.get(),
    type: isMobile() ? "day" : "week",
    weekdays: weekdaysDefault,
    isMobile: isMobile(),
    ready: false,
    focus: new Date().toISOString().substr(0, 10),
    selectedScheduleEvent: {},
    selectedElement: null,
    selectedOpen: false,
    calendarOpen: false,
    start: null,
    end: null,
    mode: "column",
    selectedDuplicateWeeks: [],
    duplicateWeeks: [
      { text: "Monday", value: "monday" },
      { text: "Tuesday", value: "tuesday" },
      { text: "Wednesday", value: "wednesday" },
      { text: "Thursday", value: "thursday" },
      { text: "Friday", value: "friday" },
      { text: "Saturday", value: "saturday" },
      { text: "Sunday", value: "sunday" },
    ],
    weekRules: [(v) => !!v.length || "Weeks are required"],
    styleInterval: "default",
    styleIntervalOptions: [
      { text: "Default", value: "default" },
      { text: "Workday", value: "workday" },
      { text: "Past", value: "past" },
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
    copyformValid: true,
  }),
  watch: {
    dark: function(newDark) {
      DarkMode.set(newDark);
    },
  },
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
    cal() {
      return this.ready ? this.$refs.calendar : null;
    },
    nowY() {
      return this.cal ? this.cal.timeToY(this.cal.times.now) + "px" : "-10px";
    },
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: "UTC",
        month: "long",
      });
    },
  },
  mounted() {
    this.ready = true;
    this.scrollToTime();
    this.updateTime();
  },
  methods: {
    handleSettingsChange(value, key) {
      this[key] = value;
    },
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
        const scheduleEvents = selectedDuplicateWeeks.map((week) => ({
          ...copyScheduleEvent,
          week,
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

      this.scheduleEvents.forEach((event) => {
        if (
          event.content === content &&
          event.name === name &&
          handleScheduleEventTime(event.start) === handleScheduleEventTime(start) &&
          handleScheduleEventTime(event.end) === handleScheduleEventTime(end)
        ) {
          duplicateScheduleEventWeeks.push(event.week);
        }
      });

      this.duplicateScheduleEventWeeks = duplicateScheduleEventWeeks;
    },
    handleReminderToggle(scheduleEvent) {
      const newScheduleEvent = {
        ...scheduleEvent,
        reminder: !scheduleEvent.reminder,
      };

      this.selectedScheduleEvent = newScheduleEvent;
      this.$store.dispatch("editScheduleEvent", newScheduleEvent);
    },
    getCurrentTime() {
      return this.cal ? this.cal.times.now.hour * 60 + this.cal.times.now.minute : 0;
    },
    scrollToTime() {
      const time = this.getCurrentTime();
      const first = Math.max(0, time - (time % 30) - 30);

      this.cal.scrollToTime(first);
    },
    updateTime() {
      setInterval(() => this.cal.updateTimes(), 60 * 1000);
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
        end: end.date,
      });
    },
    nth(d) {
      return d > 3 && d < 21 ? "th" : ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][d % 10];
    },
  },
};
</script>

<style lang="scss">
.TypeSelect,
.WeekdaysSelect {
  max-width: 200px !important;
}

.Container {
  padding: 0px !important;
}

.CalendarSheet {
  height: calc(100vh - 118px) !important;
}

.ToolbarTitle {
  cursor: pointer;
}

.v-calendar-daily__interval:first-child {
  & .v-calendar-daily__interval-text {
    top: -3px !important;
  }
}

.v-current-time {
  height: 2px;
  background-color: #ea4335;
  position: absolute;
  left: -1px;
  right: 0;
  pointer-events: none;

  &.hide {
    display: none;
  }

  &::before {
    content: "";
    position: absolute;
    background-color: #ea4335;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-top: -5px;
    margin-left: -6.5px;
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
