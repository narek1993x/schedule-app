<template>
  <v-row justify="start" class="ml-2">
    <v-dialog
      :dark="dark"
      :fullscreen="isMobile"
      v-model="dialog"
      max-width="800px"
    >
      <v-card>
        <v-card-title class="ModalTitle">
          <span class="headline">
            {{ scheduleEvent ? "Edit" : "Create" }} schedule event
          </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form @submit.prevent ref="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="title"
                    label="Title*"
                    hint="title of event"
                    :rules="titleRules"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="content"
                    name="input-7-4"
                    label="Content"
                    value
                    hint="content of event"
                  ></v-textarea>
                </v-col>
                <v-col cols="12">
                  <v-row class="d-flex justify-space-between">
                    <v-col cols="12" sm="3">
                      <v-switch
                        v-model="permanent"
                        :label="`${permanent ? 'Permanent' : 'One time'}`"
                      ></v-switch>
                    </v-col>
                    <v-col v-if="permanent" cols="12" sm="6">
                      <v-select
                        v-model="week"
                        :items="weeks"
                        :rules="weekRules"
                        label="Week*"
                      ></v-select>
                    </v-col>
                    <v-col v-else cols="12" sm="6">
                      <v-menu
                        v-model="dateMenu"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="date"
                            :rules="dateRules"
                            label="Date*"
                            hint="Event data"
                            persistent-hint
                            prepend-icon="mdi-calendar-outline"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="date"
                          no-title
                          @input="dateMenu = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-row class="d-flex justify-space-between">
                    <v-col class="d-flex" cols="12" sm="6">
                      <v-icon :size="20">mdi-timer</v-icon>
                      <vue-timepicker
                        v-model="startTime"
                        placeholder="Start*"
                        :hour-range="startHourRange"
                        :minute-range="startMinuteRange"
                        :minute-interval="5"
                        input-width="100%"
                      ></vue-timepicker>
                    </v-col>
                    <v-col class="d-flex" cols="12" sm="6">
                      <v-icon :size="20">mdi-timer</v-icon>
                      <vue-timepicker
                        v-model="endTime"
                        placeholder="End*"
                        :hour-range="endHourRange"
                        :minute-range="endMinuteRange"
                        :minute-interval="5"
                        input-width="100%"
                      ></vue-timepicker>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            :disabled="!valid || loading"
            @click="saveHandler"
          >
            {{ scheduleEvent ? "Update" : "Save" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import VueTimepicker from "vue2-timepicker";
import {
  isMobile,
  handleScheduleEventTime,
  handleHourRange,
  handleMinuteRange
} from "../../helpers/utils";
import "vue2-timepicker/dist/VueTimepicker.css";

export default {
  components: { "vue-timepicker": VueTimepicker },
  props: ["visible", "dark", "scheduleEvent", "onClose"],
  watch: {
    scheduleEvent: function(newScheduleEvent) {
      if (newScheduleEvent) {
        const {
          name,
          content,
          permanent,
          week,
          start,
          end,
          date
        } = newScheduleEvent;

        this.title = name;
        this.content = content;
        this.startTime = handleScheduleEventTime(start);
        this.endTime = handleScheduleEventTime(end);

        if (permanent) {
          this.permanent = permanent;
          this.week = week;
        } else {
          this.date = date;
        }
      }
    },
    visible: function(newVisible) {
      if (newVisible) {
        this.dialog = newVisible;
      }
    },
    dialog: function(newDialog) {
      if (!newDialog) this.closeHandler();
    }
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    loading() {
      return this.$store.getters.loading;
    },
    startHourRange() {
      return handleHourRange(this.endTime, true);
    },
    endHourRange() {
      return handleHourRange(this.startTime);
    },
    startMinuteRange() {
      return handleMinuteRange(this.startTime, this.endTime, true);
    },
    endMinuteRange() {
      return handleMinuteRange(this.startTime, this.endTime);
    }
  },
  data: () => ({
    isMobile: isMobile(),
    dialog: false,
    valid: true,
    permanent: false,
    title: "",
    content: "",
    date: "",
    dateFormatted: null,
    dateMenu: false,
    startTimerMenu: false,
    endTimerMenu: false,
    startTime: "",
    endTime: "",
    week: "",
    weeks: [
      { text: "Monday", value: "monday" },
      { text: "Tuesday", value: "tuesday" },
      { text: "Wednesday", value: "wednesday" },
      { text: "Thursday", value: "thursday" },
      { text: "Friday", value: "friday" },
      { text: "Saturday", value: "saturday" },
      { text: "Sunday", value: "sunday" }
    ],
    titleRules: [v => !!v || "Title is required"],
    dateRules: [v => !!v || "Date is required"],
    startTimeRules: [v => !!v || "Start time is required"],
    endTimeRules: [v => !!v || "End time is required"],
    weekRules: [v => !!v || "Week is required"]
  }),
  methods: {
    clear() {
      this.$refs.form.reset();
      this.dialog = false;
      this.permanent = false;
      this.title = "";
      this.content = "";
      this.date = "";
      this.dateFormatted = null;
      this.dateMenu = false;
      this.startTimerMenu = false;
      this.endTimerMenu = false;
      this.startTime = "";
      this.endTime = "";
      this.week = "";
    },
    closeHandler() {
      this.onClose();
      this.clear();
    },
    saveHandler() {
      if (this.$refs.form.validate()) {
        const schedule = {
          name: this.title,
          content: this.content,
          permanent: this.permanent,
          start: this.startTime,
          end: this.endTime,
          reminder: this.scheduleEvent ? this.scheduleEvent.reminder : true,
          ...(this.permanent
            ? {
                week: this.week
              }
            : { date: this.date }),
          ...(this.user ? { ownerId: this.user.id } : {}),
          ...(this.scheduleEvent ? { id: this.scheduleEvent.id } : {})
        };

        const dispatchAction = this.scheduleEvent
          ? "editScheduleEvent"
          : "addScheduleEvent";

        this.$store.dispatch(dispatchAction, schedule);
        this.closeHandler();
      }
    }
  }
};
</script>

<style lang="scss">
.time-picker {
  & .dropdown,
  & .select-list {
    height: 7em !important;
  }

  & .display-time {
    border: none !important;
    border-bottom: 1px solid #696969 !important;
    transition: 0.3s;
    cursor: pointer;

    &:hover,
    &:focus {
      border-bottom: 1px solid #000 !important;
      outline: none !important;
    }
  }

  & .active {
    background-color: #e535ab !important;
  }
}

@media (max-width: 767px) {
  .ModalTitle {
    & .headline {
      font-size: 20px !important;
    }
  }
}
</style>
