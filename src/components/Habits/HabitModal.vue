<template>
  <v-dialog :dark="dark" :fullscreen="isMobile" :value="visible" @click:outside="closeHandler" max-width="800px">
    <v-card>
      <v-card-title class="ModalTitle">
        <span class="headline"> {{ currentHabit ? "Edit" : "Create" }} habit</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form @submit.prevent ref="form" v-model="valid" lazy-validation>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="title"
                  label="Title*"
                  hint="title of habit"
                  :rules="titleRules"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-select
                  multiple
                  chips
                  clearable
                  v-model="types"
                  :items="Object.values(typeOptions)"
                  :rules="typeRules"
                  label="Type(s)*"
                ></v-select>
              </v-col>

              <v-col cols="12">
                <v-select
                  clearable
                  v-model="showAfter"
                  :items="allHabitItems"
                  :rules="showAfterRules"
                  label="Show after"
                ></v-select>
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
                        ampm-in-title
                        header-color="#3c3c3c"
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
                        header-color="#3c3c3c"
                        full-width
                        :min="startTime"
                        ampm-in-title
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
          {{ currentHabit ? "Update" : "Save" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { isMobile } from "../../helpers/utils";

function isCanCombine(values, types) {
  const que = types.que.value;
  const routine = types.routine.value;
  const reward = types.reward.value;

  const isQueReward = values.includes(que) && values.includes(reward) && values.length === 2;
  const isRoutineOnly = values.includes(routine) && values.length === 1;

  return isQueReward || isRoutineOnly || values.length > 0;
}

export default {
  props: ["visible", "dark", "currentHabit", "allHabits", "onClose"],
  beforeMount() {
    if (this.currentHabit) {
      const { title, types, showAfter, start, end } = this.currentHabit;

      this.title = title;
      this.types = types;
      this.showAfter = showAfter;
      this.startTime = start;
      this.endTime = end;
    }
  },
  computed: {
    loading() {
      return this.$store.getters.loading;
    },
    allHabitItems() {
      return this.allHabits.map((h) => ({ text: h.title, value: h.id }));
    },
  },
  data: (instance) => {
    return {
      isMobile: isMobile(),
      valid: true,
      title: "",
      types: [],
      showAfter: "",
      startTimerMenu: false,
      endTimerMenu: false,
      startTime: "",
      endTime: "",
      typeOptions: {
        que: { text: "Que", value: "que" },
        routine: { text: "Routine", value: "routine" },
        reward: { text: "Reward", value: "reward" },
      },
      titleRules: [(v) => !!v || "Title is required"],
      typeRules: [
        (v) => {
          const message = "You can only combine 'Que' with 'Reward'";

          if (!isCanCombine(v, instance.typeOptions)) {
            return message;
          }

          return !!v.length || "Type(s) are required";
        },
      ],
      showAfterRules: [(v) => v === "" || !!v || "Show after must be either '' or habit"],
      startTimeRules: [(v) => !!v || "Start time is required"],
      endTimeRules: [(v) => !!v || "End time is required"],
    };
  },
  methods: {
    clear() {
      this.$refs.form.reset();
      this.title = "";
      this.types = [];
      this.showAfter = "";
      this.startTime = "";
      this.endTime = "";
    },
    closeHandler() {
      this.clear();
      this.onClose();
    },
    saveHandler() {
      if (this.$refs.form.validate()) {
        const habit = {
          title: this.title,
          types: this.types,
          showAfter: this.showAfter,
          start: this.startTime,
          end: this.endTime,
          ...(this.currentHabit && { id: this.currentHabit.id }),
        };

        const dispatchAction = habit.id ? "editHabit" : "addHabit";
        this.$store.dispatch(dispatchAction, habit);
        this.closeHandler();
      }
    },
  },
};
</script>

<style lang="scss"></style>
