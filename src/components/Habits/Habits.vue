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
        v-if="showHabitsModal"
        :currentHabit="currentHabit"
        :allHabits="allHabits"
        :visible="showHabitsModal"
        :onClose="handleCloseHabitModal"
      />
      <DeleteModal
        dark
        v-if="showDeleteModal"
        type="habit"
        :show="showDeleteModal"
        :loading="loading"
        :onClose="handleCloseDeleteModal"
        :onDelete="handleDeleteHabit"
      />
      <div class="Habits">
        <Habit
          v-for="(habit, index) in allHabits"
          :key="habit.id"
          :index="index + 1"
          :habit="habit"
          :onOpenHabitModal="handleOpenHabitModal"
          :onOpenDeleteModal="handleOpenDeleteModal"
        />
      </div>
    </v-sheet>
  </v-container>
</template>

<script>
import Habit from "./Habit.vue";
import HabitModal from "./HabitModal.vue";
import DeleteModal from "../DeleteModal.vue";

export default {
  components: {
    Habit,
    HabitModal,
    DeleteModal,
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
      showDeleteModal: false,
      deleteHabitId: null,
      currentHabit: null,
    };
  },
  methods: {
    handleCloseHabitModal() {
      this.showHabitsModal = false;
      this.currentHabit = null;
    },
    handleOpenHabitModal(habit) {
      this.showHabitsModal = true;
      this.currentHabit = habit;
    },
    handleCloseDeleteModal() {
      this.showDeleteModal = false;
      this.deleteHabitId = null;
    },
    handleOpenDeleteModal(habitId) {
      this.showDeleteModal = true;
      this.deleteHabitId = habitId;
    },
    handleDeleteHabit() {
      this.$store.dispatch("removeHabit", this.deleteHabitId);
      this.handleCloseDeleteModal();
    },
  },
};
</script>

<style lang="scss">
.Container {
  padding: 0px !important;
}

.Habits {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 900px;
  height: calc(100vh - 118px);
  padding: 18px;
}
</style>
