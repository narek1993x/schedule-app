<template>
  <div
    :class="{
      Habit: true,
      [`border-color-${borderColor}`]: true,
      [`flex-${index % 2 === 0 ? 'start' : 'end'}`]: true,
    }"
  >
    <v-card>
      <v-card-title>
        <span class="headline"> {{ habit.title }}</span>
      </v-card-title>
      <v-card-actions>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="onOpenHabitModal(habit)">
              <v-icon :size="20">mdi-pencil</v-icon>
            </v-btn>
          </template>
          <span>Edit habit</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="onOpenDeleteModal(habit.id)">
              <v-icon :size="20">mdi-delete</v-icon>
            </v-btn>
          </template>
          <span>Delete habit</span>
        </v-tooltip>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  props: ["habit", "index", "onOpenHabitModal", "onOpenDeleteModal"],
  computed: {
    borderColor() {
      const { types } = this.habit;

      if (types.length === 2) {
        return "reward-que";
      }

      return types[0];
    },
  },
};
</script>

<style lang="scss">
.Habit {
  border-radius: 6px;
  max-width: 300px;
  width: 100%;
  margin-bottom: 32px;

  // &:first-child {
  //   align-self: center !important;
  // }

  // &.flex-start {
  //   align-self: flex-start;
  // }

  // &.flex-end {
  //   align-self: flex-end;
  // }

  &.border-color {
    &-que {
      border: 3px solid #4caf50;
    }

    &-routine {
      border: 3px solid #03a9f4;
    }

    &-reward {
      border: 3px solid #ff9800;
    }

    &-reward-que {
      border: 3px solid transparent;
      border-image: linear-gradient(to right, #ff9800 50%, #4caf50 50%);
      border-image-slice: 1;
    }
  }
}
</style>
