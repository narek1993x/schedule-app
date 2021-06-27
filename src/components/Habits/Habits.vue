<template>
  <v-container fluid class="Container">
    <v-sheet tile height="54" color="grey lighten-3" class="d-flex justify-space-between align-center">
      <v-btn class="ml-3 mr-6" icon @click.stop="showHabitsModal = true">
        <v-icon size="42">mdi-plus-circle-outline</v-icon>
      </v-btn>
    </v-sheet>
    <Loading :loading="loading"></Loading>
    <v-sheet>
      <HabitModal
        dark
        :currentHabit="null"
        :allHabits="allHabits"
        :visible="showHabitsModal"
        :onClose="handleCloseHabitModal"
      />
      <ul id="example-1">
        <li v-for="habit in allHabits" :key="habit.id">
          {{ habit.title }}
        </li>
      </ul>
    </v-sheet>
  </v-container>
</template>

<script>
import HabitModal from "./HabitModal.vue";
export default {
  components: {
    HabitModal,
  },
  computed: {
    loading() {
      return this.$store.getters.loading;
    },
    allHabits() {
      return this.$store.getters.allHabits;
    },
  },
  data() {
    return {
      showHabitsModal: false,
    };
  },
  methods: {
    handleCloseHabitModal() {
      this.showHabitsModal = false;
    },
  },
};
</script>

<style lang="scss">
.Container {
  padding: 0px !important;
}
</style>
