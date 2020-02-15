<template>
  <v-row justify="start" class="ml-2">
    <v-dialog dark v-model="dialog" persistent max-width="800px">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" v-on="on">
          Add
          <v-icon right dark>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Create schedule event</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid" validation>
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
                    <v-col :cols="persistant ? '2' : '12'">
                      <v-switch
                        v-model="persistant"
                        :label="`${persistant ? 'Persistant' : 'Normal'}`"
                      ></v-switch>
                    </v-col>
                    <v-col cols="6" v-if="persistant">
                      <v-select
                        v-model="week"
                        :items="weeks"
                        :rules="weekRules"
                        label="Week*"
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col v-if="persistant" cols="12" sm="6">
                  <v-menu
                    ref="startTimer"
                    v-model="startTimerMenu"
                    :close-on-content-click="false"
                    :nudge-right="30"
                    :return-value.sync="startTime"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
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
                      scrollable
                      full-width
                      :max="endTime"
                      @click:minute="$refs.startTimer.save(startTime)"
                    ></v-time-picker>
                  </v-menu>
                </v-col>
                <v-col v-if="persistant" cols="12" sm="6">
                  <v-menu
                    ref="endTimer"
                    v-model="endTimerMenu"
                    :close-on-content-click="false"
                    :nudge-right="30"
                    :return-value.sync="endTime"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
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
                      full-width
                      :min="startTime"
                      @click:minute="$refs.endTimer.save(endTime)"
                    ></v-time-picker>
                  </v-menu>
                </v-col>
                <v-col v-else cols="12" sm="6">
                  <v-menu
                    ref="menu"
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
                        hint="MM/DD/YYYY format"
                        persistent-hint
                        prepend-icon="mdi-calendar-outline"
                        @blur="date = parseDate(dateFormatted)"
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
            :disabled="!valid"
            @click="saveHandler"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    valid: false,
    persistant: false,
    title: "",
    content: "",
    date: null,
    dateFormatted: null,
    dateMenu: false,
    startTimerMenu: false,
    endTimerMenu: false,
    startTime: null,
    endTime: null,
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
    parseDate(date) {
      if (!date) return null;

      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    saveHandler() {
      if (this.$refs.form.validate()) {
        this.dialog = false;

        const schedule = {
          title: this.title,
          content: this.content,
          persistant: this.persistant,
          ...(this.persistant
            ? {
                week: this.week,
                startTime: this.startTime,
                endTime: this.endTime
              }
            : { date: this.date })
        };

        console.log("schedule: ", schedule);
        this.$refs.form.reset();
      }
    }
  }
};
</script>

<style></style>
