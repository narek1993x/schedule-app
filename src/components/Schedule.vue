<template>
  <v-layout column>
    <v-card>
      <v-container fluid grid-list-lg style="min-height: 0;">
        <v-layout row wrap>
          <v-flex xs12 sm6 md4 v-for="schedule in schedules" :key="schedule.key">
            <v-card :color="schedule.color" class="white--text">
              <v-card-title primary-title>
                <div class="headline">{{schedule.title}}</div>
              </v-card-title>
              <v-card-text
                v-if="editId !== schedule.key"
                style="font-size: 16px; line-height: 18px; white-space: pre-wrap;"
              >{{schedule.content}}</v-card-text>
              <v-card-text v-else>
                <v-text-field
                  v-model="scheduleText"
                  class="schedule-textarea"
                  style="margin-top: 0; padding-top: 0;"
                  color="white"
                  :name="schedule.key"
                  multi-line
                ></v-text-field>
              </v-card-text>
              <v-card-actions v-if="editId !== schedule.key">
                <v-btn flat dark @click="editHandler(schedule.key)">
                  <v-icon left>edit</v-icon>Edit
                </v-btn>
              </v-card-actions>
              <v-card-actions v-else>
                <v-btn
                  :disabled="isSaveDisabled(schedule.key)"
                  flat
                  dark
                  @click="saveHandler(schedule.key)"
                >
                  <v-icon left>save</v-icon>Save
                </v-btn>
                <v-btn flat dark @click="cancelHandler">
                  <v-icon left>cancel</v-icon>Cancel
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-layout>
</template>

<script>
import Loading from "./Loading";

export default {
  computed: {
    user() {
      return this.$store.getters.user;
    },
    loading() {
      return this.$store.getters.loading;
    },
    schedules() {
      return this.$store.getters.schedules;
    },
    isSaveDisabled() {
      return (key) => {
        const schedule = this.schedules.find(d => d.key === key) || {};
        return schedule.content === this.scheduleText;
      };
    }
  },
  data() {
    return {
      scheduleText: "",
      editId: ""
    };
  },
  methods: {
    editHandler(key) {
      this.cancelHandler();

      const schedule = this.schedules.find(s => s.key === key);
      this.scheduleText = schedule.content;
      this.editId = key;
    },
    cancelHandler() {
      this.editId = "";
      this.scheduleText = "";
    },
    saveHandler(key) {
      if (!this.scheduleText) return;

      const scheduleDay = this.schedules.find(d => d.key === key);

      const schedule = {
        ...scheduleDay,
        content: this.scheduleText,
        ...(this.user ? { ownerId: this.user.id } : {})
      };
      this.$store.dispatch("editSchedule", schedule);
      this.cancelHandler();
    }
  }
};
</script>

<style>
.schedule-textarea textarea {
  color: #fff !important;
}
</style>
