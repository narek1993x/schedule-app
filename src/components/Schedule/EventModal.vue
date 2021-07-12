<template>
  <v-dialog :dark="dark" :fullscreen="isMobile" :value="visible" @click:outside="closeHandler" max-width="800px">
    <v-card>
      <v-card-title class="ModalTitle">
        <span class="headline"> {{ scheduleEvent ? "Edit" : "Create" }} event</span>
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
                  rows="2"
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-row class="d-flex align-center">
                  <v-col cols="4" sm="2">
                    <ColorSelect :dark="dark" :defaultColor="color" :onSelect="colorSelectHandler"></ColorSelect>
                  </v-col>
                  <v-col cols="8" sm="4">
                    <v-btn-toggle class="permanent-toggle" v-model="permanent" dense group :dark="dark">
                      <v-btn :value="false" :disabled="isPermanentSet" small>
                        One time
                      </v-btn>
                      <v-btn :value="true" :disabled="isPermanentSet" small>
                        Permanent
                      </v-btn>
                    </v-btn-toggle>
                  </v-col>
                  <v-col v-if="permanent" cols="12" sm="6">
                    <WeekSelect
                      :defaultSelected="defaultSelectedWeekDays"
                      :onSelect="weekSelectHandler"
                      label="Week days*"
                    ></WeekSelect>
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
                          hint="Event date"
                          persistent-hint
                          prepend-icon="mdi-calendar-outline"
                          v-on="on"
                          style="min-height: 76px"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="date" no-title @input="dateMenu = false"></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12">
                <v-row class="d-flex">
                  <v-col cols="12" sm="6">
                    <v-menu
                      ref="startTimer"
                      v-model="startTimerMenu"
                      :close-on-content-click="false"
                      :nudge-right="30"
                      :return-value.sync="startTime"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="280px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="startTime"
                          :rules="startTimeRules"
                          label="Start*"
                          prepend-icon="mdi-timer"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="startTimerMenu"
                        v-model="startTime"
                        header-color="primary"
                        scrollable
                        full-width
                        :max="endTime"
                        @click:minute="$refs.startTimer.save(startTime)"
                      ></v-time-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-menu
                      ref="endTimer"
                      v-model="endTimerMenu"
                      :close-on-content-click="false"
                      :nudge-right="30"
                      :return-value.sync="endTime"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="280px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="endTime"
                          :rules="endTimeRules"
                          label="End*"
                          prepend-icon="mdi-timer"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="endTimerMenu"
                        v-model="endTime"
                        scrollable
                        header-color="primary"
                        full-width
                        :min="startTime"
                        @click:minute="$refs.endTimer.save(endTime)"
                      ></v-time-picker>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeHandler">
          Close
        </v-btn>
        <v-btn color="blue darken-1" text :disabled="!valid || loading" @click="saveHandler">
          {{ scheduleEvent ? "Update" : "Save" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ColorSelect from "../ColorSelect";
import WeekSelect from "../WeekSelect";
import { isMobile, handleEventTime } from "../../helpers/utils";

export default {
  components: {
    ColorSelect,
    WeekSelect,
  },
  props: ["visible", "dark", "scheduleEvent", "onClose", "selectedWeekDays"],
  beforeMount() {
    if (this.scheduleEvent) {
      const { name, color, content, permanent, week, start, end, date } = this.scheduleEvent;

      this.title = name;
      this.content = content;
      this.startTime = handleEventTime(start);
      this.endTime = handleEventTime(end);
      this.color = color || "blue";

      if (permanent) {
        this.permanent = permanent;
        this.week = week;
      } else {
        this.date = date;
      }
    }
  },
  computed: {
    isPermanentSet() {
      return this.scheduleEvent?.permanent !== undefined;
    },
    defaultSelectedWeekDays() {
      return this.selectedWeekDays.map((d) => d.week);
    },
    user() {
      return this.$store.getters.user;
    },
    loading() {
      return this.$store.getters.loading;
    },
  },
  data: (instance) => {
    return {
      isMobile: isMobile(),
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
      color: "blue",
      newSelectedWeekDays: instance.selectedWeekDays.map((d) => d.week),
      titleRules: [(v) => !!v || "Title is required"],
      dateRules: [(v) => !!v || "Date is required"],
      startTimeRules: [(v) => !!v || "Start time is required"],
      endTimeRules: [(v) => !!v || "End time is required"],
    };
  },
  methods: {
    clear() {
      this.$refs.form.reset();
      this.permanent = false;
      this.title = "";
      this.content = "";
      this.date = "";
      this.dateFormatted = null;
      this.dateMenu = false;
      this.startTime = "";
      this.endTime = "";
      this.week = "";
    },
    closeHandler() {
      this.clear();
      this.onClose();
    },
    weekSelectHandler(value) {
      this.newSelectedWeekDays = value;
    },
    colorSelectHandler(value) {
      this.color = value;
    },
    saveHandler() {
      if (this.$refs.form.validate()) {
        const schedule = {
          name: this.title,
          content: this.content,
          permanent: this.permanent,
          start: this.startTime,
          end: this.endTime,
          color: this.color,
          reminder: true,
          ownerId: this.user.uid,
        };

        const scheduleEvents = [];

        if (this.permanent) {
          this.newSelectedWeekDays.forEach((weekDay) => {
            const weekData = this.selectedWeekDays.find((d) => d.week === weekDay);
            scheduleEvents.push({
              ...schedule,
              ...(weekData && weekData),
              week: weekDay,
            });
          });
        } else {
          scheduleEvents.push({
            ...schedule,
            ...(this.scheduleEvent && { id: this.scheduleEvent.id }),
            week: null,
            date: this.date,
          });
        }

        const dispatchAction = !!this.scheduleEvent ? "editEvents" : "addEvents";
        this.$store.dispatch(dispatchAction, scheduleEvents);
        this.closeHandler();
      }
    },
  },
};
</script>

<style lang="scss">
%btnToggleColors {
  background-color: #2196f3 !important;
  color: #fff !important;
}

.permanent-toggle.theme {
  &--light,
  &--dark {
    .v-btn {
      &--active {
        @extend %btnToggleColors;
      }
    }

    .v-btn.v-btn--active.v-btn--has-bg {
      @extend %btnToggleColors;
    }

    .v-btn.v-btn--active.v-btn--disabled.v-btn--has-bg {
      @extend %btnToggleColors;
    }
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
