<template>
  <v-container fluid class="Container">
    <v-sheet tile height="54" color="grey lighten-3" class="d-flex justify-space-between align-center">
      <v-btn class="ml-3 mr-6" icon @click.stop="showEventModal = true">
        <v-icon size="42">mdi-plus-circle-outline</v-icon>
      </v-btn>

      <v-tooltip bottom v-if="!isMobile">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            small
            outlined
            v-bind="attrs"
            v-on="on"
            class="mr-2"
            color="grey darken-2"
            @click="handleSettingsChange('', 'focus')"
          >
            Today
          </v-btn>
        </template>
        <span>{{ todayText }}</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" @click="$refs.calendar.prev()">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </template>
        <span>Previous {{ type }}</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" class="mr-2" @click="$refs.calendar.next()">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </template>
        <span>Next {{ type }}</span>
      </v-tooltip>

      <v-menu v-model="calendarOpen" :close-on-content-click="false" :offset-x="!isMobile">
        <template v-slot:activator="{ on, attrs }">
          <v-toolbar-title v-on="on" v-bind="attrs" class="ToolbarTitle mr-2">
            {{ title }}
            <v-icon>mdi-menu-down</v-icon>
          </v-toolbar-title>
        </template>
        <v-date-picker v-model="focus" reactive show-current :full-width="isMobile" type="date"></v-date-picker>
      </v-menu>

      <v-spacer></v-spacer>

      <ScheduleSettings
        :isMobile="isMobile"
        :dark="dark"
        :type="type"
        :weekdays="weekdays"
        :onSettingsChange="handleSettingsChange"
      ></ScheduleSettings>
      <EventModal
        v-if="showEventModal"
        :dark="dark"
        :onClose="handleCloseEventModal"
        :visible="showEventModal"
        :selectedWeekDays="selectedWeekDays"
        :scheduleEvent="scheduleEvent"
      ></EventModal>
    </v-sheet>
    <Loading :loading="loading"></Loading>
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
      <Event
        :isMobile="isMobile"
        :show="selectedOpen"
        :event="selectedScheduleEvent"
        :eventActivator="selectedElement"
        :onClose="closeEvent"
        :onOpenEventeModal="handleOpenEventeModal"
        :onOpenDeleteModal="handleOpenDeleteModal"
        :onOpenCopyModal="handleOpenCopyModal"
        :onReminderToggle="handleReminderToggle"
      ></Event>
      <EventDeleteModal
        :dark="dark"
        :loading="loading"
        :showModal="showConfirmModal"
        :onClose="handleCloseDeleteModal"
        :onDelete="handleDeleteEvent"
      ></EventDeleteModal>
      <EventCopyModal
        v-if="showCopyModal"
        :dark="dark"
        :showModal="showCopyModal"
        :defaultSelected="selectedWeekDays"
        :onClose="handleCloseCopyModal"
        :onDuplicate="handleDuplicateEvent"
      ></EventCopyModal>
    </v-sheet>
  </v-container>
</template>

<script>
import moment from "moment";
import Event from "./Event.vue";
import EventModal from "./EventModal.vue";
import EventDeleteModal from "./EventDeleteModal.vue";
import EventCopyModal from "./EventCopyModal.vue";
import ScheduleSettings from "./ScheduleSettings";
import { isMobile, getWeekDayFromDate, handleScheduleEventTime } from "../../helpers/utils";
import { DarkMode } from "../../storage";

const weekdaysDefault = [1, 2, 3, 4, 5, 6, 0];

export default {
  components: {
    Event,
    EventModal,
    EventDeleteModal,
    EventCopyModal,
    ScheduleSettings,
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
    selectedWeekDays: [],
    shortIntervals: true,
    shortMonths: false,
    shortWeekdays: false,
    showEventModal: false,
    showConfirmModal: false,
    showCopyModal: false,
    deleteScheduleEventId: null,
    scheduleEvent: null,
  }),
  watch: {
    dark: function(newDark) {
      DarkMode.set(newDark);
    },
  },
  computed: {
    todayText() {
      return moment().format("dddd, MMM D");
    },
    defaultSelectedWeekDays() {
      return this.selectedWeekDays.map((d) => d.week);
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

      const startDay = start.day;
      const endDay = end.day;

      switch (this.type) {
        case "month":
          return `${startMonth} ${startYear}`;
        case "week":
        case "4day":
          return `${startMonth} ${startDay} - ${suffixMonth} ${endDay} ${endYear}`;
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
        month: "short",
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
      this.showCopyModal = false;
      this.scheduleEvent = null;
      this.selectedWeekDays = [];
    },
    handleOpenCopyModal(event) {
      this.showCopyModal = true;
      this.scheduleEvent = event;
      this.handleSelectWeekDays();
      this.closeEvent();
    },
    handleCloseDeleteModal() {
      this.deleteScheduleEventId = null;
      this.showConfirmModal = false;
    },
    handleOpenDeleteModal(eventId) {
      this.showConfirmModal = true;
      this.deleteScheduleEventId = eventId;
      this.closeEvent();
    },
    handleCloseEventModal() {
      this.showEventModal = false;
      this.scheduleEvent = null;
      this.selectedWeekDays = [];
    },
    handleOpenEventeModal(event) {
      this.showEventModal = true;
      this.scheduleEvent = event;
      this.handleSelectWeekDays();
      this.closeEvent();
    },
    handleDuplicateEvent(selected) {
      const scheduleEvent = this.scheduleEvent;

      const scheduleEvents = selected.map((week) => ({
        ...scheduleEvent,
        start: handleScheduleEventTime(scheduleEvent.start),
        end: handleScheduleEventTime(scheduleEvent.end),
        week,
      }));

      this.$store.dispatch("addScheduleEvents", scheduleEvents);
      this.handleCloseCopyModal();
    },
    handleDeleteEvent() {
      this.$store.dispatch("removeScheduleEvent", this.deleteScheduleEventId);
      this.handleCloseDeleteModal();
    },
    handleSelectWeekDays() {
      const selectedWeekDays = [];

      const { content, name, start, end } = this.scheduleEvent;

      this.scheduleEvents.forEach((event) => {
        if (
          event.content === content &&
          event.name === name &&
          handleScheduleEventTime(event.start) === handleScheduleEventTime(start) &&
          handleScheduleEventTime(event.end) === handleScheduleEventTime(end)
        ) {
          selectedWeekDays.push({
            week: event.week || getWeekDayFromDate(event.date),
            id: event.id,
            reminder: !!event.reminder,
          });
        }
      });

      this.selectedWeekDays = selectedWeekDays;
    },
    handleReminderToggle(scheduleEvent) {
      const newScheduleEvent = {
        ...scheduleEvent,
        reminder: !scheduleEvent.reminder,
      };

      this.selectedScheduleEvent = newScheduleEvent;
      this.$store.dispatch("editScheduleEvents", [newScheduleEvent]);
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
    closeEvent() {
      this.selectedOpen = false;
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedScheduleEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => (this.selectedOpen = true), 10);
      };

      if (this.selectedOpen) {
        this.closeEvent();
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
  display: flex;
  cursor: pointer;

  &:hover {
    color: #616161;

    .v-icon {
      opacity: 0.7;
    }
  }
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
