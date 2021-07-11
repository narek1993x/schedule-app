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
                  chips
                  clearable
                  v-model="type"
                  :items="Object.values(typeOptions)"
                  :rules="typeRules"
                  label="Type*"
                ></v-select>
              </v-col>

              <v-col cols="12">
                <v-row class="d-flex">
                  <v-col cols="12" sm="6">
                    <v-select v-model="order" :items="allHabitItems" label="Show after"></v-select>
                  </v-col>
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
                          label="Start"
                          prepend-icon="mdi-timer"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="startTimerMenu"
                        v-model="startTime"
                        header-color="#3c3c3c"
                        scrollable
                        full-width
                        @click:minute="$refs.startTimer.save(startTime)"
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
import { isMobile, addMinutesToTime } from "../../helpers/utils";

function getDisabledTypeOptions(options, protectedValue) {
  const disabledOptions = {};

  Object.keys(options).forEach((key) => {
    const option = options[key];
    disabledOptions[key] = option;

    if (protectedValue !== option.value) {
      disabledOptions[key].disabled = true;
    }
  });

  return disabledOptions;
}

function isChooseRoutine(lastHabit, typeOptions) {
  return lastHabit.type === typeOptions.cue.value || lastHabit.type === typeOptions["cue-reward"].value;
}

export default {
  props: ["visible", "dark", "currentHabit", "onClose"],
  beforeMount() {
    if (this.currentHabit) {
      const { title, type, order, start } = this.currentHabit;

      this.title = title;
      this.type = type;
      this.order = order;
      this.startTime = start;
    } else if (this.lastHabit) {
      this.order = this.lastHabit.order + 1;
      this.startTime = addMinutesToTime(this.lastHabit.start, 30);

      if (isChooseRoutine(this.lastHabit, this.typeOptions)) {
        this.type = this.typeOptions.routine.value;
        this.typeOptions = getDisabledTypeOptions(this.typeOptions, this.type);
      }
    }
  },
  computed: {
    loading() {
      return this.$store.getters.loading;
    },
    allHabitItems() {
      const habits = [...this.$store.getters.allHabits];

      return habits
        .filter((h) => !this.currentHabit || h.id !== this.currentHabit.id)
        .map((h) => ({ text: h.title, value: h.order + 1 }));
    },
    lastHabit() {
      const habits = [...this.$store.getters.allHabits];
      return habits[habits.length - 1];
    },
  },
  data: () => {
    return {
      isMobile: isMobile(),
      valid: true,
      title: "",
      type: "",
      order: 0,
      startTimerMenu: false,
      startTime: "",
      typeOptions: {
        cue: { text: "Cue", value: "cue" },
        routine: { text: "Routine", value: "routine" },
        reward: { text: "Reward", value: "reward" },
        "cue-reward": { text: "Cue Reward", value: "cue-reward" },
      },
      titleRules: [(v) => !!v || "Title is required"],
      typeRules: [(v) => !!v || "Type is required"],
      startTimeRules: [(v) => !!v || "Start time is required"],
    };
  },
  methods: {
    clear() {
      this.$refs.form.reset();
      this.title = "";
      this.type = "";
      this.order = 0;
      this.startTime = "";
    },
    closeHandler() {
      this.clear();
      this.onClose();
    },
    saveHandler() {
      if (this.$refs.form.validate()) {
        const habit = {
          title: this.title,
          type: this.type,
          order: this.order,
          start: this.startTime,
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
