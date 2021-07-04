<template>
  <v-container
    fluid
    :class="{
      Container: true,
      ['empty-state']: sortedHabits.length === 0,
    }"
  >
    <v-sheet tile height="54" color="grey lighten-3" class="d-flex justify-space-between align-center">
      <v-btn class="ml-3 mr-6" icon @click.stop="showHabitsModal = true">
        <v-icon size="42">mdi-plus-circle-outline</v-icon>
      </v-btn>
    </v-sheet>
    <Loading :loading="loading"></Loading>
    <v-sheet class="Container__body">
      <HabitModal
        dark
        v-if="showHabitsModal"
        :currentHabit="currentHabit"
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
      <div class="Habits" v-if="sortedHabits.length > 0">
        <Habit
          v-for="(habit, index) in sortedHabits"
          :key="habit.id"
          :habit="habit"
          :index="index + 1"
          :onOpenHabitModal="handleOpenHabitModal"
          :onOpenDeleteModal="handleOpenDeleteModal"
        />
      </div>

      <v-card
        v-else-if="isHabitsLoaded && sortedHabits.length === 0"
        outlined
        elevation="12"
        class="EmptyList d-flex justify-center pa-4"
      >
        <v-card-title class="break-word text-center">Habit list is emtpy please add one with + button!</v-card-title>
      </v-card>
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
    isHabitsLoaded() {
      return this.$store.getters.loadedData.habits;
    },
    sortedHabits() {
      const habits = [...this.$store.getters.allHabits];
      return habits.sort((a, b) => a.order - b.order);
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

  &__body {
    height: calc(100vh - 118px);
    overflow-y: auto;
  }

  &.empty-state &__body {
    display: flex;
    justify-content: center;
    align-items: center;

    .EmptyList {
      height: 200px;
    }
  }
}

.Habits {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: space-between;
  max-width: 668px;
  margin: 0 auto;
  padding: 18px;
  box-sizing: border-box;

  @media screen and (max-width: 768px) {
    &--empty-state {
      margin: 0 20px;
    }
  }

  @media screen and (max-width: 380px) {
    flex-direction: column;
    flex-wrap: nowrap;
  }
}
</style>
