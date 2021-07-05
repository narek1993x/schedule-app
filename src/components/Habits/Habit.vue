<template>
  <div
    :class="{
      Habit: true,
      [`border-color-${borderColor}`]: true,
      isOdd: index % 2 !== 0,
      isEven: index % 2 === 0,
    }"
  >
    <div class="Card">
      <v-card-title>
        <span class="headline"> {{ habit.title }}</span>
        <v-spacer></v-spacer>
        <span class="caption"> {{ habit.start + " - " + habit.end }}</span>
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
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
    </div>
  </div>
</template>

<script>
export default {
  props: ["index", "habit", "onOpenHabitModal", "onOpenDeleteModal"],
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
%arrow {
  position: absolute;
  content: "\27F6";
  font-size: 30px;
  color: #9e9e9e;
}

.Habit {
  margin-bottom: 42px;
  flex: 0 1 250px;
  padding: 3px;
  border-radius: 1em;
  position: relative;

  .Card {
    background-color: #fff;
    border-radius: 0.9em;
  }

  &.border-color {
    &-que {
      background: #4caf50;
    }

    &-routine {
      background: #03a9f4;
    }

    &-reward {
      background: #ff9800;
    }

    &-reward-que {
      background: linear-gradient(to right, #ff9800 50%, #4caf50 50%);
    }
  }

  &:first-child {
    margin-left: 191px;
    margin-right: 191px;

    &:not(:last-child)::after {
      @extend %arrow;
      bottom: -45px;
      left: calc(50% - 31px);
      transform: rotate(135deg);
    }
  }

  &.isEven:not(:last-child)::after {
    @extend %arrow;
    top: calc(50% - 21px);
    right: -49px;
  }

  &.isOdd:not(:first-child):not(:last-child)::after {
    @extend %arrow;
    bottom: -42px;
    left: -42px;
    transform: rotate(140deg);
  }

  @media screen and (max-width: 640px) {
    flex-basis: calc(50% - 20px);

    .v-card {
      &__title {
        padding: 8px;
      }
    }

    &:first-child {
      margin-left: calc(25% + 10px);
      margin-right: calc(25% + 10px);
    }

    &:first-child:not(:last-child)::after {
      font-size: 20px;
      left: calc(50% - 15px);
      bottom: -32px;
      transform: rotate(120deg);
    }

    &.isEven:not(:last-child)::after {
      font-size: 20px;
      top: calc(50% - 15px);
      right: -35px;
    }

    &.isOdd:not(:first-child):not(:last-child)::after {
      font-size: 20px;
      bottom: -25px;
      left: -20px;
      transform: rotate(130deg);
    }
  }
}
</style>
