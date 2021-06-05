<template>
  <v-select
    :dark="dark"
    v-model="color"
    :items="colors"
    label="Color"
    class="color-select"
    :menu-props="{ contentClass: 'color-select-content' }"
  >
    <template v-slot:selection="{ item }">
      <div class="color-item" :class="item"></div>
    </template>

    <template v-slot:item="{ item, attrs, on }">
      <v-list-item v-on="on" v-bind="attrs">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <div v-on="on" v-bind="attrs" class="color-item" :class="item"></div>
          </template>
          <span>{{ item }}</span>
        </v-tooltip>
      </v-list-item>
    </template></v-select
  >
</template>

<script>
export default {
  props: ["dark", "defaultColor", "onSelect"],
  watch: {
    color: function(newColor) {
      this.onSelect(newColor);
    },
  },
  data(instance) {
    return {
      color: instance.defaultColor || "blue",
      colors: [
        "red darken-4",
        "orange",
        "yellow darken-3",
        "green",
        "light-green darken-4",
        "deep-purple",
        "indigo",
        "blue",
        "light-blue",
        "cyan",
        "teal",
        "grey darken-1",
      ],
    };
  },
};
</script>

<style lang="scss">
.color-select {
  width: 64px;

  .v-input {
    &__append-inner {
      width: 20px;
      padding-left: 0px !important;
    }

    &__slot {
      padding: 0 8px !important;
    }
  }
}

.color-select-content {
  .v-list {
    display: flex;
    max-width: 64px;
    flex-wrap: wrap;

    .v-list-item {
      padding: 0;
      margin: 6px 3px;
      min-height: 18px;
      flex: 1 1 calc(50% - 6px);
    }
  }
}

.color-item {
  border-radius: 50%;
  width: 18px;
  height: 18px;
  margin: 3px;
  cursor: pointer;
}
</style>
