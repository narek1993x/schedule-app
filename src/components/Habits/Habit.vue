<template>
  <div
    :class="{
      Habit: true,
      [`border-color-${habit.type}`]: true,
      isOdd: index % 2 !== 0,
      isEven: index % 2 === 0,
      dark,
    }"
  >
    <div class="Card">
      <v-card-title>
        <span class="headline"> {{ habit.title }}</span>
        <v-spacer></v-spacer>
        <span class="caption"> {{ habit.start }}</span>
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
  props: ["index", "dark", "habit", "onOpenHabitModal", "onOpenDeleteModal"],
};
</script>

<style lang="scss">
%line {
  position: absolute;
  content: "";
}

@mixin left-to-right-line($color: #9e9e9e) {
  &::before {
    @extend %line;
    left: calc(50% - 21px);
    bottom: -23px;
    height: 20px;
    width: 22px;
    border: 3px solid transparent;
    border-color: transparent $color transparent transparent;
    border-radius: 0 0 50px 0;
  }

  &::after {
    @extend %line;
    bottom: -40px;
    height: 20px;
    border: 3px solid transparent;
    border-color: transparent transparent transparent $color;
    border-radius: 50px 0 0 0;
  }
}

.Habit {
  margin-bottom: 42px;
  flex: 0 1 250px;
  padding: 3px;
  border-radius: 1em;
  position: relative;

  &.dark {
    .Card {
      background-color: #303030;
    }

    &:first-child:not(:last-child),
    &.isOdd:not(:first-child):not(:last-child) {
      @include left-to-right-line(#fff);
    }

    &.isEven:not(:last-child)::after {
      background-color: #fff;
    }
  }

  .Card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    background-color: #fff;
    border-radius: 0.9em;
  }

  &.border-color {
    &-cue {
      background: #4caf50;
    }

    &-routine {
      background: #03a9f4;
    }

    &-reward {
      background: #ff9800;
    }

    &-cue-reward {
      background: linear-gradient(to right, #ff9800 50%, #4caf50 50%);
    }
  }

  &:first-child {
    margin-left: 191px;
    margin-right: 191px;

    &:not(:last-child) {
      @include left-to-right-line;

      &::after {
        left: calc(-53px - 15px);
        width: calc(50% + 53px);
      }
    }
  }

  &.isEven:not(:last-child)::after {
    @extend %line;
    top: calc(50% - 1.5px);
    right: calc(-50% - 4px);
    width: 126px;
    height: 3px;
    background-color: #9e9e9e;
  }

  &.isOdd:not(:first-child):not(:last-child) {
    @include left-to-right-line;

    &::after {
      left: calc(-50% - 119px - 15px);
      width: calc(100% + 119px);
    }
  }

  @media screen and (max-width: 640px) {
    flex-basis: calc(50% - 20px);

    .v-card {
      &__title {
        padding: 8px;

        .headline {
          font-size: 1rem !important;
          line-height: 1.5rem !important;
          width: 100%;
        }
      }
    }

    &:first-child {
      margin-left: calc(25% + 10px);
      margin-right: calc(25% + 10px);
    }

    &:first-child:not(:last-child)::after {
      left: -22px;
      width: calc(50% + 8px);
    }

    &.isEven:not(:last-child)::after {
      right: -37px;
      width: 34px;
    }

    &.isOdd:not(:first-child):not(:last-child)::after {
      left: calc(-50% - 42px);
      width: calc(100% + 28px);
    }
  }
}
</style>
