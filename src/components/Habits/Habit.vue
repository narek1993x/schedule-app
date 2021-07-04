<template>
  <div
    :class="{
      Habit: true,
      [`border-color-${borderColor}`]: true,
      isOdd: index % 2 !== 0,
      isEven: index % 2 === 0,
    }"
  >
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
  position: relative;

  &:first-child {
    margin-left: 191px;
    margin-right: 191px;

    &::after {
      @extend %arrow;
      bottom: -45px;
      left: calc(50% - 31px);
      transform: rotate(135deg);
    }
  }

  &.isEven:not(:last-child) {
    &::after {
      @extend %arrow;
      top: calc(50% - 21px);
      right: -49px;
    }
  }

  &.isOdd:not(:first-child):not(:last-child) {
    &::after {
      @extend %arrow;
      bottom: -42px;
      left: -42px;
      transform: rotate(140deg);
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

  @media screen and (max-width: 640px) {
    flex-basis: calc(50% - 26px);

    &:first-child {
      margin-left: calc(25% + 13px);
      margin-right: calc(25% + 13px);
    }
  }

  @media screen and (max-width: 380px) {
    flex-basis: 100%;
    margin-bottom: 50px;

    %arrow-small {
      right: unset;
      top: unset;
      bottom: -50px;
      left: calc(50% - 22px);
      transform: rotate(90deg);
    }

    &:first-child {
      margin-left: 0;
      margin-right: 0;
    }

    &:first-child,
    &.isEven:not(:last-child),
    &.isOdd:not(:first-child):not(:last-child) {
      &::after {
        right: unset;
        top: unset;
        bottom: -50px;
        left: calc(50% - 22px);
        transform: rotate(90deg);
      }
    }
  }
}
</style>
