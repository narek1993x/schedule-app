<template>
  <div
    :class="{
      Habit: true,
      [`border-color-${borderColor}`]: true,
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
  props: ["habit", "onOpenHabitModal", "onOpenDeleteModal"],
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
  margin-bottom: 32px;
  flex: 0 1 300px;
  position: relative;

  &:first-child {
    margin-left: 164px;
    margin-right: 164px;

    &::after {
      position: absolute;
      bottom: -28px;
      left: calc(50% - 12px);
      content: "\27F6";
      transform: rotate(130deg);
    }
  }

  &:nth-child(2n) {
    &::after {
      position: absolute;
      top: calc(50% - 12px);
      right: -30px;
      content: "\27F6";
    }
  }

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
